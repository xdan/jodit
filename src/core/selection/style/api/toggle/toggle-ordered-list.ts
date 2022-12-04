/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode } from 'jodit/types';
import type { CommitStyle } from '../../commit-style';
import { Dom } from 'jodit/core/dom';
import { extractSelectedPart } from '../extract';
import { CHANGE, INITIAL, REPLACE, UNWRAP } from '../../commit-style';
import { toggleAttributes } from './toggle-attributes';

const en = 'applyStyleAfterToggleOrderedList';

/**
 * Replaces `ul->ol` or `ol->ul`, apply styles to the list, or remove a list item from it
 * @private
 */
export function toggleOrderedList(
	style: CommitStyle,
	li: HTMLElement,
	jodit: IJodit,
	mode: CommitMode
): CommitMode {
	if (!li) {
		return mode;
	}

	const list = li.parentElement;

	if (!list) {
		return mode;
	}

	// ul => ol, ol => ul
	if (list.tagName.toLowerCase() !== style.element) {
		const newList = Dom.replace<HTMLElement>(
			list,
			style.element,
			jodit.createInside
		);
		toggleAttributes(style, newList, jodit, mode);
		jodit.e.fire(en, REPLACE, li, style, jodit);
		return REPLACE;
	}

	if (toggleAttributes(style, li.parentElement, jodit, INITIAL, true) === CHANGE) {
		const result = toggleAttributes(style, li.parentElement, jodit, mode);
		jodit.e.fire(en, CHANGE, li, style, jodit);
		return result;
	}

	extractSelectedPart(list, li, jodit);
	Dom.unwrap(li.parentElement);
	const wrapper = Dom.replace(li, jodit.o.enter, jodit.createInside);
	jodit.e.fire(en, UNWRAP, wrapper, style, jodit);

	return mode;
}
