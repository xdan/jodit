/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
export function clearTimeout(timer: number): void {
	window.clearTimeout(timer);
}
