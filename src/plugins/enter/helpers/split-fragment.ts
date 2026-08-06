/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers/utils/scroll-into-view';

import { insertParagraph } from './insert-paragraph';

/**
 * Splits a block element into two parts
 * and adds a new default block in the middle/start/end
 * @private
 */
export function splitFragment(
	fake: Text,
	jodit: IJodit,
	block: HTMLElement
): void {
	const sel = jodit.s,
		{ enter } = jodit.o;

	const defaultTag = enter.toLowerCase() as typeof enter;
	const isLi = Dom.isLeaf(block);
	const canSplit = block.tagName.toLowerCase() === defaultTag || isLi;

	const cursorOnTheRight = sel.cursorOnTheRight(block, fake);
	const cursorOnTheLeft = sel.cursorOnTheLeft(block, fake);

	if (!canSplit && (cursorOnTheRight || cursorOnTheLeft)) {
		if (cursorOnTheRight) {
			Dom.after(block, fake);
		} else {
			Dom.before(block, fake);
		}

		insertParagraph(fake, jodit, defaultTag);

		if (cursorOnTheLeft && !cursorOnTheRight) {
			Dom.prepend(block, fake);
		}

		return;
	}

	// Inserting the left half above the caret can trigger the browser's
	// scroll anchoring and shift the visible area — keep it stable. See #1300
	const { scrollTop } = jodit.editor;

	sel.splitSelection(block, fake);

	if (jodit.editor.scrollTop !== scrollTop) {
		jodit.editor.scrollTop = scrollTop;
	}

	// After the split the caret stays inside `block` (the right half) —
	// `splitSelection` returns the left half, which is above the caret and
	// usually already visible. Follow the caret, not the left half. See #1300
	scrollIntoViewIfNeeded(block, jodit.editor, jodit.ed);
}
