/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

/**
 *
 * @param key
 * @return {string}
 */
export const fromCamelCase = (key: string): string => {
    return key.replace(/([A-Z]+)/g, (m, letter) => {
        return '-' + letter.toLowerCase();
    });
};