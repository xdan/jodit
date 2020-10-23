/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';
import { extend } from './extend';

/**
 * Class wrapper for standard Array
 * You should not use this class in your code, only for options
 * @example
 * ```js
 * new Jodit('#editor', {
 *   buttons: Jodit.Array(['bold', 'italic'])
 * });
 * ```
 */
// @ts-ignore
export class JoditArray<T extends unknown = unknown> implements Array<T> {
	constructor(data: T[]) {
		extend(true, this, data);

		const proto = Array.prototype,
			self = this,
			methods: IDictionary<Function> = {
				pop(): T | undefined {
					return data.pop();
				},

				push(...items: T[]): number {
					return data.push(...items);
				},

				concat(...args: Parameters<typeof proto.concat>): JoditArray {
					return new JoditArray(data.concat(...args));
				},

				every(
					...args: Parameters<typeof proto.every>
				): ReturnType<typeof proto.every> {
					return data.every(...args);
				},

				fill(value: T, start?: number, end?: number): JoditArray {
					data.fill(value, start, end);
					return self;
				},

				filter(
					...args: Parameters<typeof proto.filter>
				): JoditArray<T> {
					return new JoditArray<T>(data.filter(...args));
				},

				forEach(...args: Parameters<typeof proto.forEach>): void {
					return data.forEach(...args);
				},

				includes(searchElement: T, fromIndex?: number): boolean {
					return data.includes(searchElement, fromIndex);
				},

				indexOf(searchElement: T, fromIndex?: number): number {
					return data.indexOf(searchElement, fromIndex);
				},

				lastIndexOf(searchElement: T, fromIndex?: number): number {
					return data.lastIndexOf(searchElement, fromIndex);
				},

				map<U>(...args: Parameters<(typeof proto.map)>): JoditArray<U> {
					// @ts-ignore
					return new JoditArray<U>(data.map(...args));
				},

				reduce(...args: Parameters<typeof proto.reduce>) {
					return data.reduce(...args);
				},

				reverse(): JoditArray {
					return new JoditArray([...data].reverse());
				},

				shift(): T | undefined {
					return data.shift();
				},

				slice(start?: number, end?: number): JoditArray {
					return new JoditArray(data.slice(start, end));
				},

				some(...args: Parameters<typeof proto.some>): boolean {
					return data.some(...args);
				},

				sort(compareFn?: (a: T, b: T) => number): JoditArray {
					data.sort(compareFn);
					extend(true, this, data);
					return self;
				},

				splice(start: number, deleteCount?: number): JoditArray {
					return new JoditArray(data.splice(start, deleteCount));
				},

				unshift(...items: T[]): number {
					return data.unshift(...items);
				},

				toString(): string {
					return data.toString();
				}
			};

		Object.keys(methods).forEach(key => {
			Object.defineProperty(this, key, {
				value: methods[key],
				enumerable: false,
				configurable: false
			});
		});

		Object.defineProperty(this, 'length', {
			get: () => data.length,
			set: (value: number): void => {
				data.length = value;
			},
			enumerable: false,
			configurable: false
		});

		Object.defineProperty(
			this,
			Symbol.iterator,
			{
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				...Object.getOwnPropertyDescriptor(proto, "values")!,
				value: () => data.values()
			},
		)
	}
}
