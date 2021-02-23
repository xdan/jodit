/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from '../../../types';
import { isString } from '../checker/is-string';
import { isNumeric } from '../checker/is-numeric';
import { isArray } from '../checker/is-array';
import { isPlainObject } from '../checker';

/**
 * Safe access in tree object
 *
 * @example
 * ```js
 * const a = {}, b = {};
 * Jodit.modules.Helpers.set('a.b.c.d.e', 1, a);
 * console.log(a);// {a: {b: {c: {d: {e: 1}}}}}
 *
 * Jodit.modules.Helpers.set('a.0.e', 1, b);
 * console.log(b);// {a: [{e: 1}]}
 * ```
 * @param chain
 * @param obj
 */
export function set<T>(chain: string, value: unknown, obj: IDictionary): void {
	if (!isString(chain) || !chain.length) {
		return;
	}

	const parts = chain.split('.');

	let result = obj,
		key = parts[0];

	for (let i = 0; i < parts.length - 1; i += 1) {
		key = parts[i];

		if (!isArray(result[key]) && !isPlainObject(result[key])) {
			result[key] = isNumeric(parts[i + 1]) ? [] : {};
		}

		result = result[key];
	}

	if (result) {
		result[parts[parts.length - 1]] = value;
	}
}
