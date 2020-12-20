/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CallbackFunction,
	IAsync,
	IAsyncParams,
	ITimeout
} from '../types';
import { setTimeout, clearTimeout, isFunction } from './helpers/';

export class Async implements IAsync {
	private timers: Map<number | string | Function, number> = new Map();

	setTimeout(
		callback: (...args: any[]) => void,
		timeout: number | IAsyncParams,
		...args: any[]
	): number {
		if (this.isDestructed) {
			return 0;
		}

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
	 *	jodit.e.on('mousemove', jodit.async.debounce(function() {
	 *     // Do expensive things
	 * }, 100));
	 * ```
	 *
	 * @param fn
	 * @param timeout
	 * @param firstCallImmediately
	 */
	debounce(
		fn: CallbackFunction,
		timeout: ITimeout,
		firstCallImmediately: boolean = false
	): CallbackFunction {
		let timer: number = 0,
			fired: boolean = false;

		const callFn = (...args: any[]) => {
			if (!fired) {
				timer = 0;
				fn(...args);
				fired = true;
			}
		};

		return (...args: any[]) => {
			fired = false;

			if (!timeout) {
				callFn(...args);
			} else {
				if (!timer && firstCallImmediately) {
					callFn(...args);
				}

				clearTimeout(timer);
				timer = this.setTimeout(
					() => callFn(...args),
					isFunction(timeout) ? timeout() : timeout
				);
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
	 * jodit.e.on(document.body, 'scroll', jodit.async.throttle(function() {
	 *     // Do expensive things
	 * }, 100));
	 * ```
	 */
	throttle(fn: CallbackFunction, timeout: ITimeout): CallbackFunction {
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
						timer = this.setTimeout(
							callee,
							isFunction(timeout) ? timeout() : timeout
						);
						this.timers.set(callee, timer);
					} else {
						timer = null;
					}
				};

				callee();
			}
		};
	}

	private promisesRejections: Set<Function> = new Set();

	promise<T>(
		executor: (
			resolve: (value: T | PromiseLike<T>) => void,
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

	private requestsIdle: Set<number> = new Set();

	private requestIdleCallbackNative =
		(window as any)['requestIdleCallback']?.bind(window) ??
		((callback: CallbackFunction): number => {
			const start = Date.now();

			return this.setTimeout(() => {
				callback({
					didTimeout: false,
					timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
				});
			}, 1);
		});

	private cancelIdleCallbackNative =
		(window as any)['cancelIdleCallback']?.bind(window) ??
		((request: number): void => {
			this.clearTimeout(request);
		});

	requestIdleCallback(callback: CallbackFunction): number {
		const request = this.requestIdleCallbackNative(callback);
		this.requestsIdle.add(request);
		return request;
	}

	cancelIdleCallback(request: number): void  {
		this.requestsIdle.delete(request);
		return this.cancelIdleCallbackNative(request);
	}

	clear(): void {
		this.requestsIdle.forEach(key => {
			this.cancelIdleCallback(key);
		});

		this.timers.forEach(key => {
			clearTimeout(this.timers.get(key) as number);
		});

		this.timers.clear();

		this.promisesRejections.forEach(reject => {
			reject();
		});
		this.promisesRejections.clear();
	}

	isDestructed: boolean = false;
	destruct(): any {
		this.clear();
		this.isDestructed = true;
	}
}
