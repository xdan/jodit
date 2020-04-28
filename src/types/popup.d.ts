import { IBound, IDestructible } from './types';
import { IUIElement } from './ui';

export type PopupStrategy = 'leftBottom' | 'rightBottom' | 'leftTop' | 'rightTop';
export interface IPopup extends IUIElement, IDestructible {
	container: HTMLElement;

	isOpened: boolean;
	strategy: PopupStrategy;
	viewBound: () => IBound;

	open(
		getBound: () => IBound,
		keepPosition?: boolean
	): this;

	setContent(content: HTMLElement | string): this;
	updatePosition(): this;

	close(): this;
}
