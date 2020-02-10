/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { extend } from './extend';

export class JoditArray {
	length: number = 0;

	toString() {
		const out = [];

		for (let i = 0; i < this.length; i += 1) {
			out[i] = (this as any)[i];
		}

		return out.toString();
	}

	constructor(data: any[]) {
		extend(true, this, data);
		this.length = data.length;
		const proto: any = Array.prototype as any;
		[
			'map',
			'forEach',
			'reduce',
			'push',
			'pop',
			'shift',
			'unshift',
			'slice',
			'splice'
		].forEach((method: string) => {
			(this as any)[method] = proto[method];
		});
	}
}
