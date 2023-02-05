/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module storage/memory
 */

import type { IStorage, StorageValueType } from 'jodit/types';

export class MemoryStorageProvider<T = StorageValueType>
	implements IStorage<T>
{
	private data: Map<string, T> = new Map();

	set(key: string, value: T): IStorage<T> {
		this.data.set(key, value);
		return this;
	}

	delete(key: string): IStorage<T> {
		this.data.delete(key);
		return this;
	}

	get<R = T>(key: string): R | void {
		return this.data.get(key) as R | void;
	}

	exists(key: string): boolean {
		return this.data.has(key);
	}

	clear(): IStorage<T> {
		this.data.clear();
		return this;
	}
}
