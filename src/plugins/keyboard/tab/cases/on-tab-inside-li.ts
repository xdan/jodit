/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/keyboard/tab
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';

/**
 * Checks if the cursor is at the beginning of the LI element when tabbed.
 * If so then add an internal list
 */
export function onTabInsideLi(jodit: IJodit): boolean {
	if (!jodit.o.tab.tabInsideLiInsertNewList || !jodit.s.isCollapsed()) {
		return false;
	}

	const fake = jodit.createInside.fake();
	jodit.s.insertNode(fake);

	const li = Dom.closest(fake, 'li', jodit.editor);

	if (
		li &&
		jodit.s.cursorOnTheLeft(li) &&
		Dom.isTag(li.previousElementSibling, 'li')
	) {
		const list = Dom.closest(li, ['ol', 'ul'], jodit.editor);

		if (list) {
			const newList = jodit.createInside.element(list.tagName);
			const previousLi = li.previousElementSibling;

			newList.appendChild(li);
			previousLi.appendChild(newList);
			jodit.s.setCursorAfter(fake);
			Dom.safeRemove(fake);

			return true;
		}
	}

	Dom.safeRemove(fake);

	return false;
}
