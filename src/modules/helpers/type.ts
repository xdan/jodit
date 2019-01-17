/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IDictionary } from '../../types';

const class2type: IDictionary<string> = {};
const toString = class2type.toString;
export const hasOwn = class2type.hasOwnProperty;

[
    'Boolean',
    'Number',
    'String',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Object',
    'Error',
    'Symbol',
    'HTMLDocument',
    'Window',
    'HTMLElement',
    'HTMLBodyElement',
    'Text',
    'DocumentFragment',
    'DOMStringList',
    'HTMLCollection',
].forEach(name => {
    class2type['[object ' + name + ']'] = name.toLowerCase();
});

/**
 * Get name object's type
 * @param obj
 */
export const type = (obj: any): string => {
    if (obj === null) {
        return 'null';
    }

    return typeof obj === 'object' || typeof obj === 'function'
        ? class2type[toString.call(obj)] || 'object'
        : typeof obj;
};
