/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
