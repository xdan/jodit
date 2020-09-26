/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { isFunction } from '../helpers/checker';
import { getClassName } from '../helpers/utils';

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
			const fn = descriptor.value;

			Object.defineProperty(target.prototype, key, {
				configurable: true,
				get() {
					return function (this: typeof target, ...args: any[]) {
						console.log(
							`Class: ${getClassName(
								target.prototype
							)} call: ${String(key)}`
						);
						return fn.apply(this, args);
					};
				}
			});
		}
	});
};
