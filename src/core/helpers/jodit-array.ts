/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { extend } from './extend';

export class JoditArray {
	constructor(data: any[]) {
		extend(true, this, data);

		Object.defineProperty(this, 'length', {
			value: data.length,
			enumerable: false,
			configurable: false
		});

		Object.defineProperty(this, 'toString', {
			value: (): string => {
				const out: any[] = [];

				for (let i = 0; i < (this as any).length; i += 1) {
					out[i] = (this as any)[i];
				}

				return out.toString();
			},
			enumerable: false,
			configurable: false
		});

		const proto = Array.prototype as any;

		[
			'map',
			'forEach',
			'reduce',
			'push',
			'pop',
			'shift',
			'unshift',
			'slice',
			'splice',
			'concat'
		].forEach(method => {
			Object.defineProperty(this, method, {
				value: proto[method],
				enumerable: false,
				configurable: false
			});
		});
	}
}
