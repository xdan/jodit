/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export type StorageValueType =
	| string
	| number
	| boolean
	| object
	| StorageValueType[];

export interface IStorage<T = StorageValueType> {
	set(key: string, value: T): void;
	delete(key: string): void;
	get<R = T>(key: string): R | void;
	exists(key: string): boolean;
	clear(): void;
}
