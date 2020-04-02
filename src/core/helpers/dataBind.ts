/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const dataBindKey = 'JoditDataBindKey';

export const dataBind = (elm: any, key: string, value?: any) => {
	let store = elm[dataBindKey];

	if (!store) {
		store = {};
		Object.defineProperty(elm, dataBindKey, {
			enumerable: false,
			configurable: true,
			value: store
		});
	}

	if (value === undefined) {
		return store[key];
	}

	store[key] = value;
};
