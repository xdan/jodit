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
	class newConstructorFunction extends constructorFunction {
		constructor(...args: any[]) {
			super(...args);

			if (Object.getPrototypeOf(this) === newConstructorFunction.prototype) {
				this.setStatus('ready');
			}
		}
	}

	newConstructorFunction.prototype.constructor = constructorFunction;

	return newConstructorFunction;
}
