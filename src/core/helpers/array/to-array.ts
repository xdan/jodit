/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { reset } from '../utils';
import { isNativeFunction } from '../checker/is-native-function';

/**
 * Always return Array. In some cases(Joomla Mootools)
 * Array.from can be replaced to some bad implementation.
 */
export const toArray = function toArray<T extends typeof Array.from>(
	...args: Parameters<T>
): ReturnType<T> {
	const func = isNativeFunction(Array.from)
		? Array.from
		: reset<typeof Array.from>('Array.from') ?? Array.from;
	return func.apply(Array, args) as ReturnType<T>;
} as typeof Array.from;
