export type StorageValueType = string | number | boolean | StorageValueType[];

export interface IStorage<T = StorageValueType> {
	set(key: string, value: T): void;
	get(key: string): T | void;
	exists(key: string): boolean;
	clear(): void;
}
