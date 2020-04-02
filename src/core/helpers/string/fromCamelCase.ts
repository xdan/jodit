/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
