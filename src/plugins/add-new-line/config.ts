/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/add-new-line
 */

import type { HTMLTagNames } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import enterIcon from './enter.svg';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Show a green "add paragraph" bar when the cursor hovers near the top or bottom
		 * edge of certain block elements (tables, images, iframes, etc.)
		 */
		addNewLine: boolean;

		/**
		 * Block-level tag names near which the "add new line" bar will appear
		 */
		addNewLineTagsTriggers: HTMLTagNames[];

		/**
		 * On dbl click on empty space of editor it add new P element
		 *
		 * ```js
		 * Jodit.make('#editor', {
		 *   addNewLineOnDBLClick: false // disable
		 * })
		 * ```
		 */
		addNewLineOnDBLClick: boolean;

		/**
		 * Absolute delta between cursor position and edge(top or bottom)
		 * of element when show line
		 */
		addNewLineDeltaShow: number;
	}
}

Config.prototype.addNewLine = true;
Config.prototype.addNewLineOnDBLClick = true;
Config.prototype.addNewLineTagsTriggers = [
	'table',
	'iframe',
	'img',
	'hr',
	'pre',
	'jodit'
];
Config.prototype.addNewLineDeltaShow = 20;

Icon.set('enter', enterIcon);
