import { IDestructible } from './types';

export interface IContextMenuAction {
	icon?: string;
	title?: string;
	exec?: (this: IContextMenu, e: MouseEvent) => false | void;
}

export interface IContextMenu extends IDestructible {
	show(
		x: number,
		y: number,
		actions: Array<false | IContextMenuAction>,
		zIndex?: number
	): void;

	hide(): void;
}
