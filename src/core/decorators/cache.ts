/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * The decorator allows you to cache the result of executing any method of the UI component.
 *
 * ```typescript
 * @component()
 * class UIComponent extends UIElement {
 *   @cache()
 *   someHeavyMethod(param1, param2) {
 *     return someHeaveCalculation(param1, param2);
 *   }
 * }
 *
 * const elm = new UIComponent(jodit);
 * elm.someHeavyMethod(1, 2);
 * elm.someHeavyMethod(1, 2);
 * elm.someHeavyMethod(1, 2); // someHeaveCalculation will execute only once
 * elm.someHeavyMethod(2, 2); // someHeaveCalculation will execute again
 * ```
 * @module decorators/cache
 */

import { error } from '../helpers';
import type { IDictionary } from '../../types';

export interface CachePropertyDescriptor<T, R> extends PropertyDescriptor {
	get?: (this: T) => R;
}

export function cache<T, R>(
	target: object,
	name: PropertyKey,
	descriptor: CachePropertyDescriptor<T, R>
): void {
	const getter = descriptor.get;

	if (!getter) {
		throw error('Getter property descriptor expected');
	}

	descriptor.get = function (this: T) {
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
