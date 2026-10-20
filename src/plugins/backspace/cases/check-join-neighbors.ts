/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit, Nullable } from 'jodit/types';
import { INSEPARABLE_TAGS, LIST_TAGS } from 'jodit/core/constants';
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

	// Find the main big closest element
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

		// A line break before the cursor is a single unit: remove it instead of
		// merging the current element into the (void) `<br>`, which used to move
		// the whole element's content into the `<br>` and delete it (#1282).
		if (Dom.isTag(sibling, 'br')) {
			Dom.safeRemove(sibling);
			jodit.s.setCursorBefore(fakeNode);
			return true;
		}

		if (
			sibling &&
			(checkPullNextLine(
				jodit,
				fakeNode,
				mainClosestBox,
				sibling,
				backspace
			) ||
				checkMoveListContent(
					jodit,
					mainClosestBox,
					sibling,
					backspace
				) ||
				moveContentAndRemoveEmpty(
					jodit,
					mainClosestBox,
					resolveTableSibling(sibling, backspace),
					backspace
				))
		) {
			jodit.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	return false;
}

/**
 * Content cannot be merged into the `<table>` element itself — it would land
 * between the table sections (after `</tbody>`), which is invalid HTML and
 * gets foster-parented out of the table on the next parse. Merge into the
 * edge cell instead. See https://github.com/xdan/jodit/issues/1064
 * @private
 */
function resolveTableSibling(
	sibling: Element,
	backspace: boolean
): Nullable<Element> {
	if (!Dom.isTag(sibling, 'table')) {
		return sibling;
	}

	const cells: HTMLTableCellElement[] = [];

	Dom.each(sibling, node => {
		Dom.isCell(node) && cells.push(node);
	});
	return cells.length ? cells[backspace ? cells.length - 1 : 0] : null;
}

/**
 * Delete at the edge of a list pulls the next line up to the caret, as the
 * browsers do, instead of moving the caret's line into the next block:
 * `<ul><li>one|</li></ul><p>two</p>` gives `<ul><li>one|two</li></ul>`, and
 * `<p>one|</p><ul><li>two</li></ul>` gives `<p>one|two</p>`
 * @private
 */
function checkPullNextLine(
	jodit: IJodit,
	fakeNode: Node,
	mainClosestBox: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	if (backspace || !(Dom.isList(mainClosestBox) || Dom.isList(sibling))) {
		return false;
	}

	const target = Dom.up(fakeNode, Dom.isBlock, mainClosestBox, true);
	const source = Dom.isList(sibling) ? sibling.firstElementChild : sibling;

	if (
		!target ||
		!source ||
		Dom.isTag(source, INSEPARABLE_TAGS) ||
		Dom.isTag(source, 'table')
	) {
		return false;
	}

	if (!Dom.isEmpty(source)) {
		const line: Node[] = [];

		for (
			let node = source.firstChild;
			node && !Dom.isBlock(node);
			node = node.nextSibling
		) {
			line.push(node);
		}

		if (!line.length) {
			return false;
		}

		const filter = getMoveFilter(jodit);

		line.forEach(node =>
			filter(node) ? Dom.append(target, node) : Dom.safeRemove(node)
		);
	}

	let remove: Nullable<Node> = source;

	while (remove && remove !== jodit.editor && Dom.isEmpty(remove)) {
		const parent: Nullable<Node> = remove.parentElement;
		Dom.safeRemove(remove);
		remove = parent;
	}

	return true;
}

function checkMoveListContent(
	jodit: IJodit,
	mainClosestBox: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	// Process UL/LI/OL cases
	const siblingIsList = Dom.isTag(sibling, LIST_TAGS);
	const boxIsList = Dom.isTag(mainClosestBox, LIST_TAGS);
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
