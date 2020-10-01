/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IFocusable } from './form';
import {
	CanUndef,
	IContainer,
	IDestructible,
	IDictionary,
	IViewComponent,
	Nullable
} from './types';
import { Buttons } from './toolbar';
import { IViewBased } from './view';

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
	getClassName(elementName: string): string;
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

	build(
		items: Buttons | IDictionary<string>,
		target?: Nullable<HTMLElement>
	): IUIList;
}

export interface IUIForm extends IUIGroup {
	container: HTMLFormElement;
	submit(): void;
	validate(): boolean;
	onSubmit(handler: (data: IDictionary) => false | void): void;
}

export interface IUIInput extends IUIElement {
	nativeInput: HTMLInputElement | HTMLTextAreaElement;
	options: {
		name: string;
		label?: string;
		ref?: string;
		type?: 'text' | 'checkbox' | 'url';
		placeholder?: string;
		required?: boolean;
		validators?: string[];
	};
	value: string;
	error: string;
	validate(): boolean;
	focus(): void;
}

export type IUIInputValidator = (input: IUIInput) => boolean;
