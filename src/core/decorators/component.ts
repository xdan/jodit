/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Decorate components and set status isReady after constructor
 * @param constructorFunction
 */
export function component<T extends { new (...constructorArgs: any[]): any }>(
	constructorFunction: T
) {
	const newConstructorFunction: any = function (this: any, ...args: any[]) {
		if (Object.getPrototypeOf(this) === newConstructorFunction.prototype) {
			const result = new constructorFunction(...args);
			result.setStatus('ready');
			return result;
		}

		return constructorFunction.call(this, ...args);
	};

	// copy static properties
	Object.keys(constructorFunction).forEach(key => {
		const descriptor = Object.getOwnPropertyDescriptor(
			constructorFunction,
			key
		);

		if (descriptor) {
			Object.defineProperty(newConstructorFunction, key, descriptor);
		}
	});

	[newConstructorFunction, constructorFunction].forEach((constructor) => {
		Object.defineProperty(constructor, 'originalConstructor', {
			value: constructorFunction,
			enumerable: false
		});
	})

	newConstructorFunction.prototype = constructorFunction.prototype;

	return newConstructorFunction;
}
