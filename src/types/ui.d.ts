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
	closest<T extends Function>(type: T): Nullable<IUIElement>;

	update(): void;
	setParentElement(parentElement: Nullable<IUIElement>): this;
	appendTo(element: HTMLElement): this;

	setMod(name: string, value: string | boolean | null): this;
}

export interface IUIButtonState {
	size: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
	status: string;
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
	icon?: {
		name: string;
		fill?: string;
	};
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

export interface IUIGroup extends IUIElement {
	elements: IUIElement[];
	append(elm: IUIElement): void;
	clear(): void;
}

export interface IUIList extends IUIGroup {
	mode: 'vertical' | 'horizontal';
	buttonSize: IUIButtonState['size'];

	build(
		items: Buttons | IDictionary<string>,
		target?: Nullable<HTMLElement>
	): IUIList;
}
