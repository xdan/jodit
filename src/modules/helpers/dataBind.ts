/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

const dataBindKey = 'JoditDataBindKey';

export const dataBind = (elm: any, key: string, value?: any) => {
    let store = elm[dataBindKey];

    if (!store) {
        store = {};
        Object.defineProperty(elm, dataBindKey, {
            enumerable: false,
            configurable: true,
            value: store,
        });
    }

    if (value === undefined) {
        return store[key];
    }

    store[key] = value;
};
