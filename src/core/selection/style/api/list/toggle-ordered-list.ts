/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode, ICommitStyle } from 'jodit/types';
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
	commitStyle: ICommitStyle,
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
		commitStyle,
		list
	);
	if (result !== undefined) {
		return result as CommitMode;
	}

	const hook = jodit.e.fire.bind(jodit.e, `${_PREFIX}AfterToggleList`);

	if (mode !== UNWRAP) {
		const isChangeMode =
			toggleAttributes(
				commitStyle,
				li.parentElement,
				jodit,
				INITIAL,
				true
			) === CHANGE;

		// ul => ol, ol => ul or ul => ul.class1
		if (
			mode === REPLACE ||
			isChangeMode ||
			list.tagName.toLowerCase() !== commitStyle.element
		) {
			const wrapper = unwrapList(REPLACE, list, li, jodit, commitStyle);
			const newList = wrapList(commitStyle, wrapper, jodit);
			hook(REPLACE, newList, commitStyle);
			return REPLACE;
		}
	}

	const wrapper = unwrapList(UNWRAP, list, li, jodit, commitStyle);
	hook(UNWRAP, wrapper, commitStyle);

	return UNWRAP;
}

function unwrapList(
	mode: CommitMode,
	list: HTMLElement,
	li: HTMLElement,
	jodit: IJodit,
	cs: ICommitStyle
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
