/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
export interface IStorage {
    set(key: string, value: string | number): void;
    get(key: string): string | null;
}
export declare class localStorageProvider implements IStorage {
    set(key: string, value: string | number): void;
    get(key: string): string | null;
}
export declare class Storage {
    readonly provider: IStorage;
    constructor(provider: IStorage);
    prefix: string;
    set(key: string, value: string | number): void;
    get(key: string): string | null;
}
