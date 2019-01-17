/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from '../../types';

/**
 * Parse query string
 *
 */
export const parseQuery = (queryString: string): IDictionary<string> => {
    const query: IDictionary<string> = {},
        a: string[] = queryString.substr(1).split('&');
    let keyvalue: string[];

    for (let i = 0; i < a.length; i += 1) {
        keyvalue = a[i].split('=');
        query[decodeURIComponent(keyvalue[0])] = decodeURIComponent(
            keyvalue[1] || ''
        );
    }

    return query;
};
