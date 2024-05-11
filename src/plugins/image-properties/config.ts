/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import { Config } from 'jodit/config';

import type { ImagePropertiesOptions } from './interface';

declare module 'jodit/config' {
	interface Config {
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
