/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import { IViewOptions, IViewWithToolbar } from './view';
import type { Config } from 'jodit/config';
import type {
	AjaxOptions,
	CustomCommand,
	ICreate,
	IDestructible,
	IDlgs,
	IHistory,
	IResponse,
	IStatusBar,
	Modes
} from './';
import type { IUploader } from './uploader';
import type { IFileBrowser } from './file-browser';
import type { ISelect } from './select';

interface IWorkPlace {
	editor: HTMLDivElement | HTMLBodyElement;
	element: HTMLElement;
	container: HTMLDivElement;
	workplace: HTMLDivElement;
	statusbar: IStatusBar;
	iframe?: HTMLIFrameElement | void;
	editorWindow: Window;
	history: IHistory & IDestructible;
	options: IViewOptions;
}

interface IJodit extends IViewWithToolbar, IDlgs {
	isJodit: true;

	options: Config;

	history: IHistory;

	/**
	 * @deprecated Instead use `Jodit.history`
	 */
	observer: IHistory;

	editor: HTMLElement;
	element: HTMLElement;

	getNativeEditorValue(): string;
	getEditorValue(removeSelectionMarkers?: boolean, consumer?: string): string;
	setEditorValue(value?: string): void;

	/**
	 * @internal
	 * @private
	 */
	synchronizeValues(): void;

	/**
	 * This is an internal method, do not use it in your applications.
	 * @private
	 */
	__imdSynchronizeValues(): void;

	/**
	 * Only getter
	 */
	getElementValue(): string;

	getReadOnly(): boolean;
	setReadOnly(enable: boolean): void;

	places: IWorkPlace[];
	currentPlace: IWorkPlace;
	addPlace(source: HTMLElement | string, options?: IViewOptions): void;
	setCurrentPlace(place: IWorkPlace): void;

	value: string;
	text: string;

	editorDocument: HTMLDocument;

	waitForReady(): Promise<IJodit>;

	/**
	 * Alias for this.ed
	 */
	ed: this['editorDocument'];

	editorWindow: Window;

	/**
	 * Alias for this.ed
	 */
	ew: this['editorWindow'];

	createInside: ICreate;

	selection: ISelect;

	/**
	 * Alias for this.selection
	 */
	s: this['selection'];

	/**
	 * Return current real work mode. When editor in MODE_SOURCE or MODE_WYSIWYG it will
	 * return them, but then editor in MODE_SPLIT it will return MODE_SOURCE if
	 * Textarea(CodeMirror) focused or MODE_WYSIWYG otherwise
	 *
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('#editor');
	 * console.log(editor.getRealMode());
	 * ```
	 */
	getRealMode(): Modes;
	getMode(): Modes;
	mode: Modes;
	isEditorMode(): boolean;
	toggleMode(): void;

	editorIsActive: boolean;

	focus(): void;
	readonly isFocused: boolean;

	fetch<Response extends object = any>(
		url: string,
		options?: Partial<AjaxOptions>
	): Promise<IResponse<Response>>;

	execCommand(
		command: string,
		showUI?: any,
		value?: null | any,
		...args: unknown[]
	): any;
	nativeExecCommand(
		command: string,
		showUI?: any,
		value?: null | any
	): boolean;

	registerCommand<C extends string>(
		commandNameOriginal: C,
		command: CustomCommand<IJodit, C>,
		options?: {
			stopPropagation: boolean;
		}
	): IJodit;

	registerHotkeyToCommand(
		hotkeys: string | string[],
		commandName: string,
		shouldStop?: boolean
	): void;

	/**
	 * workplace It contains source and wysiwyg editors
	 */
	workplace: HTMLDivElement;

	statusbar: IStatusBar;

	uploader: IUploader;
	filebrowser: IFileBrowser;

	iframe?: HTMLIFrameElement | void;
}
