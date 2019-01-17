/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * Create async callback if set timeout value - else call function immediately
 *
 * @param callback
 * @param timeout
 * @param a1
 * @param a2
 * @param a3
 */
export const setTimeout = <T1, T2, T3>(
    callback: (a1?: T1, a2?: T2, a3?: T3) => any,
    timeout: number,
    a1?: T1,
    a2?: T2,
    a3?: T3
): number => {
    if (!timeout) {
        callback.call(null, a1, a2, a3);
    } else {
        return window.setTimeout.call(window, callback, timeout, a1, a2, a3);
    }

    return 0;
};