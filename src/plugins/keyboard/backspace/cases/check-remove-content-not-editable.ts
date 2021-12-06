/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { IJodit } from '../../../../types';
import { Dom } from '../../../../core/dom';
import { call } from '../../../../core/helpers';
import { normalizeCursorPosition } from '../../helpers';

/**
 * Проверяет возможность удаления не редактируемго элемента
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
		normalizeCursorPosition(jodit, fakeNode, backspace);

		call(
			backspace ? jodit.s.setCursorBefore : jodit.s.setCursorAfter,
			fakeNode
		);

		return true;
	}

	return false;
}
