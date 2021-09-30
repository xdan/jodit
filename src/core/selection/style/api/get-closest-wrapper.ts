/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { isSuitElement } from './is-suit-element';
import { trim } from '../../../helpers';
import type { Nullable } from '../../../../types';

/**
 * Check closest suitable wrapper element
 * @example
 * `<strong><span>zxc<font>selected</font>dfdsf</span></strong>`
 */
export function getClosestWrapper(
	style: CommitStyle,
	font: HTMLElement,
	root: HTMLElement,
	range: () => Range
): Nullable<HTMLElement> {
	const wrapper = Dom.closest(font, e => isSuitElement(style, e), root);

	if (wrapper) {
		if (style.elementIsBlock) {
			return wrapper;
		}

		const leftRange = range();

		leftRange.setStartBefore(wrapper);
		leftRange.setEndBefore(font);

		const leftFragment = leftRange.extractContents();

		if (
			(!leftFragment.textContent ||
				!trim(leftFragment.textContent).length) &&
			leftFragment.firstChild
		) {
			Dom.unwrap(leftFragment.firstChild);
		}

		if (wrapper.parentNode) {
			wrapper.parentNode.insertBefore(leftFragment, wrapper);
		}

		leftRange.setStartAfter(font);
		leftRange.setEndAfter(wrapper);

		const rightFragment = leftRange.extractContents();

		// case then marker can be inside fragnment
		if (
			(!rightFragment.textContent ||
				!trim(rightFragment.textContent).length) &&
			rightFragment.firstChild
		) {
			Dom.unwrap(rightFragment.firstChild);
		}

		Dom.after(wrapper, rightFragment);

		return wrapper;
	}

	return null;
}
