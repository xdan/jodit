/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module event-emitter
 */

import type {
	CallbackFunction,
	CanUndef,
	IDictionary,
	IObservable
} from 'jodit/types';
import { isPlainObject, isFastEqual, isArray } from 'jodit/core/helpers';
import { nonenumerable } from 'jodit/core/decorators';

export class ObservableObject implements IObservable {
	@nonenumerable
	private readonly __data!: IDictionary;

	@nonenumerable
	private __prefix!: string[];

	@nonenumerable
	private readonly __onEvents!: IDictionary<CallbackFunction[]>;

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
							value = new ObservableObject(
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
				data[key] = new ObservableObject(
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

	static create<T, K extends T & ObservableObject = T & ObservableObject>(
		data: T,
		prefix: string[] = []
	): K {
		if (data instanceof ObservableObject) {
			return data as any;
		}

		return new ObservableObject(data, prefix) as any;
	}
}
