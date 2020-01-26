/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
