/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/size
 */

import type { IPoint } from 'jodit/types';

/**
 * Whether the element establishes a containing block for its
 * `position: fixed` descendants, so their coordinates become relative to it
 * instead of the viewport.
 */
function isContainingBlockForFixed(style: CSSStyleDeclaration): boolean {
	return (
		(style.transform !== '' && style.transform !== 'none') ||
		(style.perspective !== '' && style.perspective !== 'none') ||
		(style.filter !== '' && style.filter !== 'none') ||
		style.willChange === 'transform' ||
		style.willChange === 'perspective' ||
		style.willChange === 'filter' ||
		style.contain === 'paint' ||
		style.contain === 'layout' ||
		style.contain === 'strict' ||
		style.contain === 'content'
	);
}

/**
 * Returns the viewport offset of the containing block of a `position: fixed`
 * descendant of `elm`. A fixed element is normally positioned relative to the
 * viewport, but an ancestor with `transform`, `filter`, `perspective`, etc.
 * establishes a new containing block, shifting the fixed element by that
 * ancestor's top-left corner. The returned offset should be subtracted from
 * the desired viewport coordinates before applying them.
 *
 * Returns `{ x: 0, y: 0 }` when no such ancestor exists (the common case), so
 * call sites keep their previous behaviour unchanged.
 */
export function getFixedPositionOffset(elm: HTMLElement): IPoint {
	const win = elm.ownerDocument?.defaultView;

	let node: HTMLElement | null = elm.parentElement;

	while (win && node) {
		if (isContainingBlockForFixed(win.getComputedStyle(node))) {
			const rect = node.getBoundingClientRect();
			return { x: rect.left, y: rect.top };
		}

		node = node.parentElement;
	}

	return { x: 0, y: 0 };
}
