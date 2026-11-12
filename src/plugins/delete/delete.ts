/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/delete/README.md]]
 * @packageDocumentation
 * @module plugins/delete
 */

import type { IJodit, Nullable } from 'jodit/types';
import { NBSP_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { call, toArray, trimInv } from 'jodit/core/helpers';
import { trim } from 'jodit/core/helpers/string/trim';
import { Plugin } from 'jodit/core/plugin';

import './interface';

const NOT_EMPTY_CONTENT_TAGS = new Set([
	'img',
	'table',
	'jodit',
	'iframe',
	'hr'
] as const);

const KEEPS_SPACES = new Set(['pre', 'pre-wrap', 'break-spaces']);

/**
 * A plain space beside this neighbor isn't shown: there is none, or it's a
 * line break, a block or text starting (or ending) with a plain space
 */
// The run of spaces at the end (or the start) of the text becomes nbsp; counted, as `/ +$/` backtracks on a long run
function replaceEdgeSpaces(text: string, atEnd: boolean): string {
	let count = 0;

	while (
		count < text.length &&
		text.charAt(atEnd ? text.length - 1 - count : count) === ' '
	) {
		count += 1;
	}

	if (count === 0) {
		return text;
	}

	return atEnd
		? text.slice(0, text.length - count) + NBSP_SPACE.repeat(count)
		: NBSP_SPACE.repeat(count) + text.slice(count);
}

function hidesSpace(neighbor: Nullable<Node>, edge: RegExp): boolean {
	return (
		!neighbor ||
		Dom.isTag(neighbor, 'br') ||
		Dom.isBlock(neighbor) ||
		(Dom.isText(neighbor) && edge.test(neighbor.nodeValue ?? ''))
	);
}

export class deleteCommand extends Plugin {
	static override requires = ['backspace'];

	protected override afterInit(jodit: IJodit): void {
		jodit.e.on('afterCommand.delete', (command: 'delete' | string) => {
			if (command === 'delete') {
				this.__afterDeleteCommand();
			}
		});

		jodit.registerCommand(
			'delete',
			{
				exec: this.__onDeleteCommand.bind(this)
			},
			{
				stopPropagation: false
			}
		);
	}

	protected override beforeDestruct(jodit: IJodit): void {
		jodit.e.off('afterCommand.delete');
	}

	/**
	 * After Delete command remove extra BR
	 */
	private __afterDeleteCommand(): void {
		const jodit = this.j;

		const current = jodit.s.current();

		if (current && Dom.isTag(current.firstChild, 'br')) {
			jodit.s.removeNode(current.firstChild);
		}

		if (
			!trim(jodit.editor.textContent || '') &&
			!Dom.first(jodit.editor, node =>
				Dom.isTag(node, NOT_EMPTY_CONTENT_TAGS)
			) &&
			(!current || !Dom.closest(current, 'table', jodit.editor))
		) {
			Dom.detach(jodit.editor);

			const node = jodit.s.setCursorIn(jodit.editor);

			jodit.s.removeNode(node);
		}
	}

	private __onDeleteCommand(): false | void {
		const { jodit } = this;

		if (jodit.s.isCollapsed()) {
			return;
		}

		jodit.s.expandSelection();

		const range = jodit.s.range;
		const caret = this.__clearSelectedCells(range);

		if (caret && range.collapsed) {
			jodit.s.selectRange(caret);
			return false;
		}

		range.deleteContents();

		const fake = jodit.createInside.fake();
		range.insertNode(fake);

		const leftSibling = Dom.findSibling(fake, true);
		const rightSibling = Dom.findSibling(fake, false);

		this.__moveContentInLeftSibling(fake, leftSibling, rightSibling);
		this.__keepSpacesVisible(fake);
		this.__keepSpacesVisibleBesideTable(fake);

		range.setStartBefore(fake);
		range.collapse(true);

		this.__moveCursorInEditableSibling(jodit, leftSibling, fake, range);
		this.__addBrInEmptyBlock(fake, range);

		Dom.safeRemove(fake);
		jodit.s.selectRange(caret ?? range);

		return false;
	}

	/**
	 * A selection that starts or ends in a table cell clears the selected part
	 * of each cell it covers and keeps the cells, as the browsers do.
	 * `deleteContents` would remove the cells it fully covers, and the cells
	 * it cuts would then be merged as blocks. The range is moved out of those
	 * tables, so only the content between them is left to delete.
	 *
	 * Returns where the caret goes, or null when no table is involved
	 */
	private __clearSelectedCells(range: Range): Nullable<Range> {
		const { editor, createInside } = this.j;

		const startCell = Dom.closest(range.startContainer, Dom.isCell, editor);
		const endCell = Dom.closest(range.endContainer, Dom.isCell, editor);

		if (startCell === endCell) {
			return null;
		}

		const startTable = Dom.closest(startCell, 'table', editor);
		const endTable = Dom.closest(endCell, 'table', editor);

		const caret = range.cloneRange();
		caret.collapse(true);

		// Where the selection ends, which follows the deletion in its cell
		const end = range.cloneRange();
		end.collapse(false);

		const parts: Array<[HTMLTableCellElement, Range]> = [];

		const addParts = (table: HTMLTableElement): void => {
			toArray(table.rows)
				.flatMap(row => toArray(row.cells))
				.filter(cell => range.intersectsNode(cell))
				.forEach(cell => {
					const part = range.cloneRange();

					if (!Dom.isOrContains(cell, range.startContainer)) {
						part.setStart(cell, 0);
					}

					if (!Dom.isOrContains(cell, range.endContainer)) {
						part.setEnd(cell, cell.childNodes.length);
					}

					parts.push([cell, part]);
				});
		};

		if (startTable) {
			addParts(startTable);

			if (startTable === endTable) {
				range.collapse(true);
			} else {
				range.setStartAfter(startTable);
			}
		}

		if (endTable && endTable !== startTable) {
			addParts(endTable);
			range.setEndBefore(endTable);
		}

		parts.forEach(([cell, part]) => {
			part.deleteContents();

			if (Dom.isEmpty(cell)) {
				Dom.detach(cell);
				Dom.append(cell, createInside.element('br'));
				return;
			}

			// A space left at the cell's edge, where the selection started or
			// ended in it, would be hidden, as at a block's (#1783). Each edge
			// moves beside its fake, as making the space non-breaking would
			// move it to the start of its text
			[caret, end]
				.filter(edge => Dom.isOrContains(cell, edge.startContainer))
				.forEach(edge => {
					const fake = createInside.fake();
					edge.insertNode(fake);
					this.__keepSpacesVisible(fake);
					edge.setStartBefore(fake);
					edge.collapse(true);
					Dom.safeRemove(fake);
				});
		});

		return startTable ? caret : null;
	}

	private __moveContentInLeftSibling(
		fake: Text,
		leftSibling: Nullable<Node>,
		rightSibling: Nullable<Node>
	): void {
		leftSibling = this.__defineRightLeftBox(leftSibling);

		// Nothing is moved into a table, and a block left empty after it goes
		if (Dom.isTag(leftSibling, 'table')) {
			if (Dom.isBlock(rightSibling) && Dom.isEmpty(rightSibling)) {
				Dom.safeRemove(rightSibling);
			}

			return;
		}

		if (
			!Dom.isList(rightSibling) &&
			!Dom.isTag(rightSibling, 'table') &&
			Dom.isBlock(rightSibling) &&
			Dom.isBlock(leftSibling)
		) {
			Dom.append(leftSibling, fake);
			Dom.moveContent(rightSibling, leftSibling);
			Dom.safeRemove(rightSibling);
		}

		if (
			Dom.isList(rightSibling) &&
			Dom.isLeaf(rightSibling.firstElementChild)
		) {
			const item = rightSibling.firstElementChild;

			// What's left of the right list's first item joins the left block,
			// up to a list nested in the item
			if (!Dom.isEmpty(item) && Dom.isBlock(leftSibling)) {
				Dom.append(leftSibling, fake);

				while (item.firstChild && !Dom.isBlock(item.firstChild)) {
					Dom.append(leftSibling, item.firstChild);
				}
			}

			// Remove empty right LI
			if (Dom.isEmpty(item)) {
				Dom.safeRemove(item);
			}

			if (Dom.isEmpty(rightSibling)) {
				Dom.safeRemove(rightSibling);
			}
		}
	}

	/**
	 * A plain space the deletion leaves at an edge of the block, before a line
	 * break or next to another space isn't shown, and the browser drops it when
	 * the next char is typed. It becomes non-breaking, as in the browsers' own
	 * delete and in Backspace without a selection (#1522)
	 */
	private __keepSpacesVisible(fake: Text): void {
		const { jodit } = this;
		const block =
			Dom.closest(fake, Dom.isBlock, jodit.editor) ?? jodit.editor;

		if (KEEPS_SPACES.has(jodit.ew.getComputedStyle(block).whiteSpace)) {
			return;
		}

		const before = this.__findNeighbor(fake, true, block);
		const after = this.__findNeighbor(fake, false, block);

		if (Dom.isText(before) && hidesSpace(after, /^ /)) {
			before.nodeValue = replaceEdgeSpaces(before.nodeValue!, true);
		}

		if (Dom.isText(after) && hidesSpace(before, / $/)) {
			after.nodeValue = replaceEdgeSpaces(after.nodeValue!, false);
		}
	}

	/**
	 * A deletion that starts or ends in a table leaves the fake between the
	 * table and the block it reached into, and a space at that block's edge
	 * would be hidden as well (#1783)
	 */
	private __keepSpacesVisibleBesideTable(fake: Text): void {
		const before = Dom.findNotEmptySibling(fake, true);
		const after = Dom.findNotEmptySibling(fake, false);

		const block = Dom.isTag(after, 'table')
			? before
			: Dom.isTag(before, 'table')
				? after
				: null;

		if (!Dom.isBlock(block) || Dom.isTag(block, 'table')) {
			return;
		}

		const edge = this.jodit.createInside.fake();

		if (block === before) {
			Dom.append(block, edge);
		} else {
			block.insertBefore(edge, block.firstChild);
		}

		this.__keepSpacesVisible(edge);
		Dom.safeRemove(edge);
	}

	/**
	 * The text, line break or other element next to the caret in its block,
	 * looking inside inline elements
	 */
	private __findNeighbor(
		fake: Text,
		left: boolean,
		block: HTMLElement
	): Nullable<Node> {
		return call(
			left ? Dom.prev : Dom.next,
			fake,
			(node: Nullable<Node>) =>
				Dom.isText(node)
					? trimInv(node.nodeValue ?? '').length > 0
					: !Dom.isComment(node) &&
						!(Dom.isInlineBlock(node) && node.firstChild),
			block
		);
	}

	/**
	 * If left sibling is list - return last leaf
	 */
	private __defineRightLeftBox(leftSibling: Nullable<Node>): Nullable<Node> {
		if (!Dom.isList(leftSibling)) {
			return leftSibling;
		}

		let lastLeaf = leftSibling.lastElementChild;
		if (!Dom.isLeaf(lastLeaf)) {
			lastLeaf = this.j.createInside.element('li');
			Dom.append(leftSibling, lastLeaf);
		}

		return lastLeaf;
	}

	/**
	 * Add BR in the empty block left at the caret
	 */
	private __addBrInEmptyBlock(fake: Text, range: Range): void {
		const jodit = this.j;

		if (
			fake.isConnected &&
			Dom.isBlock(fake.parentNode) &&
			!fake.nextSibling &&
			!fake.previousSibling
		) {
			const br = jodit.createInside.element('br');
			Dom.after(fake, br);
			range.setStartBefore(br);
			range.collapse(true);
		}
	}

	private __moveCursorInEditableSibling(
		jodit: IJodit,
		leftSibling: Node | null,
		fake: Text,
		range: Range
	): void {
		if (!leftSibling || !Dom.isText(leftSibling)) {
			const root =
				Dom.closest(fake, Dom.isBlock, jodit.editor) ?? jodit.editor;

			const leftText = Dom.prev(fake, Dom.isText, root);

			if (leftText) {
				range.setStartAfter(leftText);
				range.collapse(true);
				Dom.safeRemove(fake);
			}
		}
	}
}

pluginSystem.add('deleteCommand', deleteCommand);
