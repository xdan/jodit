/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { trim } from '../string';

/**
 * Replaces back slashes and correctly concatenates several parts of the path.
 * @param path
 * @see Test helpers
 */
export const normalizePath = (...path: string[]) => {
	return path
		.filter(part => trim(part).length)
		.map((part, index) => {
			part = part.replace(/([^:])[\\\/]+/g, '$1/');

			if (index) {
				part = part.replace(/^\//, '')
			}

			if (index !== path.length - 1) {
				part = part.replace(/\/$/, '')
			}

			return part;
		})
		.join('/');
};
