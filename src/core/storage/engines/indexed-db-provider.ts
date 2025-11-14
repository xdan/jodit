/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module storage
 */

import type { IAsyncStorage, StorageValueType } from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';

/**
 * Persistent storage using IndexedDB
 */
export class IndexedDBProvider<T = StorageValueType>
	implements IAsyncStorage<T>
{
	private dbPromise: Promise<IDBDatabase> | null = null;
	private readonly DB_VERSION = 1;
	private readonly storeName: string;

	constructor(
		readonly dbName: string = 'JoditDB',
		storeName: string = 'keyValueStore'
	) {
		this.storeName = storeName;
	}

	/**
	 * Initialize or get the database connection
	 */
	private getDB(): Promise<IDBDatabase> {
		if (this.dbPromise) {
			return this.dbPromise;
		}

		this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
			if (typeof indexedDB === 'undefined') {
				reject(new Error('IndexedDB is not supported'));
				return;
			}

			const request = indexedDB.open(this.dbName, this.DB_VERSION);

			request.onerror = (): void => {
				reject(request.error);
			};

			request.onsuccess = (): void => {
				resolve(request.result);
			};

			request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
				const db = (event.target as IDBOpenDBRequest).result;

				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});

		return this.dbPromise;
	}

	/**
	 * Perform a transaction on the store
	 */
	private async performTransaction<R>(
		mode: IDBTransactionMode,
		callback: (store: IDBObjectStore) => IDBRequest<R>
	): Promise<R> {
		try {
			const db = await this.getDB();
			const transaction = db.transaction([this.storeName], mode);
			const store = transaction.objectStore(this.storeName);
			const request = callback(store);

			return new Promise<R>((resolve, reject) => {
				request.onsuccess = (): void => {
					resolve(request.result);
				};

				request.onerror = (): void => {
					reject(request.error);
				};
			});
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async set(key: string, value: T): Promise<this> {
		try {
			const result = await this.performTransaction('readwrite', store =>
				store.put(value, key)
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				await result;
			}
		} catch (e) {
			if (!IS_PROD) {
				console.error(e);
			}
		}

		return this;
	}

	async delete(key: string): Promise<this> {
		try {
			const result = await this.performTransaction('readwrite', store =>
				store.delete(key)
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				await result;
			}
		} catch {}

		return this;
	}

	async get<R = T>(key: string): Promise<R | void> {
		try {
			let result = await this.performTransaction('readonly', store =>
				store.get(key)
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				result = await result;
			}

			return result as R | void;
		} catch {
			return undefined;
		}
	}

	async exists(key: string): Promise<boolean> {
		try {
			let result = await this.performTransaction('readonly', store =>
				store.get(key)
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				result = await result;
			}

			return result !== undefined;
		} catch {
			return false;
		}
	}

	async clear(): Promise<this> {
		try {
			const result = await this.performTransaction('readwrite', store =>
				store.clear()
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				await result;
			}
		} catch {}

		return this;
	}

	/**
	 * Close the database connection
	 */
	async close(): Promise<void> {
		if (this.dbPromise) {
			try {
				const db = await this.dbPromise;
				db.close();
			} catch {}
			this.dbPromise = null;
		}
	}

	/**
	 * Get all keys in the store
	 */
	async keys(): Promise<string[]> {
		try {
			let result = await this.performTransaction('readonly', store =>
				store.getAllKeys()
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				result = await result;
			}

			return result.map(k => String(k));
		} catch {
			return [];
		}
	}

	/**
	 * Get all values in the store
	 */
	async values(): Promise<T[]> {
		try {
			let result = await this.performTransaction('readonly', store =>
				store.getAll()
			);

			// Handle case where result might be a promise
			if (result && typeof result === 'object' && 'then' in result) {
				result = await result;
			}

			return result;
		} catch {
			return [];
		}
	}

	/**
	 * Get all entries (key-value pairs) in the store
	 */
	async entries(): Promise<Array<[string, T]>> {
		try {
			const [keys, values] = await Promise.all([
				this.keys(),
				this.values()
			]);

			return keys.map((key, index) => [key, values[index]]);
		} catch {
			return [];
		}
	}
}

let cachedResult: boolean | null = null;

/**
 * Check if IndexedDB is available
 */
export async function canUseIndexedDB(): Promise<boolean> {
	if (cachedResult != null) {
		return cachedResult;
	}

	try {
		if (typeof indexedDB === 'undefined') {
			cachedResult = false;
			return false;
		}

		const tmpKey = '___Jodit___' + Math.random().toString();

		const request = indexedDB.open(tmpKey);

		cachedResult = await new Promise<boolean>(resolve => {
			request.onerror = (): void => {
				resolve(false);
			};

			request.onsuccess = (): void => {
				indexedDB.deleteDatabase(tmpKey);
				resolve(true);
			};
		});

		return cachedResult;
	} catch {
		cachedResult = false;
		return false;
	}
}
