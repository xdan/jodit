/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IDictionary, Nullable } from 'jodit/types';
import { isString } from '../checker/is-string';
import { isVoid } from '../checker/is-void';

/**
 * Safe access in tree object
 *
 * @example
 * ```js
 * const obj = {
 *   a: {
 *     b: {
 *       c: {
 *         e: false
 *       }
 *     }
 *   }
 * };
 *
 * console.log(Jodit.modules.Helpers.get('a.b.c.d.e', obj) === false); // true
 * console.log(Jodit.modules.Helpers.get('a.b.a.d.e', obj) === null); // false
 * ```
 */
export function get<T>(chain: string, obj: IDictionary): Nullable<T> {
	if (!isString(chain) || !chain.length) {
		return null;
	}

	const parts = chain.split('.');

	let result = obj;

	for (const part of parts) {
		if (isVoid(result[part])) {
			return null;
		}

		result = result[part];
	}

	if (isVoid(result)) {
		return null;
	}

	return result as T;
}
