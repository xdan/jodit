/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/component/README.md]]
 * @packageDocumentation
 * @module decorators/component
 */

import type { IComponent } from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';
import { getClassName } from 'jodit/core/helpers/utils/get-class-name';

export interface ComponentCompatible<T = IComponent> {
	new (...constructorArgs: any[]): T;
}

const componentRegistry = new Map<string, ComponentCompatible>();
const decoratedClasses = new WeakSet<Function>();
const warnedClasses = new WeakSet<Function>();

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
			} else if (
				!IS_PROD &&
				!decoratedClasses.has(this.constructor) &&
				!warnedClasses.has(this.constructor)
			) {
				// Only the outermost class's decorator sets `ready`, so a subclass
				// without its own decorator stays in `beforeInit`. See #1685
				warnedClasses.add(this.constructor);
				console.warn(
					`Component "${this.constructor.name || getClassName(this)}" extends a @component class without being decorated itself, so it never becomes ready and its @watch, @debounce, @throttle and @hook handlers never run`
				);
			}
		}
	}

	decoratedClasses.add(constructorFunction);
	decoratedClasses.add(newConstructorFunction);

	const name = getClassName(constructorFunction.prototype);

	if (componentRegistry.has(name) && !IS_PROD) {
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
