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
		// A table cell is never joined with its neighbour
		if (Dom.up(fakeNode, Dom.isCell, mainClosestBox, true)) {
			return false;
		}

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

		const box = findCaretBox(fakeNode, mainClosestBox);

		if (
			sibling &&
			(checkMoveListContent(jodit, box, sibling, backspace) ||
				moveContentAndRemoveEmpty(
					jodit,
					box,
					findEdgeBlock(
						resolveTableSibling(sibling, backspace),
						backspace,
						jodit.editor
					),
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
 * The block holding the caret inside the box that has the sibling, so
 * `<p>one</p><div><p>|two</p></div>` joins the two paragraphs instead of
 * moving the whole `<div>` into the first one. For a list item that is its
 * list, which the list cases handle.
 */
function findCaretBox(fakeNode: Node, mainClosestBox: Element): Element {
	const block = Dom.up(fakeNode, Dom.isBlock, mainClosestBox);

	if (!block) {
		return mainClosestBox;
	}

	return Dom.isLeaf(block) && block.parentElement
		? block.parentElement
		: block;
}

/**
 * The innermost block on the sibling's edge facing the caret, so the
 * content is joined to text: `<div><p>one</p></div><p>|two</p>` gives
 * `<div><p>one|two</p></div>`
 */
function findEdgeBlock(
	sibling: Nullable<Element>,
	backspace: boolean,
	root: HTMLElement
): Nullable<Element> {
	let block = sibling;

	while (block) {
		const edge = backspace ? block.lastChild : block.firstChild;
		const child =
			edge && Dom.isEmptyTextNode(edge)
				? Dom.findNotEmptySibling(edge, backspace)
				: edge;

		if (
			!Dom.isBlock(child) ||
			Dom.isTag(child, INSEPARABLE_TAGS) ||
			Dom.isTag(child, 'table') ||
			!Dom.isContentEditable(child, root)
		) {
			return block;
		}

		block = child;
	}

	return block;
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
