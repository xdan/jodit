/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { getMoveFilter } from 'jodit/plugins/backspace/helpers';

/**
 * Check if two separate elements can be connected
 * @private
 */
export function checkJoinNeighbors(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	let nextBox: Nullable<Node> = fakeNode,
		mainClosestBox: Nullable<Node> = nextBox;

	// Find main big closest element
	while (
		nextBox &&
		!Dom.findNotEmptySibling(nextBox, backspace) &&
		nextBox.parentElement !== jodit.editor
	) {
		nextBox = nextBox.parentElement;
		mainClosestBox = nextBox;
	}

	if (
		Dom.isElement(mainClosestBox) &&
		Dom.isContentEditable(mainClosestBox, jodit.editor)
	) {
		const sibling = Dom.findNotEmptySibling(
			mainClosestBox,
			backspace
		) as Nullable<Element>;

		if (
			sibling &&
			(checkMoveListContent(jodit, mainClosestBox, sibling, backspace) ||
				moveContentAndRemoveEmpty(
					jodit,
					mainClosestBox,
					sibling,
					backspace
				))
		) {
			jodit.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	return false;
}

function checkMoveListContent(
	jodit: IJodit,
	mainClosestBox: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	// Process UL/LI/OL cases
	const siblingIsList = Dom.isTag(sibling, ['ol', 'ul']);
	const boxIsList = Dom.isTag(mainClosestBox, ['ol', 'ul']);
	const elementChild = (elm: Element, side: boolean): Nullable<Node> =>
		side ? elm.firstElementChild : elm.lastElementChild;

	if (boxIsList) {
		sibling = jodit.createInside.element(jodit.o.enterBlock);
		Dom.before(mainClosestBox, sibling);

		return moveContentAndRemoveEmpty(
			jodit,
			elementChild(mainClosestBox, backspace),
			sibling,
			backspace
		);
	}

	if (sibling && siblingIsList && !boxIsList) {
		return moveContentAndRemoveEmpty(
			jodit,
			mainClosestBox,
			elementChild(sibling, !backspace),
			backspace
		);
	}

	return false;
}

function moveContentAndRemoveEmpty(
	jodit: IJodit,
	mainClosestBox: Nullable<Node>,
	sibling: Nullable<Node>,
	backspace: boolean
): boolean {
	// Move content and remove empty nodes
	if (mainClosestBox && Dom.isElement(sibling)) {
		Dom.moveContent(
			mainClosestBox,
			sibling,
			!backspace,
			getMoveFilter(jodit)
		);

		let remove: Nullable<Node> = mainClosestBox;

		while (remove && remove !== jodit.editor && Dom.isEmpty(remove)) {
			const parent: Nullable<Node> = remove.parentElement;
			Dom.safeRemove(remove);
			remove = parent;
		}

		return true;
	}

	return false;
}
