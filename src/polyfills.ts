/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import 'classlist-polyfill';
import 'es6-promise/auto';

((e: Element) => {
	e.matches ||
		(e.matches =
			(e as any).matchesSelector !== undefined
				? (e as any).matchesSelector
				: function(this: Element, selector: string) {
						if (!this.ownerDocument) {
							return [];
						}

						const matches: NodeList | null = this.ownerDocument.querySelectorAll(
								selector
							),
							th = this;

						return Array.prototype.some.call(
							matches,
							(elm: Element) => {
								return elm === th;
							}
						);
				  });
})(Element.prototype);

if (!Array.from) {
	Array.from = <T>(object: T[]): T[] => {
		'use strict';
		return [].slice.call(object);
	};
}

// for ie11
if (!Array.prototype.includes) {
	Array.prototype.includes = function (value: any) {
		return this.indexOf(value) > -1;
	}
}

if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target:any, varArgs:any) { // .length of function is 2
		'use strict';
		if (target == null) { // TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];

			if (nextSource != null) { // Skip over if undefined or null
			for (var nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
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
