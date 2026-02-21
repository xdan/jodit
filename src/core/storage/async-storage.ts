/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module storage
 */

import type { IAsyncStorage, IStorage, StorageValueType } from 'jodit/types';
import { camelCase } from 'jodit/core/helpers/string/camel-case';

import {
	canUseIndexedDB,
	IndexedDBProvider
} from './engines/indexed-db-provider';
import {
	canUsePersistentStorage,
	LocalStorageProvider,
	type WebStorageStrategy
} from './engines/local-storage-provider';
import { MemoryStorageProvider } from './engines/memory-storage-provider';
import { StorageKey } from './storage';

export class AsyncStorage<T = StorageValueType> implements IAsyncStorage<T> {
	protected constructor(
		private provider: Promise<IStorage<T> | IAsyncStorage<T>>,
		suffix?: string
	) {
		if (suffix) {
			this.prefix += suffix;
		}
	}

	readonly prefix = StorageKey;
	async set(key: string, value: T): Promise<this> {
		const provider = await this.provider;
		await provider.set(camelCase(this.prefix + key), value);
		return this;
	}

	async delete(key: string): Promise<this> {
		const provider = await this.provider;
		await provider.delete(camelCase(this.prefix + key));
		return this;
	}

	async get<R = T>(key: string): Promise<R | void> {
		const provider = await this.provider;
		return provider.get<R>(camelCase(this.prefix + key));
	}

	async exists(key: string): Promise<boolean> {
		const provider = await this.provider;
		return provider.exists(camelCase(this.prefix + key));
	}

	async clear(): Promise<this> {
		const provider = await this.provider;
		await provider.clear();
		return this;
	}

	async close(): Promise<void> {
		const provider = await this.provider;
		if ('close' in provider && typeof provider.close === 'function') {
			await provider.close();
		}
	}

	static makeStorage(
		persistentOrStrategy:
			| boolean
			| WebStorageStrategy
			| 'memoryStorage'
			| 'indexedDB' = false,
		suffix?: string
	): IAsyncStorage {
		let provider:
			| void
			| Promise<IStorage | IAsyncStorage>
			| IStorage
			| IAsyncStorage = undefined;

		let storage: AsyncStorage | null = null;

		if (
			persistentOrStrategy === 'localStorage' ||
			persistentOrStrategy === 'sessionStorage'
		) {
			if (canUsePersistentStorage(persistentOrStrategy)) {
				provider = new LocalStorageProvider(
					StorageKey + (suffix || ''),
					persistentOrStrategy
				);
			}
		} else if (
			persistentOrStrategy === 'indexedDB' ||
			persistentOrStrategy === true
		) {
			provider = canUseIndexedDB().then(canUse =>
				canUse
					? new IndexedDBProvider(
							StorageKey + (suffix || ''),
							'keyValueStore'
						)
					: new MemoryStorageProvider()
			);
		}

		if (!provider) {
			provider = new MemoryStorageProvider();
		}

		storage = new AsyncStorage(Promise.resolve(provider), suffix);

		return storage;
	}
}
