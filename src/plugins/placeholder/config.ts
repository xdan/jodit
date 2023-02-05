/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/placeholder
 */

import { Config } from 'jodit/config';

/**
 * Show placeholder
 */
declare module 'jodit/config' {
	interface Config {
		/**
		 * Show placeholder
		 * @example
		 * ```javascript
		 * var editor = new Jodit('#editor', {
		 *    showPlaceholder: false
		 * });
		 * ```
		 */
		showPlaceholder: boolean;

		/**
		 * Use a placeholder from original input field, if it was set
		 * @example
		 * ```javascript
		 * //<textarea id="editor" placeholder="start typing text ..." cols="30" rows="10"></textarea>
		 * var editor = new Jodit('#editor', {
		 *    useInputsPlaceholder: true
		 * });
		 * ```
		 */
		useInputsPlaceholder: boolean;

		/**
		 * Default placeholder
		 * @example
		 * ```javascript
		 * var editor = new Jodit('#editor', {
		 *    placeholder: 'start typing text ...'
		 * });
		 * ```
		 */
		placeholder: string;
	}
}

Config.prototype.showPlaceholder = true;
Config.prototype.placeholder = 'Type something';
Config.prototype.useInputsPlaceholder = true;
