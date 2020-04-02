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
export const camelCase = (key: string): string => {
    return key.replace(/([-_])(.)/g, (m, code, letter) => {
        return letter.toUpperCase();
    });
};
