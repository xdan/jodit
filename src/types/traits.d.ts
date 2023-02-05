/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDictionary, Nullable } from 'jodit/types';
import type {
	IComponent,
	IContainer,
	IDialog,
	IDialogOptions
} from 'jodit/types';

export type ModType = string | boolean | null;

export interface IMods {
	/**
	 * Set/remove modification (null - remove)
	 */
	setMod<T extends IComponent & IContainer & IMods>(
		this: T,
		name: string,
		value: ModType
	): T;
	afterSetMod(name: string, value: ModType): void;

	getMod(name: string): ModType;
	mods: IDictionary<ModType>;
}

export interface IElms {
	getElm(elementName: string): Nullable<HTMLElement>;
	getElms(elementName: string): HTMLElement[];
}

export interface IDlgs {
	dlg(options?: IDialogOptions): IDialog;

	confirm(
		msg: string,
		title: string | ((yes: boolean) => void) | undefined,
		callback?: (yes: boolean) => void | false
	): IDialog;

	prompt(
		msg: string,
		title: string | (() => false | void) | undefined,
		callback: (value: string) => false | void,
		placeholder?: string,
		defaultValue?: string
	): IDialog;

	alert(
		msg: string | HTMLElement,
		title?: string | (() => void | false),
		callback?: string | ((dialog: IDialog) => void | false),
		className?: string
	): IDialog;
}
