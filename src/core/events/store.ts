/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CallbackFunction,
	EventHandlerBlock,
	IDictionary
} from '../../types';

export const defaultNameSpace = 'JoditEventDefaultNamespace';

export class EventHandlersStore {
	private __store: IDictionary<IDictionary<EventHandlerBlock[]>> = {};

	get(event: string, namespace: string): EventHandlerBlock[] | void {
		if (this.__store[namespace] !== undefined) {
			return this.__store[namespace][event];
		}
	}

	indexOf(
		event: string,
		namespace: string,
		originalCallback: CallbackFunction
	): false | number {
		const blocks: EventHandlerBlock[] | void = this.get(event, namespace);

		if (blocks) {
			for (let i = 0; i < blocks.length; i += 1) {
				if (blocks[i].originalCallback === originalCallback) {
					return i;
				}
			}
		}

		return false;
	}

	namespaces(withoutDefault: boolean = false): string[] {
		const nss = Object.keys(this.__store);
		return withoutDefault ? nss.filter(ns => ns !== defaultNameSpace) : nss;
	}

	events(namespace: string): string[] {
		return this.__store[namespace]
			? Object.keys(this.__store[namespace])
			: [];
	}

	set(
		event: string,
		namespace: string,
		data: EventHandlerBlock,
		onTop: boolean = false
	): void {
		if (this.__store[namespace] === undefined) {
			this.__store[namespace] = {};
		}

		if (this.__store[namespace][event] === undefined) {
			this.__store[namespace][event] = [];
		}

		if (!onTop) {
			this.__store[namespace][event].push(data);
		} else {
			this.__store[namespace][event].unshift(data);
		}
	}

	clear(): void {
		this.__store = {};
	}
}
