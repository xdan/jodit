/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isFunction } from '../checker';
import { IViewBased } from '../../../types';

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
export function call<T extends any[], R>(
	func: (...args: T) => R,
	...args: T
): R {
	return func(...args);
}

/**
 * Alias for `elm.getAttribute` but if set second argument `-{key}`
 * it will also check `data-{key}` attribute
 * if set `value` it is alias for setAttribute with same logic
 *
 * @param elm
 * @param key
 * @param [value]
 */
export function attr(
	elm: HTMLElement | null,
	key: string,
	value?: string | number | boolean | null
): null | string {
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

	if (value !== undefined) {
		if (value === null) {
			elm.hasAttribute(key) && elm.removeAttribute(key);
		} else {
			elm.setAttribute(key, value.toString());
			return value.toString();
		}
	}

	return elm.getAttribute(key);
}

/**
 * Mark element for debugging
 * @param elm
 */
export function markOwner(jodit: IViewBased, elm: HTMLElement): void {
	attr(elm, 'data-editor_id', jodit.id);

	!elm.component &&
		Object.defineProperty(elm, 'jodit', {
			value: jodit
		});
}
