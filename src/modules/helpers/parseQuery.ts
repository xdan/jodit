/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';

/**
 * Parse query string
 */
export const parseQuery = (queryString: string): IDictionary<string> => {
	const query: IDictionary<string> = {},
		a = queryString.substr(1).split('&');


	for (let i = 0; i < a.length; i += 1) {
		const keyValue = a[i].split('=');
		query[decodeURIComponent(keyValue[0])] = decodeURIComponent(
			keyValue[1] || ''
		);
	}

	return query;
};
