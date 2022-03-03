/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clipboard/paste-from-word
 */

import type { InsertMode } from 'jodit/plugins/clipboard/paste/interface';
import { Config } from 'jodit/config';

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
	}
}

Config.prototype.askBeforePasteFromWord = true;
Config.prototype.processPasteFromWord = true;
Config.prototype.defaultActionOnPasteFromWord = null;
