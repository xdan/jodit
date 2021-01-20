/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, Nullable } from '../../../types';
import { isString, isVoid } from '../checker';

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
 * console.log(Jodit.modules.Helpers.get('a.b.c.d.e') === false);
 * console.log(Jodit.modules.Helpers.get('a.b.a.d.e') === null);
 * ```
 * @param chain
 * @param obj
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
