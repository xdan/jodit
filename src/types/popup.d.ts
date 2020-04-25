import { IBound, IDestructible } from './types';

export interface IPopup extends IDestructible {
	container: HTMLElement;

	isOpened: boolean;

	open(
		getBound: () => IBound,
		keepPosition?: boolean
	): this;

	setContent(content: HTMLElement | string): this;

	close(): this;
}
