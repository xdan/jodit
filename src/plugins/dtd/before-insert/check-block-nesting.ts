/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/dtd
 * @internal
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Moves the cursor out of a block that can't hold the inserted block: before
 * or after it when the cursor is at its edge, or between its two halves when
 * the cursor is inside its content. An empty block is removed
 */
function moveCursorOutOf(jodit: IJodit, parent: HTMLElement): void {
	const { s } = jodit;

	if (Dom.isEmpty(parent)) {
		s.setCursorAfter(parent);
		Dom.safeRemove(parent);
		return;
	}

	if (s.cursorOnTheRight(parent)) {
		s.setCursorAfter(parent);
		return;
	}

	if (s.cursorOnTheLeft(parent)) {
		s.setCursorBefore(parent);
		return;
	}

	s.setCursorAfter(s.splitSelection(parent) ?? parent);
}

/**
 * Checks whether the insertion of an element at the current location is allowed,
 * if it is not allowed, it deletes an empty block element, moves the cursor
 * before or after it, or splits it at the cursor
 * @internal
 */
export function checkBlockNesting(jodit: IJodit, node: Nullable<Node>): void {
	if (Dom.isFragment(node)) {
		node = node.firstChild;
	}

	if (jodit.o.dtd.checkBlockNesting && Dom.isBlock(node)) {
		let parent: Nullable<HTMLElement> = null;
		let current: Nullable<HTMLElement> =
			jodit.s.current()?.parentElement ?? null;

		while (current && current !== jodit.editor) {
			if (Dom.isBlock(current)) {
				// In DIV mode the caret's own empty block is a line, like
				// `<p><br></p>`, not a container to insert into (#1315)
				const isEmptyLine =
					!parent &&
					Dom.isTag(current, jodit.o.enter) &&
					Dom.isEmpty(current);

				if (
					jodit.o.dtd.blockLimits[current.nodeName.toLowerCase()] &&
					!isEmptyLine
				) {
					break;
				}

				parent = current;
			}

			current = current.parentElement;
		}

		// A list that is all of the inserted content adds its items to the
		// list of the item it goes into, as the browsers' own paste does
		if (
			Dom.isLeaf(current) &&
			Dom.isList(node) &&
			Dom.isFragment(node.parentNode) &&
			!Dom.findNotEmptySibling(node, false)
		) {
			Dom.unwrap(node);
			parent = current;
		}

		if (parent) {
			moveCursorOutOf(jodit, parent);
		}
	}
}
