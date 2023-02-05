/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IEventEmitter, IViewComponent, Nullable } from 'jodit/types';
import { isViewObject } from '../checker/is-view-object';

const store = new WeakMap();

export const dataBind = <T = any>(
	elm: IViewComponent | Node | object,
	key: string,
	value?: T
): T => {
	let itemStore = store.get(elm);

	if (!itemStore) {
		itemStore = {};
		store.set(elm, itemStore);

		let e: Nullable<IEventEmitter> = null;

		if (isViewObject((elm as IViewComponent).j)) {
			e = (elm as IViewComponent).j.e;
		}

		if (isViewObject(elm)) {
			e = elm.e;
		}

		e &&
			e.on('beforeDestruct', () => {
				store.delete(elm);
			});
	}

	if (value === undefined) {
		return itemStore[key];
	}

	itemStore[key] = value;

	return value;
};
