/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:README.md]]
 * @packageDocumentation
 * @module jodit
 */

import type {
	CustomCommand,
	ExecCommandCallback,
	IDictionary,
	IPluginSystem,
	IStatusBar,
	IViewOptions,
	IWorkPlace,
	MarkerInfo,
	Modes,
	IFileBrowser,
	IJodit,
	IUploader,
	ICreate,
	IFileBrowserCallBackData,
	IStorage,
	CanPromise,
	IObserver
} from './types';

import { Config } from './config';
import * as consts from './core/constants';

import {
	Create,
	Dom,
	Observer,
	Plugin,
	Select,
	StatusBar,
	STATUSES
} from './modules/';

import {
	asArray,
	css,
	isPromise,
	normalizeKeyAliases,
	error,
	isString,
	attr,
	isFunction,
	resolveElement,
	isVoid,
	callPromise,
	toArray,
	markAsAtomic,
	ConfigProto,
	kebabCase,
	isJoditObject
} from './core/helpers/';

import { Storage } from './core/storage/';

import { ViewWithToolbar } from './core/view/view-with-toolbar';

import { instances, pluginSystem, modules, lang } from './core/global';
import { autobind, cache } from './core/decorators';

/**
 * Class Jodit. Main class
 */
export class Jodit extends ViewWithToolbar implements IJodit {
	/** @override */
	className(): string {
		return 'Jodit';
	}

	/**
	 * Return promise for ready actions
	 * @example
	 * ```js
	 * const jodit = Jodit.make('#editor');
	 * await jodit.waitForReady();
	 * jodit.e.fire('someAsyncLoadedPluginEvent', (test) => {
	 *   alert(test);
	 * });
	 * ```
	 */
	waitForReady(): Promise<IJodit> {
		if (this.isReady) {
			return Promise.resolve(this);
		}

		return this.async.promise(resolve => {
			this.hookStatus('ready', () => resolve(this));
		});
	}

	/**
	 * Define if object is Jodit
	 */
	override readonly isJodit: true = true;

	/**
	 * Plain text editor's value
	 */
	get text(): string {
		if (this.editor) {
			return this.editor.innerText || '';
		}

		const div = this.createInside.div();
		div.innerHTML = this.getElementValue();

		return div.innerText || '';
	}

	/**
	 * Return default timeout period in milliseconds for some debounce or throttle functions.
	 * By default return `{observer.timeout}` options
	 */
	override get defaultTimeout(): number {
		return this.options && this.o.observer
			? this.o.observer.timeout
			: Config.defaultOptions.observer.timeout;
	}

	/**
	 * Method wrap usual Has Object in Object helper for prevent deep object merging in options*
	 */
	static atom<T>(object: T): T {
		return markAsAtomic(object);
	}

	/**
	 * Factory for creating Jodit instance
	 */
	static make(element: HTMLElement | string, options?: object): Jodit {
		return new Jodit(element, options);
	}

	/**
	 * Checks if the element has already been initialized when for Jodit
	 */
	static isJoditAssigned(
		element: HTMLElement
	): element is HTMLElement & { component: Jodit } {
		return (
			element &&
			isJoditObject(element.component) &&
			!element.component.isInDestruct
		);
	}

	/**
	 * Default settings
	 */
	static override get defaultOptions(): Config {
		return Config.defaultOptions;
	}

	static fatMode: boolean = false;

	static plugins: IPluginSystem = pluginSystem;

	static modules: IDictionary<Function> = modules;
	static ns: IDictionary<Function> = modules;

	static decorators: IDictionary<Function> = {};
	static instances: IDictionary<IJodit> = instances;

	static lang: any = lang;

	static core = {
		Plugin
	};

	private __defaultStyleDisplayKey = 'data-jodit-default-style-display';
	private __defaultClassesKey = 'data-jodit-default-classes';

	private commands: IDictionary<Array<CustomCommand<IJodit>>> = {};

	private __selectionLocked: MarkerInfo[] | null = null;

	private __wasReadOnly = false;

	/**
	 * Container for set/get value
	 */
	override readonly storage!: IStorage;

	readonly createInside: ICreate = new Create(
		() => this.ed,
		this.o.createAttributes
	);

	/**
	 * Editor has focus in this time
	 */
	editorIsActive = false;

	private setPlaceField(field: keyof IWorkPlace, value: any): void {
		if (!this.currentPlace) {
			this.currentPlace = {} as any;
			this.places = [this.currentPlace];
		}

		this.currentPlace[field] = value;
	}

	/**
	 * element It contains source element
	 */
	get element(): HTMLElement {
		return this.currentPlace.element;
	}

	/**
	 * editor It contains the root element editor
	 */
	get editor(): HTMLDivElement | HTMLBodyElement {
		return this.currentPlace.editor;
	}

	set editor(editor: HTMLDivElement | HTMLBodyElement) {
		this.setPlaceField('editor', editor);
	}

	/**
	 * Container for all staff
	 */
	override get container(): HTMLDivElement {
		return this.currentPlace.container;
	}

	override set container(container: HTMLDivElement) {
		this.setPlaceField('container', container);
	}

	/**
	 * workplace It contains source and wysiwyg editors
	 */
	get workplace(): HTMLDivElement {
		return this.currentPlace.workplace;
	}

	/**
	 * Statusbar module
	 */
	get statusbar(): IStatusBar {
		return this.currentPlace.statusbar;
	}

	/**
	 * iframe Iframe for iframe mode
	 */
	get iframe(): HTMLIFrameElement | void {
		return this.currentPlace.iframe;
	}

	set iframe(iframe: HTMLIFrameElement | void) {
		this.setPlaceField('iframe', iframe);
	}

	get observer(): IObserver {
		return this.currentPlace.observer;
	}

	/**
	 * In iframe mode editor's window can be different by owner
	 */
	get editorWindow(): Window {
		return this.currentPlace.editorWindow;
	}

	set editorWindow(win: Window) {
		this.setPlaceField('editorWindow', win);
	}

	/**
	 * Alias for this.ew
	 */
	get ew(): this['editorWindow'] {
		return this.editorWindow;
	}

	/**
	 * In iframe mode editor's window can be different by owner
	 */
	get editorDocument(): Document {
		return this.currentPlace.editorWindow.document;
	}

	/**
	 * Alias for this.ew
	 */
	get ed(): this['editorDocument'] {
		return this.editorDocument;
	}

	/**
	 * options All Jodit settings default + second arguments of constructor
	 */
	override get options(): Config {
		return this.currentPlace.options as Config;
	}

	override set options(opt: Config) {
		this.setPlaceField('options', opt);
	}

	readonly selection!: Select;

	/**
	 * Alias for this.selection
	 */
	get s(): this['selection'] {
		return this.selection;
	}

	@cache
	get uploader(): IUploader {
		return this.getInstance('Uploader', this.o.uploader);
	}

	@cache
	get filebrowser(): IFileBrowser {
		const jodit = this;

		const options = ConfigProto(
			{
				defaultTimeout: jodit.defaultTimeout,
				uploader: jodit.o.uploader,
				language: jodit.o.language,
				license: jodit.o.license,
				theme: jodit.o.theme,
				defaultCallback(data: IFileBrowserCallBackData): void {
					if (data.files && data.files.length) {
						data.files.forEach((file, i) => {
							const url = data.baseurl + file;
							const isImage = data.isImages
								? data.isImages[i]
								: false;

							if (isImage) {
								jodit.s.insertImage(
									url,
									null,
									jodit.o.imageDefaultWidth
								);
							} else {
								jodit.s.insertNode(
									jodit.createInside.fromHTML(
										`<a href='${url}' title='${url}'>${url}</a>`
									)
								);
							}
						});
					}
				}
			},
			this.o.filebrowser
		);

		return jodit.getInstance<IFileBrowser>('FileBrowser', options);
	}

	private __mode: Modes = consts.MODE_WYSIWYG;

	/**
	 * Editor's mode
	 */
	get mode(): Modes {
		return this.__mode;
	}

	set mode(mode: Modes) {
		this.setMode(mode);
	}

	/**
	 * Return real HTML value from WYSIWYG editor.
	 */
	getNativeEditorValue(): string {
		const value: string = this.e.fire('beforeGetNativeEditorValue');

		if (isString(value)) {
			return value;
		}

		if (this.editor) {
			return this.editor.innerHTML;
		}

		return this.getElementValue();
	}

	/**
	 * Set value to native editor
	 */
	setNativeEditorValue(value: string): void {
		const data = {
			value
		};

		if (this.e.fire('beforeSetNativeEditorValue', data)) {
			return;
		}

		if (this.editor) {
			this.editor.innerHTML = data.value;
		}
	}

	/**
	 * HTML value
	 */
	get value(): string {
		return this.getEditorValue();
	}

	set value(html: string) {
		this.setEditorValue(html);
	}

	/**
	 * Return editor value
	 */
	getEditorValue(
		removeSelectionMarkers: boolean = true,
		consumer?: string
	): string {
		/**
		 * Triggered before getEditorValue executed.
		 * If returned not undefined getEditorValue will return this value
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('beforeGetValueFromEditor', function () {
		 *     return editor.editor.innerHTML.replace(/a/g, 'b');
		 * });
		 * ```
		 */
		let value: string;

		value = this.e.fire('beforeGetValueFromEditor', consumer);

		if (value !== undefined) {
			return value;
		}

		value = this.getNativeEditorValue().replace(
			consts.INVISIBLE_SPACE_REG_EXP(),
			''
		);

		if (removeSelectionMarkers) {
			value = value.replace(
				/<span[^>]+id="jodit-selection_marker_[^>]+><\/span>/g,
				''
			);
		}

		if (value === '<br>') {
			value = '';
		}

		/**
		 * Triggered after getEditorValue got value from wysiwyg.
		 * It can change new_value.value
		 *
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('afterGetValueFromEditor', function (new_value) {
		 *     new_value.value = new_value.value.replace('a', 'b');
		 * });
		 * ```
		 */
		const new_value: { value: string } = { value };

		this.e.fire('afterGetValueFromEditor', new_value, consumer);

		return new_value.value;
	}

	private __callChangeCount = 0;

	/**
	 * Set editor html value and if set sync fill source element value
	 * When method was called without arguments - it is simple way to synchronize editor to element
	 */
	setEditorValue(value?: string): void {
		/**
		 * Triggered before getEditorValue set value to wysiwyg.
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('beforeSetValueToEditor', function (old_value) {
		 *     return old_value.value.replace('a', 'b');
		 * });
		 * editor.e.on('beforeSetValueToEditor', function () {
		 *     return false; // disable setEditorValue method
		 * });
		 * ```
		 */
		const newValue: string | undefined | false = this.e.fire(
			'beforeSetValueToEditor',
			value
		);

		if (newValue === false) {
			return;
		}

		if (isString(newValue)) {
			value = newValue;
		}

		if (!this.editor) {
			if (value !== undefined) {
				this.setElementValue(value);
			}

			return; // try change value before init or after destruct
		}

		if (!isString(value) && !isVoid(value)) {
			throw error('value must be string');
		}

		if (value !== undefined && this.getNativeEditorValue() !== value) {
			this.setNativeEditorValue(value);
		}

		this.e.fire('postProcessSetEditorValue');

		const old_value = this.getElementValue(),
			new_value = this.getEditorValue();

		if (
			!this.isSilentChange &&
			old_value !== new_value &&
			this.__callChangeCount < consts.SAFE_COUNT_CHANGE_CALL
		) {
			this.setElementValue(new_value);
			this.__callChangeCount += 1;

			try {
				this.observer.upTick();
				this.e.fire('change', new_value, old_value);
				this.e.fire(this.observer, 'change', new_value, old_value);
			} finally {
				this.__callChangeCount = 0;
			}
		}
	}

	/**
	 * Return source element value
	 */
	getElementValue(): string {
		return (this.element as HTMLInputElement).value !== undefined
			? (this.element as HTMLInputElement).value
			: this.element.innerHTML;
	}

	/**
	 * Set source element value and if set sync fill editor value
	 * When method was called without arguments - it is simple way to synchronize element to editor
	 */
	setElementValue(value?: string): void {
		if (!isString(value) && value !== undefined) {
			throw error('value must be string');
		}

		if (value !== undefined) {
			if (this.element !== this.container) {
				if ((this.element as HTMLInputElement).value !== undefined) {
					(this.element as HTMLInputElement).value = value;
				} else {
					this.element.innerHTML = value;
				}
			}
		} else {
			value = this.getElementValue();
		}

		if (value !== this.getEditorValue()) {
			this.setEditorValue(value);
		}
	}

	/**
	 * Register custom handler for command
	 *
	 * @example
	 * ```javascript
	 * var jodit = new Jodit('#editor);
	 *
	 * jodit.setEditorValue('test test test');
	 *
	 * jodit.registerCommand('replaceString', function (command, needle, replace) {
	 *      var value = this.getEditorValue();
	 *      this.setEditorValue(value.replace(needle, replace));
	 *      return false; // stop execute native command
	 * });
	 *
	 * jodit.execCommand('replaceString', 'test', 'stop');
	 *
	 * console.log(jodit.value); // stop test test
	 *
	 * // and you can add hotkeys for command
	 * jodit.registerCommand('replaceString', {
	 *    hotkeys: 'ctrl+r',
	 *    exec: function (command, needle, replace) {
	 *     var value = this.getEditorValue();
	 *     this.setEditorValue(value.replace(needle, replace));
	 *    }
	 * });
	 *
	 * ```
	 */
	registerCommand(
		commandNameOriginal: string,
		command: CustomCommand<IJodit>,
		options?: {
			stopPropagation: boolean;
		}
	): IJodit {
		const commandName: string = commandNameOriginal.toLowerCase();

		if (this.commands[commandName] === undefined) {
			this.commands[commandName] = [];
		}

		this.commands[commandName].push(command);

		if (!isFunction(command)) {
			const hotkeys: string | string[] | void =
				this.o.commandToHotkeys[commandName] ||
				this.o.commandToHotkeys[commandNameOriginal] ||
				command.hotkeys;

			if (hotkeys) {
				this.registerHotkeyToCommand(
					hotkeys,
					commandName,
					options?.stopPropagation
				);
			}
		}

		return this;
	}

	/**
	 * Register hotkey for command
	 */
	registerHotkeyToCommand(
		hotkeys: string | string[],
		commandName: string,
		shouldStop: boolean = true
	): void {
		const shortcuts: string = asArray(hotkeys)
			.map(normalizeKeyAliases)
			.map(hotkey => hotkey + '.hotkey')
			.join(' ');

		this.e
			.off(shortcuts)
			.on(shortcuts, (type: string, stop: { shouldStop: boolean }) => {
				stop.shouldStop = shouldStop ?? true;
				return this.execCommand(commandName); // because need `beforeCommand`
			});
	}

	/**
	 * Execute command editor
	 *
	 * @param command - command. It supports all the
	 * {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands} and a number of its own
	 * for example applyStyleProperty. Comand fontSize receives the second parameter px,
	 * formatBlock and can take several options
	 * @example
	 * ```javascript
	 * this.execCommand('fontSize', 12); // sets the size of 12 px
	 * this.execCommand('underline');
	 * this.execCommand('formatBlock', 'p'); // will be inserted paragraph
	 * ```
	 */
	execCommand(
		command: string,
		showUI: boolean = false,
		value: null | any = null
	): void {
		if (this.o.readonly && command !== 'selectall') {
			return;
		}

		let result: any;
		command = command.toLowerCase();

		/**
		 * Called before any command
		 * @param command - Command name in lowercase
		 * @param second - The second parameter for the command
		 * @param third - The third option is for the team
		 * @example
		 * ```javascript
		 * parent.e.on('beforeCommand', function (command) {
		 *  if (command === 'justifyCenter') {
		 *      var p = parent.c.element('p')
		 *      parent.s.insertNode(p)
		 *      parent.s.setCursorIn(p);
		 *      p.style.textAlign = 'justyfy';
		 *      return false; // break execute native command
		 *  }
		 * })
		 * ```
		 */
		result = this.e.fire('beforeCommand', command, showUI, value);

		if (result !== false) {
			result = this.execCustomCommands(command, showUI, value);
		}

		if (result !== false) {
			this.s.focus();

			if (command === 'selectall') {
				this.s.select(this.editor, true);
			} else {
				try {
					result = this.nativeExecCommand(command, showUI, value);
				} catch (e) {
					if (!isProd) {
						throw e;
					}
				}
			}
		}

		/**
		 * It called after any command
		 * @param command - name command
		 * @param second - The second parameter for the command
		 * @param third - The third option is for the team
		 */
		this.e.fire('afterCommand', command, showUI, value);

		this.setEditorValue(); // synchrony

		return result;
	}

	/**
	 * Don't raise a change event
	 */
	private isSilentChange: boolean = false;

	/**
	 * Exec native command
	 */
	nativeExecCommand(
		command: string,
		showUI: boolean = false,
		value: null | any = null
	): boolean {
		this.isSilentChange = true;

		try {
			return this.ed.execCommand(command, showUI, value);
		} finally {
			this.isSilentChange = false;
		}
	}

	private execCustomCommands(
		commandName: string,
		second: any = false,
		third: null | any = null
	): false | void {
		commandName = commandName.toLowerCase();

		if (this.commands[commandName] !== undefined) {
			let result: any;

			const exec = (command: CustomCommand<Jodit>) => {
				let callback: ExecCommandCallback<Jodit>;

				if (isFunction(command)) {
					callback = command;
				} else {
					callback = command.exec;
				}

				const resultCurrent: any = (callback as any).call(
					this,
					commandName,
					second,
					third
				);

				if (resultCurrent !== undefined) {
					result = resultCurrent;
				}
			};

			for (let i = 0; i < this.commands[commandName].length; i += 1) {
				exec(this.commands[commandName][i]);
			}

			return result;
		}
	}

	/**
	 * Disable selecting
	 */
	override lock(name = 'any'): boolean {
		if (super.lock(name)) {
			this.__selectionLocked = this.s.save();
			this.s.clear();
			this.editor.classList.add('jodit_disabled');
			this.e.fire('lock', true);
			return true;
		}

		return false;
	}

	/**
	 * Enable selecting
	 */
	override unlock(): boolean {
		if (super.unlock()) {
			this.editor.classList.remove('jodit_disabled');

			if (this.__selectionLocked) {
				this.s.restore();
			}

			this.e.fire('lock', false);
			return true;
		}

		return false;
	}

	/**
	 * Return current editor mode: Jodit.MODE_WYSIWYG, Jodit.MODE_SOURCE or Jodit.MODE_SPLIT
	 */
	getMode(): Modes {
		return this.mode;
	}

	isEditorMode(): boolean {
		return this.getRealMode() === consts.MODE_WYSIWYG;
	}

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
	getRealMode(): Modes {
		if (this.getMode() !== consts.MODE_SPLIT) {
			return this.getMode();
		}

		const active = this.od.activeElement;

		if (
			active &&
			(active === this.iframe ||
				Dom.isOrContains(this.editor, active) ||
				Dom.isOrContains(this.toolbar.container, active))
		) {
			return consts.MODE_WYSIWYG;
		}

		return consts.MODE_SOURCE;
	}

	/**
	 * Set current mode
	 */
	setMode(mode: number | string): void {
		const oldmode: Modes = this.getMode();

		const data = {
				mode: parseInt(mode.toString(), 10) as Modes
			},
			modeClasses = [
				'jodit-wysiwyg_mode',
				'jodit-source__mode',
				'jodit_split_mode'
			];

		/**
		 * Triggered before setMode executed. If returned false method stopped
		 * @param data - PlainObject `{mode: {string}}` In handler you can change data.mode
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('beforeSetMode', function (data) {
		 *     data.mode = Jodit.MODE_SOURCE; // not respond to the mode change. Always make the source code mode
		 * });
		 * ```
		 */
		if (this.e.fire('beforeSetMode', data) === false) {
			return;
		}

		this.__mode = [
			consts.MODE_SOURCE,
			consts.MODE_WYSIWYG,
			consts.MODE_SPLIT
		].includes(data.mode)
			? data.mode
			: consts.MODE_WYSIWYG;

		if (this.o.saveModeInStorage) {
			this.storage.set('jodit_default_mode', this.mode);
		}

		modeClasses.forEach(className => {
			this.container.classList.remove(className);
		});

		this.container.classList.add(modeClasses[this.mode - 1]);

		/**
		 * Triggered after setMode executed
		 * @example
		 * ```javascript
		 * var editor = new Jodit("#redactor");
		 * editor.e.on('afterSetMode', function () {
		 *     editor.setEditorValue(''); // clear editor's value after change mode
		 * });
		 * ```
		 */
		if (oldmode !== this.getMode()) {
			this.e.fire('afterSetMode');
		}
	}

	/**
	 * Toggle editor mode WYSIWYG to TEXTAREA(CodeMirror) to SPLIT(WYSIWYG and TEXTAREA) to again WYSIWYG
	 *
	 * @example
	 * ```javascript
	 * var editor = new Jodit('#editor');
	 * editor.toggleMode();
	 * ```
	 */
	toggleMode(): void {
		let mode = this.getMode();

		if (
			[
				consts.MODE_SOURCE,
				consts.MODE_WYSIWYG,
				this.o.useSplitMode ? consts.MODE_SPLIT : 9
			].includes(mode + 1)
		) {
			mode += 1;
		} else {
			mode = consts.MODE_WYSIWYG;
		}

		this.setMode(mode);
	}

	/**
	 * Switch on/off the editor into the disabled state.
	 * When in disabled, the user is not able to change the editor content
	 * This function firing the `disabled` event.
	 */
	setDisabled(isDisabled: boolean): void {
		this.o.disabled = isDisabled;

		const readOnly: boolean = this.__wasReadOnly;

		this.setReadOnly(isDisabled || readOnly);
		this.__wasReadOnly = readOnly;

		if (this.editor) {
			this.editor.setAttribute('aria-disabled', isDisabled.toString());
			this.container.classList.toggle('jodit_disabled', isDisabled);
			this.e.fire('disabled', isDisabled);
		}
	}

	/**
	 * Return true if editor in disabled mode
	 */
	getDisabled(): boolean {
		return this.o.disabled;
	}

	/**
	 * Switch on/off the editor into the read-only state.
	 * When in readonly, the user is not able to change the editor content, but can still
	 * use some editor functions (show source code, print content, or seach).
	 * This function firing the `readonly` event.
	 */
	setReadOnly(isReadOnly: boolean): void {
		if (this.__wasReadOnly === isReadOnly) {
			return;
		}

		this.__wasReadOnly = isReadOnly;
		this.o.readonly = isReadOnly;

		if (isReadOnly) {
			this.editor && this.editor.removeAttribute('contenteditable');
		} else {
			this.editor && this.editor.setAttribute('contenteditable', 'true');
		}

		this.e && this.e.fire('readonly', isReadOnly);
	}

	/**
	 * Return true if editor in read-only mode
	 */
	getReadOnly(): boolean {
		return this.o.readonly;
	}

	/**
	 * Hook before init
	 */
	beforeInitHook(): CanPromise<void> {
		// do nothing
	}

	/**
	 * Hook after init
	 */
	afterInitHook(): void {
		// do nothing
	}

	/** @override **/
	protected override initOptions(options?: object): void {
		this.options = <Config>(
			ConfigProto(options || {}, Config.defaultOptions)
		);
	}

	/** @override **/
	protected override initOwners(): void {
		// in iframe it can be changed
		this.editorWindow = this.o.ownerWindow;
		this.ownerWindow = this.o.ownerWindow;
	}

	/**
	 * Create instance of Jodit
	 *
	 * @param element - Selector or HTMLElement
	 * @param options - Editor's options
	 */
	constructor(element: HTMLElement | string, options?: object) {
		super(options as IViewOptions, true);

		try {
			const elementSource = resolveElement(
				element,
				this.o.shadowRoot || this.od
			);

			if (Jodit.isJoditAssigned(elementSource)) {
				return elementSource.component;
			}
		} catch (e) {
			this.destruct();
			throw e;
		}

		this.setStatus(STATUSES.beforeInit);

		this.id =
			attr(resolveElement(element, this.o.shadowRoot || this.od), 'id') ||
			new Date().getTime().toString();

		instances[this.id] = this;

		this.storage = Storage.makeStorage(true, this.id);

		this.attachEvents(options as IViewOptions);

		this.e.on(this.ow, 'resize', () => {
			if (this.e) {
				this.e.fire('resize');
			}
		});

		this.e.on('prepareWYSIWYGEditor', this.prepareWYSIWYGEditor);

		this.selection = new Select(this);

		const beforeInitHookResult = this.beforeInitHook();

		callPromise(beforeInitHookResult, (): void => {
			this.e.fire('beforeInit', this);

			const initPluginsResult = pluginSystem.init(this);

			callPromise(initPluginsResult, () => {
				this.e.fire('afterPluginSystemInit', this);

				this.e.on('changePlace', () => {
					this.setReadOnly(this.o.readonly);
					this.setDisabled(this.o.disabled);
				});

				this.places.length = 0;
				const addPlaceResult = this.addPlace(element, options);

				instances[this.id] = this;

				const init = () => {
					if (this.e) {
						this.e.fire('afterInit', this);
					}

					this.afterInitHook();

					this.setStatus(STATUSES.ready);

					this.e.fire('afterConstructor', this);
				};

				callPromise(addPlaceResult, init);
			});
		});
	}

	currentPlace!: IWorkPlace;
	places!: IWorkPlace[];

	private elementToPlace: Map<HTMLElement, IWorkPlace> = new Map();

	/**
	 * Create and init current editable place
	 */
	addPlace(
		source: HTMLElement | string,
		options?: object
	): void | Promise<any> {
		const element = resolveElement(source, this.o.shadowRoot || this.od);

		this.attachEvents(options as IViewOptions);

		if (element.attributes) {
			toArray(element.attributes).forEach((attr: Attr) => {
				const name: string = attr.name;
				let value: string | boolean | number = attr.value;

				if (
					(Config.defaultOptions as any)[name] !== undefined &&
					(!options || (options as any)[name] === undefined)
				) {
					if (['readonly', 'disabled'].indexOf(name) !== -1) {
						value = value === '' || value === 'true';
					}

					if (/^[0-9]+(\.)?([0-9]+)?$/.test(value.toString())) {
						value = Number(value);
					}

					(this.options as any)[name] = value;
				}
			});
		}

		let container = this.c.div('jodit-container');

		container.classList.add('jodit');
		container.classList.add('jodit-container');
		container.classList.add(`jodit_theme_${this.o.theme || 'default'}`);

		const { styleValues } = this.o;

		Object.keys(styleValues).forEach(key => {
			const property = kebabCase(key);
			container.style.setProperty(`--jd-${property}`, styleValues[key]);
		});

		container.setAttribute('contenteditable', 'false');

		let buffer: null | string = null;

		if (this.o.inline) {
			if (['TEXTAREA', 'INPUT'].indexOf(element.nodeName) === -1) {
				container = element as HTMLDivElement;
				element.setAttribute(
					this.__defaultClassesKey,
					element.className.toString()
				);

				buffer = container.innerHTML;

				container.innerHTML = '';
			}

			container.classList.add('jodit_inline');
			container.classList.add('jodit-container');
		}

		// actual for inline mode
		if (element !== container) {
			// hide source element
			if (element.style.display) {
				element.setAttribute(
					this.__defaultStyleDisplayKey,
					element.style.display
				);
			}

			element.style.display = 'none';
		}

		const workplace = this.c.div('jodit-workplace', {
			contenteditable: false
		});

		container.appendChild(workplace);

		if (element.parentNode && element !== container) {
			element.parentNode.insertBefore(container, element);
		}

		Object.defineProperty(element, 'component', {
			enumerable: false,
			configurable: true,
			value: this
		});

		const editor = this.c.div('jodit-wysiwyg', {
			contenteditable: true,
			'aria-disabled': false,
			tabindex: this.o.tabIndex
		});

		workplace.appendChild(editor);

		const currentPlace: IWorkPlace = {
			editor,
			element,
			container,
			workplace,
			statusbar: new StatusBar(this, container),
			options: this.isReady
				? (ConfigProto(
						options || {},
						Config.defaultOptions
				  ) as IWorkPlace['options'])
				: this.options,
			observer: new Observer(this),
			editorWindow: this.ow
		};

		this.elementToPlace.set(editor, currentPlace);

		this.setCurrentPlace(currentPlace);
		this.places.push(currentPlace);

		this.setNativeEditorValue(this.getElementValue()); // Init value

		const initResult = this.initEditor(buffer);

		const opt = this.options;

		const init = () => {
			if (
				opt.enableDragAndDropFileToEditor &&
				opt.uploader &&
				(opt.uploader.url || opt.uploader.insertImageAsBase64URI)
			) {
				this.uploader.bind(this.editor);
			}

			// in initEditor - the editor could change
			if (!this.elementToPlace.get(this.editor)) {
				this.elementToPlace.set(this.editor, currentPlace);
			}

			this.e.fire('afterAddPlace', currentPlace);
		};

		return callPromise(initResult, init);
	}

	/** @override */
	protected override addDisclaimer(elm: HTMLElement): void {
		this.workplace.appendChild(elm);
	}

	/**
	 * Set current place object
	 */
	setCurrentPlace(place: IWorkPlace): void {
		if (this.currentPlace === place) {
			return;
		}

		if (!this.isEditorMode()) {
			this.setMode(consts.MODE_WYSIWYG);
		}

		this.currentPlace = place;

		this.buildToolbar();

		if (this.isReady) {
			this.e.fire('changePlace', place);
		}
	}

	private initEditor(buffer: null | string): void | Promise<any> {
		const result = this.createEditor();

		return callPromise(result, () => {
			if (this.isInDestruct) {
				return;
			}

			// syncro
			if (this.element !== this.container) {
				this.setElementValue();
			} else {
				buffer != null && this.setEditorValue(buffer); // inline mode
			}

			let mode = this.o.defaultMode;

			if (this.o.saveModeInStorage) {
				const localMode = this.storage.get('jodit_default_mode');

				if (typeof localMode === 'string') {
					mode = parseInt(localMode, 10);
				}
			}

			this.setMode(mode);

			if (this.o.readonly) {
				this.__wasReadOnly = false;
				this.setReadOnly(true);
			}

			if (this.o.disabled) {
				this.setDisabled(true);
			}

			// if enter plugin not installed
			try {
				this.ed.execCommand(
					'defaultParagraphSeparator',
					false,
					this.o.enter.toLowerCase()
				);
			} catch {}

			// fix for native resizing
			try {
				this.ed.execCommand('enableObjectResizing', false, 'false');
			} catch {}

			try {
				this.ed.execCommand('enableInlineTableEditing', false, 'false');
			} catch {}
		});
	}

	/**
	 * Create main DIV element and replace source textarea
	 */
	private createEditor(): void | Promise<any> {
		const defaultEditorArea = this.editor;

		const stayDefault: boolean | undefined | Promise<void> = this.e.fire(
			'createEditor',
			this
		);

		return callPromise(stayDefault, () => {
			if (this.isInDestruct) {
				return;
			}

			if (stayDefault === false || isPromise(stayDefault)) {
				Dom.safeRemove(defaultEditorArea);
			}

			if (this.o.editorCssClass) {
				this.editor.classList.add(this.o.editorCssClass);
			}

			if (this.o.style) {
				css(this.editor, this.o.style);
			}

			this.e
				.on('synchro', () => {
					this.setEditorValue();
				})
				.on('focus', () => {
					this.editorIsActive = true;
				})
				.on('blur', () => (this.editorIsActive = false));

			this.prepareWYSIWYGEditor();

			// direction
			if (this.o.direction) {
				const direction =
					this.o.direction.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';

				this.container.style.direction = direction;
				this.container.setAttribute('dir', direction);

				this.toolbar.setDirection(direction);
			}

			if (this.o.triggerChangeEvent) {
				this.e.on(
					'change',
					this.async.debounce(() => {
						this.e && this.e.fire(this.element, 'change');
					}, this.defaultTimeout)
				);
			}
		});
	}

	/**
	 * Attach some native event listeners
	 */
	@autobind
	private prepareWYSIWYGEditor() {
		const { editor } = this;

		if (this.o.spellcheck) {
			this.editor.setAttribute('spellcheck', 'true');
		} else {
			this.editor.setAttribute('spellcheck', 'false');
		}

		// direction
		if (this.o.direction) {
			const direction =
				this.o.direction.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';

			this.editor.style.direction = direction;
			this.editor.setAttribute('dir', direction);
		}

		// proxy events
		this.e
			.on(editor, 'mousedown touchstart focus', () => {
				const place = this.elementToPlace.get(editor);

				if (place) {
					this.setCurrentPlace(place);
				}
			})
			.on(editor, 'compositionend', () => {
				this.setEditorValue();
			})
			.on(
				editor,
				'selectionchange selectionstart keydown keyup input keypress dblclick mousedown mouseup ' +
					'click copy cut dragstart drop dragover paste resize touchstart touchend focus blur',
				(event: Event): false | void => {
					if (this.o.readonly || this.isSilentChange) {
						return;
					}

					const w = this.ew;
					if (
						event instanceof (w as any).KeyboardEvent &&
						(event as KeyboardEvent).isComposing
					) {
						return;
					}

					if (this.e && this.e.fire) {
						if (this.e.fire(event.type, event) === false) {
							return false;
						}

						this.setEditorValue();
					}
				}
			);
	}

	/**
	 * Jodit's Destructor. Remove editor, and return source input
	 */
	override destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		this.elementToPlace.clear();

		if (!this.editor) {
			return;
		}

		const buffer = this.getEditorValue();

		this.storage.clear();

		this.buffer.clear();

		this.commands = {};

		this.__selectionLocked = null;

		this.e.off(this.ow, 'resize');
		this.e.off(this.ow);
		this.e.off(this.od);
		this.e.off(this.od.body);

		this.places.forEach(
			({
				container,
				workplace,
				statusbar,
				element,
				iframe,
				editor,
				observer
			}) => {
				if (element !== container) {
					if (element.hasAttribute(this.__defaultStyleDisplayKey)) {
						const display = attr(
							element,
							this.__defaultStyleDisplayKey
						);

						if (display) {
							element.style.display = display;
							element.removeAttribute(
								this.__defaultStyleDisplayKey
							);
						}
					} else {
						element.style.display = '';
					}
				} else {
					if (element.hasAttribute(this.__defaultClassesKey)) {
						element.className =
							attr(element, this.__defaultClassesKey) || '';
						element.removeAttribute(this.__defaultClassesKey);
					}
				}

				if (element.hasAttribute('style') && !attr(element, 'style')) {
					element.removeAttribute('style');
				}

				!statusbar.isInDestruct && statusbar.destruct();

				this.e.off(container);
				this.e.off(element);
				this.e.off(editor);

				Dom.safeRemove(workplace);
				Dom.safeRemove(editor);

				if (container !== element) {
					Dom.safeRemove(container);
				}

				Object.defineProperty(element, 'component', {
					enumerable: false,
					configurable: true,
					value: null
				});

				Dom.safeRemove(iframe);

				// inline mode
				if (container === element) {
					element.innerHTML = buffer;
				}

				!observer.isInDestruct && observer.destruct();
			}
		);

		this.places.length = 0;
		this.currentPlace = {} as any;

		delete instances[this.id];

		super.destruct();
	}
}
