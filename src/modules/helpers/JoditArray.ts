/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { extend } from './extend';

export class JoditArray {
	public length: number = 0;
	public toString() {
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
