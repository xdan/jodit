import { CallbackFunction } from './types';

export interface IObservableObject<T> {
	on(event: string | string[], callback: CallbackFunction): this;
	fire(event: string | string[], ...attr: any[]): void;
}
export type ObservableObject<T> = T & IObservableObject<T>;
