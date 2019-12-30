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
}
