/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IFocusable } from './form';
import type {
	CanUndef,
	IContainer,
	IDestructible,
	IDictionary,
	IViewComponent,
	Nullable
} from './types';
import type { ButtonsGroups } from './toolbar';
import type { IViewBased } from './view';
import type { IKeyValidator } from './input';

export interface IUIElement extends IViewComponent, IContainer, IDestructible {
	parentElement: Nullable<IUIElement>;
	container: HTMLElement;

	closest<T extends Function>(type: T | IUIElement): Nullable<IUIElement>;

	update(): void;
	updateParentElement(target: IUIElement): this;
	appendTo(element: HTMLElement): this;

	mods: IDictionary<string | boolean | null>;

	setMod(
		name: string,
		value: string | boolean | null,
		container?: HTMLElement
	): this;

	getFullElName(elementName: string): string;
	getElm(elementName: string): HTMLElement;
	getElms(elementName: string): HTMLElement[];
}

export interface IUIIconState {
	name: string;
	iconURL: string;
	fill: string;
}

export interface IUIButtonState {
	size: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
	name: string;
	status: string;
	type: 'button' | 'submit';
	disabled: boolean;
	activated: boolean;

	icon: IUIIconState;

	text: string;
	tooltip: string;

	tabIndex: CanUndef<number>;
}

export interface IUIButtonStatePartial {
	name?: IUIButtonState['name'];
	size?: IUIButtonState['size'];
	status?: IUIButtonState['status'];
	type?: IUIButtonState['type'];
	disabled?: boolean;
	activated?: boolean;
	icon?: {
		name: string;
		fill?: string;
	};
	text?: string;
	tooltip?: string;
	tabIndex?: IUIButtonState['tabIndex'];
}

export interface IUIButton extends IViewComponent, IUIElement, IFocusable {
	state: IUIButtonState;

	setState(state: IUIButtonStatePartial): this;

	text: HTMLElement;
	icon: HTMLElement;

	isButton: true;

	onAction(callback: (event: MouseEvent) => void): this;
}

export interface IUIGroup extends IUIElement {
	elements: IUIElement[];
	allChildren: IUIElement[];
	append(elm: IUIElement): void;
	clear(): void;
}

export interface IUIList extends IUIGroup {
	jodit: IViewBased;

	mode: 'vertical' | 'horizontal';
	buttonSize: IUIButtonState['size'];

	buttons: IUIButton[];
	getButtonsNames(): string[];

	setRemoveButtons(removeButtons?: string[]): this;

	build(items: ButtonsGroups, target?: Nullable<HTMLElement>): IUIList;
}

export interface IUIForm extends IUIGroup {
	container: HTMLFormElement;
	submit(): void;
	validate(): boolean;
	onSubmit(handler: (data: IDictionary) => false | void): void;
}

export interface IUIInput extends IUIElement {
	validator: IKeyValidator;
	nativeInput: HTMLInputElement | HTMLTextAreaElement;

	state: {
		className: string;
		autocomplete: boolean;
		name: string;
		icon: string;
		label: string;
		ref: string;
		type: 'text' | 'checkbox' | 'url';
		placeholder: string;
		required: boolean;
		validators: string[];
		clearButton?: boolean;
	};

	value: string;
	error: string;
	validate(): boolean;
	focus(): void;

	readonly isFocused: boolean;
}

export type IUIInputValidator = (input: IUIInput) => boolean;

export interface IUIOption {
	value: string,
	text: string
}

export interface IUISelect extends IUIElement {
	nativeInput: HTMLSelectElement;
	options: {
		name: string;
		label?: string;
		ref?: string;
		options: IUIOption[];
		required?: boolean;
		placeholder?: string;
		validators?: string[];
		size?: number;
		multiple?: boolean;
	};
	value: string;
	error: string;
	validate(): boolean;
	focus(): void;
}

export type IUISelectValidator = (select: IUISelect) => boolean;
