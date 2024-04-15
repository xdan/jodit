/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @internal
 * @module decorators/spy
 */

// @ts-nocheck

import {
	isBoolean,
	isFunction,
	isNumber,
	isPlainObject,
	isString
} from 'jodit/core/helpers/checker';
import { getClassName } from 'jodit/core/helpers/utils';

/**
 * Allow spy for the class
 */
export function spy(target: Function): void {
	const methods = Reflect.ownKeys(target.prototype);

	methods.forEach(key => {
		// Ignore special case target method
		if (['className', 'constructor'].includes(key)) {
			return;
		}

		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			key
		);

		// Only methods need binding
		if (descriptor && isFunction(descriptor.value)) {
			Object.defineProperty(target.prototype, key, {
				...descriptor,
				value: function (this: typeof target, ...args: any[]): any {
					console.warn(
						`Class: ${getClassName(target.prototype)} call: ${String(
							key
						)}(${args.map(a =>
							isPlainObject(a) ||
							isString(a) ||
							isBoolean(a) ||
							isNumber(a)
								? JSON.stringify(a)
								: {}.toString.call(a)
						)})`
					);

					return descriptor.value.apply(this, args);
				}
			});
		}
	});
}
