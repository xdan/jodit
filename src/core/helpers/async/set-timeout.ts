/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/async
 */

import { globalWindow } from 'jodit/core/constants';

/**
 * Create async callback if set timeout value - else call function immediately
 */
export function setTimeout<T = any>(
	callback: (...args: T[]) => void,
	timeout: number,
	...args: T[]
): number {
	if (!timeout) {
		callback.call(null, ...args);
	} else {
		return globalWindow.setTimeout(callback, timeout, ...args);
	}

	return 0;
}

/**
 * Clear timeout
 */
export function clearTimeout(timer: number): void {
	globalWindow.clearTimeout(timer);
}
