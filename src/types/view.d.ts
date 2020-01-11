/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Buttons, Controls, IControlType, IProgressBar, IToolbarCollection } from './toolbar';
import { IComponent, IDictionary } from './types';
import { ICreate } from './create';
import { IEventsNative } from './events';
import { IStorage } from './storage';
import { IAsync } from './async';

interface ILanguageOptions {
	language?: string;
	debugLanguage?: boolean;
	i18n?: IDictionary<IDictionary<string>> | false;
}

interface IToolbarOptions {
	theme?: string;
	toolbar?: boolean | string | HTMLElement;
	toolbarButtonSize?: 'small' | 'middle' | 'large'
	textIcons?: boolean;

	extraButtons: Array<string | IControlType>;
	removeButtons: string[];
	buttons: Buttons;

	showTooltip?: boolean;
	showTooltipDelay?: number;
	useNativeTooltip?: boolean;

	direction?: string;
}

interface IViewOptions extends ILanguageOptions, IToolbarOptions {
	basePath?: string;

	disabled?: boolean;
	readonly?: boolean;
	iframe?: boolean;

	activeButtonsInReadOnly?: string[];

	allowTabNavigation?: boolean;

	zIndex?: number;
	fullsize?: boolean;
	globalFullsize?: boolean;

	controls?: Controls;
}

interface IPanel<T = IViewOptions>  extends IComponent {
	container: HTMLElement;
	create: ICreate;

	ownerDocument: Document;
	ownerWindow: Window;

	isLockedNotBy(name: string): boolean;
	isLocked(): boolean;

	lock(name?: string): boolean;
	unlock(): boolean;

	isFullSize: () => boolean;
	toggleFullSize(isFullSize?: boolean): void;

	options: T;
}

interface IViewBased<T = IViewOptions> extends IPanel<T> {
	/**
	 * @property {string} ID attribute for source element, id add {id}_editor it's editor's id
	 */
	id: string;
	markOwner(elm: HTMLElement): void;

	basePath: string;

	buffer: IStorage;

	progressbar: IProgressBar;

	options: T;

	events: IEventsNative;
	create: ICreate;
	async: IAsync;

	i18n: (text: string, ...params: Array<string | number>) => string;

	defaultTimeout: number;

	getInstance<T = IComponent>(moduleName: string, options?: object): T;

	getVersion: () => string;

	components: Set<IComponent>;

	workplace: HTMLDivElement;
}

interface IViewWithToolbar<T = IViewOptions> extends IViewBased<T> {
	toolbar: IToolbarCollection;

	setPanel(element: HTMLElement | string): void;
}
