/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode } from 'jodit/types';
import type { CommitStyle } from '../../commit-style';
import { Dom } from 'jodit/core/dom';
import { extractSelectedPart } from '../extract';
import { _PREFIX, CHANGE, INITIAL, REPLACE, UNWRAP } from '../../commit-style';
import { toggleAttributes } from './toggle-attributes';

/**
 * Replaces `ul->ol` or `ol->ul`, apply styles to the list, or remove a list item from it
 * @private
 */
export function toggleOrderedList(
	commitStyle: CommitStyle,
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

	const result = jodit.e.fire(
		`${_PREFIX}BeforeToggleOrderedList`,
		mode,
		commitStyle.options,
		list
	);
	if (result !== undefined) {
		return result as CommitMode;
	}

	const hook = jodit.e.fire.bind(jodit.e, `${_PREFIX}AfterToggleOrderedList`);

	// ul => ol, ol => ul
	if (list.tagName.toLowerCase() !== commitStyle.element) {
		const newList = Dom.replace<HTMLElement>(
			list,
			commitStyle.element,
			jodit.createInside
		);
		toggleAttributes(commitStyle, newList, jodit, mode);
		hook(REPLACE, li);
		return REPLACE;
	}

	if (
		toggleAttributes(
			commitStyle,
			li.parentElement,
			jodit,
			INITIAL,
			true
		) === CHANGE
	) {
		const result = toggleAttributes(
			commitStyle,
			li.parentElement,
			jodit,
			mode
		);
		hook(CHANGE, li);
		return result;
	}

	extractSelectedPart(list, li, jodit);
	Dom.unwrap(li.parentElement);
	const wrapper = Dom.replace(li, jodit.o.enter, jodit.createInside);
	hook(UNWRAP, wrapper);
	return mode;
}
