/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-processor
 */

import { Config } from 'jodit/config';

/**
 * @module plugins/image-processor
 */

declare module 'jodit/config' {
	interface Config {
		/**
		 * Options for processing images inserted into the editor (e.g. converting base64 data URIs to Blob URLs).
		 */
		imageProcessor: {
			replaceDataURIToBlobIdInView: boolean;
		};
	}
}

Config.prototype.imageProcessor = {
	replaceDataURIToBlobIdInView: true
};
