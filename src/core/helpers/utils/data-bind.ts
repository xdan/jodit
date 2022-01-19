/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IEventEmitter, IViewComponent, Nullable } from 'jodit/types';
import { ViewComponent } from 'jodit/core/component';
import { isViewObject } from '../checker';

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

		if (elm instanceof ViewComponent) {
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
