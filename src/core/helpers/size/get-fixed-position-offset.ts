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
 * Without such an ancestor the containing block is the layout viewport. Its
 * offset is `{ x: 0, y: 0 }` in most browsers, but WebKit measures client
 * rects from the visual viewport, so once the page is pinch-zoomed and panned
 * the layout viewport starts above and to the left of the client origin.
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

	const vv = win?.visualViewport;

	// WebKit's `scrollX`/`scrollY` follow the visual viewport too (truncated),
	// where Blink's and Gecko's follow the layout viewport
	if (
		win &&
		vv &&
		(vv.offsetLeft || vv.offsetTop) &&
		Math.abs(vv.pageLeft - win.scrollX) < 1 &&
		Math.abs(vv.pageTop - win.scrollY) < 1
	) {
		return { x: -Math.round(vv.offsetLeft), y: -Math.round(vv.offsetTop) };
	}

	return { x: 0, y: 0 };
}
