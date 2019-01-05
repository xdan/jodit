/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { CallbackFunction } from '../../../types';
import { setTimeout } from './setTimeout';

/**
 * Debouncing enforces that a function not be called again until a certain amount of time has passed without
 * it being called. As in "execute this function only if 100 milliseconds have passed without it being called."
 *
 * @method debounce
 * @param {function} fn
 * @param {int} timeout
 * @param {boolean} [invokeAsap] - execute fn on first call without timeout
 * @param {context} [ctx] Context
 * @return {function}
 * @example
 * ```javascript
 * var jodit = new Jodit('.editor');
 * Jodit.modules.Dom("input").on('keydown', jodit.helper.debounce(function() {
 *     // Do expensive things
 * }, 100));
 * ```
 */
export const debounce = function<T>(
    this: T,
    fn: CallbackFunction<T>,
    timeout?: number,
    invokeAsap?: boolean,
    ctx?: T
) {
    if (arguments.length === 3 && typeof invokeAsap !== 'boolean') {
        ctx = invokeAsap;
        invokeAsap = false;
    }

    let timer: number = 0;

    return function(this: T) {
        const args = arguments;
        const context: T = ctx || this;

        if ((invokeAsap && !timer) || !timeout) {
            fn.apply(context, args as any);
        }

        if (timeout) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!invokeAsap) {
                    fn.apply(context, args as any);
                }
                timer = 0;
            }, timeout);
        }
    };
};