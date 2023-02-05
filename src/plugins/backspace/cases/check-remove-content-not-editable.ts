/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { call } from 'jodit/core/helpers';
import { moveNodeInsideStart } from 'jodit/core/selection/helpers';

/**
 * Checks if a non-editable element can be deleted
 * @private
 */
export function checkRemoveContentNotEditable(
	jodit: IJodit,
	fakeNode: Text,
	backspace: boolean
): boolean {
	let neighbor = Dom.findSibling(fakeNode, backspace);

	if (
		!neighbor &&
		fakeNode.parentElement &&
		fakeNode.parentElement !== jodit.editor
	) {
		neighbor = Dom.findSibling(fakeNode.parentElement, backspace);
	}

	if (
		Dom.isElement(neighbor) &&
		!Dom.isContentEditable(neighbor, jodit.editor)
	) {
		call(backspace ? Dom.before : Dom.after, neighbor, fakeNode);
		Dom.safeRemove(neighbor);
		moveNodeInsideStart(jodit, fakeNode, backspace);

		call(
			backspace ? jodit.s.setCursorBefore : jodit.s.setCursorAfter,
			fakeNode
		);

		return true;
	}

	return false;
}
