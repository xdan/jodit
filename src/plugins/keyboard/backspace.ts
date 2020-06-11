/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../../core/constants';
import { MAY_BE_REMOVED_WITH_KEY } from '../../core/constants';
import { Dom } from '../../modules';
import {
	call,
	isString,
	normalizeNode,
	trim,
	trimInv
} from '../../core/helpers';
import { IJodit, Nullable } from '../../types';
import { Plugin } from '../../core/plugin';

/**
 * Plug-in process entering Backspace key
 *
 * @module backspace
 */
export class backspace extends Plugin {
	private removeEmptyBlocks(container: HTMLElement): void {
		let box: Nullable<HTMLElement> = container,
			parent: Nullable<Node>;

		normalizeNode(container);

		do {
			const html = box.innerHTML.replace(
				consts.INVISIBLE_SPACE_REG_EXP(),
				''
			);

			if (
				(!html.length || html === '<br>') &&
				!Dom.isCell(box, this.j.ew) &&
				box.parentNode &&
				container !== this.j.editor
			) {
				parent = box.parentNode;
				this.j.s.removeNode(box);
			} else {
				break;
			}

			box = parent as Nullable<HTMLElement>;
		} while (box && box !== this.j.editor);
	}

	/**
	 * Remove invisible chars
	 *
	 * @param box
	 * @param toLeft
	 * @param range
	 */
	private removeChar(
		box: { node: Nullable<Node> },
		toLeft: boolean,
		range: Range
	): void | true {
		let nextElement: Nullable<Node> = null;

		do {
			if (Dom.isText(box.node) && isString(box.node.nodeValue)) {
				// remove invisible spaces
				let value = box.node.nodeValue,
					startOffset: number = toLeft ? value.length : 0;

				const increment: number = toLeft ? -1 : 1,
					startOffsetInRange: number = startOffset;

				while (
					startOffset >= 0 &&
					startOffset <= value.length &&
					value[startOffset + (toLeft ? -1 : 0)] ===
						consts.INVISIBLE_SPACE
				) {
					startOffset += increment;
				}

				if (startOffset !== startOffsetInRange) {
					if (toLeft) {
						value =
							value.substr(0, startOffset) +
							value.substr(startOffsetInRange);
					} else {
						value =
							value.substr(0, startOffsetInRange) +
							value.substr(startOffset);
						startOffset = startOffsetInRange;
					}

					box.node.nodeValue = value;
				}

				range.setStart(box.node, startOffset);
				range.collapse(true);
				this.j.s.selectRange(range);

				nextElement = Dom.findInline(box.node, toLeft, this.j.editor);

				if (trimInv(value).length > 1) {
					let setRange: boolean = false;

					if (toLeft) {
						if (startOffset) {
							setRange = true;
						}
					} else {
						if (startOffset < value.length) {
							setRange = true;
						}
					}

					if (setRange) {
						return true;
					}
				} else {
					let startNode: Nullable<Node> = box.node;

					// do {
					range.setStartBefore(startNode);
					range.collapse(true);
					this.j.s.selectRange(range);

					const parentNode: Nullable<Node> = startNode.parentNode;
					this.j.s.removeNode(startNode);
					startNode = parentNode;
					// } while (
					// 	startNode &&
					// 	startNode !== this.jodit.editor &&
					// 	Dom.isInlineBlock(startNode) &&
					// 	Dom.isEmpty(startNode)
					// );

					box.node = nextElement;
				}

				if (nextElement) {
					if (Dom.isInlineBlock(nextElement)) {
						nextElement = toLeft
							? nextElement.lastChild
							: nextElement.firstChild;
					}

					if (Dom.isText(nextElement)) {
						box.node = nextElement;
					}
				}
			}
		} while (Dom.isText(nextElement));
	}

	private removePotential(node: Nullable<Node>): false | void {
		if (node && this.potentialRemovable.test(node.nodeName)) {
			this.j.s.removeNode(node);
			return false;
		}
	}

	private potentialRemovable: RegExp = MAY_BE_REMOVED_WITH_KEY;

	private removeInline(
		box: { node: Nullable<Node> },
		toLeft: boolean,
		range: Range
	): boolean | void {
		if (box.node) {
			const workElement = box.node;

			const removeCharFlag = this.removeChar(box, toLeft, range);

			if (removeCharFlag) {
				return true;
			}

			if (!box.node) {
				box.node = workElement.parentNode;
			}

			if (box.node === this.j.editor) {
				return false;
			}

			let node = box.node;

			if (this.removePotential(node) === false) {
				return false;
			}

			if (node) {
				node = toLeft ? node.previousSibling : node.nextSibling;
			}

			while (
				Dom.isText(node) &&
				node.nodeValue &&
				node.nodeValue.match(/^[\n\r]+$/)
			) {
				node = toLeft ? node.previousSibling : node.nextSibling;
			}

			return this.removePotential(node);
		}
	}

	private isEmpty = (node: Node): boolean => {
		if (node.nodeName.match(/^(TD|TH|TR|TABLE|LI)$/) !== null) {
			return false;
		}

		if (
			Dom.isEmpty(node) ||
			node.nodeName.match(this.potentialRemovable) !== null
		) {
			return true;
		}

		if (Dom.isText(node) && !Dom.isEmptyTextNode(node)) {
			return false;
		}

		return Array.from(node.childNodes).every(this.isEmpty);
	};

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
	 * Handler keypress Delete or Backspace buttons
	 * @param backspace
	 */
	private onDelete(backspace: boolean): false | void {
		const jodit = this.j;

		if (!jodit.s.isFocused()) {
			jodit.s.focus();
		}

		if (!jodit.s.isCollapsed()) {
			jodit.execCommand('Delete');
			return false;
		}

		const sel = jodit.s.sel,
			range = sel && sel.rangeCount ? sel.getRangeAt(0) : false;

		if (!range) {
			return false;
		}

		const fakeNode = jodit.createInside.text(consts.INVISIBLE_SPACE);

		const marker = jodit.createInside.span();

		try {
			range.insertNode(fakeNode);

			if (!Dom.isOrContains(jodit.editor, fakeNode)) {
				return false;
			}

			let container = Dom.up(
				fakeNode,
				node => Dom.isBlock(node, jodit.editorWindow),
				jodit.editor
			);

			const workElement = Dom.findInline(
				fakeNode,
				backspace,
				jodit.editor
			);

			// if (!container && Dom.isElement(workElement)) {
			// 	if (Dom.isEmpty(workElement)) {
			// 		Dom.safeRemove(workElement);
			// 	} else {
			// 		this.j.s.setCursorIn(workElement, !backspace);
			// 	}
			//
			// 	return false;
			// }

			const box = {
				node: workElement
			};

			let tryRemoveInline: boolean | void;

			if (workElement) {
				tryRemoveInline = this.removeInline(box, backspace, range);
			} else if (fakeNode.parentNode) {
				tryRemoveInline = this.removeInline(
					{
						node: backspace
							? fakeNode.parentNode.previousSibling
							: fakeNode.parentNode.nextSibling
					},
					backspace,
					range
				);
			}

			if (tryRemoveInline !== undefined) {
				return tryRemoveInline ? undefined : false;
			}

			if (container && Dom.isCell(container, this.j.ew)) {
				return false;
			}

			let prevBox = call(
				backspace ? Dom.prev : Dom.next,
				box.node || fakeNode,
				node =>
					Dom.isBlock(node, jodit.editorWindow) &&
					!/^(ul|ol)$/i.test(node.nodeName),
				jodit.editor
			);

			if (!prevBox && container && container.parentNode) {
				prevBox = jodit.createInside.element(jodit.o.enter);

				let boxNode: Node = container;

				while (
					boxNode &&
					boxNode.parentNode &&
					boxNode.parentNode !== jodit.editor
				) {
					boxNode = boxNode.parentNode;
				}

				boxNode.parentNode &&
					boxNode.parentNode.insertBefore(prevBox, boxNode);
			} else {
				if (prevBox && this.isEmpty(prevBox)) {
					jodit.s.removeNode(prevBox);
					return false;
				}
			}

			if (prevBox) {
				const tmpNode = jodit.s.setCursorIn(prevBox, !backspace);

				jodit.s.insertNode(marker, false, false);

				if (
					Dom.isText(tmpNode) &&
					tmpNode.nodeValue === consts.INVISIBLE_SPACE
				) {
					Dom.safeRemove(tmpNode);
				}
			}

			if (container) {
				const parentContainer = container.parentNode;

				this.removeEmptyBlocks(container);

				if (prevBox && parentContainer) {
					if (
						container.nodeName === prevBox.nodeName &&
						parentContainer &&
						prevBox.parentNode &&
						parentContainer !== jodit.editor &&
						prevBox.parentNode !== jodit.editor &&
						parentContainer !== prevBox.parentNode &&
						parentContainer.nodeName === prevBox.parentNode.nodeName
					) {
						container = parentContainer as HTMLElement;
						prevBox = prevBox.parentNode as HTMLElement;
					}

					Dom.moveContent(container, prevBox, !backspace);
					normalizeNode(prevBox);
				}

				if (Dom.isTag(prevBox, 'li')) {
					const UL = Dom.closest(prevBox, ['ul', 'ol'], jodit.editor);

					if (UL) {
						const nextBox = UL.nextSibling;

						if (
							nextBox &&
							nextBox.nodeName === UL.nodeName &&
							UL !== nextBox
						) {
							Dom.moveContent(nextBox, UL, !backspace);
							jodit.s.removeNode(nextBox);
						}
					}
				}

				this.removeEmptyBlocks(container);

				return false;
			}
		} finally {
			const parent = fakeNode.parentNode;

			if (parent && fakeNode.nodeValue === consts.INVISIBLE_SPACE) {
				Dom.safeRemove(fakeNode);

				if (
					!parent.firstChild &&
					parent.parentNode &&
					parent !== jodit.editor
				) {
					jodit.s.removeNode(parent);
				}
			}

			if (marker && Dom.isOrContains(jodit.editor, marker, true)) {
				const tmpNode = jodit.s.setCursorBefore(marker);

				Dom.safeRemove(marker);

				if (
					tmpNode &&
					tmpNode.parentNode &&
					(Dom.findInline(tmpNode, true, tmpNode.parentNode) ||
						Dom.findInline(tmpNode, false, tmpNode.parentNode))
				) {
					Dom.safeRemove(tmpNode);
				}
			}

			jodit.setEditorValue();
		}

		return false;
	}

	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.e
			.on('afterCommand', (command: string) => {
				if (command === 'delete') {
					this.afterDeleteCommand();
				}
			})
			.on('keydown', (event: KeyboardEvent): false | void => {
				if (
					event.key === consts.KEY_BACKSPACE ||
					event.key === consts.KEY_DELETE
				) {
					return this.onDelete(event.key === consts.KEY_BACKSPACE);
				}
			});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('afterCommand').off('keydown');
	}
}
