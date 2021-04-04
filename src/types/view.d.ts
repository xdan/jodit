/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	Buttons,
	ButtonsGroup,
	ButtonsOption,
	Controls,
	IControlType,
	IProgressBar,
	IToolbarCollection
} from './toolbar';
import type { IComponent, IContainer, IDictionary, Nullable } from './types';
import type { Attributes, ICreate } from './create';
import type { IStorage } from './storage';
import type { IAsync } from './async';
import type { IUIButtonState } from './ui';
import type { IEventsNative } from './events';
import type { IPluginButton } from './plugin';
import type { Mods, Elms } from '../core/traits';

interface ILanguageOptions {
	language?: string;
	debugLanguage?: boolean;
	i18n?: IDictionary<IDictionary<string>> | false;
}

interface IToolbarOptions {
	theme?: string;
	toolbar?: boolean | string | HTMLElement;
	toolbarButtonSize?: IUIButtonState['size'];
	textIcons?: boolean | ((key: string) => boolean);

	extraButtons?: Buttons;
	removeButtons?: string[];
	extraIcons?: IDictionary<string>;

	buttons?: ButtonsOption;

	showTooltip?: boolean;
	showTooltipDelay?: number;
	useNativeTooltip?: boolean;

	direction?: string;
}

type NodeFunction = (elm: HTMLElement) => void;

interface IViewOptions extends ILanguageOptions, IToolbarOptions {
	headerButtons?: string | Array<IControlType | string | ButtonsGroup>;
	basePath?: string;
	theme?: string;

	defaultTimeout?: number;

	disabled?: boolean;
	readonly?: boolean;
	iframe?: boolean;

	namespace: string;

	activeButtonsInReadOnly?: string[];

	allowTabNavigation?: boolean;

	zIndex?: number;
	fullsize?: boolean;
	globalFullSize?: boolean;

	controls?: Controls;

	createAttributes?: IDictionary<Attributes | NodeFunction>;

	events?: IDictionary<(...args: any[]) => any>;

	shadowRoot?: Nullable<ShadowRoot>;

	ownerWindow?: Window;
}

interface IViewBased<T = IViewOptions>
	extends IContainer,
		IComponent,
		Mods,
		Elms {
	isView: true;

	/**
	 * ID attribute for source element, id add {id}_editor it's editor's id
	 */
	id: string;

	basePath: string;

	isLocked: boolean;
	isLockedNotBy(name: string): boolean;
	lock(name?: string): boolean;
	unlock(): boolean;

	isFullSize: boolean;
	toggleFullSize(isFullSize?: boolean): void;

	buffer: IStorage;
	storage: IStorage;

	progressbar: IProgressBar;

	events: IEventsNative;
	e: this['events'];

	async: IAsync;

	create: ICreate;
	c: this['create'];

	OPTIONS: T;
	options: this['OPTIONS'];
	// alias
	o: this['options'];

	i18n: (text: string, ...params: Array<string | number>) => string;

	defaultTimeout: number;

	getVersion: () => string;

	components: Set<IComponent>;
	getInstance<T extends IComponent>(moduleName: string, options?: object): T;
}

interface IViewWithToolbar<T = IViewOptions> extends IViewBased<T> {
	toolbar: IToolbarCollection;
	toolbarContainer: HTMLElement;

	registeredButtons: Set<IPluginButton>;
	registerButton(btn: IPluginButton): this;
	unregisterButton(btn: IPluginButton): this;

	setPanel(element: HTMLElement | string): void;
}
