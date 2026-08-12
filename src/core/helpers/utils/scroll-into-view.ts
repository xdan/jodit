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

/**
 * @module helpers/utils
 */

/**
 * `getBoundingClientRect` returns fractional values while `scrollTop`,
 * `offsetTop` and `clientHeight` are rounded to integers, so a container
 * scrolled right up to its limit can still appear to clip the element by a
 * fraction of a pixel. Treat anything clipped by less than a pixel as
 * visible — otherwise `scrollIntoViewIfNeeded` falls through to
 * `elm.scrollIntoView()` and needlessly scrolls the whole page.
 */
const SUBPIXEL_TOLERANCE = 1;

/**
 * Check if element is in view
 */
export function inView(
	elm: HTMLElement,
	root: HTMLElement,
	doc: Document
): boolean {
	let rect = elm.getBoundingClientRect(),
		el: HTMLElement | null = elm as HTMLElement | null;

	const top: number = rect.top,
		height: number = rect.height;

	while (el && el !== root && el.parentNode) {
		el = el.parentNode as HTMLElement;
		rect = el.getBoundingClientRect();

		// The element's bottom is clipped by the container's bottom edge: a
		// caret sitting on that line is invisible, so the element is not in
		// view even though its top still fits. The `top > rect.top` guard keeps
		// elements taller than the container (which can never fully fit) from
		// being treated as always out of view. See #1300
		if (top + height > rect.bottom + SUBPIXEL_TOLERANCE && top > rect.top) {
			return false;
		}

		// Check if the element is out of view due to a container scrolling
		if (top + height <= rect.top) {
			return false;
		}
	}

	// Check it's within the document viewport: the element must fit above the
	// viewport bottom (same clipped-bottom rule as above), and its bottom must
	// not be above the viewport top — the latter guard was missing, so an
	// element scrolled above the top was wrongly reported as visible and never
	// scrolled to. See #1279
	const clientHeight =
		(doc.documentElement && doc.documentElement.clientHeight) || 0;

	return (
		(top + height <= clientHeight + SUBPIXEL_TOLERANCE || top <= 0) &&
		top + height >= 0
	);
}

/**
 * Scroll element into view if it is not in view
 */
export function scrollIntoViewIfNeeded(
	elm: Nullable<Node>,
	root: HTMLElement,
	doc: Document
): void {
	if (Dom.isHTMLElement(elm) && !inView(elm, root, doc)) {
		if (root.clientHeight !== root.scrollHeight) {
			// Scroll the minimal distance: when the element is below the
			// visible area align it to the bottom (natural typing flow),
			// otherwise align it to the top. See #1300
			const alignBottom =
				elm.offsetTop + elm.offsetHeight - root.clientHeight;

			root.scrollTop =
				root.scrollTop < alignBottom ? alignBottom : elm.offsetTop;
		}

		if (!inView(elm, root, doc)) {
			// `block: 'nearest'` scrolls the page the minimal distance (one
			// line while typing), while the default `block: 'start'` aligns
			// the element to the viewport top and the page jumps like
			// PageDown was pressed
			elm.scrollIntoView({ block: 'nearest' });
		}
	}
}
