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

		target.hookStatus(STATUSES.ready, (component: IDictionary) => {
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
		});
	};
}

export default watch;
