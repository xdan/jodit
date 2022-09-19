import type { IDestructible } from './types';

export type MessageVariant = 'info' | 'error' | 'success';

export interface IMessages extends IDestructible {
	info(text: string, timeout?: number): void;
	success(text: string, timeout?: number): void;
	error(text: string, timeout?: number): void;
	message(text: string, variant?: MessageVariant, timeout?: number): void;
}
