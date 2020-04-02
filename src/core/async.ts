/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	CallbackFunction,
	IAsync,
	IAsyncParams
} from '../types';
import { setTimeout, clearTimeout } from './helpers/async';

export class Async implements IAsync {
	private timers: Map<number | string | Function, number> = new Map();

	setTimeout(
		callback: (...args: any[]) => void,
		timeout: number | IAsyncParams,
		...args: any[]
	): number {
		let options: IAsyncParams = {};

		if (typeof timeout !== 'number') {
			options = timeout;
			timeout = options.timeout || 0;
		}

		if (options.label && this.timers.has(options.label)) {
			clearTimeout(this.timers.get(options.label) as number);
			this.timers.delete(options.label);
		}

		const timer = setTimeout(callback, timeout, ...args),
			key = options.label || timer;

		this.timers.set(key, timer);

		return timer;
	}

	clearTimeout(timer: number): void {
		clearTimeout(timer);

		this.timers.delete(timer);
	}

	/**
	 * Debouncing enforces that a function not be called again until a certain amount of time has passed without
	 * it being called. As in "execute this function only if 100 milliseconds have passed without it being called."
	 *
	 * @param {function} fn
	 * @param {int} timeout
	 * @return {function}
	 *
	 * @example
	 * ```javascript
	 * var jodit = new Jodit('.editor');
	 *	jodit.events.on('mousemove', jodit.async.debounce(function() {
	 *     // Do expensive things
	 * }, 100));
	 * ```
	 *
	 * @param fn
	 * @param timeout
	 */
	debounce(
		fn: CallbackFunction,
		timeout: number
	): CallbackFunction {
		let timer: number = 0, lastArgs: any[];

		return (...args: any[]) => {
			lastArgs = args;

			if (!timeout) {
				fn(...lastArgs);
			} else {
				clearTimeout(timer);
				timer = this.setTimeout(() => fn(...lastArgs), timeout);
				this.timers.set(fn, timer);
			}
		};
	}

	/**
	 * Throttling enforces a maximum number of times a function can be called over time.
	 * As in "execute this function at most once every 100 milliseconds."
	 *
	 * @method throttle
	 * @param {function} fn
	 * @param {int} timeout
	 * @param {context} [ctx] Context
	 * @return {function}
	 * @example
	 * ```javascript
	 * var jodit = new Jodit('.editor');
	 * jodit.events.on(document.body, 'scroll', jodit.async.throttle(function() {
	 *     // Do expensive things
	 * }, 100));
	 * ```
	 */
	throttle(
		fn: CallbackFunction,
		timeout: number,
	): CallbackFunction {
		let timer: number | null = null,
			needInvoke: boolean,
			callee: () => void,
			lastArgs: any[];

		return (...args: any[]) => {
			needInvoke = true;
			lastArgs = args;

			if (!timeout) {
				fn(...lastArgs);
				return;
			}

			if (!timer) {
				callee = () => {
					if (needInvoke) {
						fn(...lastArgs);
						needInvoke = false;
						timer = this.setTimeout(callee, timeout);
						this.timers.set(callee, timer);
					} else {
						timer = null;
					}
				};

				callee();
			}
		};
	};


	private promisesRejections: Set<Function> = new Set();

	promise<T>(
		executor: (
			resolve: (value?: T | PromiseLike<T>) => void,
			reject?: (reason?: any) => void
		) => void
	): Promise<T> {
		let rejectCallback: Function = () => {};

		const promise = new Promise<T>((resolve, reject) => {
			this.promisesRejections.add(reject);
			rejectCallback = reject;
			return executor(resolve, reject);
		});

		promise.finally(() => {
			this.promisesRejections.delete(rejectCallback);
		});

		return promise;
	}

	/**
	 * Get Promise status
	 * @param p
	 */
	promiseState(
		p: Promise<any>
	): Promise<'pending' | 'fulfilled' | 'rejected'> {
		if ((p as any).status) {
			return (p as any).status;
		}

		// Hi IE11
		if (!Promise.race) {
			return new Promise(resolve => {
				p.then(
					v => {
						resolve('fulfilled');
						return v;
					},
					e => {
						resolve('rejected');
						throw e;
					}
				);

				this.setTimeout(() => {
					resolve('pending');
				}, 100);
			});
		}

		const t = {};

		return Promise.race([p, t]).then(
			v => (v === t ? 'pending' : 'fulfilled'),
			() => 'rejected'
		);
	}

	clear(): void {
		this.timers.forEach(key => {
			clearTimeout(this.timers.get(key) as number);
		});

		this.timers.clear();

		this.promisesRejections.forEach(reject => {
			reject();
		});
		this.promisesRejections.clear();
	}

	destruct(): any {
		this.clear();
	}
}
