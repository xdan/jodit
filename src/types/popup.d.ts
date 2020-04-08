import { IBound, IDestructible } from './types';

export interface IPopup extends IDestructible {
	container: HTMLElement;

	isOpened: boolean;

	open(content: HTMLElement, getBound: () => IBound): void;

	close(): void;
}
