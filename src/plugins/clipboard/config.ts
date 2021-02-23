/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../../types';
import { Config } from '../../config';
import {
	INSERT_AS_HTML,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	INSERT_AS_TEXT,
	TEXT_PLAIN
} from '../../core/constants';
import { Alert } from '../../modules/dialog';
import { pasteInsertHtml } from './paste/helpers';
import { pluginKey as clipboardPluginKey } from './clipboard';

export type PasteEvent = ClipboardEvent | DragEvent;
export type InsertMode =
	| typeof INSERT_AS_HTML
	| typeof INSERT_CLEAR_HTML
	| typeof INSERT_ONLY_TEXT
	| typeof INSERT_AS_TEXT;

declare module '../../config' {
	interface Config {
		/**
		 * Ask before paste HTML in WYSIWYG mode
		 */
		askBeforePasteHTML: boolean;
		processPasteHTML: boolean;

		askBeforePasteFromWord: boolean;
		processPasteFromWord: boolean;

		/**
		 * Inserts HTML line breaks before all newlines in a string
		 */
		nl2brInPlainText: boolean;

		/**
		 * Default insert method
		 */
		defaultActionOnPaste: InsertMode;

		/**
		 * Default insert method from word, if not define, it will use defaultActionOnPaste instead
		 */
		defaultActionOnPasteFromWord: InsertMode | null;

		/**
		 * Draggable elements
		 */
		draggableTags: string | string[];
	}
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.processPasteHTML = true;

Config.prototype.askBeforePasteFromWord = true;
Config.prototype.processPasteFromWord = true;

Config.prototype.nl2brInPlainText = true;
Config.prototype.defaultActionOnPaste = INSERT_AS_HTML;
Config.prototype.defaultActionOnPasteFromWord = null;

Config.prototype.draggableTags = ['img', 'a', 'jodit-media', 'jodit'];

Config.prototype.controls.cut = {
	command: 'cut',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Cut selection'
} as IControlType;

Config.prototype.controls.copy = {
	command: 'copy',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Copy selection'
} as IControlType;

const psKey = 'pasteStorage';

Config.prototype.controls.paste = {
	tooltip: 'Paste from clipboard',

	async exec(editor: IJodit, _, { control }) {
		if (control.name === psKey) {
			editor.execCommand('showPasteStorage');
			return;
		}

		editor.s.focus();

		let text = '',
			error = true;

		if (navigator.clipboard) {
			try {
				const items = await (navigator.clipboard as any).read();

				if (items && items.length) {
					const textBlob = await items[0].getType(TEXT_PLAIN);
					text = await new Response(textBlob).text();
				}

				error = false;
			} catch (e) {
				if (!isProd) {
					console.log(e);
				}
			}

			if (error) {
				try {
					text = await navigator.clipboard.readText();
					error = false;
				} catch (e) {
					if (!isProd) {
						console.log(e);
					}
				}
			}
		}

		if (error) {
			text = editor.buffer.get<string>(clipboardPluginKey) || '';
			error = text.length === 0;
		}

		const value = editor.value;

		if (error) {
			editor.ed.execCommand('paste');
			error = value === editor.value;
			!error && editor.e.fire('afterPaste');
		} else if (text.length) {
			pasteInsertHtml(null, editor, text);
			editor.e.fire('afterPaste');
		} else {
			if (error) {
				Alert(
					editor.i18n(
						"Your browser doesn't support direct access to the clipboard."
					),
					() => {
						editor.s.focus();
					}
				).bindDestruct(editor);
			}
		}
	},

	list: {
		[psKey]: 'Paste Storage'
	},

	isChildDisabled(j): boolean {
		return j.e.fire('pasteStorageList') < 2;
	}
} as IControlType;

Config.prototype.controls.selectall = {
	icon: 'select-all',
	command: 'selectall',
	tooltip: 'Select all'
} as IControlType;
