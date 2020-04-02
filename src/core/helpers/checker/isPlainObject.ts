/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isWindow } from './isWindow';
import { hasOwn } from '../type';
import { IDictionary } from '../../../types';

/**
 * Check if element is simple plaint object
 * @param obj
 */
export const isPlainObject = <T>(obj: any | IDictionary<T>): obj is IDictionary<T> => {
    if (typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
        return false;
    }

    return !(
        obj.constructor &&
        !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
    );
};
