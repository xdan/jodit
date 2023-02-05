/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/resizer
 */

import type { HTMLTagNames } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Use true frame for editing iframe size
		 */
		allowResizeTags: HTMLTagNames[];

		resizer: {
			/**
			 * Show size
			 */
			showSize: boolean;
			hideSizeTimeout: number;

			/**
			 * Save width and height proportions when resizing
			 * ```js
			 * Jodit.make('#editor', {
			 *   allowResizeTags: ['img', 'iframe', 'table', 'jodit'],
			 *   resizer: {
			 *     useAspectRatio: false, // don't save,
			 *     useAspectRatio: ['img'], // save only for images (default value)
			 *     useAspectRatio: true // save for all
			 *   }
			 * });
			 * ```
			 */
			useAspectRatio: boolean | HTMLTagNames[];

			/**
			 * When resizing images, change not the styles but the width and height attributes
			 */
			forImageChangeAttributes: boolean;

			/**
			 * The minimum width for the editable element
			 */
			min_width: number;

			/**
			 * The minimum height for the item being edited
			 */
			min_height: number;
		};
	}
}

Config.prototype.allowResizeTags = ['img', 'iframe', 'table', 'jodit'];

Config.prototype.resizer = {
	showSize: true,
	hideSizeTimeout: 1000,
	forImageChangeAttributes: true,
	min_width: 10,
	min_height: 10,
	useAspectRatio: ['img']
};
