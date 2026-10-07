/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { Nullable } from 'jodit/types';
import { isFunction } from 'jodit/core/helpers/checker';

/**
 * Both shapes `getComposedRanges` has shipped in.
 *
 * The standard takes an options object, `getComposedRanges({ shadowRoots })`.
 * Safari shipped it earlier taking the shadow roots as plain arguments, and
 * that build is still around on iPadOS, so both are tried.
 */
type GetComposedRanges = (
	optionsOrRoot?: { shadowRoots?: ShadowRoot[] } | ShadowRoot,
	...rest: ShadowRoot[]
) => StaticRange[];

function isInside(node: Node, shadowRoot: ShadowRoot): boolean {
	return node === shadowRoot || shadowRoot.contains(node);
}

function usable(
	ranges: Nullable<StaticRange[]>,
	shadowRoot: ShadowRoot
): ranges is StaticRange[] {
	return (
		Array.isArray(ranges) &&
		ranges.length > 0 &&
		ranges.every(range => isInside(range.startContainer, shadowRoot))
	);
}

/**
 * Ranges of a selection that lies inside the given shadow tree.
 *
 * `window.getSelection()` stops at the shadow boundary and reports the host
 * instead of the node the caret is really in. `getComposedRanges` is the
 * standard way to ask past that boundary.
 *
 * @returns `null` when the browser has no `getComposedRanges`, or when neither
 * call shape returned ranges that point inside the shadow tree — in which case
 * there is nothing better to offer than the plain window selection.
 */
export function composedRanges(
	selection: Selection,
	shadowRoot: ShadowRoot
): Nullable<StaticRange[]> {
	const getComposedRanges = (
		selection as unknown as {
			getComposedRanges?: GetComposedRanges;
		}
	).getComposedRanges;

	if (!isFunction(getComposedRanges)) {
		return null;
	}

	for (const args of [[{ shadowRoots: [shadowRoot] }], [shadowRoot]]) {
		let ranges: Nullable<StaticRange[]>;

		try {
			ranges = getComposedRanges.apply(selection, args);
		} catch {
			// A build that only knows the other shape throws on this one.
			continue;
		}

		if (usable(ranges, shadowRoot)) {
			return ranges;
		}
	}

	return null;
}
