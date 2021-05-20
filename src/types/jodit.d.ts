/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewOptions, IViewWithToolbar } from './view';
import type { Config } from '../config';
import type { Select } from '../core/selection/select';
import { CustomCommand, ICreate, IStatusBar, IStorage, Modes } from './';
import { IUploader } from './uploader';
import { IFileBrowser } from './file-browser';
import type { Observer } from '../modules';

interface IWorkPlace {
	editor: HTMLDivElement | HTMLBodyElement;
	element: HTMLElement;
	container: HTMLDivElement;
	workplace: HTMLDivElement;
	statusbar: IStatusBar;
	iframe?: HTMLIFrameElement | void;
	editorWindow: Window;
	observer: Observer;
	options: IViewOptions;
}

interface IJodit extends IViewWithToolbar {
	isJodit: true;

	options: Config;
	observer: Observer;
	editor: HTMLElement;
	element: HTMLElement;

	getNativeEditorValue(): string;
	getEditorValue(removeSelectionMarkers?: boolean): string;
	setEditorValue(value?: string, notChangeStack?: boolean): void;

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

	/**
	 * @property {Select} selection
	 */
	selection: Select;

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
	 * var editor = new Jodit('#editor');
	 * console.log(editor.getRealMode());
	 * ```
	 */
	getRealMode(): Modes;
	getMode(): Modes;
	mode: Modes;
	isEditorMode(): boolean;
	toggleMode(): void;

	editorIsActive: boolean;

	execCommand(command: string, showUI?: any, value?: null | any): any;
	nativeExecCommand(
		command: string,
		showUI?: any,
		value?: null | any
	): boolean;

	registerCommand(
		commandNameOriginal: string,
		command: CustomCommand<IJodit>,
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
