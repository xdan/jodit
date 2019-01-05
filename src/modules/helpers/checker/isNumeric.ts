/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
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