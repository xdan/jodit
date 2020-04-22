/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Component } from '../component';

const store = new WeakMap();

/**
 *
 * @param elm
 * @param key
 * @param value
 */
export const dataBind = <T = any>(elm: object, key: string, value?: T): T => {
	let itemStore = store.get(elm);

	if (!itemStore) {
		itemStore = {};
		store.set(elm, itemStore);

		if (elm instanceof Component) {
			elm?.j?.e?.on('beforeDestruct', () => {
				store.delete(elm);
			});
		}
	}

	if (value === undefined) {
		return itemStore[key];
	}

	itemStore[key] = value;

	return value;
};
