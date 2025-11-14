/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module storage
 */

import type { IStorage, StorageValueType } from 'jodit/types';

export type WebStorageStrategy = 'localStorage' | 'sessionStorage';

/**
 * Check if user disable local storages/cookie etc.
 */
export const canUsePersistentStorage = (
	strategy: WebStorageStrategy = 'localStorage'
): boolean => {
	const cache = new Map<WebStorageStrategy, boolean>();

	return ((): boolean => {
		if (cache.has(strategy)) {
			return cache.get(strategy)!;
		}

		const tmpKey = '___Jodit___' + Math.random().toString();

		const storage =
			strategy === 'sessionStorage' ? sessionStorage : localStorage;

		try {
			storage.setItem(tmpKey, '1');
			const result = storage.getItem(tmpKey) === '1';
			storage.removeItem(tmpKey);

			cache.set(strategy, result);
			return result;
		} catch {}

		cache.set(strategy, false);
		return false;
	})();
};

/**
 * Persistent storage in localStorage or sessionStorage
 */
export class LocalStorageProvider<T = StorageValueType> implements IStorage<T> {
	private get storage(): Storage {
		return this.strategy === 'sessionStorage'
			? sessionStorage
			: localStorage;
	}

	set(key: string, value: T): this {
		try {
			const buffer = this.storage.getItem(this.rootKey);

			const json = buffer ? JSON.parse(buffer) : {};

			json[key] = value;

			this.storage.setItem(this.rootKey, JSON.stringify(json));
		} catch {}

		return this;
	}

	delete(key: string): this {
		try {
			this.storage.removeItem(this.rootKey);
		} catch {}

		return this;
	}

	get<R = T>(key: string): R | void {
		try {
			const buffer = this.storage.getItem(this.rootKey);

			const json = buffer ? JSON.parse(buffer) : {};

			return json[key] !== undefined ? json[key] : undefined;
		} catch {}
	}

	exists(key: string): boolean {
		return this.get(key) != null;
	}

	constructor(
		readonly rootKey: string,
		readonly strategy: WebStorageStrategy = 'localStorage'
	) {}

	clear(): this {
		try {
			this.storage.removeItem(this.rootKey);
		} catch {}

		return this;
	}
}
