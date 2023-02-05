/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/paste
 */

import type { IControlType, IJodit, IUIOption } from 'jodit/types';
import {
	CLIPBOARD_ID,
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_ONLY_TEXT,
	TEXT_PLAIN
} from 'jodit/core/constants';
import { Config } from 'jodit/config';

import { pasteInsertHtml } from './helpers';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Ask before paste HTML in WYSIWYG mode
		 */
		askBeforePasteHTML: boolean;

		/**
		 * When the user inserts a piece of HTML, the plugin will ask - How to insert it.
		 * If after that user insert the same fragment again, the previous option will be used without extra question.
		 */
		memorizeChoiceWhenPasteFragment: boolean;

		/**
		 * Handle pasted text - similar to HTML
		 */
		processPasteHTML: boolean;

		/**
		 * Inserts HTML line breaks before all newlines in a string
		 */
		nl2brInPlainText: boolean;

		/**
		 * Options when inserting HTML string
		 */
		pasteHTMLActionList: IUIOption[];
	}
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.processPasteHTML = true;

Config.prototype.pasteHTMLActionList = [
	{ value: INSERT_AS_HTML, text: 'Keep' },
	{ value: INSERT_AS_TEXT, text: 'Insert as Text' },
	{ value: INSERT_ONLY_TEXT, text: 'Insert only Text' }
];

Config.prototype.memorizeChoiceWhenPasteFragment = false;

Config.prototype.nl2brInPlainText = true;

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
			text = editor.buffer.get<string>(CLIPBOARD_ID) || '';
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
				editor.alert(
					"Your browser doesn't support direct access to the clipboard.",
					() => void editor.s.focus()
				);
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
