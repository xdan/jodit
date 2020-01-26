/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
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
