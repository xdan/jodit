/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent } from 'jodit/types';
import { getClassName } from 'jodit/core/helpers/utils/get-class-name';

/**
 * [[include:core/decorators/component/README.md]]
 * @packageDocumentation
 * @module decorators/component
 */

export interface ComponentCompatible<T = IComponent> {
	new (...constructorArgs: any[]): T;
}

const componentRegistry = new Map<string, ComponentCompatible>();

/**
 * Decorate components and set status isReady after constructor
 * @param constructorFunction - Component constructor class
 */
export function component<T extends ComponentCompatible>(
	constructorFunction: T
): T {
	class newConstructorFunction extends constructorFunction {
		constructor(...args: any[]) {
			super(...args);

			const isRootConstructor =
				this.constructor === newConstructorFunction;

			// We can add a decorator to multiple classes in a chain.
			// Status should be set only as root
			if (isRootConstructor) {
				// In some es/minimizer builds, JS instantiates the original class rather than the new constructor
				if (!(this instanceof newConstructorFunction)) {
					Object.setPrototypeOf(
						this,
						newConstructorFunction.prototype
					);
				}

				this.setStatus('ready');
			}
		}
	}

	const name = getClassName(constructorFunction.prototype);

	if (componentRegistry.has(name)) {
		throw new Error(`Component with name "${name}" is already registered`);
	}

	componentRegistry.set(name, newConstructorFunction);
	return newConstructorFunction;
}

export function getComponentClass<T extends IComponent>(
	name: string
): ComponentCompatible<T> {
	return componentRegistry.get(name) as ComponentCompatible<T>;
}
