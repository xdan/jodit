/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Config } from '../../config';
import {
	INSERT_AS_HTML,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	INSERT_AS_TEXT
} from '../../core/constants';
import { IControlType, IJodit } from '../../types';
import { pluginKey as clipboardPluginKey } from './cut';
import { Alert } from '../../modules/dialog';
import { pasteInsertHtml } from './paste/helpers';

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

		if (error) {
			text = editor.buffer.get<string>(clipboardPluginKey) || '';
			error = text.length === 0;
		}

		if (error && navigator.clipboard) {
			try {
				const items = await (navigator.clipboard as any).read();

				if (items && items.length) {
					const textBlob = await items[0].getType('text/plain');
					text = await new Response(textBlob).text();
				}
			} catch {}

			if (error) {
				try {
					text = await navigator.clipboard.readText();
					error = false;
				} catch {}
			}
		}

		if (error) {
			const value = editor.value;
			editor.ed.execCommand('paste');
			error = value !== editor.value;
		}

		if (text) {
			pasteInsertHtml(editor, text);
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
