import { IDestructible } from './types';

export interface IAsyncParams {
	timeout?: number;
	label?: string;
}

export interface IAsync extends IDestructible {
	setTimeout<T = any>(
		callback: (...args: T[]) => void,
		timeout: number | IAsyncParams,
		...args: T[]
	): number;

	clearTimeout(timer: number): void;

	clear() : void;

	promise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject?: (reason?: any) => void) => void): Promise<T>;

	promiseState(p: Promise<any>): Promise<"pending" | "fulfilled" | "rejected">;
}
