import { IBound, IDestructible } from './types';
import { IUIElement } from './ui';

export interface IPopup extends IUIElement, IDestructible {
	container: HTMLElement;

	isOpened: boolean;

	open(
		getBound: () => IBound,
		keepPosition?: boolean
	): this;

	setContent(content: HTMLElement | string): this;
	updatePosition(): this;

	close(): this;
}
