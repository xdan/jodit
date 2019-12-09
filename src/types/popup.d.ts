import { IControlTypeStrong } from './toolbar';
import { IComponent } from './types';

export interface IPopup extends IComponent {
	isOpened: boolean;

	container: HTMLElement;
	target: HTMLElement;

	open(
		content: string | HTMLElement | IControlTypeStrong,
		rightAlign?: boolean,
		noStandardActions?: boolean
	): void;

	close(current?: HTMLElement | IPopup): void;
}
