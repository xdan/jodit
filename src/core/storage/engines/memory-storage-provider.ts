/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module storage/memory
 */

import type { IStorage, StorageValueType } from 'jodit/types';

export class MemoryStorageProvider<T = StorageValueType>
	implements IStorage<T>
{
	private __data: Map<string, T> = new Map();

	set(key: string, value: T): IStorage<T> {
		this.__data.set(key, value);
		return this;
	}

	delete(key: string): IStorage<T> {
		this.__data.delete(key);
		return this;
	}

	get<R = T>(key: string): R | void {
		return this.__data.get(key) as R | void;
	}

	exists(key: string): boolean {
		return this.__data.has(key);
	}

	clear(): IStorage<T> {
		this.__data.clear();
		return this;
	}
}
