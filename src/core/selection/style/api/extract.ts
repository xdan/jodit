/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { call } from 'jodit/core/helpers/utils/utils';
import { trim } from 'jodit/core/helpers/string/trim';
import { Dom } from 'jodit/core/dom/dom';
import { isMarker } from 'jodit/core/helpers/checker/is-marker';

/**
 * If the selection area is inside an element that matches the commit (suitable relative),
 * but does not completely fill it.
 * Then the method cuts the parent and leaves itself in a copy of the parent (suitable relative) in the middle.
 *
 * @example
 * Apply strong to
 * ```html
 * 	<strong><span>some<font>SELECTED</font>text</span></strong>
 * ```
 * Should extract selection from parent `strong`
 * ```html
 * `<strong><span>some</span></strong><strong><span><font>SELECTED</font></span></strong><strong><span>test</span></strong>
 * ```
 * @private
 */
export function extractSelectedPart(
	wrapper: HTMLElement,
	font: HTMLElement,
	jodit: IJodit
): void {
	const range = jodit.s.createRange();

	// Left part
	const leftEdge = isMarker(font.previousSibling)
		? font.previousSibling
		: font;

	range.setStartBefore(wrapper);
	range.setEndBefore(leftEdge);

	extractAndMove(wrapper, range, true);

	// Right part
	const rightEdge = isMarker(font.nextSibling) ? font.nextSibling : font;

	range.setStartAfter(rightEdge);
	range.setEndAfter(wrapper);

	extractAndMove(wrapper, range, false);
}

/**
 * Retrieves content before after the selected area, clears it if it is empty, and inserts before after the framed selection
 */
function extractAndMove(
	wrapper: HTMLElement,
	range: Range,
	left: boolean
): void {
	const fragment = range.extractContents();

	if (
		(!fragment.textContent || !trim(fragment.textContent).length) &&
		fragment.firstChild
	) {
		Dom.unwrap(fragment.firstChild);
	}

	if (wrapper.parentNode) {
		call(left ? Dom.before : Dom.after, wrapper, fragment);
	}
}
