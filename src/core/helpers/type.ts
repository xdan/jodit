/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from '../../types';

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
	'HTMLCollection'
].forEach(name => {
	class2type['[object ' + name + ']'] = name.toLowerCase();
});

/**
 * Get name object's type
 * @param obj
 */
export const type = (obj: any): string => {
	// eslint-disable-next-line eqeqeq
	if (obj === null) {
		return 'null';
	}

	return typeof obj === 'object' || typeof obj === 'function'
		? class2type[toString.call(obj)] || 'object'
		: typeof obj;
};

/**
 * Helper for create Error object
 * @param message
 */
export function error(message: string): Error {
	return new TypeError(message);
}
