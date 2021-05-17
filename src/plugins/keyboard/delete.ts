/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Plugin } from '../../core/plugin';
import type { CanUndef, IJodit, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import {
	INSEPARABLE_TAGS,
	INVISIBLE_SPACE,
	NBSP_SPACE
} from '../../core/constants';
import { isVoid, call, trim, attr, trimInv, toArray } from '../../core/helpers';
import {
	findMostNestedNeighbor,
	findNotEmptyNeighbor,
	findNotEmptySibling,
	getSibling,
	getSiblingBox,
	normalizeCursorPosition
} from './helpers';
import { Config } from '../../config';

declare module '../../config' {
	interface Config {
		delete: {
			hotkeys: {
				delete: string[];
				deleteWord: string[];
				backspace: string[];
				backspaceWord: string[];
			};
		};
	}
}

Config.prototype.delete = {
	hotkeys: {
		delete: ['delete', 'cmd+backspace'],
		deleteWord: ['ctrl+delete', 'cmd+alt+backspace', 'ctrl+alt+backspace'],
		backspace: ['backspace'],
		backspaceWord: ['ctrl+backspace']
	}
};

export class Delete extends Plugin {
	/** @override */
	requires = ['hotkeys'];

	/**
	 * Shortcut for jodit.editor
	 */
	private get root(): HTMLElement {
		return this.j.editor;
	}

	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.e.on('afterCommand.delete', (command: string) => {
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
				exec: () => this.onDelete(false, true),
				hotkeys: jodit.o.delete.hotkeys.deleteWord
			})
			.registerCommand('backspaceWordButton', {
				exec: () => this.onDelete(true, true),
				hotkeys: jodit.o.delete.hotkeys.backspaceWord
			});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
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
			!jodit.editor.querySelector('img') &&
			(!current || !Dom.closest(current, 'table', jodit.editor))
		) {
			jodit.editor.innerHTML = '';

			const node = jodit.s.setCursorIn(jodit.editor);

			jodit.s.removeNode(node);
		}
	}

	/**
	 * Listener BackSpace or Delete button
	 *
	 * @param backspace
	 * @param block
	 */
	private onDelete(backspace: boolean, block: boolean = false): false | void {
		const sel = this.j.selection;

		if (!sel.isFocused()) {
			sel.focus();
		}

		if (!sel.sel?.rangeCount || this.checkNotCollapsed()) {
			return false;
		}

		const jodit = this.j;

		const range = sel.range;
		const fakeNode = jodit.createInside.text(INVISIBLE_SPACE);

		try {
			range.insertNode(fakeNode);

			if (!Dom.isOrContains(jodit.editor, fakeNode)) {
				return;
			}

			normalizeCursorPosition(fakeNode, backspace);

			if (
				this.checkRemoveInseparableElement(fakeNode, backspace) ||
				this.checkRemoveChar(fakeNode, backspace, block) ||
				this.checkTableCell(fakeNode, backspace) ||
				this.checkRemoveEmptyParent(fakeNode, backspace) ||
				this.checkRemoveEmptyNeighbor(fakeNode, backspace) ||
				this.checkJoinTwoLists(fakeNode, backspace) ||
				this.checkJoinNeighbors(fakeNode, backspace) ||
				this.checkRewrapListItem(fakeNode, backspace)
			) {
				return false;
			}
		} catch (e) {
			if (!isProd) {
				console.error(e);
			}

			throw e;
		} finally {
			this.safeRemoveEmptyNode(fakeNode);
		}

		return false;
	}

	/**
	 * On Not collapsed selection - should only remove whole selected content
	 *
	 * @example
	 * ```html
	 * <p>first | stop</p><p>second | stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>first | stop</p>
	 * ```
	 */
	private checkNotCollapsed(): void | true {
		const jodit = this.j;

		if (!jodit.s.isCollapsed()) {
			jodit.execCommand('Delete');
			return true;
		}
	}

	/**
	 * Check possibility the char can be removed
	 *
	 * @example
	 * ```html
	 * te|st
	 * ```
	 * result
	 * ```html
	 * t|st
	 * ```
	 * @param fakeNode
	 * @param backspace
	 * @param block
	 */
	private checkRemoveChar(
		fakeNode: Node,
		backspace: boolean,
		block: boolean
	): void | true {
		const step = backspace ? -1 : 1;
		const anotherSibling: Nullable<Node> = getSibling(fakeNode, !backspace);

		let sibling: Nullable<Node> = getSibling(fakeNode, backspace),
			removeNeighbor: Nullable<Node> = null;

		let charRemoved: boolean = false,
			removed: CanUndef<string>;

		while (sibling && (Dom.isText(sibling) || Dom.isInlineBlock(sibling))) {
			while (Dom.isInlineBlock(sibling)) {
				sibling = (
					backspace ? sibling?.lastChild : sibling?.firstChild
				) as Nullable<Node>;
			}

			if (!sibling) {
				break;
			}

			if (sibling.nodeValue?.length) {
				// For Unicode escapes
				let value = toArray(sibling.nodeValue);

				const length = value.length;

				let index = backspace ? length - 1 : 0;

				if (value[index] === INVISIBLE_SPACE) {
					while (value[index] === INVISIBLE_SPACE) {
						index += step;
					}
				}

				removed = value[index];

				if (value[index + step] === INVISIBLE_SPACE) {
					index += step;

					while (value[index] === INVISIBLE_SPACE) {
						index += step;
					}

					index += backspace ? 1 : -1;
				}

				if (backspace && index < 0) {
					value = [];
				} else {
					value = value.slice(
						backspace ? 0 : index + 1,
						backspace ? index : length
					);
				}

				if (
					!anotherSibling ||
					!Dom.isText(anotherSibling) ||
					(!backspace ? / $/ : /^ /).test(
						anotherSibling.nodeValue ?? ''
					) ||
					!trimInv(anotherSibling.nodeValue || '').length
				) {
					for (
						let i = backspace ? value.length - 1 : 0;
						backspace ? i >= 0 : i < value.length;
						i += backspace ? -1 : 1
					) {
						if (value[i] === ' ') {
							value[i] = NBSP_SPACE;
						} else {
							break;
						}
					}
				}

				sibling.nodeValue = value.join('');
			}

			if (!sibling.nodeValue?.length) {
				removeNeighbor = sibling;
			}

			if (!isVoid(removed) && removed !== INVISIBLE_SPACE) {
				charRemoved = true;

				call(backspace ? Dom.after : Dom.before, sibling, fakeNode);

				if (block) {
					while (this.checkRemoveChar(fakeNode, backspace, false)) {}
				}

				break;
			}

			let nextSibling = getSibling(sibling, backspace);

			if (
				!nextSibling &&
				sibling.parentNode &&
				sibling.parentNode !== this.root
			) {
				nextSibling = findMostNestedNeighbor(
					sibling,
					!backspace,
					this.root,
					true
				);
			}

			if (removeNeighbor) {
				Dom.safeRemove(removeNeighbor);
				removeNeighbor = null;
			}

			sibling = nextSibling;
		}

		if (charRemoved) {
			this.removeEmptyInlineParent(fakeNode);
			this.addBRInsideEmptyBlock(fakeNode);
			this.j.s.setCursorBefore(fakeNode);
		}

		return charRemoved || undefined;
	}

	/**
	 * Helper remove all empty inline parents
	 * @param node
	 */
	private removeEmptyInlineParent(node: Node): void {
		let parent = node.parentElement;

		while (parent && Dom.isInlineBlock(parent)) {
			const p = parent.parentElement;

			if (Dom.isEmpty(parent)) {
				Dom.after(parent, node);
				Dom.safeRemove(parent);
			}

			parent = p;
		}
	}

	/**
	 * Helper add BR element inside empty block element
	 * @param node
	 */
	private addBRInsideEmptyBlock(node: Node): void {
		if (
			node.parentElement !== this.root &&
			Dom.isBlock(node.parentElement, this.j.ew) &&
			Dom.each(node.parentElement, Dom.isEmptyTextNode)
		) {
			Dom.after(node, this.j.createInside.element('br'));
		}
	}

	/**
	 * Check possibility inseparable Element can be removed (img, hr etc.)
	 *
	 * @example
	 * ```html
	 * <p>first second <img>| stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>first second | stop</p>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveInseparableElement(
		fakeNode: Node,
		backspace: boolean
	): void | true {
		const neighbor = Dom.findSibling(fakeNode, backspace);

		if (
			Dom.isElement(neighbor) &&
			(Dom.isTag(neighbor, INSEPARABLE_TAGS) ||
				Dom.isEmpty(neighbor) ||
				attr(neighbor, 'contenteditable') === 'false')
		) {
			Dom.safeRemove(neighbor);
			this.j.s.setCursorBefore(fakeNode);

			if (Dom.isTag(neighbor, 'br')) {
				this.checkRemoveEmptyParent(fakeNode, backspace);
			}

			return true;
		}
	}

	/**
	 * Inside the CELL table - nothing to do
	 *
	 * @example
	 * ```html
	 * <table><tr><td>|test</td></tr></table>
	 * ```
	 * result
	 * ```html
	 * <table><tr><td>|test</td></tr></table>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkTableCell(fakeNode: Node, backspace: boolean): void | true {
		const cell = fakeNode.parentElement;

		if (Dom.isCell(cell, this.j.ew)) {
			return true;
		}
	}

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
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveEmptyParent(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		let found: boolean = false;
		const { setCursorBefore, setCursorIn } = this.j.s;

		let prn: Nullable<Node> = Dom.closest(
			fakeNode,
			Dom.isElement,
			this.root
		);

		if (!prn || !Dom.isEmpty(prn)) {
			return;
		}

		const neighbor = findNotEmptyNeighbor(fakeNode, backspace, this.root);

		do {
			if (prn && Dom.isEmpty(prn) && !Dom.isCell(prn, this.j.ew)) {
				Dom.after(prn, fakeNode);

				const tmp: Nullable<Node> = Dom.closest(
					prn,
					n => Dom.isElement(n) && n !== prn,
					this.root
				);

				Dom.safeRemove(prn);

				found = true;

				prn = tmp;
			} else {
				break;
			}
		} while (prn);

		if (found && this.checkJoinTwoLists(fakeNode, backspace)) {
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

		return found || undefined;
	}

	/**
	 * Try join two UL elements
	 *
	 * @param fakeNode
	 * @param backspace
	 * @example
	 * ```html
	 * <ul><li>one</li></ul>|<ol><li>two</li></ol>
	 * ```
	 * Result
	 * ```html
	 * <ul><li>one|</li><li>two</li></ul>
	 * ```
	 */
	private checkJoinTwoLists(fakeNode: Node, backspace: boolean): true | void {
		const next = Dom.findSibling(fakeNode, backspace),
			prev = Dom.findSibling(fakeNode, !backspace);

		if (
			!Dom.closest(fakeNode, Dom.isElement, this.root) &&
			Dom.isTag(next, ['ul', 'ol']) &&
			Dom.isTag(prev, ['ul', 'ol']) &&
			Dom.isTag(next.lastElementChild, 'li') &&
			Dom.isTag(prev.firstElementChild, 'li')
		) {
			const { setCursorBefore, setCursorAfter } = this.j.s;

			const target = next.lastElementChild,
				second = prev.firstElementChild;

			call(!backspace ? Dom.append : Dom.prepend, second, fakeNode);

			Dom.moveContent(prev, next, !backspace);
			Dom.safeRemove(prev);

			call(backspace ? Dom.append : Dom.prepend, target, fakeNode);
			call(backspace ? setCursorBefore : setCursorAfter, fakeNode);

			return true;
		}
	}

	/**
	 * Check if it is possible to remove an empty adjacent element.
	 *
	 * @example
	 * ```html
	 * <p><br></p><p>|second stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>|second stop</p>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveEmptyNeighbor(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		const parent = Dom.closest(fakeNode, Dom.isElement, this.root);

		if (!parent) {
			return;
		}

		const neighbor = findNotEmptySibling(parent, backspace);

		if (neighbor && Dom.isEmpty(neighbor)) {
			Dom.safeRemove(neighbor);
			this.j.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	/**
	 * Check if two separate elements can be connected
	 *
	 * @param fakeNode
	 * @param backspace
	 */
	private checkJoinNeighbors(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		const { jodit } = this;

		let nextBox: Nullable<Node> = fakeNode,
			mainClosestBox: Nullable<Node> = nextBox;

		// Find main big closest element
		while (
			nextBox &&
			!findNotEmptySibling(nextBox, backspace) &&
			nextBox.parentElement !== this.root
		) {
			nextBox = nextBox.parentElement;
			mainClosestBox = nextBox;
		}

		if (Dom.isElement(mainClosestBox)) {
			const sibling = findNotEmptySibling(
				mainClosestBox,
				backspace
			) as Nullable<Element>;

			if (
				sibling &&
				(this.checkMoveListContent(
					mainClosestBox,
					sibling,
					backspace
				) ||
					this.moveContentAndRemoveEmpty(
						mainClosestBox,
						sibling,
						backspace
					))
			) {
				jodit.s.setCursorBefore(fakeNode);
				return true;
			}
		}
	}

	private checkMoveListContent(
		mainClosestBox: Element,
		sibling: Element,
		backspace: boolean
	): boolean {
		const { jodit } = this;

		// Process UL/LI/OL cases
		const siblingIsList = Dom.isTag(sibling, ['ol', 'ul']);
		const boxIsList = Dom.isTag(mainClosestBox, ['ol', 'ul']);
		const elementChild = (elm: Element, side: boolean) =>
			side ? elm.firstElementChild : elm.lastElementChild;

		if (boxIsList) {
			sibling = jodit.createInside.element(jodit.o.enterBlock);
			Dom.before(mainClosestBox, sibling);

			return this.moveContentAndRemoveEmpty(
				elementChild(mainClosestBox, backspace),
				sibling,
				backspace
			);
		}

		if (sibling && siblingIsList && !boxIsList) {
			return this.moveContentAndRemoveEmpty(
				mainClosestBox,
				elementChild(sibling, !backspace),
				backspace
			);
		}

		return false;
	}
	private moveContentAndRemoveEmpty(
		mainClosestBox: Nullable<Node>,
		sibling: Nullable<Node>,
		backspace: boolean
	): boolean {
		// Move content and remove empty nodes
		if (mainClosestBox && Dom.isElement(sibling)) {
			Dom.moveContent(mainClosestBox, sibling, !backspace);

			let remove: Nullable<Node> = mainClosestBox;

			while (remove && remove !== this.root && Dom.isEmpty(remove)) {
				const parent: Nullable<Node> = remove.parentElement;
				Dom.safeRemove(remove);
				remove = parent;
			}

			return true;
		}

		return false;
	}

	checkJoinNeighbors2(fakeNode: Node, backspace: boolean): true | void {
		const parent = Dom.closest(fakeNode, Dom.isElement, this.root);

		if (!parent) {
			return;
		}

		let neighbor = getSiblingBox(parent, backspace, this.root);

		if (!neighbor) {
			return;
		}

		const startNeighbor = neighbor;

		this.j.s.setCursorBefore(fakeNode);

		if (!this.j.s.cursorInTheEdge(backspace, parent)) {
			return;
		}

		if (
			Dom.isTag(neighbor, ['ul', 'ol']) &&
			!Dom.isTag(parent, ['ul', 'ol'])
		) {
			neighbor = backspace
				? neighbor.lastElementChild
				: neighbor.firstElementChild;
		}

		if (
			parent &&
			neighbor &&
			startNeighbor &&
			Dom.isElement(neighbor) &&
			this.j.s.cursorInTheEdge(backspace, parent)
		) {
			Dom.moveContent(parent, neighbor, !backspace);

			// <p><b>ab</b></p><p><b></b></p>

			let next;

			// FIXME
			do {
				next = findMostNestedNeighbor(
					startNeighbor,
					backspace,
					this.root
				);

				if (next === parent) {
					let nextParentNode: Nullable<Node> = next;

					do {
						const nextParent: Nullable<Node> =
							nextParentNode.parentElement;
						Dom.safeRemove(nextParentNode);
						nextParentNode = nextParent;
					} while (nextParentNode && Dom.isEmpty(nextParentNode));
				}

				Dom.safeRemove(next);
			} while (next !== parent);

			this.j.s.setCursorBefore(fakeNode);
			return true;
		}

		// Try move cursor in the UL if it was in the edge of LI
		if (
			Dom.isTag(parent, 'li') &&
			this.j.s.cursorInTheEdge(backspace, parent)
		) {
			call(backspace ? Dom.before : Dom.after, parent, fakeNode);
			const result = this.checkJoinNeighbors(fakeNode, backspace);
			call(!backspace ? Dom.append : Dom.prepend, parent, fakeNode);
			this.j.s.setCursorBefore(fakeNode);

			return result;
		}
	}

	/**
	 * For first item in list on backspace try move his content in new P
	 *
	 * @param fakeNode
	 * @param backspace
	 * @example
	 * ```html
	 * <ul><li>|first</li><li>second</li></ul>
	 * ```
	 * Result
	 *  ```html
	 * <p>|first</p><ul><li>second</li></ul>
	 * ```
	 */
	private checkRewrapListItem(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		if (backspace) {
			const li = Dom.closest(fakeNode, Dom.isElement, this.root);

			if (
				Dom.isTag(li, 'li') &&
				li?.parentElement?.firstElementChild === li &&
				this.j.s.cursorInTheEdge(true, li)
			) {
				const ul = li.parentElement;
				const p = this.j.createInside.element(this.j.o.enterBlock);

				Dom.before(ul, p);
				Dom.moveContent(li, p);
				Dom.safeRemove(li);

				if (Dom.isEmpty(ul)) {
					Dom.safeRemove(ul);
				}

				this.j.s.setCursorBefore(fakeNode);

				return true;
			}
		}
	}

	/**
	 * Remove node and replace cursor position out of it
	 * @param fakeNode
	 */
	private safeRemoveEmptyNode(fakeNode: Node) {
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
