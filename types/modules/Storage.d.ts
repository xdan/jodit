/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
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
