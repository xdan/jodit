/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IStorage, StorageValueType } from '../../types';

export class MemoryStorageProvider<T = StorageValueType> implements IStorage<T> {
	private data: Map<string, T> = new Map();

	set(key: string, value: T) {
		this.data.set(key, value);
	}

	get<R = T>(key: string): R | void {
		return <R | void>this.data.get(key);
	}

	exists(key: string): boolean {
		return this.data.has(key);
	}

	clear() {
		this.data.clear();
	}
}
