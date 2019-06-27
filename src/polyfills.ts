/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
