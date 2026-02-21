/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/sticky
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Keep the toolbar visible at the top of the viewport when scrolling past the editor
		 *
		 * ```javascript
		 * var editor = Jodit.make('#someid', {
		 *  toolbarSticky: false
		 * })
		 * ```
		 */
		toolbarSticky: boolean;

		/**
		 * Disable sticky toolbar on mobile devices to save screen space
		 */
		toolbarDisableStickyForMobile: boolean;

		/**
		 * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to
		 * move the toolbar Jodit by this amount [more](https://xdsoft.net/jodit/docs/#2.5.57)
		 *
		 * ```javascript
		 * var editor = Jodit.make('#someid', {
		 *  toolbarStickyOffset: 100
		 * })
		 * ```
		 */
		toolbarStickyOffset: number;
	}
}

Config.prototype.toolbarSticky = true;
Config.prototype.toolbarDisableStickyForMobile = true;
Config.prototype.toolbarStickyOffset = 0;
