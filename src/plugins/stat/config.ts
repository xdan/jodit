/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/stat
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		showCharsCounter: boolean;
		countHTMLChars: boolean;
		showWordsCounter: boolean;
	}
}

Config.prototype.showCharsCounter = true;
Config.prototype.countHTMLChars = false;
Config.prototype.showWordsCounter = true;
