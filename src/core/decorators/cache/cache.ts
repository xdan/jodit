/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/cache/README.md]]
 * @packageDocumentation
 * @module decorators/cache
 */

import { error, isFunction } from 'jodit/core/helpers';
import type { IDictionary } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

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

export function cacheHTML<T, R>(
	target: IDictionary,
	name: string,
	descriptor: CachePropertyDescriptor<T, R>
): void {
	const fn = descriptor.value;
	if (!isFunction(fn)) {
		throw error('Handler must be a Function');
	}

	let cached: Element;

	descriptor.value = function (this: T, ...attrs: unknown[]): R {
		if (cached) {
			// return cached.cloneNode(true) as R;
		}

		const value = fn.apply(this, attrs);

		if (Dom.isElement(value)) {
			cached = value;
		}

		return value.cloneNode(true) as R;
	};
}
