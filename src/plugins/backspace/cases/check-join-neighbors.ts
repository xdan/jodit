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
	return joinNeighbors(jodit, fakeNode, backspace, false);
}

/**
 * `moved` is set on the one re-entrant pass after `moveToNextLine`
 */
function joinNeighbors(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean,
	moved: boolean
): boolean {
	if (checkJoinBareText(jodit, fakeNode, backspace)) {
		return true;
	}

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

		// With the inline element inside its blocks, the cases below join the
		// lines as they join any two, and its styles stay with its text
		if (
			moveInlineInside(mainClosestBox, jodit.editor) ||
			moveInlineInside(sibling, jodit.editor)
		) {
			return joinNeighbors(jodit, fakeNode, backspace, moved);
		}

		// A line break before the cursor is a single unit: remove it instead of
		// merging the current element into the (void) `<br>`, which used to move
		// the whole element's content into the `<br>` and delete it (#1282).
		if (Dom.isTag(sibling, 'br')) {
			Dom.safeRemove(sibling);
			jodit.s.setCursorBefore(fakeNode);
			return true;
		}

		// Backspace leaves a block after a table alone, as Word does, rather
		// than moving its text into the last cell
		if (backspace && Dom.isTag(sibling, 'table')) {
			jodit.s.setCursorBefore(fakeNode);
			return true;
		}

		const box = findCaretBox(fakeNode, mainClosestBox);

		// One pass only: the line now sits beside the next one, so the
		// cases below join them. The DOM has changed either way
		if (
			!moved &&
			sibling &&
			moveToNextLine(jodit, fakeNode, box, sibling, backspace)
		) {
			if (!joinNeighbors(jodit, fakeNode, backspace, true)) {
				jodit.s.setCursorBefore(fakeNode);
			}

			return true;
		}

		if (
			sibling &&
			(checkPullNextLine(jodit, fakeNode, box, sibling, backspace) ||
				checkMoveListContent(jodit, box, sibling, backspace) ||
				checkJoinInlineSibling(jodit, box, sibling, backspace) ||
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
 * Old content can have an inline element round blocks. This moves it inside
 * them: `<span style="…"><p>one</p><p>two</p></span>` becomes
 * `<p><span style="…">one</span></p><p><span style="…">two</span></p>`.
 * An element that holds anything but blocks is left as it is.
 */
function moveInlineInside(node: Nullable<Node>, root: HTMLElement): boolean {
	if (!Dom.isElement(node) || Dom.isBlock(node)) {
		return false;
	}

	// The inner one first: `<span><strong><p>one</p></strong></span>`
	Array.from(node.childNodes).forEach(child => moveInlineInside(child, root));

	const children = Array.from(node.childNodes).filter(
		child => !Dom.isEmptyTextNode(child)
	);

	if (!children.length || !children.every(child => Dom.isBlock(child))) {
		return false;
	}

	children.forEach(block => {
		// Nothing goes inside a rule, an embed or a non-editable block
		if (
			Dom.isTag(block, INSEPARABLE_TAGS) ||
			!Dom.isContentEditable(block, root)
		) {
			return;
		}

		const inner = node.cloneNode(false);
		Dom.moveContent(block, inner);
		Dom.append(block, inner);

		// A list or a table: on down to its items or cells
		moveInlineInside(inner, root);
	});

	Dom.unwrap(node);

	return true;
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

/**
 * On Delete, Word joins two lines where the next one is, inside or outside
 * its box or quote, and the joined line keeps the caret line's kind, list item
 * or paragraph. Two paragraphs already join that way. When either line is a
 * list item, this moves the caret's line beside the next one, and the usual
 * cases then join them: `<p>one|</p><div><ul><li>two</li></ul></div>` becomes
 * `<div><p>one|</p><ul><li>two</li></ul></div>`
 * @private
 */
function moveToNextLine(
	jodit: IJodit,
	fakeNode: Node,
	box: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	if (
		backspace ||
		Dom.isTag(sibling, 'table') ||
		Dom.isTag(sibling, INSEPARABLE_TAGS) ||
		!Dom.isContentEditable(sibling, jodit.editor)
	) {
		return false;
	}

	const line = Dom.up(fakeNode, Dom.isBlock, box, true);
	const next = findEdgeBlock(sibling, false, jodit.editor);

	if (
		!line ||
		!next ||
		!Dom.isContentEditable(next, jodit.editor) ||
		!(Dom.isLeaf(line) || Dom.isLeaf(next)) ||
		// A paragraph inside a list item is left as it is
		Dom.isLeaf(line.parentElement) ||
		Dom.isLeaf(next.parentElement) ||
		boxOf(line) === boxOf(next)
	) {
		return false;
	}

	const from = line.parentElement;

	if (Dom.isLeaf(line) && Dom.isLeaf(next)) {
		Dom.before(next, line);
	} else if (Dom.isLeaf(line)) {
		// A list item keeps its bullet, in a list of its own
		Dom.before(next, ownList(line));
	} else {
		// A paragraph can't go inside a list, so it goes in front of it
		Dom.before(next.parentElement!, line);
	}

	let remove: Nullable<Node> = from;

	while (remove && remove !== jodit.editor && Dom.isEmpty(remove)) {
		const parent: Nullable<Node> = remove.parentElement;
		Dom.safeRemove(remove);
		remove = parent;
	}

	return true;
}

/**
 * The box or quote a line is in, past its lists
 */
function boxOf(line: Element): Nullable<Element> {
	let box = line.parentElement;

	while (Dom.isList(box) || Dom.isLeaf(box)) {
		box = box.parentElement;
	}

	return box;
}

/**
 * Moves a list item into a list of its own, which carries on its numbering
 */
function ownList(item: HTMLLIElement): HTMLElement {
	const list = item.parentElement as HTMLElement;
	const own = list.cloneNode(false) as HTMLElement;
	const index = Array.from(list.children).indexOf(item);

	if (index) {
		// Two lists cannot share one id
		own.removeAttribute('id');

		if (Dom.isTag(list, 'ol')) {
			const start = parseInt(list.getAttribute('start') || '1', 10) || 1;
			own.setAttribute('start', String(start + index));
		}
	}

	Dom.append(own, item);

	return own;
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
	box: Element,
	sibling: Element,
	backspace: boolean
): boolean {
	if (backspace || !(Dom.isList(box) || Dom.isList(sibling))) {
		return false;
	}

	const target = Dom.up(fakeNode, Dom.isBlock, box, true);
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

/**
 * A block next to bare text in the same parent joins that text, as the
 * browsers do: `<li>one<p>|two</p></li>` gives `<li>one|two</li>`, and
 * `<li><p>one|</p>two</li>` gives `<li><p>one|two</p></li>`
 * @private
 */
function checkJoinInlineSibling(
	jodit: IJodit,
	box: Element,
	sibling: Node,
	backspace: boolean
): boolean {
	if (
		Dom.isBlock(sibling) ||
		!Dom.isBlock(box) ||
		Dom.isList(box) ||
		// The caret's block is nested deeper than the text: `text<div><p>|x</p></div>`
		box.parentNode !== sibling.parentNode ||
		Array.from(box.childNodes).some(node => Dom.isBlock(node))
	) {
		return false;
	}

	if (backspace) {
		// Text after the block keeps its own line
		const next = Dom.findNotEmptySibling(box, false);
		if (next && !Dom.isBlock(next) && !Dom.isTag(next, 'br')) {
			Dom.after(box, jodit.createInside.element('br'));
		}

		Dom.unwrap(box);
		return true;
	}

	const filter = getMoveFilter(jodit);

	for (let node: Nullable<Node> = sibling; node && !Dom.isBlock(node);) {
		const next: Nullable<Node> = node.nextSibling;

		if (Dom.isTag(node, 'br')) {
			Dom.safeRemove(node);
			break;
		}

		filter(node) ? Dom.append(box, node) : Dom.safeRemove(node);
		node = next;
	}

	return true;
}

/**
 * Bare text next to a block in the same parent, as the browsers join them:
 * Backspace in `<div><p>a</p>|b</div>` gives `<div><p>a|b</p></div>`, Delete
 * in `<div>a|<p>b</p>c</div>` gives `<div>a|b<br>c</div>`
 */
function checkJoinBareText(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean
): boolean {
	const block = Dom.findNotEmptySibling(fakeNode, backspace);

	if (
		!Dom.isElement(block) ||
		!Dom.isBlock(block) ||
		Dom.isList(block) ||
		Dom.isTag(block, 'table') ||
		Dom.isCell(block) ||
		!Dom.isContentEditable(block, jodit.editor) ||
		Array.from(block.childNodes).some(node => Dom.isBlock(node))
	) {
		return false;
	}

	const filter = getMoveFilter(jodit);

	if (backspace) {
		// The caret's line goes to the end of the block before it
		for (let node: Nullable<Node> = fakeNode; node && !Dom.isBlock(node);) {
			const next: Nullable<Node> = node.nextSibling;

			if (Dom.isTag(node, 'br')) {
				Dom.safeRemove(node);
				break;
			}

			filter(node) ? Dom.append(block, node) : Dom.safeRemove(node);
			node = next;
		}
	} else {
		// The block's content joins the caret's line, and text after the
		// block keeps its own line
		const next = Dom.findNotEmptySibling(block, false);

		if (next && !Dom.isBlock(next) && !Dom.isTag(next, 'br')) {
			Dom.after(block, jodit.createInside.element('br'));
		}

		Dom.unwrap(block);
	}

	jodit.s.setCursorBefore(fakeNode);
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
