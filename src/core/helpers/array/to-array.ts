/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/array
 */

import { isNativeFunction } from 'jodit/core/helpers/checker/is-native-function';
import { reset } from 'jodit/core/helpers/utils/reset';

/**
 * Always return Array. It's a safe polyfill for [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) method
 * In certain scenarios (such as with Joomla Mootools), Array.from may be substituted with a less optimal implementation
 * ```javascript
 * Jodit.modules.Helpers.toArray('123') // ['1', '2', '3']
 * Jodit.modules.Helpers.toArray(['test']) // ['test']
 * Jodit.modules.Helpers.toArray(1) // []
 * ```
 */
export const toArray = function toArray<T extends typeof Array.from>(
	...args: Parameters<T>
): ReturnType<T> {
	const func = isNativeFunction(Array.from)
		? Array.from
		: reset<typeof Array.from>('Array.from') ?? Array.from;

	return func.apply(Array, args) as ReturnType<T>;
} as typeof Array.from;
