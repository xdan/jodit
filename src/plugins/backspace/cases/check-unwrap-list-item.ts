/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Backspace at the start of a later list item takes the bullet off, as Word
 * does: the item becomes a paragraph where it was, and the list is split
 * around it. A split `<ol>` carries its numbering on with `start`.
 *
 * @example
 * ```html
 * <ol><li>first</li><li>|second</li><li>third</li></ol>
 * ```
 * Result
 * ```html
 * <ol><li>first</li></ol><p>|second</p><ol start="2"><li>third</li></ol>
 * ```
 *
 * @private
 */
export function checkUnwrapListItem(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	if (!backspace) {
		return false;
	}

	const li = Dom.closest(fakeNode, 'li', jodit.editor);
	const list = li ? li.parentElement : null;

	if (
		!li ||
		!Dom.isList(list) ||
		!li.previousElementSibling ||
		Dom.isEmpty(li) ||
		Array.from(li.childNodes).some(node => Dom.isBlock(node)) ||
		!jodit.s.cursorInTheEdge(true, li)
	) {
		return false;
	}

	const p = jodit.createInside.element(jodit.o.enterBlock);
	Dom.after(list, p);

	if (li.nextElementSibling) {
		const rest = list.cloneNode(false) as HTMLElement;

		while (li.nextSibling) {
			Dom.append(rest, li.nextSibling);
		}

		if (Dom.isTag(list, 'ol')) {
			const start = parseInt(list.getAttribute('start') || '1', 10) || 1;
			rest.setAttribute(
				'start',
				String(start + list.children.length - 1)
			);
		}

		Dom.after(p, rest);
	}

	Dom.moveContent(li, p);
	Dom.safeRemove(li);
	jodit.s.setCursorBefore(fakeNode);

	return true;
}
