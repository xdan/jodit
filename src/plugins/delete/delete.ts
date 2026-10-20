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
import { $$, toArray } from 'jodit/core/helpers';
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

		if (this.__clearSelectedCells(range)) {
			jodit.s.selectRange(range);
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
		this.__addBrInEmptyBlock(fake, rightSibling, range);

		Dom.safeRemove(fake);
		jodit.s.selectRange(range);

		return false;
	}

	/**
	 * A selection from one table cell into another clears the selected part
	 * of each cell and keeps the cells, as the browsers do. `deleteContents`
	 * would remove the cells it fully covers, and the cells it splits would
	 * then be merged as blocks.
	 */
	private __clearSelectedCells(range: Range): boolean {
		const { editor, createInside } = this.j;

		const startCell = Dom.closest(range.startContainer, Dom.isCell, editor);
		const endCell = Dom.closest(range.endContainer, Dom.isCell, editor);
		const table = startCell && Dom.closest(startCell, 'table', editor);

		if (
			!table ||
			!endCell ||
			startCell === endCell ||
			Dom.closest(endCell, 'table', editor) !== table
		) {
			return false;
		}

		const parts = toArray(table.rows)
			.flatMap(row => toArray(row.cells))
			.filter(cell => range.intersectsNode(cell))
			.map(cell => {
				const part = range.cloneRange();

				if (!Dom.isOrContains(cell, range.startContainer)) {
					part.setStart(cell, 0);
				}

				if (!Dom.isOrContains(cell, range.endContainer)) {
					part.setEnd(cell, cell.childNodes.length);
				}

				return [cell, part] as const;
			});

		range.collapse(true);

		parts.forEach(([cell, part]) => {
			part.deleteContents();

			if (Dom.isEmpty(cell)) {
				Dom.detach(cell);
				Dom.append(cell, createInside.element('br'));
			}
		});

		return true;
	}

	private __moveContentInLeftSibling(
		fake: Text,
		leftSibling: Nullable<Node>,
		rightSibling: Nullable<Node>
	): void {
		leftSibling = this.__defineRightLeftBox(leftSibling);

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
	 * Add BR in empty blocks left and right(for table cell)
	 */
	private __addBrInEmptyBlock(
		fake: Text,
		rightSibling: Nullable<Node>,
		range: Range
	): void {
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

		// Add BR in the right empty table cell
		if (Dom.isTag(rightSibling, 'table')) {
			const firstCell = $$('td,th', rightSibling).shift();
			if (Dom.isCell(firstCell) && Dom.isEmpty(firstCell)) {
				Dom.append(firstCell, jodit.createInside.element('br'));
			}
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
