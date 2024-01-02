/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		 * const editor = Jodit.make('#editor', {
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
		 * const editor = Jodit.make('#editor', {
		 *    useInputsPlaceholder: true
		 * });
		 * ```
		 */
		useInputsPlaceholder: boolean;

		/**
		 * Default placeholder
		 * @example
		 * ```javascript
		 * const editor = Jodit.make('#editor', {
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
