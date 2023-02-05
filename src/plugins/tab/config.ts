/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/tab
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		tab: {
			/**
			 * Pressing Tab inside LI will add an internal list
			 */
			tabInsideLiInsertNewList: boolean;
		};
	}
}

Config.prototype.tab = {
	tabInsideLiInsertNewList: true
};
