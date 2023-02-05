/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
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
import type { IUIButtonState } from './ui';
import type { IEventEmitter } from './events';
import type { IPluginButton } from './plugin';
import type { IElms, IMods } from './traits';
import type { IMessages } from 'jodit/types/messages';

interface ILanguageOptions {
	language?: string;
	debugLanguage?: boolean;
	i18n?: IDictionary<IDictionary<string>> | false;
}

interface IToolbarOptions {
	toolbar?: boolean | string | HTMLElement;
	readonly theme?: string;
	readonly toolbarButtonSize?: IUIButtonState['size'];
	readonly textIcons?: boolean | ((key: string) => boolean);

	readonly extraButtons?: Buttons;
	readonly removeButtons?: string[];
	readonly extraIcons?: IDictionary<string>;

	readonly buttons?: ButtonsOption;

	readonly showTooltip?: boolean;
	readonly showTooltipDelay?: number;
	readonly useNativeTooltip?: boolean;

	readonly direction?: string;
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

	namespace?: string;

	activeButtonsInReadOnly?: string[];

	allowTabNavigation?: boolean;

	zIndex?: number | string;
	fullsize?: boolean;
	globalFullSize?: boolean;

	controls?: Controls;

	createAttributes?: IDictionary<Attributes | NodeFunction>;

	events?: IDictionary<(...args: any[]) => any>;

	shadowRoot?: Nullable<ShadowRoot>;

	ownerWindow?: Window;

	language?: string;
}

interface IViewBased<T = IViewOptions>
	extends IContainer,
		IComponent,
		IMods,
		IElms {
	readonly isView: true;
	readonly parent: Nullable<IViewBased>;

	/**
	 * ID attribute for source element, id add \{id\}_editor it's editor's id
	 */
	readonly id: string;

	readonly basePath: string;

	readonly isLocked: boolean;
	isLockedNotBy(name: string): boolean;
	lock(name?: string): boolean;
	unlock(): boolean;

	readonly isFullSize: boolean;
	toggleFullSize(isFullSize?: boolean): void;

	readonly buffer: IStorage;
	readonly storage: IStorage;

	readonly progressbar: IProgressBar;

	readonly events: IEventEmitter;
	readonly e: this['events'];

	readonly create: ICreate;
	readonly c: this['create'];

	readonly OPTIONS: T;
	readonly options: this['OPTIONS'];
	// alias
	readonly o: this['options'];

	i18n(text: string, ...params: Array<string | number>): string;

	readonly defaultTimeout: number;

	getVersion(): string;

	readonly components: Set<IComponent>;
	getInstance<T extends IComponent>(moduleName: string, options?: object): T;

	message: IMessages;
}

interface IViewWithToolbar<T = IViewOptions> extends IViewBased<T> {
	toolbar: IToolbarCollection;
	toolbarContainer: HTMLElement;

	registeredButtons: Set<IPluginButton>;
	registerButton(btn: IPluginButton): this;
	unregisterButton(btn: IPluginButton): this;
	getRegisteredButtonGroups(): IDictionary<string[]>;

	setPanel(element: HTMLElement | string): void;
}
