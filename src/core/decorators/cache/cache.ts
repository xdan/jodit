/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

export function cached<T>(object: object, property: string): Nullable<T> {
	const descriptor = Object.getOwnPropertyDescriptor(object, property);
	if (!descriptor || isFunction(descriptor.get)) {
		return null;
	}
	return descriptor.value as T;
}

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
