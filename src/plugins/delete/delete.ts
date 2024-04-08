/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/delete/README.md]]
 * @packageDocumentation
 * @module plugins/delete
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { $$ } from 'jodit/core/helpers';
import { trim } from 'jodit/core/helpers/string/trim';
import { Plugin } from 'jodit/core/plugin';

import './interface';

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
			!jodit.editor.querySelector('img,table,jodit,iframe,hr') &&
			(!current || !Dom.closest(current, 'table', jodit.editor))
		) {
			jodit.editor.innerHTML = '';

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
