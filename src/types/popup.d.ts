import { IBound, IDestructible, Nullable } from './types';

export interface IPopup extends IDestructible {
	container: HTMLElement;

	isOpened: boolean;

	open(content: Nullable<HTMLElement>, getBound: () => IBound): void;

	setContent(content: HTMLElement): void;

	close(): void;
}
