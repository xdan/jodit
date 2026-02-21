/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/limit
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Maximum number of words allowed in the editor. Set to `false` to disable the limit.
		 */
		limitWords: false | number;

		/**
		 * Maximum number of characters allowed in the editor. Set to `false` to disable the limit.
		 */
		limitChars: false | number;

		/**
		 * Maximum number of characters counted from the raw HTML source. Set to `false` to disable the limit.
		 */
		limitHTML: false;
	}
}

Config.prototype.limitWords = false;
Config.prototype.limitChars = false;
Config.prototype.limitHTML = false;
