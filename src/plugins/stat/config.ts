/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/stat
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Display a character counter in the statusbar
		 */
		showCharsCounter: boolean;

		/**
		 * When true, count characters from the raw HTML source instead of visible text only
		 */
		countHTMLChars: boolean;

		/**
		 * When true, include whitespace characters in the character count
		 */
		countTextSpaces: boolean;

		/**
		 * Display a word counter in the statusbar
		 */
		showWordsCounter: boolean;
	}
}

Config.prototype.showCharsCounter = true;
Config.prototype.countHTMLChars = false;
Config.prototype.countTextSpaces = false;
Config.prototype.showWordsCounter = true;
