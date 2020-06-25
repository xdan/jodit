/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CanUndef, IDictionary } from '../../types';
import { error, isFunction, isPlainObject, splitArray } from '../helpers';
import { ObserveObject } from '../events';
import { Component, STATUSES } from '../component';

export function getPropertyDescriptor(
	obj: any,
	prop: string
): CanUndef<PropertyDescriptor> {
	let desc;

	do {
		desc = Object.getOwnPropertyDescriptor(obj, prop);
		obj = Object.getPrototypeOf(obj);
	} while (!desc && obj);

	return desc;
}

/**
 * Watch decorator. Added observer for some change in field value
 * @param observeFields
 */
export function watch(observeFields: string[] | string) {
	return <T extends Component & IDictionary>(
		target: T,
		propertyKey: string
	) => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		const process = (component: IDictionary) => {
			const callback = (key: string, ...args: any[]) => {
				if (!component.isInDestruct) {
					component[propertyKey](key, ...args);
				}
			};

			splitArray(observeFields).forEach(field => {
				const parts = field.split('.'),
					[key] = parts;

				let value: any = component[key];

				if (value instanceof ObserveObject) {
					value.on(`change.${field}`, callback);
				} else if (isPlainObject(value) && parts.length > 1) {
					component[key] = ObserveObject.create(value, [key]);
					component[key].on(`change.${field}`, callback);
				} else {
					const descriptor = getPropertyDescriptor(target, key);

					Object.defineProperty(component, key, {
						configurable: true,
						set(v: any): void {
							const oldValue = value;

							if (oldValue === v) {
								return;
							}

							value = v;
							if (descriptor && descriptor.set) {
								descriptor.set.call(component, v);
							}

							if (isPlainObject(value)) {
								value = ObserveObject.create(value, [key]);
								value.on('change.' + field, callback);
							}

							callback(key, oldValue, value);
						},
						get(): any {
							if (descriptor && descriptor.get) {
								return descriptor.get.call(component);
							}

							return value;
						}
					});
				}
			});
		};

		if (isFunction(target.hookStatus)) {
			target.hookStatus(STATUSES.ready, process);
		} else {
			process(target);
		}
	};
}

export default watch;
