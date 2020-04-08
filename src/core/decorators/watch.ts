import { splitArray } from '../helpers/array/splitArray';
import { IDictionary } from '../../types';
import { isFunction, isPlainObject } from '../helpers/checker';
import { ObserveObject } from '../events/observeObject';
import { Component } from '../../modules';
import { STATUSES } from '../../modules/component';

export function watch(observeFields: string[] | string) {
	return function<T extends Component & IDictionary>(
		target: T,
		propertyKey: string
	) {
		if (!isFunction(target[propertyKey])) {
			return;
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
