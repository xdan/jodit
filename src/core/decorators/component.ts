/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isFunction } from '../helpers';

interface ComponentCompatible {
	className?: () => string;
	new (...constructorArgs: any[]): any;
}

/**
 * Safe access to ClassName
 * @param elm
 */
const cn = (elm: ComponentCompatible): string | number => {
	return isFunction(elm.className) ? elm.className() : NaN;
};

/**
 * Decorate components and set status isReady after constructor
 * @param constructorFunction
 */
export function component<T extends ComponentCompatible>(
	constructorFunction: T
) {
	class newConstructorFunction extends constructorFunction {
		constructor(...args: any[]) {
			super(...args);

			const isSamePrototype =
				Object.getPrototypeOf(this) ===
				newConstructorFunction.prototype;

			/** For strange minimizer */
			const isSameClassName =
				cn(this as unknown as ComponentCompatible) ===
				cn(newConstructorFunction.prototype);

			if (!isProd && isSamePrototype && !isSameClassName) {
				throw new Error('Need use decorator only for components');
			}

			if (isSamePrototype || isSameClassName) {
				this.setStatus('ready');
			}
		}
	}

	newConstructorFunction.prototype.constructor = constructorFunction;

	return newConstructorFunction;
}
