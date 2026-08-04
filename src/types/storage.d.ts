/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

export type StorageValueType =
	string | number | boolean | object | StorageValueType[];

export interface IStorage<T = StorageValueType> {
	set(key: string, value: T): this;
	delete(key: string): this;
	get<R = T>(key: string): R | void;
	exists(key: string): boolean;
	clear(): this;
}

export interface IAsyncStorage<T = StorageValueType> {
	set(key: string, value: T): Promise<this>;
	delete(key: string): Promise<this>;
	get<R = T>(key: string): Promise<R | void>;
	exists(key: string): Promise<boolean>;
	clear(): Promise<this>;
	close(): Promise<void>;
}

/**
 * Which provider should back an {@link IAsyncStorage} created by
 * `AsyncStorage.makeStorage`:
 * - `'local'` — use `localStorage` (falls back to memory if it is blocked);
 * - `'memory'` — use an in-memory store (nothing survives a page reload);
 * - a custom {@link IAsyncStorage} implementation — use it as-is.
 */
export type AsyncStorageDefaultProvider = 'local' | 'memory' | IAsyncStorage;

export interface IAsyncStorageOptions {
	/**
	 * Overrides the provider that backs the storage. When omitted the storage
	 * behaves as before — persistent `IndexedDB` with an in-memory fallback.
	 */
	defaultProvider?: AsyncStorageDefaultProvider;
}
