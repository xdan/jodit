/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module event-emitter
 */

import type {
	CallbackFunction,
	EventHandlerBlock,
	IDictionary
} from 'jodit/types';
import { assert } from 'jodit/core/helpers/utils/assert';
import { toArray } from 'jodit/core/helpers/array/to-array';

export const defaultNameSpace = 'JoditEventDefaultNamespace';

export class EventHandlersStore {
	private __store: Map<string, IDictionary<EventHandlerBlock[]>> = new Map();

	get(event: string, namespace: string): EventHandlerBlock[] | void {
		if (this.__store.has(namespace)) {
			const ns = this.__store.get(namespace);
			assert(ns, '-');
			return ns[event];
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
		const nss = toArray(this.__store.keys());
		return withoutDefault ? nss.filter(ns => ns !== defaultNameSpace) : nss;
	}

	events(namespace: string): string[] {
		const ns = this.__store.get(namespace);
		return ns ? Object.keys(ns) : [];
	}

	set(
		event: string,
		namespace: string,
		data: EventHandlerBlock,
		onTop: boolean = false
	): void {
		let ns = this.__store.get(namespace);
		if (!ns) {
			ns = {};
			this.__store.set(namespace, ns);
		}

		if (ns[event] === undefined) {
			ns[event] = [];
		}

		if (!onTop) {
			ns[event].push(data);
		} else {
			ns[event].unshift(data);
		}
	}

	clear(): void {
		this.__store.clear();
	}

	clearEvents(namespace: string, event: string): void {
		const ns = this.__store.get(namespace);

		if (ns && ns[event]) {
			delete ns[event];

			if (!Object.keys(ns).length) {
				this.__store.delete(namespace);
			}
		}
	}

	isEmpty(): boolean {
		return this.__store.size === 0;
	}
}
