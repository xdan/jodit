/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { call } from 'jodit/core/helpers';
import { moveNodeInsideStart } from 'jodit/core/selection/helpers';

import { checkJoinNeighbors } from './check-join-neighbors';

/**
 * Checks if a non-editable element can be deleted. A non-editable block goes
 * whole, and the lines either side of it then join, as the spec's tests do:
 * `<ul><li>one|</li></ul><div contenteditable="false">x</div><p>two</p>`
 * gives `<ul><li>one|two</li></ul>`
 * @private
 */
export function checkRemoveContentNotEditable(
	jodit: IJodit,
	fakeNode: Text,
	backspace: boolean
): boolean {
	let node: Node = fakeNode;
	let neighbor = Dom.findSibling(node, backspace);

	// Past the edges of the blocks the caret is at, but not into a table cell
	while (
		!neighbor &&
		node.parentElement &&
		node.parentElement !== jodit.editor &&
		!Dom.isCell(node.parentElement)
	) {
		node = node.parentElement;

		// At the start of a list item, Backspace takes the bullet off first
		if (backspace && Dom.isLeaf(node)) {
			return false;
		}

		neighbor = Dom.findSibling(node, backspace);
	}

	if (
		Dom.isElement(neighbor) &&
		!Dom.isContentEditable(neighbor, jodit.editor)
	) {
		if (Dom.isBlock(neighbor)) {
			Dom.safeRemove(neighbor);
			checkJoinNeighbors(jodit, fakeNode, backspace);
		} else {
			call(backspace ? Dom.before : Dom.after, neighbor, fakeNode);
			Dom.safeRemove(neighbor);
			moveNodeInsideStart(jodit, fakeNode, backspace);
		}

		call(
			backspace ? jodit.s.setCursorBefore : jodit.s.setCursorAfter,
			fakeNode
		);

		return true;
	}

	return false;
}
