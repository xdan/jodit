/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import {
	isBoolean,
	isFunction,
	isNumber,
	isPlainObject,
	isString
} from '../helpers/checker';
import { getClassName } from '../helpers/utils';
import { type } from '../helpers';

/**
 * Allow spy for the class
 * @param target
 */
export const spy = function spy(target: Function) {
	const methods = Reflect.ownKeys(target.prototype);

	methods.forEach(key => {
		// Ignore special case target method
		if (key === 'constructor') {
			return;
		}

		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			key
		);

		// Only methods need binding
		if (descriptor && isFunction(descriptor.value)) {
			target.prototype[key] = function (
				this: typeof target,
				...args: any[]
			) {
				console.log(
					`Class: ${getClassName(target.prototype)} call: ${String(
						key
					)}(${args.map(a =>
						isPlainObject(a) ||
						isString(a) ||
						isBoolean(a) ||
						isNumber(a)
							? JSON.stringify(a)
							: `[${type(a)}]`
					)})`
				);

				return descriptor.value.apply(this, args);
			};
		}
	});
};
