/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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

			/**
			 * Outside table cells and the list items Tab already nests, Tab at a
			 * caret inserts this many non-breaking spaces, and Shift+Tab or
			 * Backspace takes them out again. In a list's first item Tab
			 * indents the list. Tab and Shift+Tab with a selection indent and
			 * outdent it, and a tab in pasted text becomes the same spaces.
			 * Neither key moves the focus on: Escape and then Tab does. 0
			 * leaves Tab to the browser, which moves the focus on
			 */
			spaces: number;
		};
	}
}

Config.prototype.tab = {
	tabInsideLiInsertNewList: true,
	spaces: 0
};
