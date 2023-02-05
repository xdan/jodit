/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, IDictionary } from 'jodit/types';

import 'classlist-polyfill';
import 'es6-promise/auto';
import 'core-js/es/symbol';
import 'core-js/es/array/find-index';
import 'core-js/es/array/from';

// for ie11
if (!Array.prototype.includes) {
	Array.prototype.includes = function (value: any): boolean {
		return this.indexOf(value) > -1;
	};
}

// for ie11
if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, 'assign', {
		value: function assign(target: IDictionary, varArgs: IDictionary) {
			// .length of function is 2
			if (target == null) {
				throw new TypeError(
					'Cannot convert undefined or null to object'
				);
			}

			const to = Object(target);

			for (let index = 1; index < arguments.length; index++) {
				// eslint-disable-next-line prefer-rest-params
				const nextSource = arguments[index];

				if (nextSource != null) {
					for (const nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (
							Object.prototype.hasOwnProperty.call(
								nextSource,
								nextKey
							)
						) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

if (!Array.prototype.find) {
	Array.prototype.find = function <T>(value: T): CanUndef<T> {
		return this.indexOf(value) > -1 ? value : undefined;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (value: any): boolean {
		return this[this.length - 1] === value;
	};
}
