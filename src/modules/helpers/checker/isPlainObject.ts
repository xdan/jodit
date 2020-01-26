/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
