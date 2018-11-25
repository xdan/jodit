/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { camelCase } from "./Helpers";

export interface IStorage {
    set(key: string, value: string | number): void;
    get(key: string): string | null;
}

export class localStorageProvider implements IStorage {
    public set(key: string, value: string | number) {
        localStorage.setItem(key, value.toString());
    }

    public get(key: string): string | null {
        return localStorage.getItem(key);
    }
}

export class Storage {
    public prefix: string = "Jodit_";
    constructor(readonly provider: IStorage) {}

    public set(key: string, value: string | number) {
        this.provider.set(camelCase(this.prefix + key), value);
    }

    public get(key: string): string | null {
        return this.provider.get(camelCase(this.prefix + key));
    }
}
