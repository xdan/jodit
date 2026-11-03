/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { toArray } from 'jodit/core/helpers/array/to-array';

/**
 * The name a link reaches an anchor by: its `id`, or in older content its
 * `name`
 */
export function getAnchorName(anchor: HTMLAnchorElement): string {
	return anchor.id || anchor.getAttribute('name') || '';
}

/**
 * An anchor: an `<a>` with a name, no `href` and nothing in it
 */
export function isAnchor(node: Nullable<Node>): node is HTMLAnchorElement {
	return (
		Dom.isTag(node, 'a') &&
		!node.hasAttribute('href') &&
		!node.hasChildNodes() &&
		getAnchorName(node) !== ''
	);
}

/**
 * The anchors in `root`, in the order they come
 */
export function getAnchors(root: ParentNode): HTMLAnchorElement[] {
	return toArray(root.querySelectorAll('a')).filter(isAnchor);
}
