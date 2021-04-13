/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
import { ButtonsOption } from './toolbar';

export interface IUIElement extends IViewComponent, IContainer, IDestructible {
	parentElement: Nullable<IUIElement>;
	container: HTMLElement;
	name: string;

	/**
	 * Apply callback for all parents
	 * @param callback
	 */
	bubble(callback: (parent: IUIElement) => void): this;

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
	value: string | number | boolean;
	status: string;
	type: 'button' | 'submit';
	disabled: boolean;
	activated: boolean;

	icon: IUIIconState;

	text: string;
	tooltip: string;

	tabIndex: CanUndef<number>;
}

export type IUIButtonStatePartial = Omit<Partial<IUIButtonState>, 'icon'> & {
	icon?: Partial<IUIButtonState['icon']>;
};

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
	append(elm: IUIElement | IUIElement[], distElement?: string): this;
	remove(elm: IUIElement): this;
	clear(): this;
}

export interface IUIList extends IUIGroup {
	jodit: IViewBased;

	mode: 'vertical' | 'horizontal';
	buttonSize: IUIButtonState['size'];

	buttons: IUIButton[];
	getButtonsNames(): string[];

	setRemoveButtons(removeButtons?: string[]): this;

	build(items: ButtonsOption, target?: Nullable<HTMLElement>): IUIList;
}

export interface IUIForm extends IUIGroup {
	container: HTMLFormElement;
	submit(): void;
	validate(): boolean;
	onSubmit(handler: (data: IDictionary) => false | void): void;
}

export interface IUIInput extends IUIElement {
	readonly nativeInput:
		| HTMLInputElement
		| HTMLSelectElement
		| HTMLTextAreaElement;

	readonly state: {
		className: string;
		autocomplete: boolean;
		name: string;
		value: string;
		icon: string;
		label: string;
		ref: string;
		type: 'text' | 'checkbox' | 'url' | 'file' | 'hidden';
		placeholder: string;
		required: boolean;
		validators: string[];
		clearButton?: boolean;
		onChange?: (value: string) => void;
	};

	value: string;
	error: string;
	validate(): boolean;
	focus(): void;

	readonly isFocused: boolean;
}

export interface IUIInputValidator<T extends IUIInput = IUIInput> {
	(input: T): boolean;
}

export interface IUIOption {
	value: string | boolean | number;
	text: string;
}

export interface IUISelect extends IUIInput {
	readonly nativeInput: HTMLSelectElement;

	readonly state: IUIInput['state'] & {
		options: IUIOption[];
		size?: number;
		multiple?: boolean;
	};
}

export interface IUIRange extends IUIInput {
	readonly state: IUIInput['state'] & {
		min: number;
		max: number;
	};
}
