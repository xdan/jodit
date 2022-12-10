/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode, IStyleOptions } from 'jodit/types';
import type { CommitStyle } from '../../commit-style';
import { Dom } from 'jodit/core/dom/dom';
import { assert } from 'jodit/core/helpers/utils/assert';
import { extractSelectedPart } from '../extract';
import { _PREFIX, CHANGE, INITIAL, UNWRAP, REPLACE } from '../../commit-style';
import { toggleAttributes } from '../toggle-attributes';
import { wrapList } from 'jodit/core/selection/style/api';

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
		`${_PREFIX}BeforeToggleList`,
		mode,
		commitStyle.options,
		list
	);
	if (result !== undefined) {
		return result as CommitMode;
	}

	const hook = jodit.e.fire.bind(jodit.e, `${_PREFIX}AfterToggleList`);

	// ul => ol, ol => ul
	if (list.tagName.toLowerCase() !== commitStyle.element) {
		const wrapper = unwrapList(
			REPLACE,
			list,
			li,
			jodit,
			commitStyle.options
		);
		const newList = wrapList(commitStyle, wrapper, jodit);
		toggleAttributes(commitStyle, newList, jodit, mode);
		hook(REPLACE, newList, commitStyle.options);
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
		hook(CHANGE, list, commitStyle.options);
		return result;
	}

	const wrapper = unwrapList(UNWRAP, list, li, jodit, commitStyle.options);
	hook(UNWRAP, wrapper, commitStyle.options);

	return UNWRAP;
}

function unwrapList(
	mode: CommitMode,
	list: HTMLElement,
	li: HTMLElement,
	jodit: IJodit,
	cs: IStyleOptions
): HTMLElement {
	const result = jodit.e.fire(`${_PREFIX}BeforeUnwrapList`, mode, list, cs);

	if (result) {
		assert(
			Dom.isHTMLElement(result),
			`${_PREFIX}BeforeUnwrapList hook must return HTMLElement`
		);
		return result;
	}

	extractSelectedPart(list, li, jodit);
	assert(
		Dom.isHTMLElement(li.parentElement),
		'Element should be inside the list'
	);
	Dom.unwrap(li.parentElement);
	return Dom.replace(li, jodit.o.enter, jodit.createInside);
}
