/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/async/README.md]]
 * @packageDocumentation
 * @module async
 */

import type {
	CallbackFunction,
	IAsync,
	IAsyncParams,
	ITimeout,
	Nullable,
	RejectablePromise
} from 'jodit/types';
import { setTimeout, clearTimeout } from 'jodit/core/helpers/async';

import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { isPlainObject } from 'jodit/core/helpers/checker/is-plain-object';
import { isPromise } from 'jodit/core/helpers/checker/is-promise';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { isNumber } from 'jodit/core/helpers/checker/is-number';
import { assert } from 'jodit/core/helpers/utils/assert';

type Callback = (...args: any[]) => void;

export class Async implements IAsync {
	private timers: Map<number | string | Function, number> = new Map();
	private __callbacks: Map<number | string, Callback> = new Map();

	delay(timeout: number | IAsyncParams): RejectablePromise<void> {
		return this.promise(resolve => this.setTimeout(resolve, timeout));
	}

	setTimeout(
		callback: Callback,
		timeout: number | IAsyncParams,
		...args: any[]
	): number {
		if (this.isDestructed) {
			return 0;
		}

		let options: IAsyncParams = {};

		if (!isNumber(timeout)) {
			options = timeout;
			timeout = options.timeout || 0;
		}

		if (options.label) {
			this.clearLabel(options.label);
		}

		const timer = setTimeout(callback, timeout, ...args),
			key = options.label || timer;

		this.timers.set(key, timer);
		this.__callbacks.set(key, callback);

		return timer;
	}

	updateTimeout(label: string, timeout: number): Nullable<number> {
		assert(label && this.timers.has(label), 'Label does not exist');

		if (!label || !this.timers.has(label)) {
			return null;
		}

		const callback = this.__callbacks.get(label);
		assert(isFunction(callback), 'Callback is not a function');
		return this.setTimeout(callback, { label, timeout });
	}

	private clearLabel(label: string): void {
		if (label && this.timers.has(label)) {
			clearTimeout(this.timers.get(label) as number);
			this.timers.delete(label);
			this.__callbacks.delete(label);
		}
	}

	clearTimeout(timer: number): void;
	clearTimeout(label: string): void;
	clearTimeout(timerOrLabel: number | string): void {
		if (isString(timerOrLabel)) {
			return this.clearLabel(timerOrLabel);
		}

		clearTimeout(timerOrLabel);
		this.timers.delete(timerOrLabel);
		this.__callbacks.delete(timerOrLabel);
	}

	/**
	 * Debouncing enforces that a function not be called again until a certain amount of time has passed without
	 * it being called. As in "execute this function only if 100 milliseconds have passed without it being called."
	 *
	 * @example
	 * ```javascript
	 * var jodit = Jodit.make('.editor');
	 * jodit.e.on('mousemove', jodit.async.debounce(() => {
	 * 	// Do expensive things
	 * }, 100));
	 * ```
	 */
	debounce(
		fn: CallbackFunction,
		timeout: ITimeout | IAsyncParams,
		firstCallImmediately: boolean = false
	): CallbackFunction {
		let timer: number = 0,
			fired: boolean = false;

		const promises: Function[] = [];

		const callFn = (...args: any[]): void => {
			if (!fired) {
				timer = 0;
				const res = fn(...args);
				fired = true;

				if (promises.length) {
					const runPromises = (): void => {
						promises.forEach(res => res());
						promises.length = 0;
					};

					isPromise(res) ? res.finally(runPromises) : runPromises();
				}
			}
		};

		const onFire = (...args: any[]): void => {
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

		return isPlainObject(timeout) && timeout.promisify
			? (...args: any[]): Promise<any> => {
					const promise = this.promise(res => {
						promises.push(res);
					});

					onFire(...args);

					return promise;
			  }
			: onFire;
	}

	/**
	 * Throttling enforces a maximum number of times a function can be called over time.
	 * As in "execute this function at most once every 100 milliseconds."
	 *
	 * @example
	 * ```javascript
	 * var jodit = Jodit.make('.editor');
	 * jodit.e.on(document.body, 'scroll', jodit.async.throttle(function() {
	 * 	// Do expensive things
	 * }, 100));
	 * ```
	 */
	throttle(
		fn: CallbackFunction,
		timeout: ITimeout | IAsyncParams,
		ignore: boolean = false
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
				callee = (): void => {
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
			reject: (reason?: any) => void
		) => void
	): RejectablePromise<T> {
		let rejectCallback: RejectablePromise<T>['rejectCallback'] = () => {};

		const promise = new Promise<T>((resolve, reject) => {
			this.promisesRejections.add(reject);
			rejectCallback = reject;
			return executor(resolve, reject);
		});

		if (!promise.finally && process.env.TARGET_ES !== 'es2018') {
			promise.finally = (
				onfinally?: (() => void) | undefined | null
			): Promise<T> => {
				promise.then(onfinally).catch(onfinally);
				return promise;
			};
		}

		promise
			.finally(() => {
				this.promisesRejections.delete(rejectCallback);
			})
			.catch(() => null);

		(promise as RejectablePromise<T>).rejectCallback = rejectCallback;

		return promise as RejectablePromise<T>;
	}

	/**
	 * Get Promise status
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
	private requestsRaf: Set<number> = new Set();

	private requestIdleCallbackNative =
		(window as any)['requestIdleCallback']?.bind(window) ??
		((
			callback: IdleRequestCallback,
			options?: { timeout: number }
		): number => {
			const start = Date.now();

			return this.setTimeout(() => {
				callback({
					didTimeout: false,
					timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
				});
			}, options?.timeout ?? 1);
		});

	private cancelIdleCallbackNative =
		(window as any)['cancelIdleCallback']?.bind(window) ??
		((request: number): void => {
			this.clearTimeout(request);
		});

	requestIdleCallback(
		callback: IdleRequestCallback,
		options?: { timeout: number }
	): number {
		const request = this.requestIdleCallbackNative(callback, options);
		this.requestsIdle.add(request);
		return request;
	}

	requestIdlePromise(options?: {
		timeout: number;
	}): RejectablePromise<number> {
		return this.promise<number>(res => {
			const request = this.requestIdleCallback(
				() => res(request),
				options
			);
		});
	}

	cancelIdleCallback(request: number): void {
		this.requestsIdle.delete(request);
		return this.cancelIdleCallbackNative(request);
	}

	requestAnimationFrame(callback: FrameRequestCallback): number {
		const request = requestAnimationFrame(callback);
		this.requestsRaf.add(request);
		return request;
	}

	cancelAnimationFrame(request: number): void {
		this.requestsRaf.delete(request);
		cancelAnimationFrame(request);
	}

	clear(): void {
		this.requestsIdle.forEach(key => this.cancelIdleCallback(key));
		this.requestsRaf.forEach(key => this.cancelAnimationFrame(key));

		this.timers.forEach(key =>
			clearTimeout(this.timers.get(key) as number)
		);

		this.timers.clear();
		this.promisesRejections.forEach(reject => reject());

		this.promisesRejections.clear();
	}

	isDestructed: boolean = false;

	destruct(): any {
		this.clear();
		this.isDestructed = true;
	}
}
