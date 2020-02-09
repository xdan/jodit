/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../constants';
import { Dom } from '../modules/Dom';
import { $$, scrollIntoView } from '../modules/helpers/';
import { HTMLTagNames, IJodit } from '../types';
import { Plugin } from '../modules/Plugin';
import { INVISIBLE_SPACE } from '../constants';

/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @param {CSSStyleSheet} [style]
 * @return {HTMLElement}
 */
export const insertParagraph = (
	editor: IJodit,
	fake: Text | false,
	wrapperTag: HTMLTagNames,
	style?: CSSStyleDeclaration
): HTMLElement => {
	const p = editor.create.inside.element(wrapperTag),
		helper_node = editor.create.inside.element('br');

	p.appendChild(helper_node);

	if (style && style.cssText) {
		p.setAttribute('style', style.cssText);
	}

	editor.selection.insertNode(p, false, false);
	editor.selection.setCursorBefore(helper_node);

	const range = editor.selection.createRange();

	range.setStartBefore(wrapperTag.toLowerCase() !== 'br' ? helper_node : p);
	range.collapse(true);

	editor.selection.selectRange(range);

	Dom.safeRemove(fake);

	scrollIntoView(p, editor.editor, editor.editorDocument);

	editor.events?.fire('synchro'); // fire change

	return p;
};

/**
 * One of most important core plugins. It is responsible for all the browsers to have the same effect when the Enter
 * button is pressed. By default, it should insert the <p>
 */
export class enter extends Plugin {
	private brMode = false;
	private defaultTag: 'p' | 'br' | 'div' = consts.PARAGRAPH;

	afterInit(editor: IJodit): void {
		// use 'enter' option if no set
		this.defaultTag = editor.options.enter.toLowerCase() as
			| 'p'
			| 'div'
			| 'br';
		this.brMode = this.defaultTag === consts.BR.toLowerCase();

		if (!editor.options.enterBlock) {
			editor.options.enterBlock = this.brMode
				? consts.PARAGRAPH
				: (this.defaultTag as 'p' | 'div');
		}

		editor.events
			.off('.enter')
			.on('change.enter', this.checkWrapper)
			.on('keydown.enter', (event: KeyboardEvent): false | void => {
				if (event.which === consts.KEY_ENTER) {
					/**
					 * Fired on processing `Enter` key. If return some value, plugin `enter` will do nothing.
					 * if return false - prevent default Enter behavior
					 *
					 * @event beforeEnter
					 */
					const beforeEnter = editor.events.fire(
						'beforeEnter',
						event
					);

					if (beforeEnter !== undefined) {
						return beforeEnter;
					}

					if (!editor.selection.isCollapsed()) {
						editor.execCommand('Delete');
					}

					editor.selection.focus();

					this.onEnter(event);

					return false;
				}
			});
	}

	private checkWrapper = (): false | void => {
		if (!this.jodit.isEditorMode() || true) {
			return;
		}

		let current = this.jodit.selection.current(false) as Node;

		let currentBox = this.getBlockWrapper(current);

		if (!currentBox) {
			this.wrapText(current);
		}
	};

	private onEnter(event: KeyboardEvent): false | void {
		const editor = this.jodit,
			sel = editor.selection,
			defaultTag = this.defaultTag;

		let current = sel.current(false) as Node;

		if (!current || current === editor.editor) {
			current = editor.create.inside.text(INVISIBLE_SPACE);
			sel.insertNode(current);
			sel.select(current);
		}

		let currentBox = this.getBlockWrapper(current);

		const isLi = Dom.isTag(currentBox, 'li');

		// if use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
		if (!isLi && this.checkBR(current, event.shiftKey) === false) {
			return false;
		}

		// wrap no wrapped element
		if (!currentBox && !this.hasPreviousBlock(current)) {
			currentBox = this.wrapText(current);
		}

		if (!currentBox || currentBox === current) {
			insertParagraph(editor, false, isLi ? 'li' : defaultTag);
			return false;
		}

		if (this.checkUnsplittableBox(currentBox) === false) {
			return false;
		}

		if (isLi && Dom.isEmpty(currentBox)) {
			this.enterInsideEmptyLIelement(currentBox);
			return false;
		}

		const canSplit =
			currentBox.tagName.toLowerCase() === this.defaultTag || isLi;

		const cursorOnTheRight = sel.cursorOnTheRight(currentBox);
		const cursorOnTheLeft = sel.cursorOnTheLeft(currentBox);

		if (
			(!canSplit || Dom.isEmpty(currentBox)) &&
			(cursorOnTheRight || cursorOnTheLeft)
		) {
			let fake: Text | false = false;

			if (cursorOnTheRight) {
				fake = sel.setCursorAfter(currentBox);
			} else {
				fake = sel.setCursorBefore(currentBox);
			}

			insertParagraph(editor, fake, this.defaultTag);

			if (cursorOnTheLeft && !cursorOnTheRight) {
				sel.setCursorIn(currentBox, true);
			}

			return;
		}

		sel.splitSelection(currentBox);
	}

	private getBlockWrapper(
		current: Node | null,
		tagReg = consts.IS_BLOCK
	): HTMLElement | false {
		let node = current;
		const root = this.jodit.editor;

		do {
			if (!node || node === root) {
				break;
			}

			if (tagReg.test(node.nodeName)) {
				if (Dom.isTag(node, 'li')) {
					return node;
				}

				return (
					this.getBlockWrapper(node.parentNode, /^li$/i) ||
					(node as HTMLElement)
				);
			}

			node = node.parentNode;
		} while (node && node !== root);

		return false;
	}

	private checkBR(current: Node, shiftKeyPressed: boolean): void | false {
		// if use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
		if (
			this.brMode ||
			shiftKeyPressed ||
			Dom.closest(current, 'PRE|BLOCKQUOTE', this.jodit.editor)
		) {
			const br = this.jodit.create.inside.element('br');

			this.jodit.selection.insertNode(br, true);
			scrollIntoView(br, this.jodit.editor, this.jodit.editorDocument);

			return false;
		}
	}

	private wrapText(current: Node) {
		let needWrap: Node = current;

		Dom.up(
			needWrap,
			node => {
				if (
					node &&
					node.hasChildNodes() &&
					node !== this.jodit.editor
				) {
					needWrap = node;
				}
			},
			this.jodit.editor
		);

		const currentBox = Dom.wrapInline(
			needWrap,
			this.jodit.options.enter,
			this.jodit
		);

		if (Dom.isEmpty(currentBox)) {
			const helper_node = this.jodit.create.inside.element('br');

			currentBox.appendChild(helper_node);
			this.jodit.selection.setCursorBefore(helper_node);
		}

		return currentBox;
	}

	private hasPreviousBlock(current: Node): boolean {
		const editor = this.jodit;

		return Boolean(
			Dom.prev(
				current,
				(elm: Node | null) =>
					Dom.isBlock(elm, editor.editorWindow) ||
					Dom.isImage(elm, editor.editorWindow),
				editor.editor
			)
		);
	}

	private checkUnsplittableBox(currentBox: HTMLElement): false | void {
		const editor = this.jodit,
			sel = editor.selection;

		if (!Dom.canSplitBlock(currentBox, editor.editorWindow)) {
			const br = editor.create.inside.element('br');

			sel.insertNode(br, false);
			sel.setCursorAfter(br);

			return false;
		}
	}

	private enterInsideEmptyLIelement(currentBox: HTMLElement) {
		let fakeTextNode: Text | false = false;

		const ul: HTMLUListElement = Dom.closest(
			currentBox,
			'ol|ul',
			this.jodit.editor
		) as HTMLUListElement;

		// If there is no LI element before
		if (
			!Dom.prev(
				currentBox,
				(elm: Node | null) => Dom.isTag(elm, 'li'),
				ul
			)
		) {
			fakeTextNode = this.jodit.selection.setCursorBefore(ul);
			// If there is no LI element after
		} else if (
			!Dom.next(
				currentBox,
				(elm: Node | null) => Dom.isTag(elm, 'li'),
				ul
			)
		) {
			fakeTextNode = this.jodit.selection.setCursorAfter(ul);
		} else {
			const leftRange = this.jodit.selection.createRange();
			leftRange.setStartBefore(ul);
			leftRange.setEndAfter(currentBox);
			const fragment = leftRange.extractContents();

			if (ul.parentNode) {
				ul.parentNode.insertBefore(fragment, ul);
			}

			fakeTextNode = this.jodit.selection.setCursorBefore(ul);
		}

		Dom.safeRemove(currentBox);

		insertParagraph(this.jodit, fakeTextNode, this.defaultTag);

		if (!$$('li', ul).length) {
			Dom.safeRemove(ul);
		}
	}

	beforeDestruct(editor: IJodit): void {
		editor.events.off('keydown.enter');
	}
}
