/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';
import { isPlainObject } from './checker';

/**
 * Build query string
 */
export const buildQuery = (data: IDictionary, prefix?: string): string => {
	const str: string[] = [];

	const enc = encodeURIComponent;

	for (const dataKey in data) {
		if (data.hasOwnProperty(dataKey)) {
			const k = prefix ? prefix + '[' + dataKey + ']' : dataKey;
			const v = data[dataKey];

			str.push(
				isPlainObject(v) ? buildQuery(v, k) : enc(k) + '=' + enc(v)
			);
		}
	}

	return str.join('&');
};
