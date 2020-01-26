/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
