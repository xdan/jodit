/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/backspace/README.md]]
 * @packageDocumentation
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { INVISIBLE_SPACE } from 'jodit/core/constants';
import { isFunction, trim } from 'jodit/core/helpers';
import { moveNodeInsideStart } from 'jodit/core/selection/helpers';
import { pluginSystem } from 'jodit/core/global';

import type { DeleteMode } from './interface';
import { cases } from './cases';
import { checkNotCollapsed } from './cases/check-not-collapsed';

import './config';

export class backspace extends Plugin {
	override requires = ['hotkeys'];

	protected override afterInit(jodit: IJodit): void {
		jodit.e.on('afterCommand.delete', (command: 'delete' | string) => {
			if (command === 'delete') {
				this.afterDeleteCommand();
			}
		});

		jodit
			.registerCommand(
				'deleteButton',
				{
					exec: () => this.onDelete(false),
					hotkeys: jodit.o.delete.hotkeys.delete
				},
				{
					stopPropagation: false
				}
			)
			.registerCommand(
				'backspaceButton',
				{
					exec: () => this.onDelete(true),
					hotkeys: jodit.o.delete.hotkeys.backspace
				},
				{
					stopPropagation: false
				}
			)
			.registerCommand('deleteWordButton', {
				exec: () => this.onDelete(false, 'word'),
				hotkeys: jodit.o.delete.hotkeys.deleteWord
			})
			.registerCommand('backspaceWordButton', {
				exec: () => this.onDelete(true, 'word'),
				hotkeys: jodit.o.delete.hotkeys.backspaceWord
			})
			.registerCommand('deleteSentenceButton', {
				exec: () => this.onDelete(false, 'sentence'),
				hotkeys: jodit.o.delete.hotkeys.deleteSentence
			})
			.registerCommand('backspaceSentenceButton', {
				exec: () => this.onDelete(true, 'sentence'),
				hotkeys: jodit.o.delete.hotkeys.backspaceSentence
			});
	}

	protected override beforeDestruct(jodit: IJodit): void {
		jodit.e.off('afterCommand.delete');
	}

	/**
	 * After Delete command remove extra BR
	 */
	private afterDeleteCommand(): void {
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

	/**
	 * Listener BackSpace or Delete button
	 */
	private onDelete(
		backspace: boolean,
		mode: DeleteMode = 'char'
	): false | void {
		const jodit = this.j;

		const sel = jodit.selection;

		if (!sel.isFocused()) {
			sel.focus();
		}

		if (checkNotCollapsed(jodit)) {
			return false;
		}

		const range = sel.range;
		const fakeNode = jodit.createInside.text(INVISIBLE_SPACE);

		try {
			Dom.safeInsertNode(range, fakeNode);

			if (!Dom.isOrContains(jodit.editor, fakeNode)) {
				return;
			}

			if (jodit.e.fire('backSpaceBeforeCases', backspace, fakeNode)) {
				return false;
			}

			moveNodeInsideStart(jodit, fakeNode, backspace);

			if (
				cases.some((func): void | true => {
					if (
						isFunction(func) &&
						func(jodit, fakeNode, backspace, mode)
					) {
						if (!isProd) {
							console.info('Remove case:', func.name);
						}
						return true;
					}
				})
			) {
				return false;
			}
		} catch (e) {
			if (!isProd) {
				console.error(e);
			}

			throw e;
		} finally {
			jodit.e.fire('backSpaceAfterDelete', backspace, fakeNode);
			this.safeRemoveEmptyNode(fakeNode);
		}

		return false;
	}

	/**
	 * Remove node and replace cursor position out of it
	 */
	private safeRemoveEmptyNode(fakeNode: Node): void {
		const { range } = this.j.s;

		if (range.startContainer === fakeNode) {
			if (fakeNode.previousSibling) {
				if (Dom.isText(fakeNode.previousSibling)) {
					range.setStart(
						fakeNode.previousSibling,
						fakeNode.previousSibling.nodeValue?.length ?? 0
					);
				} else {
					range.setStartAfter(fakeNode.previousSibling);
				}
			} else if (fakeNode.nextSibling) {
				if (Dom.isText(fakeNode.nextSibling)) {
					range.setStart(fakeNode.nextSibling, 0);
				} else {
					range.setStartBefore(fakeNode.nextSibling);
				}
			}

			range.collapse(true);
			this.j.s.selectRange(range);
		}

		Dom.safeRemove(fakeNode);
	}
}

pluginSystem.add('backspace', backspace);
