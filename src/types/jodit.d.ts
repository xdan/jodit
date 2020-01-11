/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewOptions, IViewWithToolbar } from './view';
import { Config } from '../Config';
import { Observer } from '../modules/observer/observer';
import { Select } from '../modules/Selection';
import { CustomCommand, IStatusBar, IStorage, Modes } from './';
import { IUploader } from './uploader';
import { IFileBrowser } from './fileBrowser';

interface IWorkPlace {
	editor: HTMLDivElement | HTMLBodyElement;
	element: HTMLElement;
	container: HTMLDivElement;
	workplace: HTMLDivElement;
	statusbar: IStatusBar;
	iframe?: HTMLIFrameElement | void;
	editorWindow: Window;
	observer: Observer;
}

interface IJodit extends IViewWithToolbar {
	isJodit: true;

	options: Config;
	observer: Observer;
	editor: HTMLElement;
	element: HTMLElement;

	getNativeEditorValue(): string;
	getEditorValue(removeSelectionMarkers?: boolean): string;
	setEditorValue(value?: string): void;

	places: IWorkPlace[];
	currentPlace: IWorkPlace;
	addPlace(source: HTMLElement | string, options?: IViewOptions): void;
	setCurrentPlace(place: IWorkPlace): void;

	value: string;

	/**
	 * @property {HTMLDocument} editorDocument
	 */
	editorDocument: HTMLDocument;

	/**
	 * @property {Window} editorWindow
	 */
	editorWindow: Window;

	/**
	 * @property {Select} selection
	 */
	selection: Select;

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
	isEditorMode(): boolean;
	toggleMode(): void;

	editorIsActive: boolean;

	execCommand(command: string, showUI?: any, value?: null | any): any;

	registerCommand(
		commandNameOriginal: string,
		command: CustomCommand<IJodit>
	): IJodit;

	registerHotkeyToCommand(
		hotkeys: string | string[],
		commandName: string
	): void;

	getEditorText(): string;

	/**
	 * workplace It contains source and wysiwyg editors
	 */
	workplace: HTMLDivElement;

	statusbar: IStatusBar;

	uploader: IUploader;
	filebrowser: IFileBrowser;
	storage: IStorage;

	iframe?: HTMLIFrameElement | void;
}
