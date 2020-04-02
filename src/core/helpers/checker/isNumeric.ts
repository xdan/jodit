/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check value has numeric format
 *
 * @param value
 */
export const isNumeric = (value: number | string): boolean => {
    if (typeof value === 'string') {
        if (!value.match(/^([+\-])?[0-9]+(\.?)([0-9]+)?(e[0-9]+)?$/)) {
            return false;
        }

        value = parseFloat(value);
    }

    return !isNaN(value) && isFinite(value);
};
