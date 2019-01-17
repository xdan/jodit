/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */


import { isNumeric } from './isNumeric';

/**
 * Check value is Int
 * @param value
 */
export const isInt = (value: number | string): boolean => {
    if (typeof value === 'string' && isNumeric(value)) {
        value = parseFloat(value);
    }

    return typeof value === 'number' && Number.isFinite(value) && !(value % 1);
};