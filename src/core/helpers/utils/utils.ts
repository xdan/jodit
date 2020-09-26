/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isFunction, isPromise } from '../checker';
import type {
	CanPromise,
	IDictionary,
	IViewBased,
	Nullable
} from '../../../types';
import { get } from './get';

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
	elm: Element | null,
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

export function callPromise(
	condition: CanPromise<unknown>,
	callback: () => CanPromise<any>
): CanPromise<void> {
	if (isPromise(condition)) {
		return condition.finally(callback);
	} else {
		return callback();
	}
}

const map: IDictionary = {};

/**
 * Reset Vanila JS native function
 * @param key
 * @example
 * ```js
 * reset('Array.from')(Set([1,2,3])) // [1, 2, 3]
 * ```
 */
export const reset = function <T extends Function>(key: string): Nullable<T> {
	if (!(key in map)) {
		const iframe = document.createElement('iframe');

		try {
			iframe.src = 'about:blank';
			document.body.appendChild(iframe);

			if (!iframe.contentWindow) {
				return null;
			}

			const func = get(key, iframe.contentWindow),
				bind = get(
					key.split('.').slice(0, -1).join('.'),
					iframe.contentWindow
				);

			if (isFunction(func)) {
				map[key] = func.bind(bind);
			}
		} catch (e) {
			if (!isProd) {
				throw e;
			}
		} finally {
			iframe.parentNode?.removeChild(iframe);
		}
	}

	return map[key] ?? null;
};
