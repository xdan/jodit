/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IDictionary, Nullable } from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';
import { isFunction } from 'jodit/core/helpers/checker/is-function';

import { get } from './get';

const map: IDictionary = {};

/**
 * Reset Vanilla JS native function
 * @example
 * ```js
 * reset('Array.from')(Set([1,2,3])) // [1, 2, 3]
 * ```
 * You must use the function derived from the method immediately as its iframe is being removed
 */
export function reset<T extends Function>(key: string): Nullable<T> {
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
			if (!IS_PROD) {
				throw e;
			}
		} finally {
			iframe.parentNode?.removeChild(iframe);
		}
	}

	return map[key] ?? null;
}
