import { IBound, IDestructible, Nullable } from './types';

export interface IPopup extends IDestructible {
	container: HTMLElement;

	isOpened: boolean;

	open(
		getBound: () => IBound,
		keepPosition?: boolean
	): this;

	setContent(content: HTMLElement): this;

	close(): this;
}
