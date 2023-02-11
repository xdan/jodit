/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { $$ } from 'jodit/core/helpers/utils/selector';

import { insertParagraph } from './insert-paragraph';

/**
 * Handles pressing the Enter key inside an empty LI inside a list
 * @private
 */
export function processEmptyLILeaf(
	fake: Text,
	jodit: IJodit,
	li: HTMLElement
): void {
	const list: Nullable<HTMLElement> = Dom.closest(
		li,
		['ol', 'ul'],
		jodit.editor
	);

	if (!list) {
		return;
	}

	const parentLi = list.parentElement,
		listInsideLeaf = Dom.isTag(parentLi, 'li');

	const container = listInsideLeaf ? parentLi : list;

	// Empty element in the middle of the list
	const leftRange = jodit.s.createRange();
	leftRange.setStartAfter(li);
	leftRange.setEndAfter(list);
	const rightPart = leftRange.extractContents();

	Dom.after(container, fake);

	Dom.safeRemove(li);

	if (!$$('li', list).length) {
		Dom.safeRemove(list);
	}

	const newLi = insertParagraph(
		fake,
		jodit,
		listInsideLeaf ? 'li' : jodit.o.enter
	);

	if (!rightPart.querySelector('li')) {
		return;
	}

	if (listInsideLeaf) {
		newLi.appendChild(rightPart);
	} else {
		Dom.after(newLi, rightPart);
	}
}
