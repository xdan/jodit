/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, Nullable } from 'jodit/types';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers/utils/scroll-into-view';
import { Dom } from 'jodit/core/dom/dom';

import { insertParagraph } from './insert-paragraph';

/**
 * Splits a block element into two parts
 * and adds a new default block in the middle/start/end
 * @private
 */
export function splitFragment(jodit: IJodit, currentBox: HTMLElement): void {
	const sel = jodit.s,
		{ enter } = jodit.o;

	const defaultTag = enter.toLowerCase() as typeof enter;
	const isLi = Dom.isTag(currentBox, 'li');
	const canSplit = currentBox.tagName.toLowerCase() === defaultTag || isLi;

	const cursorOnTheRight = sel.cursorOnTheRight(currentBox);
	const cursorOnTheLeft = sel.cursorOnTheLeft(currentBox);

	if (!canSplit && (cursorOnTheRight || cursorOnTheLeft)) {
		let fake: Nullable<Text> = null;

		if (cursorOnTheRight) {
			fake = sel.setCursorAfter(currentBox);
		} else {
			fake = sel.setCursorBefore(currentBox);
		}

		insertParagraph(jodit, fake, defaultTag);

		if (cursorOnTheLeft && !cursorOnTheRight) {
			sel.setCursorIn(currentBox, true);
		}

		return;
	}

	const newP = sel.splitSelection(currentBox);

	scrollIntoViewIfNeeded(newP, jodit.editor, jodit.ed);
}
