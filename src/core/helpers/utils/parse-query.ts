/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IDictionary } from 'jodit/types';

/**
 * Parse query string
 */
export const parseQuery = (queryString: string): IDictionary<string> => {
	const query: IDictionary<string> = {},
		a = queryString.substring(1).split('&');

	for (let i = 0; i < a.length; i += 1) {
		const keyValue = a[i].split('=');
		query[decodeURIComponent(keyValue[0])] = decodeURIComponent(
			keyValue[1] || ''
		);
	}

	return query;
};
