/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IAsync, IAsyncParams, IDictionary } from '../types';
import { setTimeout } from './helpers/async';

export class Async implements IAsync {
	private timers: IDictionary<number> = {};

	setTimeout<T = any>(callback: (...args: T[]) => void, timeout: number | IAsyncParams, ...args: T[]): number {
		let options: IAsyncParams = {};

		if (typeof timeout !== 'number') {
			options = timeout;
			timeout = options.timeout || 0;
		}

		if (options.label && this.timers[options.label]) {
			this.clearTimeout(this.timers[options.label]);
			delete this.timers[options.label];
		}

		const
			timer = setTimeout(callback, timeout, ...args),
			key = options.label || timer;

		this.timers[key.toString()] = timer;

		return timer;
	}

	clearTimeout(timer: number): void {
		clearTimeout(timer);

		if (this.timers[timer]) {
			delete this.timers[timer];
		}
	}

	destruct(): any {
		Object.keys(this.timers).forEach((key) => {
			this.clearTimeout(this.timers[key]);
		});
	}
}
