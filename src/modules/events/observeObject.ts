/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

import { CallbackFunction, IDictionary } from '../../types';

export class ObserveObject {
	protected constructor(readonly data: IDictionary) {
		Object.keys(data).forEach((key) => {
			Object.defineProperty(this, key, {
				set: (value) => {
					this.fire(['beforeChange', `beforeChange.${key}`], key, value);
					data[key] = value;
					this.fire(['change', `change.${key}`], key, value);
				},
				get: () => {
					return data[key];
				}
			})
		});
	}

	private __onEvents: IDictionary<CallbackFunction[]> = {};

	on(event: string | string[], callback: CallbackFunction): ObserveObject {
		if (Array.isArray(event)) {
			event.map((e) => this.on(e, callback));
			return this;
		}

		if (!this.__onEvents[event]) {
			this.__onEvents[event] = [];
		}

		this.__onEvents[event].push(callback);

		return this;
	}

	private __lockEvent: IDictionary<boolean> = {};

	private fire(event: string | string[], ...attr: any[]) {
		if (Array.isArray(event)) {
			event.map((e) => this.fire(e, ...attr));
			return;
		}

		try {
			if (!this.__lockEvent[event] && this.__onEvents[event]) {
				this.__lockEvent[event] = true;
				this.__onEvents[event].forEach(clb => clb.call(this, ...attr));
			}
		} catch {} finally {
			this.__lockEvent[event] = false;
		}
	}

	static create<T, K extends T & ObserveObject = T & ObserveObject>(data: T): K {
		return (new ObserveObject(data)) as any;
	}
}
