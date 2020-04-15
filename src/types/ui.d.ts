import { IFocusable } from './form';
import { IComponent, IContainer, IDestructible, IDictionary, Nullable } from './types';
import { Buttons } from './toolbar';

export interface IUIElement extends IContainer, IDestructible {
	isButton: boolean;
	parentElement: Nullable<IUIElement>;
	update(): void;
	setParentElement(parentElement: Nullable<IUIElement>): void;
	appendTo(element: HTMLElement): void;
}

export interface IUIButtonState {
	size: "small" | "middle" | "large";
	disabled: boolean;
	activated: boolean;
	icon: {
		name: string;
		iconURL: string;
		fill: string;
	};
	text: string;
	tooltip: string;
}

export interface IUIButton extends IComponent, IUIElement, IFocusable {
	state: IUIButtonState;
	text: HTMLElement;
	icon: HTMLElement;

	isButton: true;

	onAction(callback: (event: MouseEvent) => void): IUIButton;
}

export interface IUIList extends IUIElement {
	elements: IUIElement[];
	append(elm: IUIElement): void;

	build(
		items: Buttons | IDictionary<string>,
		target?: Nullable<HTMLElement>
	): IUIList;

	clear(): void;
}
