/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/hotkeys
 */

import type { IDictionary } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * You can redefine hotkeys for some command
		 *
		 * @example
		 * ```js
		 * const jodit = Jodit.make('#editor', {
		 *  commandToHotkeys: {
		 *      bold: 'ctrl+shift+b',
		 *      italic: ['ctrl+i', 'ctrl+b'],
		 *  }
		 * })
		 * ```
		 */
		commandToHotkeys: IDictionary<string | string[]>;
	}
}

Config.prototype.commandToHotkeys = {
	removeFormat: ['ctrl+shift+m', 'cmd+shift+m'],
	insertOrderedList: ['ctrl+shift+7', 'cmd+shift+7'],
	insertUnorderedList: ['ctrl+shift+8, cmd+shift+8'],
	selectall: ['ctrl+a', 'cmd+a']
};
