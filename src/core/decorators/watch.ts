import { IDictionary } from '../../types';
import { error, isFunction, isPlainObject, splitArray } from '../helpers';
import { ObserveObject } from '../events';
import { Component, STATUSES } from '../../modules/component';

/**
 * Watch decorator. Added observer for some change in field value
 * @param observeFields
 */
export function watch(observeFields: string[] | string) {
	return function<T extends Component & IDictionary>(
		target: T,
		propertyKey: string
	) {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(STATUSES.ready, (component: IDictionary) => {
			const callback = (key: string = '') => {
				if (!component.isInDestruct) {
					component[propertyKey](key);
				}
			};

			splitArray(observeFields).forEach(field => {
				const parts = field.split('.'),
					[key] = parts;

				let value: any = component[key];

				if (value instanceof ObserveObject) {
					value.on('change', callback);
				} else if (isPlainObject(value)) {
					component[key] = ObserveObject.create(value, [key]);
					component[key].on('change', callback);
				} else {
					Object.defineProperty(component, key, {
						set(v: any): void {
							if (value === v) {
								return;
							}

							value = v;

							if (isPlainObject(value)) {
								value = ObserveObject.create(value, [key]);
								value.on('change.' + field, callback);
							}

							callback();
						},
						get(): any {
							return value;
						}
					});
				}
			});
		});
	};
}

export default watch;
