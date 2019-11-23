export type StorageValueType = string | number | boolean | StorageValueType[];

export interface IStorage<T = StorageValueType> {
	set(key: string, value: T): void;
	get<R = T>(key: string): R | void;
	exists(key: string): boolean;
	clear(): void;
}
