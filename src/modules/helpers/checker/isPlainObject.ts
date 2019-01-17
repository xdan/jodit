/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { isWindow } from './isWindow';
import { hasOwn } from '../type';

/**
 * Check if element is simple plaint object
 *
 * @param obj
 */
export const isPlainObject = (obj: any): boolean => {
    if (typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
        return false;
    }

    return !(
        obj.constructor &&
        !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
    );
};