/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/watch/README.md]]
 * @packageDocumentation
 * @module decorators/watch
 */

import type {
	CanUndef,
	DecoratorHandler,
	IComponent,
	IDictionary,
	IViewBased
} from 'jodit/types';
import { STATUSES } from 'jodit/core/component/statuses';
import { observable } from 'jodit/core/event-emitter/observable';
import { splitArray } from 'jodit/core/helpers/array/split-array';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { isPlainObject } from 'jodit/core/helpers/checker/is-plain-object';
import { isViewObject } from 'jodit/core/helpers/checker/is-view-object';
import { error } from 'jodit/core/helpers/utils/error';

export function getPropertyDescriptor(
	obj: unknown,
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
 */
export function watch(
	observeFields: string[] | string,
	opts?: {
		context?: object | ((c: IDictionary) => object);
		immediately?: boolean;
	}
): DecoratorHandler {
	return <T extends IComponent & IDictionary>(
		target: T,
		propertyKey: string
	) => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		const immediately = opts?.immediately ?? true;
		const context = opts?.context;

		const process = (component: IComponent): void => {
			const view = isViewObject(component)
				? component
				: (component as unknown as { jodit: IViewBased }).jodit;

			let callback = (key: string, ...args: any[]): void | unknown => {
				if (component.isInDestruct) {
					return;
				}

				return (component as any)[propertyKey](key, ...args);
			};

			if (!immediately) {
				callback = component.async.microDebounce(callback, true);
			}

			splitArray(observeFields).forEach(field => {
				if (/:/.test(field)) {
					const [objectPath, eventName] = field.split(':');
					let ctx = context;

					if (objectPath.length) {
						ctx = component.get<CanUndef<object>>(objectPath)!;
					}

					if (isFunction(ctx)) {
						ctx = ctx(component);
					}

					view.events.on(ctx || component, eventName, callback);

					if (!ctx) {
						view.events.on(eventName, callback);
					}

					component.hookStatus('beforeDestruct', () => {
						view.events
							.off(ctx || component, eventName, callback)
							.off(eventName, callback);
					});

					return;
				}

				const parts = field.split('.'),
					[key] = parts as unknown as Array<keyof IComponent>,
					teil = parts.slice(1);

				let value: any = component[key];

				if (isPlainObject(value)) {
					const observableValue = observable(value);
					observableValue.on(`change.${teil.join('.')}`, callback);
				}

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
							value = observable(value);
							value.on(`change.${teil.join('.')}`, callback);
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
			});
		};

		if (isFunction(target.hookStatus)) {
			target.hookStatus(STATUSES.ready, process);
		} else {
			process(target);
		}
	};
}
