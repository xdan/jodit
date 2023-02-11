/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/enter/README.md]]
 * @packageDocumentation
 * @module plugins/enter
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { Plugin } from 'jodit/core/plugin/plugin';
import { BR, PARAGRAPH, KEY_ENTER } from 'jodit/core/constants';
import { watch } from 'jodit/core/decorators';
import { isBoolean } from 'jodit/core/helpers/checker/is-boolean';

import {
	checkBR,
	checkUnsplittableBox,
	processEmptyLILeaf,
	getBlockWrapper,
	hasPreviousBlock,
	insertParagraph,
	splitFragment,
	wrapText,
	moveCursorOutFromSpecialTags
} from './helpers';
import { pluginSystem } from 'jodit/core/global';
import './interface';

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

			const beforeEnter = editor.e.fire('beforeEnter', event);

			if (beforeEnter !== undefined) {
				return beforeEnter;
			}

			if (!editor.s.isCollapsed()) {
				editor.execCommand('Delete');
			}

			editor.s.focus();

			this.onEnter(event);
			editor.e.fire('afterEnter', event);
			editor.synchronizeValues(); // fire change

			return false;
		}
	}

	private onEnter(event?: KeyboardEvent): false | void {
		const { jodit } = this;

		const fake = jodit.createInside.fake();

		try {
			Dom.safeInsertNode(jodit.s.range, fake);

			moveCursorOutFromSpecialTags(jodit, fake, ['a']);

			let block = getBlockWrapper(fake, jodit);

			const isLi = Dom.isTag(block, 'li');

			// if use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
			if (
				(!isLi || event?.shiftKey) &&
				checkBR(fake, jodit, event?.shiftKey)
			) {
				return false;
			}

			// wrap no wrapped element
			if (!block && !hasPreviousBlock(fake, jodit)) {
				block = wrapText(fake, jodit);
			}

			if (!block) {
				insertParagraph(fake, jodit, isLi ? 'li' : jodit.o.enter);
				return false;
			}

			if (!checkUnsplittableBox(fake, jodit, block)) {
				return false;
			}

			if (isLi && this.__isEmptyListLeaf(block)) {
				processEmptyLILeaf(fake, jodit, block);
				return false;
			}

			splitFragment(fake, jodit, block);
		} finally {
			fake.isConnected && jodit.s.setCursorBefore(fake);
			Dom.safeRemove(fake);
		}
	}

	private __isEmptyListLeaf(li: HTMLElement): boolean {
		const result = this.j.e.fire('enterIsEmptyListLeaf', li);
		return isBoolean(result) ? result : Dom.isEmpty(li);
	}

	/** @override */
	beforeDestruct(editor: IJodit): void {
		editor.e.off('keydown.enter');
	}
}

pluginSystem.add('enter', enter);
