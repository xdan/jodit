/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
