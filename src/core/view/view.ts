/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/view/README.md]]
 * @packageDocumentation
 * @module view
 */

import type {
	IComponent,
	ICreate,
	IProgressBar,
	IStorage,
	IViewBased,
	IViewOptions,
	Nullable,
	IDictionary,
	IEventEmitter,
	IMessages
} from 'jodit/types';
import { Storage } from 'jodit/core/storage';
import {
	camelCase,
	ConfigProto,
	error,
	i18n,
	isDestructable,
	isFunction,
	isVoid
} from 'jodit/core/helpers';
import {
	APP_VERSION,
	BASE_PATH,
	ES,
	IS_ES_MODERN,
	IS_ES_NEXT
} from 'jodit/core/constants';
import {
	Component,
	STATUSES,
	ProgressBar,
	Create,
	Dom,
	ViewComponent
} from 'jodit/modules';
import { modules } from 'jodit/core/global';
import { hook, derive, cache } from 'jodit/core/decorators';
import { Mods } from 'jodit/core/traits/mods';
import { Elms } from 'jodit/core/traits/elms';
import { EventEmitter } from 'jodit/core/event-emitter';
import { UIMessages } from 'jodit/modules/messages/messages';

export interface View extends Mods, Elms {}

@derive(Mods, Elms)
export abstract class View extends Component implements IViewBased, Mods, Elms {
	readonly isView = true as const;
	parent: Nullable<IViewBased> = null;

	readonly mods: IDictionary<string | boolean | null> = {};

	/**
	 * ID attribute for source element, id add `{id}_editor` it's editor's id
	 */
	id!: string;

	/**
	 * All created ViewComponent inside this view
	 */
	readonly components: Set<IComponent> = new Set();

	/**
	 * Get path for loading extra staff
	 */
	get basePath(): string {
		if (this.o.basePath) {
			return this.o.basePath;
		}

		return BASE_PATH;
	}

	// from webpack.config.js
	static readonly ES: 'es5' | 'es2015' | 'es2018' | 'es2021' = ES;
	static readonly version: string = APP_VERSION;
	static readonly esNext: boolean = IS_ES_NEXT; // from webpack.config.js
	static readonly esModern: boolean = IS_ES_MODERN; // from webpack.config.js

	/**
	 * Return default timeout period in milliseconds for some debounce or throttle functions.
	 * By default, `{history.timeout}` options
	 */
	get defaultTimeout(): number {
		return isVoid(this.o.defaultTimeout) ? 100 : this.o.defaultTimeout;
	}

	/**
	 * Some extra data inside editor
	 * @see copyformat plugin
	 */
	@cache
	get buffer(): IStorage {
		return Storage.makeStorage();
	}

	@cache
	get message(): IMessages {
		return this.getMessageModule(this.container);
	}

	protected getMessageModule(container: HTMLElement): IMessages {
		return new UIMessages(this, container);
	}

	/**
	 * Container for persistent set/get value
	 */
	@cache
	get storage(): IStorage {
		return Storage.makeStorage(true, this.id);
	}

	readonly create!: ICreate;

	@cache
	get c(): this['create'] {
		return this.create;
	}

	private __container!: HTMLDivElement;
	get container(): HTMLDivElement {
		return this.__container;
	}

	set container(container: HTMLDivElement) {
		this.__container = container;
	}

	events!: IEventEmitter;

	@cache
	get e(): this['events'] {
		return this.events;
	}

	/**
	 * progress_bar Progress bar
	 */
	@cache
	get progressbar(): IProgressBar {
		return new ProgressBar(this);
	}

	OPTIONS: IViewOptions = View.defaultOptions;
	private __options!: this['OPTIONS'];
	get options(): this['OPTIONS'] {
		return this.__options;
	}

	set options(options: this['OPTIONS']) {
		this.__options = options;
	}

	/**
	 * Short alias for options
	 */
	get o(): this['options'] {
		return this.options;
	}

	/**
	 * Internationalization method. Uses Jodit.lang object
	 */
	i18n(text: string, ...params: Array<string | number>): string {
		return i18n(text, params, this.options);
	}

	private __isFullSize: boolean = false;

	toggleFullSize(isFullSize?: boolean): void {
		if (isFullSize === undefined) {
			isFullSize = !this.__isFullSize;
		}

		if (isFullSize === this.__isFullSize) {
			return;
		}

		this.__isFullSize = isFullSize;
		this.e.fire('toggleFullSize', isFullSize);
	}

	private __whoLocked: string | false = '';

	/**
	 * View is locked
	 */
	get isLocked(): boolean {
		return this.__whoLocked !== '';
	}

	isLockedNotBy = (name: string): boolean =>
		this.isLocked && this.__whoLocked !== name;

	/**
	 * Disable selecting
	 */
	lock(name = 'any'): boolean {
		if (!this.isLocked) {
			this.__whoLocked = name;
			return true;
		}

		return false;
	}

	/**
	 * Enable selecting
	 */
	unlock(): boolean {
		if (this.isLocked) {
			this.__whoLocked = '';
			return true;
		}

		return false;
	}

	/**
	 * View is in fullSize
	 */
	get isFullSize(): boolean {
		return this.__isFullSize;
	}

	/**
	 * Return current version
	 */
	getVersion(): string {
		return View.version;
	}

	static getVersion(): string {
		return View.version;
	}

	/** @override */
	protected initOptions(options?: Partial<IViewOptions>): void {
		this.options = ConfigProto(
			options || {},
			ConfigProto(this.options || {}, View.defaultOptions)
		) as IViewOptions;
	}

	/**
	 * Can change ownerWindow here
	 */
	protected initOwners(): void {
		this.ownerWindow = this.o.ownerWindow ?? window;
	}

	/**
	 * Add option's event handlers in emitter
	 */
	protected attachEvents(options?: IViewOptions): void {
		if (!options) {
			return;
		}

		const e = options?.events;
		e && Object.keys(e).forEach((key: string) => this.e.on(key, e[key]));
	}

	protected constructor(
		options?: Partial<IViewOptions>,
		readonly isJodit: boolean = false
	) {
		super();

		this.id = new Date().getTime().toString();

		this.initOptions(options);
		this.initOwners();

		this.events = new EventEmitter(this.od);
		this.create = new Create(this.od);

		this.container = this.c.div(`jodit ${this.componentName}`);
	}

	private __modulesInstances: Map<string, IComponent> = new Map();

	/**
	 * Make one instance of one module
	 */
	getInstance<T extends IComponent>(moduleName: string, options?: object): T {
		const instance: Nullable<T> = this.e.fire(
			camelCase('getInstance_' + moduleName),
			options
		);

		if (instance) {
			return instance;
		}

		const module = modules[moduleName] as any,
			mi = this.__modulesInstances;

		if (!isFunction(module)) {
			throw error('Need real module name');
		}

		if (!mi.has(moduleName)) {
			const instance =
				module.prototype instanceof ViewComponent
					? new module(this, options)
					: new module(options);

			this.components.add(instance);

			mi.set(moduleName, instance);
		}

		return mi.get(moduleName) as any;
	}

	/** Add some element to box */
	protected addDisclaimer(elm: HTMLElement): void {
		this.container.appendChild(elm);
	}

	/**
	 * Call before destruct
	 */
	@hook(STATUSES.beforeDestruct)
	protected beforeDestruct(): void {
		this.e.fire(STATUSES.beforeDestruct, this);

		this.components.forEach(component => {
			if (isDestructable(component) && !component.isInDestruct) {
				component.destruct();
			}
		});

		this.components.clear();
	}

	/** @override */
	override destruct(): void {
		if (this.isDestructed) {
			return;
		}

		this.progressbar.destruct();
		this.message.destruct();

		if (this.events) {
			this.events.destruct();
			// @ts-ignore
			this.events = undefined;
		}

		if (this.buffer) {
			this.buffer.clear();
		}

		Dom.safeRemove(this.container);

		super.destruct();
	}

	static defaultOptions: IViewOptions;
}

View.defaultOptions = {
	extraButtons: [],
	cache: true,
	textIcons: false,
	namespace: '',
	removeButtons: [],
	zIndex: 100002,
	defaultTimeout: 100,
	fullsize: false,
	showTooltip: true,
	useNativeTooltip: false,
	buttons: [],
	globalFullSize: true,
	language: 'auto'
};
