/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { call } from 'jodit/core/helpers/utils';

/**
 * For first item in list on backspace try move his content in new P
 *
 * @example
 * ```html
 * <ul><li>|first</li><li>second</li></ul>
 * ```
 * Result
 * ```html
 * <p>|first</p><ul><li>second</li></ul>
 * ```
 *
 * @private
 */
export function checkUnwrapFirstListItem(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	const li = Dom.closest(fakeNode, Dom.isElement, jodit.editor);

	const { s } = jodit;

	if (
		Dom.isTag(li, 'li') &&
		li?.parentElement?.[
			backspace ? 'firstElementChild' : 'lastElementChild'
		] === li &&
		s.cursorInTheEdge(backspace, li)
	) {
		const ul = li.parentElement;
		const p = jodit.createInside.element(jodit.o.enterBlock);

		call(backspace ? Dom.before : Dom.after, ul, p);

		Dom.moveContent(li, p);
		Dom.safeRemove(li);

		if (Dom.isEmpty(ul)) {
			Dom.safeRemove(ul);
		}

		call(backspace ? s.setCursorBefore : s.setCursorAfter, fakeNode);

		return true;
	}

	return false;
}
