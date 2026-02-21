/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { ImagePropertiesOptions } from 'jodit/plugins/image-properties/interface';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Configuration for the image properties dialog (opened on double-click).
		 * Controls which editing tabs are available: src, alt, title, link, size, margins, classes, styles, etc.
		 */
		image: ImagePropertiesOptions;
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
	availableClasses: [],
	editStyle: true,
	editId: true,
	editAlign: true,
	showPreview: true,
	selectImageAfterClose: true
};
