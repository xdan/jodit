/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { findNotEmptyNeighbor } from 'jodit/plugins/keyboard/helpers';
import { INSEPARABLE_TAGS } from 'jodit/core/constants';
import { checkJoinTwoLists } from 'jodit/plugins/keyboard/backspace/cases/check-join-two-lists';

/**
 * Check if the current empty item can be removed
 *
 * @example
 * ```html
 * <p>first stop</p><p>|<br></p>
 * ```
 * result
 * ```html
 * <p>first stop|</p>
 * ```
 *
 * @private
 */
export function checkRemoveEmptyParent(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	let found: boolean = false;
	const { setCursorBefore, setCursorIn } = jodit.s;

	let prn: Nullable<Node> = Dom.closest(
		fakeNode,
		Dom.isElement,
		jodit.editor
	);

	if (!prn || !Dom.isEmpty(prn)) {
		return false;
	}

	const neighbor = findNotEmptyNeighbor(fakeNode, backspace, jodit.editor);

	do {
		if (prn && Dom.isEmpty(prn) && !Dom.isCell(prn)) {
			Dom.after(prn, fakeNode);

			const tmp: Nullable<Node> = Dom.closest(
				prn,
				n => Dom.isElement(n) && n !== prn,
				jodit.editor
			);

			Dom.safeRemove(prn);

			found = true;

			prn = tmp;
		} else {
			break;
		}
	} while (prn);

	if (found && checkJoinTwoLists(jodit, fakeNode, backspace)) {
		return true;
	}

	if (
		neighbor &&
		!Dom.isText(neighbor) &&
		!Dom.isTag(neighbor, INSEPARABLE_TAGS)
	) {
		setCursorIn(neighbor, !backspace);
	} else {
		setCursorBefore(fakeNode);
	}

	return found;
}
