/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/cache/README.md]]
 * @packageDocumentation
 * @module decorators/cache
 */

import type {
	IDictionary,
	IViewBased,
	IViewComponent,
	Nullable
} from 'jodit/types';
import { STATUSES } from 'jodit/core/component/statuses';
import { Dom } from 'jodit/core/dom/dom';
import { isFunction, isViewObject } from 'jodit/core/helpers/checker';
import { error } from 'jodit/core/helpers/utils/error/error';

export interface CachePropertyDescriptor<T, R> extends PropertyDescriptor {
	get?: (this: T) => R;
}

/**
 * Retrieves a cached property value from an object if it exists; otherwise, returns `null`.
 *
 * This utility is particularly useful when working with properties that are lazily initialized
 * or dynamically created, such as getters or cached computations. It ensures you can safely
 * access the value without triggering initialization or creating a new instance.
 *
 * ### Usage Example:
 * ```typescript
 * import type { IUIElement } from "jodit";
 *
 * const { component, cache, cached } = Jodit.decorators;
 * const { UIElement } = Jodit.modules;
 *
 * @component
 * class SomeComponent extends UIElement {
 *   @cache
 *   get someElement(): IUIElement {
 *     return new UIElement(this.jodit);
 *   }
 *
 *   destruct() {
 *     // Use the cached utility to clean up only if the property is initialized
 *     cached(this, 'someElement')?.destruct();
 *     super.destruct();
 *   }
 * }
 * ```
 *
 * @param object - The object containing the property to check.
 * @param property - The name of the property to retrieve from the cache.
 * @returns The cached value of the property if it exists; otherwise, `null`.
 *
 * ### Notes:
 * - If the property is defined as a getter, the function will return `null`
 *   instead of invoking the getter.
 * - This function is non-destructive and does not alter the object's state.
 */
export function cached<T>(object: object, property: string): Nullable<T> {
	const descriptor = Object.getOwnPropertyDescriptor(object, property);
	if (!descriptor || isFunction(descriptor.get)) {
		return null;
	}
	return descriptor.value as T;
}

/**
 * A decorator that caches the result of a getter method. Once the getter is accessed for the first time,
 * its computed value is stored as a property of the object. Subsequent accesses return the cached value
 * without recalculating it, improving performance and avoiding redundant computations.
 *
 * ### Key Features:
 * - **Lazy Initialization**: The original getter is invoked only once, the first time the property is accessed.
 * - **Immutability**: After caching, the value is stored as a non-writable, non-configurable property, preventing accidental modifications.
 * - **Conditional Caching**: If the returned value has a property `noCache` set to `true`, the caching mechanism is bypassed, and the getter is invoked each time.
 *
 * ### Usage Example 1: Basic Caching
 * ```typescript
 * import { cache } from './decorators';
 *
 * class Example {
 *   private counter = 0;
 *
 *   @cache
 *   get expensiveComputation(): number {
 *     console.log('Calculating...');
 *     return ++this.counter;
 *   }
 * }
 *
 * const instance = new Example();
 * console.log(instance.expensiveComputation); // Logs "Calculating..." and returns 1
 * console.log(instance.expensiveComputation); // Returns 1 (cached value, no calculation)
 * ```
 *
 * ### Usage Example 2: Integration with Cached Utilities
 * ```typescript
 * import { cache, cached } from './decorators';
 * import type { IUIElement } from "jodit";
 *
 * const { component } = Jodit.decorators;
 * const { UIElement } = Jodit.modules;
 *
 * @component
 * class SomeComponent extends UIElement {
 *   @cache
 *   get someElement(): IUIElement {
 *     return new UIElement(this.jodit);
 *   }
 *
 *   destruct() {
 *     // Use the cached utility to clean up only if the property is initialized
 *     cached(this, 'someElement')?.destruct();
 *     super.destruct();
 *   }
 * }
 * ```
 *
 * @param _ - The target object (not used directly).
 * @param name - The name of the property to decorate.
 * @param descriptor - The property descriptor, which must include a getter method.
 * @throws Will throw an error if the descriptor does not include a getter.
 *
 * ### Notes:
 * - **Performance**: Ideal for properties that are computationally expensive and do not change after the initial computation.
 * - **Flexibility**: Supports conditional caching via the `noCache` property in the returned value.
 * - **Compatibility**: Designed to work seamlessly with objects and classes in TypeScript or JavaScript.
 */
export function cache<T, R>(
	_: object,
	name: PropertyKey,
	descriptor: CachePropertyDescriptor<T, R>
): void {
	const getter = descriptor.get;

	if (!getter) {
		throw error('Getter property descriptor expected');
	}

	descriptor.get = function (this: T): R {
		const value = getter.call(this);

		if (value && (value as IDictionary).noCache === true) {
			return value;
		}

		Object.defineProperty(this, name, {
			configurable: descriptor.configurable,
			enumerable: descriptor.enumerable,
			writable: false,
			value
		});

		return value;
	};
}

export function cacheHTML<T extends Function, R>(
	target: IDictionary,
	_: string,
	descriptor: CachePropertyDescriptor<T, R>
): void {
	const fn = descriptor.value;
	if (!isFunction(fn)) {
		throw error('Handler must be a Function');
	}

	let useCache = true;

	const cached: WeakMap<Function, Element> = new WeakMap();

	descriptor.value = function (this: T, ...attrs: unknown[]): R {
		if (useCache && cached.has(this.constructor)) {
			return cached.get(this.constructor)?.cloneNode(true) as R;
		}

		const value = fn.apply(this, attrs);

		if (useCache && Dom.isElement(value)) {
			cached.set(this.constructor, value);
		}

		return useCache ? (value.cloneNode(true) as R) : value;
	};

	target.hookStatus(
		STATUSES.ready,
		(component: IViewComponent | IViewBased) => {
			const view = isViewObject(component)
				? component
				: (component as unknown as { jodit: IViewBased }).jodit;

			useCache = Boolean(view.options.cache);
		}
	);
}
