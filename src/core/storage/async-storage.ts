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
		readonly provider: IStorage<T> | IAsyncStorage<T>,
		suffix?: string
	) {
		if (suffix) {
			this.prefix += suffix;
		}
	}
	readonly prefix = StorageKey;
	async set(key: string, value: T): Promise<this> {
		await this.provider.set(camelCase(this.prefix + key), value);
		return this;
	}

	async delete(key: string): Promise<this> {
		await this.provider.delete(camelCase(this.prefix + key));
		return this;
	}

	async get<R = T>(key: string): Promise<R | void> {
		return this.provider.get<R>(camelCase(this.prefix + key));
	}

	async exists(key: string): Promise<boolean> {
		return this.provider.exists(camelCase(this.prefix + key));
	}

	async clear(): Promise<this> {
		await this.provider.clear();
		return this;
	}

	static async makeStorage(
		persistentOrStrategy:
			| boolean
			| WebStorageStrategy
			| 'indexedDB' = false,
		suffix?: string
	): Promise<IAsyncStorage> {
		let provider;

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
			if (await canUseIndexedDB()) {
				provider = new IndexedDBProvider(
					StorageKey + (suffix || ''),
					'keyValueStore'
				);
			}
		}

		if (!provider) {
			provider = new MemoryStorageProvider();
		}

		return new AsyncStorage(provider, suffix);
	}
}
