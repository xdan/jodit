/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license;
 * For GPL see LICENSE.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
