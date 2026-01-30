/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isFunction } from 'jodit/core/helpers/checker/is-function';

/**
 * [[include:core/decorators/autobind/README.md]]
 * @packageDocumentation
 * @module decorators/autobind
 */

/**
 * Decorator that automatically binds a method to its class instance.
 * This is useful when passing methods as callbacks to preserve the correct `this` context.
 *
 * @example
 * ```typescript
 * class MyComponent {
 *   @autobind
 *   handleClick() {
 *     console.log(this); // Always refers to MyComponent instance
 *   }
 * }
 *
 * const component = new MyComponent();
 * const button = document.createElement('button');
 * button.addEventListener('click', component.handleClick); // `this` is correctly bound
 * ```
 */
export function autobind(
	_target: object,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	if (!isFunction(descriptor.value)) {
		throw new TypeError(
			`@autobind can only be applied to methods, but "${propertyKey}" is not a function`
		);
	}

	const originalMethod = descriptor.value;

	return {
		configurable: true,
		get(): typeof originalMethod {
			// Create a bound version of the method and cache it on the instance
			const boundMethod = originalMethod.bind(this);

			// Define the bound method as a property on the instance
			// This ensures the same bound function is returned on subsequent accesses
			Object.defineProperty(this, propertyKey, {
				value: boundMethod,
				configurable: true,
				writable: true
			});

			return boundMethod;
		}
	};
}
