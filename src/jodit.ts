/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	IHistory,
	AjaxOptions,
	IResponse
} from 'jodit/types';

import type * as Modules from 'jodit/modules/';

import { Config } from 'jodit/config';
import * as constants from 'jodit/core/constants';

import {
	Create,
	Dom,
	History,
	Plugin,
	Select,
	StatusBar,
	STATUSES,
	UIMessages,
	ViewWithToolbar
} from 'jodit/modules/';

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
	isJoditObject,
	isNumber
} from 'jodit/core/helpers/';

import { Storage } from 'jodit/core/storage/';

import { lang } from 'jodit/core/constants';
import {
	instances,
	pluginSystem,
	modules,
	eventEmitter
} from 'jodit/core/global';
import {
	autobind,
	cache,
	throttle,
	watch,
	derive
} from 'jodit/core/decorators';
import { Dlgs } from 'jodit/core/traits';
import { Ajax } from 'jodit/core/request';

const __defaultStyleDisplayKey = 'data-jodit-default-style-display';
const __defaultClassesKey = 'data-jodit-default-classes';

/**
 * Class Jodit. Main class
 */
export interface Jodit extends Dlgs {}

@derive(Dlgs)
export class Jodit extends ViewWithToolbar implements IJodit, Dlgs {
	/** @override */
	override className(): string {
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

	static get ready(): Promise<IJodit> {
		return new Promise(resolve => {
			eventEmitter.on('oditready', resolve);
		});
	}

	/**
	 * Define if object is Jodit
	 */
	override readonly isJodit = true as const;

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
	 * By default, `{history.timeout}` options
	 */
	override get defaultTimeout(): number {
		return isNumber(this.o.defaultTimeout)
			? this.o.defaultTimeout
			: Config.defaultOptions.defaultTimeout;
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
		return new this(element, options);
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

	static readonly plugins: IPluginSystem = pluginSystem;

	static modules: typeof Modules = modules as unknown as typeof Modules;
	static ns: typeof Modules = modules as unknown as typeof Modules;

	static readonly decorators: IDictionary<Function> = {};
	static readonly constants: typeof constants = constants;
	static readonly instances: IDictionary<IJodit> = instances;

	static readonly lang: any = lang;

	static readonly core = {
		Plugin
	};

	private readonly commands: Map<string, CustomCommand<IJodit, string>[]> =
		new Map();

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

	private __setPlaceField(field: keyof IWorkPlace, value: any): void {
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
		this.__setPlaceField('editor', editor);
	}

	/**
	 * Container for all staff
	 */
	override get container(): HTMLDivElement {
		return this.currentPlace.container;
	}

	override set container(container: HTMLDivElement) {
		this.__setPlaceField('container', container);
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
		this.__setPlaceField('iframe', iframe);
	}

	get history(): IHistory {
		return this.currentPlace.history;
	}

	/**
	 * @deprecated Instead use `Jodit.history`
	 */
	get observer(): IHistory {
		return this.history;
	}

	/**
	 * In iframe mode editor's window can be different by owner
	 */
	get editorWindow(): Window {
		return this.currentPlace.editorWindow;
	}

	set editorWindow(win: Window) {
		this.__setPlaceField('editorWindow', win);
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
		this.__setPlaceField('options', opt);
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
				shadowRoot: jodit.o.shadowRoot,
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

	private __mode: Modes = constants.MODE_WYSIWYG;

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
	 * @internal
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
		// @ts-ignore Internal method
		this.history.__processChanges();
	}

	@throttle()
	synchronizeValues(): void {
		this.__imdSynchronizeValues();
	}

	/**
	 * This is an internal method, do not use it in your applications.
	 * @private
	 * @internal
	 */
	__imdSynchronizeValues(): void {
		this.setEditorValue();
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
		 * var editor = Jodit.make("#redactor");
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
			constants.INVISIBLE_SPACE_REG_EXP(),
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
		 * var editor = Jodit.make("#redactor");
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
		 * var editor = Jodit.make("#redactor");
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
				this.__setElementValue(value);
			}

			return; // try change value before init or after destruct
		}

		if (!isString(value) && !isVoid(value)) {
			throw error('value must be string');
		}

		if (!isVoid(value) && this.getNativeEditorValue() !== value) {
			this.setNativeEditorValue(value);
		}

		this.e.fire('postProcessSetEditorValue');

		const old_value = this.getElementValue(),
			new_value = this.getEditorValue();

		if (
			!this.__isSilentChange &&
			old_value !== new_value &&
			this.__callChangeCount < constants.SAFE_COUNT_CHANGE_CALL
		) {
			this.__setElementValue(new_value);
			this.__callChangeCount += 1;

			if (!isProd && this.__callChangeCount > 4) {
				console.warn(
					'Too many recursive changes',
					new_value,
					old_value
				);
			}

			try {
				// @ts-ignore Internal method
				this.history.__upTick();
				this.e.fire('change', new_value, old_value);
				this.e.fire(this.history, 'change', new_value, old_value);
			} finally {
				this.__callChangeCount = 0;
			}
		}
	}

	/**
	 * If some plugin changes the DOM directly, then you need to update the content of the original element
	 */
	@watch(':internalChange')
	protected updateElementValue(): void {
		this.__setElementValue(this.getEditorValue());
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
	 * @deprecated Use `Jodit.value` instead
	 */
	protected setElementValue(value?: string): CanPromise<void> {
		const oldValue = this.getElementValue();

		if (value === undefined || (isString(value) && value !== oldValue)) {
			value ??= oldValue;

			if (value !== this.getEditorValue()) {
				this.setEditorValue(value);
			}
		}

		return this.__setElementValue(value);
	}

	private __setElementValue(value: string): CanPromise<void> {
		if (!isString(value)) {
			throw error('value must be string');
		}

		if (
			this.element !== this.container &&
			value !== this.getElementValue()
		) {
			const data = { value };

			const res = this.e.fire('beforeSetElementValue', data);

			callPromise(res, () => {
				if ((this.element as HTMLInputElement).value !== undefined) {
					(this.element as HTMLInputElement).value = data.value;
				} else {
					this.element.innerHTML = data.value;
				}

				this.e.fire('afterSetElementValue', data);
			});
		}
	}

	/**
	 * Register custom handler for command
	 *
	 * @example
	 * ```javascript
	 * var jodit = Jodit.make('#editor);
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
	registerCommand<C extends string>(
		commandNameOriginal: C,
		command: CustomCommand<IJodit, C>,
		options?: {
			stopPropagation: boolean;
		}
	): IJodit {
		const commandName: string = commandNameOriginal.toLowerCase();

		let commands = this.commands.get(commandName);
		if (commands === undefined) {
			commands = [];
			this.commands.set(commandName, commands);
		}

		commands.push(command as CustomCommand<IJodit, string>);

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
				if (stop) {
					stop.shouldStop = shouldStop ?? true;
				}

				return this.execCommand(commandName); // because need `beforeCommand`
			});
	}

	/**
	 * Execute command editor
	 *
	 * @param command - command. It supports all the
	 * @see https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands and a number of its own
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
		showUI?: boolean,
		value?: null | any,
		...args: unknown[]
	): void {
		if (!this.s.isFocused()) {
			this.s.focus();
		}

		if (
			this.o.readonly &&
			!this.o.allowCommandsInReadOnly.includes(command)
		) {
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
		result = this.e.fire('beforeCommand', command, showUI, value, ...args);

		if (result !== false) {
			result = this.__execCustomCommands(command, showUI, value, ...args);
		}

		if (result !== false) {
			this.s.focus();

			if (command === 'selectall') {
				this.s.select(this.editor, true);
				this.s.expandSelection();
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
	private __isSilentChange: boolean = false;

	/**
	 * Exec native command
	 */
	nativeExecCommand(
		command: string,
		showUI?: boolean,
		value?: null | any
	): boolean {
		this.__isSilentChange = true;

		try {
			return this.ed.execCommand(command, showUI, value);
		} finally {
			this.__isSilentChange = false;
		}
	}

	private __execCustomCommands<C extends string>(
		commandName: C,
		second?: any,
		third?: null | any,
		...args: unknown[]
	): false | void {
		commandName = commandName.toLowerCase() as C;

		const commands = this.commands.get(commandName);

		if (commands !== undefined) {
			let result: any;

			commands.forEach((command: CustomCommand<Jodit, C>) => {
				let callback: ExecCommandCallback<Jodit, C>;

				if (isFunction(command)) {
					callback = command;
				} else {
					callback = command.exec;
				}

				const resultCurrent: any = callback.call(
					this,
					commandName,
					second,
					third,
					...args
				);

				if (resultCurrent !== undefined) {
					result = resultCurrent;
				}
			});

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
			this.editor.classList.add('jodit_lock');
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
			this.editor.classList.remove('jodit_lock');

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
		return this.getRealMode() === constants.MODE_WYSIWYG;
	}

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
	getRealMode(): Modes {
		if (this.getMode() !== constants.MODE_SPLIT) {
			return this.getMode();
		}

		const active = this.od.activeElement;

		if (
			active &&
			(active === this.iframe ||
				Dom.isOrContains(this.editor, active) ||
				Dom.isOrContains(this.toolbar.container, active))
		) {
			return constants.MODE_WYSIWYG;
		}

		return constants.MODE_SOURCE;
	}

	/**
	 * Set current mode
	 */
	setMode(mode: number | string): void {
		const oldMode: Modes = this.getMode();

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
		 * var editor = Jodit.make("#redactor");
		 * editor.e.on('beforeSetMode', function (data) {
		 *     data.mode = Jodit.MODE_SOURCE; // not respond to the mode change. Always make the source code mode
		 * });
		 * ```
		 */
		if (this.e.fire('beforeSetMode', data) === false) {
			return;
		}

		this.__mode = [
			constants.MODE_SOURCE,
			constants.MODE_WYSIWYG,
			constants.MODE_SPLIT
		].includes(data.mode)
			? data.mode
			: constants.MODE_WYSIWYG;

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
		 * var editor = Jodit.make("#redactor");
		 * editor.e.on('afterSetMode', function () {
		 *     editor.setEditorValue(''); // clear editor's value after change mode
		 * });
		 * ```
		 */
		if (oldMode !== this.getMode()) {
			this.e.fire('afterSetMode');
		}
	}

	/**
	 * Toggle editor mode WYSIWYG to TEXTAREA(CodeMirror) to SPLIT(WYSIWYG and TEXTAREA) to again WYSIWYG
	 *
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('#editor');
	 * editor.toggleMode();
	 * ```
	 */
	toggleMode(): void {
		let mode = this.getMode();

		if (
			[
				constants.MODE_SOURCE,
				constants.MODE_WYSIWYG,
				this.o.useSplitMode ? constants.MODE_SPLIT : 9
			].includes(mode + 1)
		) {
			mode += 1;
		} else {
			mode = constants.MODE_WYSIWYG;
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

	focus(): void {
		if (this.getMode() !== constants.MODE_SOURCE) {
			this.s.focus();
		}
	}

	get isFocused(): boolean {
		return this.s.isFocused();
	}

	/**
	 * Hook before init
	 */
	protected beforeInitHook(): CanPromise<void> {
		// do nothing
	}

	/**
	 * Hook after init
	 */
	protected afterInitHook(): void {
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
	 *
	 * @deprecated - Instead use `Jodit.make`
	 */
	constructor(element: HTMLElement | string, options?: object) {
		super(options as IViewOptions, true);

		try {
			const elementSource = resolveElement(
				element,
				this.o.shadowRoot || this.od
			);

			if (Jodit.isJoditAssigned(elementSource)) {
				// @ts-ignore
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

		this.e.on('prepareWYSIWYGEditor', this.__prepareWYSIWYGEditor);

		this.selection = new Select(this);

		const beforeInitHookResult = this.beforeInitHook();

		callPromise(beforeInitHookResult, (): void => {
			this.e.fire('beforeInit', this);

			pluginSystem.__init(this);

			this.e.fire('afterPluginSystemInit', this);

			this.e.on('changePlace', () => {
				this.setReadOnly(this.o.readonly);
				this.setDisabled(this.o.disabled);
			});

			this.places.length = 0;
			const addPlaceResult = this.addPlace(element, options);

			instances[this.id] = this;

			const init = (): void => {
				if (this.e) {
					this.e.fire('afterInit', this);
				}

				this.afterInitHook();

				this.setStatus(STATUSES.ready);

				this.e.fire('afterConstructor', this);
			};

			callPromise(addPlaceResult, init);
		});
	}

	currentPlace!: IWorkPlace;
	places!: IWorkPlace[];

	private readonly __elementToPlace: Map<HTMLElement, IWorkPlace> = new Map();

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
		addClassNames(this.o.className, container);

		if (this.o.containerStyle) {
			css(container, this.o.containerStyle);
		}

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
					__defaultClassesKey,
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
					__defaultStyleDisplayKey,
					element.style.display
				);
			}

			element.style.display = 'none';
		}

		const workplace = this.c.div('jodit-workplace', {
			contenteditable: false
		});

		container.appendChild(workplace);

		this.message.destruct();
		this.message = new UIMessages(this, workplace);

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
			history: new History(this),
			editorWindow: this.ow
		};

		this.__elementToPlace.set(editor, currentPlace);

		this.setCurrentPlace(currentPlace);
		this.places.push(currentPlace);

		this.setNativeEditorValue(this.getElementValue()); // Init value

		const initResult = this.__initEditor(buffer);

		const opt = this.options;

		const init = (): void => {
			if (
				opt.enableDragAndDropFileToEditor &&
				opt.uploader &&
				(opt.uploader.url || opt.uploader.insertImageAsBase64URI)
			) {
				this.uploader.bind(this.editor);
			}

			// in initEditor - the editor could change
			if (!this.__elementToPlace.get(this.editor)) {
				this.__elementToPlace.set(this.editor, currentPlace);
			}

			this.e.fire('afterAddPlace', currentPlace);
		};

		return callPromise(initResult, init);
	}

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
			this.setMode(constants.MODE_WYSIWYG);
		}

		this.currentPlace = place;

		this.buildToolbar();

		if (this.isReady) {
			this.e.fire('changePlace', place);
		}
	}

	private __initEditor(buffer: null | string): void | Promise<any> {
		const result = this.__createEditor();

		return callPromise(result, () => {
			if (this.isInDestruct) {
				return;
			}

			// syncro
			if (this.element !== this.container) {
				const value = this.getElementValue();

				if (value !== this.getEditorValue()) {
					this.setEditorValue(value);
				}
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
	private __createEditor(): void | Promise<any> {
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

			addClassNames(
				this.o.editorClassName || this.o.editorCssClass,
				this.editor
			);

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

			this.__prepareWYSIWYGEditor();

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
	private __prepareWYSIWYGEditor(): void {
		const { editor } = this;

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
				const place = this.__elementToPlace.get(editor);

				if (place) {
					this.setCurrentPlace(place);
				}
			})
			.on(editor, 'compositionend', this.synchronizeValues)
			.on(
				editor,
				'selectionchange selectionstart keydown keyup input keypress dblclick mousedown mouseup ' +
					'click copy cut dragstart drop dragover paste resize touchstart touchend focus blur',
				(event: Event): false | void => {
					if (this.o.readonly || this.__isSilentChange) {
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

						this.synchronizeValues();
					}
				}
			);
	}

	fetch<Response extends object = any>(
		url: string,
		options?: Partial<AjaxOptions>
	): Promise<IResponse<Response>> {
		const ajax = new Ajax<Response>(
			{
				url,
				...options
			},
			this.o.defaultAjaxOptions
		);

		const destroy = (): void => {
			this.e.off('beforeDestruct', destroy);
			this.progressbar.progress(100).hide();
			ajax.destruct();
		};
		this.e.one('beforeDestruct', destroy);

		this.progressbar.show().progress(30);
		const promise = ajax.send();

		promise.finally(destroy).catch(() => null);

		return promise;
	}

	/**
	 * Jodit's Destructor. Remove editor, and return source input
	 */
	override destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		this.__elementToPlace.clear();

		if (!this.editor) {
			return;
		}

		const buffer = this.getEditorValue();

		this.storage.clear();
		this.buffer.clear();
		this.commands.clear();

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
				history
			}) => {
				if (element !== container) {
					if (element.hasAttribute(__defaultStyleDisplayKey)) {
						const display = attr(element, __defaultStyleDisplayKey);

						if (display) {
							element.style.display = display;
							element.removeAttribute(__defaultStyleDisplayKey);
						}
					} else {
						element.style.display = '';
					}
				} else {
					if (element.hasAttribute(__defaultClassesKey)) {
						element.className =
							attr(element, __defaultClassesKey) || '';
						element.removeAttribute(__defaultClassesKey);
					}
				}

				if (element.hasAttribute('style') && !attr(element, 'style')) {
					element.removeAttribute('style');
				}

				statusbar.destruct();

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

				history.destruct();
			}
		);

		this.places.length = 0;
		this.currentPlace = {} as any;

		delete instances[this.id];

		super.destruct();
	}
}

function addClassNames(className: string | false, elm: HTMLElement): void {
	if (className) {
		className.split(/\s+/).forEach(cn => elm.classList.add(cn));
	}
}
