/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CallbackFunction, CanUndef, IDictionary } from '../../types';
import { isPlainObject, isFastEqual, isArray } from '../helpers';
import { nonenumerable } from '../decorators';

export class ObserveObject {
	@nonenumerable
	private __data!: IDictionary;

	@nonenumerable
	private __prefix!: string[];

	@nonenumerable
	private __onEvents!: IDictionary<CallbackFunction[]>;

	protected constructor(
		data: IDictionary,
		prefix: string[] = [],
		onEvents: IDictionary<CallbackFunction[]> = {}
	) {
		this.__data = data;
		this.__prefix = prefix;
		this.__onEvents = onEvents;

		Object.keys(data).forEach(key => {
			const prefix = this.__prefix.concat(key).filter(a => a.length);

			Object.defineProperty(this, key, {
				set: (value: CanUndef<unknown>) => {
					const oldValue = data[key];

					if (!isFastEqual(oldValue, value)) {
						this.fire(
							[
								'beforeChange',
								`beforeChange.${prefix.join('.')}`
							],
							key,
							value
						);

						if (isPlainObject(value)) {
							value = new ObserveObject(
								value,
								prefix,
								this.__onEvents
							);
						}

						data[key] = value;

						const sum: string[] = [];

						this.fire(
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
					return data[key];
				},
				enumerable: true,
				configurable: true
			});

			if (isPlainObject(data[key])) {
				data[key] = new ObserveObject(
					data[key],
					prefix,
					this.__onEvents
				);
			}
		});
	}

	valueOf(): any {
		return this.__data;
	}

	toString(): string {
		return JSON.stringify(this.valueOf());
	}

	/**
	 * Add listener on some changes
	 * @param event
	 * @param callback
	 */
	on(event: string | string[], callback: CallbackFunction): this {
		if (isArray(event)) {
			event.map(e => this.on(e, callback));
			return this;
		}

		if (!this.__onEvents[event]) {
			this.__onEvents[event] = [];
		}

		this.__onEvents[event].push(callback);

		return this;
	}

	@nonenumerable
	private __lockEvent: IDictionary<boolean> = {};

	fire(event: string | string[], ...attr: any[]): void {
		if (isArray(event)) {
			event.map(e => this.fire(e, ...attr));
			return;
		}

		try {
			if (!this.__lockEvent[event] && this.__onEvents[event]) {
				this.__lockEvent[event] = true;
				this.__onEvents[event].forEach(clb => clb.call(this, ...attr));
			}
		} finally {
			this.__lockEvent[event] = false;
		}
	}

	static create<T, K extends T & ObserveObject = T & ObserveObject>(
		data: T,
		prefix: string[] = []
	): K {
		if (data instanceof ObserveObject) {
			return data as any;
		}

		return new ObserveObject(data, prefix) as any;
	}
}
