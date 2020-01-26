/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';

type eachCallback<T, N> = ((this: T, key: N, value: T) => boolean | void);

export function each<T>(obj: T[], callback: eachCallback<T, number>): boolean;

export function each<T>(
	obj: IDictionary<T>,
	callback: eachCallback<T, string>
): boolean;

export function each<T>(
	obj: T[] | IDictionary<T>,
	callback: eachCallback<T, any>
): boolean {
	let length: number, keys: string[], i: number;

	if (Array.isArray(obj)) {
		length = obj.length;
		for (i = 0; i < length; i += 1) {
			if (callback.call(obj[i], i, obj[i]) === false) {
				return false;
			}
		}
	} else {
		keys = Object.keys(obj);
		for (i = 0; i < keys.length; i += 1) {
			if (callback.call(obj[keys[i]], keys[i], obj[keys[i]]) === false) {
				return false;
			}
		}
	}

	return true;
}
