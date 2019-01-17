/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const completeUrl = (url: string): string => {
    if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
        url = 'https:' + url;
    }

    return url;
};
