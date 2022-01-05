/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { CallbackFunction, IDestructible } from './types';

export type ITimeout = number | (() => number);

export interface IAsyncParams {
	timeout?: number;
	label?: string;
	promisify?: boolean;
}

interface RejectablePromise<T> extends Promise<T> {
	rejectCallback: (reason?: any) => void;
	finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

export interface IAsync extends IDestructible {
	delay(timeout: number | IAsyncParams): Promise<void>;

	setTimeout<T = any>(
		callback: (...args: T[]) => void,
		timeout: number | IAsyncParams,
		...args: T[]
	): number;

	clearTimeout(timer: number): void;
	clearTimeout(label: string): void;
	clearTimeout(timerOrLabel: number | string): void;

	clear(): void;

	promise<T>(
		executor: (
			resolve: (value: T | PromiseLike<T>) => void,
			reject: (reason?: any) => void
		) => void
	): RejectablePromise<T>;

	promiseState(
		p: Promise<any>
	): Promise<'pending' | 'fulfilled' | 'rejected'>;

	debounce(
		fn: CallbackFunction,
		timeout: ITimeout | IAsyncParams,
		firstCallImmediately?: boolean
	): CallbackFunction;

	throttle(
		fn: CallbackFunction,
		timeout: ITimeout | IAsyncParams,
		firstCallImmediately?: boolean
	): CallbackFunction;

	requestIdleCallback(fn: IdleRequestCallback): number;
	requestIdlePromise(): RejectablePromise<number>;
	cancelIdleCallback(request: number): void;
}
