import { IFocusable } from './form';
import {
	IComponent,
	IContainer,
	IDestructible,
	IDictionary,
	Nullable
} from './types';
import { Buttons } from './toolbar';

export interface IUIElement extends IContainer, IDestructible {
	isButton: boolean;
	parentElement: Nullable<IUIElement>;
	update(): void;
	setParentElement(parentElement: Nullable<IUIElement>): void;
	appendTo(element: HTMLElement): this;
}

export interface IUIButtonState {
	size: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
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

export interface IUIButtonStatePartial {
	size?: IUIButtonState['size'];
	disabled?: boolean;
	activated?: boolean;
	icon?: IUIButtonState['icon'];
	text?: string;
	tooltip?: string;
}

export interface IUIButton extends IComponent, IUIElement, IFocusable {
	state: IUIButtonState;
	setState(state: IUIButtonStatePartial): this;

	text: HTMLElement;
	icon: HTMLElement;

	isButton: true;

	onAction(callback: (event: MouseEvent) => void): this;
}

export interface IUIList extends IUIElement {
	mode: 'vertical' | 'horizontal';

	elements: IUIElement[];
	append(elm: IUIElement): void;

	build(
		items: Buttons | IDictionary<string>,
		target?: Nullable<HTMLElement>
	): IUIList;

	clear(): void;
}
