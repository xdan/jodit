/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
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
import type { IViewBased } from './view';
import type { ButtonsOption } from './toolbar';
import type { IElms, IMods } from './traits';

export interface IUIElement
	extends IViewComponent,
		IContainer,
		IDestructible,
		IMods,
		IElms {
	parentElement: Nullable<IUIElement>;
	container: HTMLElement;
	name: string;

	/**
	 * Apply callback for all parents
	 */
	bubble(callback: (parent: IUIElement) => void): this;

	closest<T extends IUIElement>(type: Function): Nullable<T>;
	closest<T extends IUIElement>(type: Function | T): Nullable<T>;

	update(): void;
	updateParentElement(target: IUIElement): this;
	appendTo(element: HTMLElement): this;
}

export interface IUIIconState {
	name: string;
	iconURL: string;
	fill: string;
}

export type ButtonVariant =
	| 'initial'
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger';

export interface IUIButtonState {
	size: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
	name: string;
	value: string | number | boolean;

	variant: ButtonVariant;

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
		value: string | number;
		icon: string;
		label: string;
		ref: string;
		type: 'text' | 'number' | 'checkbox' | 'url' | 'file' | 'hidden';
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

export interface IUITextArea extends IUIInput {
	readonly nativeInput: HTMLTextAreaElement;

	readonly state: IUIInput['state'] & {
		size?: number;
		resizable?: boolean;
	};
}

export interface IUIRange extends IUIInput {
	readonly state: IUIInput['state'] & {
		min: number;
		max: number;
	};
}

export interface IUICheckBox extends IUIInput {
	readonly state: IUIInput['state'] & {
		checked: boolean;
		switch: boolean;
	};
}
