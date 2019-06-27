/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CallbackFunction } from '../../../types';
import { setTimeout } from './setTimeout';

/**
 * Throttling enforces a maximum number of times a function can be called over time.
 * As in "execute this function at most once every 100 milliseconds."
 *
 * @method throttle
 * @param {function} fn
 * @param {int} timeout
 * @param {context} [ctx] Context
 * @return {function}
 * @example
 * ```javascript
 * var jodit = new Jodit('.editor');
 * jodit.events.on(document.body, 'scroll', jodit.helper.throttle(function() {
 *     // Do expensive things
 * }, 100));
 * ```
 */
export const throttle = <T>(
    fn: CallbackFunction<T>,
    timeout: number,
    ctx?: T
) => {
    let timer: number | null = null,
        args: IArguments,
        needInvoke: boolean,
        callee: () => void;

    return function(this: any) {
        args = arguments;
        needInvoke = true;
        const context: T = ctx || this;

        if (!timeout) {
            fn.apply(context, args as any);
            return;
        }

        if (!timer) {
            callee = () => {
                if (needInvoke) {
                    fn.apply(context, args as any);
                    needInvoke = false;
                    timer = setTimeout(callee, timeout);
                } else {
                    timer = null;
                }
            };
            callee();
        }
    };
};
