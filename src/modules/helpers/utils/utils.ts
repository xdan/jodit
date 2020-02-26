/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isFunction } from '../checker';

/**
 * Call function with parameters
 *
 * @param func
 * @param args
 * @example
 * ```js
 * const f = Math.random();
 * Jodit.modules.Helpers.call(f > 0.5 ? Math.ceil : Math.floor, f);
 * ```
 */
export function call<T extends Array<any>, R>(func: (...args: T) => R, ...args: T): R {
	return func(...args);
}

/**
 * Alias for `elm.getAttribute` but if set second argument `-{key}`
 * it will also check `data-{key}` attribute
 *
 * @param elm
 * @param key
 */
export function attr(elm: HTMLElement, key: string): null | string {
	if (!elm || !isFunction(elm.getAttribute)) {
		return null;
	}

	if (/^-/.test(key)) {
		const res = attr(elm, `data${key}`);

		if (res) {
			return res;
		}

		key = key.substr(1);
	}

	return elm.getAttribute(key);
}
