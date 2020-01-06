/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IAsync, IAsyncParams } from '../types';
import { setTimeout } from './helpers/async';

export class Async implements IAsync {
	private timers: Map<number | string, number> = new Map();

	setTimeout<T = any>(callback: (...args: T[]) => void, timeout: number | IAsyncParams, ...args: T[]): number {
		let options: IAsyncParams = {};

		if (typeof timeout !== 'number') {
			options = timeout;
			timeout = options.timeout || 0;
		}

		if (options.label && this.timers.has(options.label)) {
			this.clearTimeout(this.timers.get(options.label) as number);
			this.timers.delete(options.label);
		}

		const
			timer = setTimeout(callback, timeout, ...args),
			key = options.label || timer;

		this.timers.set(key, timer);

		return timer;
	}

	clearTimeout(timer: number): void {
		clearTimeout(timer);

		this.timers.delete(timer);
	}

	private promisesRejections: Set<Function> = new Set();

	promise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
		let rejectCallback: Function = () => {};

		const promise = new Promise<T>((resolve, reject) => {
			this.promisesRejections.add(reject);
			rejectCallback = reject;
			return executor(resolve, reject);
		});

		promise.finally(() => {
			this.promisesRejections.delete(rejectCallback)
		});

		return promise;
	}

	clear(): void {
		this.timers.forEach((key) => {
			this.clearTimeout(this.timers.get(key) as number);
		});
		this.timers.clear();

		this.promisesRejections.forEach((reject) => {
			reject();
		});
		this.promisesRejections.clear();
	}

	destruct(): any {
		this.clear();
	}
}
