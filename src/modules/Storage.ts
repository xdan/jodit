/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {camelCase} from "./Helpers";

export interface IStorage {
    set(key: string, value: string | number): void;
    get(key: string): string | null;
}

export class localStorageProvider implements IStorage {
    set(key: string, value: string | number) {
        localStorage.setItem(key, value.toString());
    }

    get(key: string): string | null {
        return localStorage.getItem(key);
    }
}

export class Storage {
    constructor(readonly provider: IStorage) {}
    prefix: string = 'Jodit_';

    set(key: string, value: string | number) {
        this.provider.set(camelCase(this.prefix + key), value);
    }

    get(key: string): string | null {
        return this.provider.get(camelCase(this.prefix + key));
    }
}