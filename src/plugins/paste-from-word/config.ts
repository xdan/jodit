/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/paste-from-word
 */

import type { InsertMode, IUIOption } from 'jodit/types';
import { Config } from 'jodit/config';
import {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_ONLY_TEXT
} from 'jodit/core/constants';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Show the paste dialog if the html is similar to what MSWord gives when copying.
		 */
		askBeforePasteFromWord: boolean;

		/**
		 * Handle pasting of HTML - similar to a fragment copied from MSWord
		 */
		processPasteFromWord: boolean;

		/**
		 * Default insert method from word, if not define, it will use defaultActionOnPaste instead
		 * @example
		 * ```js
		 * Jodit.make('#editor', {
		 *   defaultActionOnPasteFromWord: 'insert_clear_html'
		 * })
		 * ```
		 */
		defaultActionOnPasteFromWord: InsertMode | null;

		/**
		 * Options when inserting data from Word
		 */
		pasteFromWordActionList: IUIOption[];
	}
}

Config.prototype.askBeforePasteFromWord = true;
Config.prototype.processPasteFromWord = true;
Config.prototype.defaultActionOnPasteFromWord = null;

Config.prototype.pasteFromWordActionList = [
	{ value: INSERT_AS_HTML, text: 'Keep' },
	{ value: INSERT_AS_TEXT, text: 'Clean' },
	{ value: INSERT_ONLY_TEXT, text: 'Insert only Text' }
];
