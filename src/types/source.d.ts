import { IDestructible, IInitable } from './types';

export interface ISourceEditor extends IDestructible, IInitable {
	getValue(): string;
	setValue(raw: string): void;
	insertRaw(raw: string): void;
	getSelectionEnd(): number;
	getSelectionStart(): number;
	setSelectionRange(start: number, end: number): void;

	setPlaceHolder(title: string): void

	focus(): void;

	setReadOnly(isReadOnly: boolean): void;

	selectAll(): void;

	isReady: boolean;
	onReadyAlways(callback: Function): void;
}
