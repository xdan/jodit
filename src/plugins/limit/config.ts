/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * limit words count
		 */
		limitWords: false | number;

		/**
		 * limit chars count
		 */
		limitChars: false | number;

		/**
		 * limit html chars count
		 */
		limitHTML: false;
	}
}

Config.prototype.limitWords = false;
Config.prototype.limitChars = false;
Config.prototype.limitHTML = false;
