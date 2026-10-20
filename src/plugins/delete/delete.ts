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
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { toArray } from 'jodit/core/helpers';
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
			}
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

		// Remove empty right LI
		if (
			Dom.isList(rightSibling) &&
			Dom.isLeaf(rightSibling.firstElementChild) &&
			Dom.isEmpty(rightSibling.firstElementChild)
		) {
			Dom.safeRemove(rightSibling.firstElementChild);
		}
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
