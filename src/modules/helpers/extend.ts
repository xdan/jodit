/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { JoditObject } from './JoditObject';
import { JoditArray } from './JoditArray';
import { type } from './type';
import { isPlainObject } from './checker/isPlainObject';

/**
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 * @param target The target object to copy to.
 * @param source The source object from which to copy properties.
 */
export function extend<T, U>(target: T, source: U): T & U;
export function extend<U, V>(deep: true, source1: U, source2: V): U & V;

/**
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 * @param target The target object to copy to.
 * @param source1 The first source object from which to copy properties.
 * @param source2 The second source object from which to copy properties.
 */
export function extend<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function extend<T, U, V>(
	deep: true,
	target: T,
	source1: U,
	source2: V
): T & U & V;

/**
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 * @param target The target object to copy to.
 * @param source1 The first source object from which to copy properties.
 * @param source2 The second source object from which to copy properties.
 * @param source3 The third source object from which to copy properties.
 */
export function extend<T, U, V, W>(
	target: T,
	source1: U,
	source2: V,
	source3: W
): T & U & V & W;
export function extend<T, U, V, W>(
	deep: true,
	target: T,
	source1: U,
	source2: V,
	source3: W
): T & U & V & W;

/**
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 * @param target The target object to copy to.
 * @param sources One or more source objects from which to copy properties
 */
export function extend(target: object, ...sources: any[]): any;
export function extend(deep: true, target: object, ...sources: any[]): any;

export function extend(this: any, ...args: any[]): any {
	const length = args.length;
	let options,
		name,
		src,
		copy,
		copyIsArray,
		clone,
		target: boolean | any = args[0] || {},
		i = 1,
		j,
		keys,
		deep = false;

	if (typeof target === 'boolean') {
		deep = target;
		target = args[i] || {};
		i += 1;
	}

	if (typeof target !== 'object' && type(target) === 'function') {
		target = {};
	}

	if (i === length) {
		target = this;
		i += 1;
	}

	for (i; i < length; i += 1) {
		options = args[i];
		if (options !== null && options !== undefined) {
			keys = Object.keys(options);
			for (j = 0; j < keys.length; j += 1) {
				name = keys[j];
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (
					deep &&
					copy &&
					((isPlainObject(copy) && !(copy instanceof JoditObject)) ||
						(Array.isArray(copy) && !(copy instanceof JoditArray)))
				) {
					copyIsArray = Array.isArray(copy);

					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					target[name] = extend(deep, clone, copy);
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
}
