/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitMode, ICommitStyle, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { size } from 'jodit/core/helpers/size/object-size';
import { assert } from 'jodit/core/helpers/utils/assert';
import { extractSelectedPart } from 'jodit/core/selection/style/api/extract';
import { elementsEqualAttributes } from 'jodit/core/selection/style/api/is-same-attributes';
import { toggleAttributes } from 'jodit/core/selection/style/api/toggle-attributes';
import {
	_PREFIX,
	CHANGE,
	INITIAL,
	REPLACE,
	UNWRAP
} from 'jodit/core/selection/style/constants';

import { wrapList } from './wrap-list';

/**
 * Replaces `ul->ol` or `ol->ul`, apply styles to the list, or remove a list item from it
 * @private
 */
export function toggleOrderedList(
	commitStyle: ICommitStyle,
	li: HTMLElement,
	jodit: IJodit,
	mode: CommitMode,
	collapsed: boolean = false
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

		const isSameList = Dom.isTag(list, commitStyle.element);

		// ol => ol[style="list-style-type: lower-roman"]: a list's style
		// belongs to the whole list, so it is changed without splitting it
		if (
			isSameList &&
			isChangeMode &&
			mode !== REPLACE &&
			changesStyleOnly(commitStyle)
		) {
			toggleAttributes(commitStyle, list, jodit, CHANGE);
			hook(CHANGE, joinPrevious(commitStyle, list, mode), commitStyle);
			return CHANGE;
		}

		// Restyled already, for an earlier part of the selection
		if (isSameList && mode === CHANGE) {
			return CHANGE;
		}

		// ul => ol, ol => ul or ul => ul.class1
		if (mode === REPLACE || isChangeMode || !isSameList) {
			// With just a caret, Word converts the whole list
			const items =
				collapsed && !isSameList
					? Array.from((list as HTMLElement).children).filter(item =>
							Dom.isLeaf(item)
						)
					: [li];

			let newList!: HTMLElement;

			for (const item of items) {
				newList = keepNumbering(item, itemList =>
					wrapList(
						commitStyle,
						unwrapList(REPLACE, itemList, item, jodit, commitStyle),
						jodit
					)
				);
			}

			hook(REPLACE, newList, commitStyle);
			return REPLACE;
		}
	}

	const wrapper = keepNumbering(li, itemList =>
		unwrapList(UNWRAP, itemList, li, jodit, commitStyle)
	);
	hook(UNWRAP, wrapper, commitStyle);

	return UNWRAP;
}

/**
 * Takes `item` out of its list with `takeOut`, and carries a numbered list's
 * count on past it, as Word does: 1, a bullet, then 2
 */
function keepNumbering<T>(
	item: HTMLElement,
	takeOut: (list: HTMLElement) => T
): T {
	const list = item.parentElement as HTMLElement;
	const rest = item.nextElementSibling;
	const next = Dom.isTag(list, 'ol')
		? (parseInt(list.getAttribute('start') || '1', 10) || 1) +
			Array.from(list.children).indexOf(item)
		: 0;

	const result = takeOut(list);
	const restList = rest?.parentElement;

	if (next && Dom.isTag(restList, 'ol')) {
		next > 1
			? restList.setAttribute('start', String(next))
			: restList.removeAttribute('start');
	}

	return result;
}

/**
 * Other attributes, such as a class, still move the items into a new list,
 * where the `beforeWrapList` hook can add markup to each of them
 */
function changesStyleOnly({ options: { attributes } }: ICommitStyle): boolean {
	return Boolean(attributes?.style) && size(attributes!) === 1;
}

/**
 * Joins a restyled list to the list before it, when the selection runs on
 * from that list and the two now match
 */
function joinPrevious(
	commitStyle: ICommitStyle,
	list: HTMLElement,
	mode: CommitMode
): HTMLElement {
	const prev = Dom.findSibling(list, true);

	if (
		mode !== CHANGE ||
		!Dom.isTag(prev, commitStyle.element) ||
		!elementsEqualAttributes(prev, list)
	) {
		return list;
	}

	Dom.append(prev, Array.from(list.childNodes));
	Dom.safeRemove(list);

	return prev;
}

function unwrapList(
	mode: CommitMode,
	list: HTMLElement,
	li: HTMLElement,
	jodit: IJodit,
	cs: ICommitStyle
): HTMLElement | DocumentFragment {
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

	// In the REPLACE mode the content will be immediately wrapped in a `li`
	// of the new list inside `wrapList`, so it should stay in the document.
	// Replacing it with a fragment here would dissolve the content
	// (with `enter: 'br'`) and the new list would never be inserted.
	if (mode === REPLACE) {
		return li;
	}

	return Dom.replace(
		li,
		jodit.o.enter.toLowerCase() !== 'br'
			? jodit.o.enter
			: jodit.createInside.fragment(),
		jodit.createInside
	);
}
