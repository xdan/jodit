/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/keyboard/enter/README.md]]
 * @packageDocumentation
 * @module plugins/enter
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { Plugin } from 'jodit/core/plugin/plugin';
import {
	INVISIBLE_SPACE,
	BR,
	PARAGRAPH,
	KEY_ENTER
} from 'jodit/core/constants';
import { watch } from 'jodit/core/decorators';

import {
	checkBR,
	checkUnsplittableBox,
	processEmptyLILeaf,
	getBlockWrapper,
	hasPreviousBlock,
	insertParagraph,
	splitFragment,
	wrapText
} from './helpers';
import { pluginSystem } from 'jodit/core/global';

/**
 * One of most important core plugins. It is responsible for all the browsers to have the same effect when the Enter
 * button is pressed. By default, it should insert the <p>
 */
export class enter extends Plugin {
	/** @override */
	protected override afterInit(editor: IJodit): void {
		// use 'enter' option if no set
		const defaultTag = editor.o.enter.toLowerCase() as 'p' | 'div' | 'br';
		const brMode = defaultTag === BR.toLowerCase();

		if (!editor.o.enterBlock) {
			editor.o.enterBlock = brMode
				? PARAGRAPH
				: (defaultTag as 'p' | 'div');
		}

		editor.registerCommand(
			'enter',
			(command: string, value?: string, event: any = {}): false | void =>
				this.onEnter(event)
		);
	}

	@watch(':keydown.enter')
	protected onEnterKeyDown(event: KeyboardEvent): false | void {
		if (event.key === KEY_ENTER) {
			const editor = this.j;

			/**
			 * Fired on processing `Enter` key. If return some value, plugin `enter` will do nothing.
			 * if return false - prevent default Enter behavior
			 */
			const beforeEnter = editor.e.fire('beforeEnter', event);

			if (beforeEnter !== undefined) {
				return beforeEnter;
			}

			if (!editor.s.isCollapsed()) {
				editor.execCommand('Delete');
			}

			editor.s.focus();

			this.onEnter(event);
			editor.synchronizeValues(); // fire change

			return false;
		}
	}

	private onEnter(event?: KeyboardEvent): false | void {
		const editor = this.j;

		const current = this.getCurrentOrFillEmpty(editor);

		let currentBox = getBlockWrapper(editor, current);

		const isLi = Dom.isTag(currentBox, 'li');

		// if use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
		if (
			(!isLi || event?.shiftKey) &&
			!checkBR(editor, current, event?.shiftKey)
		) {
			return false;
		}

		// wrap no wrapped element
		if (!currentBox && !hasPreviousBlock(editor, current)) {
			currentBox = wrapText(editor, current);
		}

		if (!currentBox || currentBox === current) {
			insertParagraph(editor, null, isLi ? 'li' : editor.o.enter);
			return false;
		}

		if (!checkUnsplittableBox(editor, currentBox)) {
			return false;
		}

		if (isLi && Dom.isEmpty(currentBox)) {
			processEmptyLILeaf(editor, currentBox);
			return false;
		}

		splitFragment(editor, currentBox);
	}

	private getCurrentOrFillEmpty(editor: IJodit): Node {
		const { s } = editor;
		let current = s.current(false);

		if (!current || current === editor.editor) {
			current = editor.createInside.text(INVISIBLE_SPACE);
			s.insertNode(current, false, false);
			s.select(current);
		}

		return current;
	}

	/** @override */
	beforeDestruct(editor: IJodit): void {
		editor.e.off('keydown.enter');
	}
}

pluginSystem.add('enter', enter);
