/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module event-emitter
 */

import type {
	CanUndef,
	IObservable,
	CallbackFunction,
	IDictionary
} from 'jodit/types';
import { isArray, isFastEqual, isPlainObject } from 'jodit/core/helpers';
import { getPropertyDescriptor } from 'jodit/core/decorators';

const OBSERVABLE_OBJECT = Symbol('observable-object');

function isObservableObject<T extends Record<string | symbol, any>>(
	obj: T
): obj is T & IObservable {
	return obj[OBSERVABLE_OBJECT] !== undefined;
}

/**
 * Makes any object an observable object
 * @example
 * ```js
 * const obj = {
 *   a: 1,
 *   b: {
 *     c: 5
 *   }
 * }
 *
 * const obsObj = Jodit.modules.observable(obj);
 * console.log(obj === obsObj); // true
 * obsObj.on('change', () => {
 *   console.log('Object changed');
 * });
 * obsObj.on('change.a', () => {
 *   console.log('Key a changed');
 * });
 * obsObj.on('change.b.c', () => {
 *   console.log('Key b.c changed');
 * });
 *
 * obj.a = 6;
 * // Object changed
 * // Key a changed
 *
 * obj.b = {c: 6}
 * // Object changed
 *
 * obj.b.c = 8
 * // Object changed
 * // Key b.c changed
 * ```
 */
export function observable<T extends IDictionary, O extends T & IObservable>(
	obj: T
): O {
	if (isObservableObject(obj)) {
		return obj as O;
	}

	const __lockEvent: IDictionary<boolean> = {};
	const __onEvents: IDictionary<CallbackFunction[]> = {};

	const on = (event: string | string[], callback: CallbackFunction): O => {
		if (isArray(event)) {
			event.map(e => on(e, callback));
			return obj as O;
		}

		if (!__onEvents[event]) {
			__onEvents[event] = [];
		}

		__onEvents[event].push(callback);

		return obj as O;
	};

	const fire = (event: string | string[], ...attr: any[]): void => {
		if (isArray(event)) {
			event.map(e => fire(e, ...attr));
			return;
		}

		try {
			if (!__lockEvent[event] && __onEvents[event]) {
				__lockEvent[event] = true;
				__onEvents[event].forEach(clb => clb.call(obj, ...attr));
			}
		} finally {
			__lockEvent[event] = false;
		}
	};

	const initAccessors = <K extends IDictionary>(
		dict: K,
		prefixes: string[] = []
	): void => {
		const store = {} as K;

		if (isObservableObject(dict)) {
			return;
		}

		Object.defineProperty(dict, OBSERVABLE_OBJECT, {
			enumerable: false,
			value: true
		});

		Object.keys(dict).forEach(_key => {
			const key = _key as keyof T & string;
			const prefix = prefixes.concat(key).filter(a => a.length);
			store[key] = dict[key];

			const descriptor = getPropertyDescriptor(dict, key);

			Object.defineProperty(dict, key, {
				set: (value: CanUndef<unknown>) => {
					const oldValue = store[key];
					if (!isFastEqual(store[key], value)) {
						fire(
							[
								'beforeChange',
								`beforeChange.${prefix.join('.')}`
							],
							key,
							value
						);

						if (isPlainObject(value)) {
							initAccessors(value, prefix);
						}

						if (descriptor && descriptor.set) {
							descriptor.set.call(obj, value);
						} else {
							store[key] = value as any;
						}

						const sum: string[] = [];

						fire(
							[
								'change',
								...prefix.reduce((rs, p) => {
									sum.push(p);
									rs.push(`change.${sum.join('.')}`);
									return rs;
								}, [] as string[])
							],
							prefix.join('.'),
							oldValue,
							(value as any)?.valueOf
								? (value as any).valueOf()
								: value
						);
					}
				},
				get: () => {
					if (descriptor && descriptor.get) {
						return descriptor.get.call(obj);
					}

					return store[key];
				},
				enumerable: true,
				configurable: true
			});

			if (isPlainObject(store[key])) {
				initAccessors(store[key], prefix);
			}
		});

		Object.defineProperty(obj, 'on', {
			value: on
		});
	};

	initAccessors(obj);

	return obj as O;
}
