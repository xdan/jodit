/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		 * Create helper
		 */
		addNewLine: boolean;

		/**
		 * What kind of tags it will be impact
		 */
		addNewLineTagsTriggers: HTMLTagNames[];

		/**
		 * On dbl click on empty space of editor it add new P element
		 * @example
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
