/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
export function setTimeout<T = any>(
	callback: (...args: T[]) => void,
	timeout: number,
	...args: T[]
): number {
	if (!timeout) {
		callback.call(null, ...args);
	} else {
		return window.setTimeout(callback, timeout, ...args);
	}

	return 0;
}

/**
 * Clear timeout
 * @param timer
 */
export function clearTimeout(timer: number) {
	window.clearTimeout(timer);
}
