/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		image: {
			dialogWidth: number;

			/**
			 * Open editing dialog after double click on image
			 */
			openOnDblClick: boolean;

			/**
			 * Show edit 'src' input
			 */
			editSrc: boolean;

			/**
			 * Show crop/resize btn
			 */
			useImageEditor: boolean;

			/**
			 * Show edit 'title' input
			 */
			editTitle: boolean;

			/**
			 * Show edit 'alt' input
			 */
			editAlt: boolean;

			/**
			 * Show edit image link's options
			 */
			editLink: boolean;

			/**
			 * Show edit image size's inputs
			 */
			editSize: boolean;

			/**
			 * Show edit margin inputs
			 */
			editMargins: boolean;
			editBorderRadius: boolean;

			/**
			 * Show edit classNames input
			 */
			editClass: boolean;

			/**
			 * Show style edit input
			 */
			editStyle: boolean;

			/**
			 * Show edit ID input
			 */
			editId: boolean;

			/**
			 * Show Alignment selector
			 */
			editAlign: boolean;

			/**
			 * Show preview image
			 */
			showPreview: boolean;

			/**
			 * Select image after close dialog
			 */
			selectImageAfterClose: boolean;
		};
	}
}

Config.prototype.image = {
	dialogWidth: 600,
	openOnDblClick: true,
	editSrc: true,
	useImageEditor: true,
	editTitle: true,
	editAlt: true,
	editLink: true,
	editSize: true,
	editBorderRadius: true,
	editMargins: true,
	editClass: true,
	editStyle: true,
	editId: true,
	editAlign: true,
	showPreview: true,
	selectImageAfterClose: true
};
