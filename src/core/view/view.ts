/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IAsync,
	IComponent,
	ICreate,
	IProgressBar,
	IStorage
} from '../../types';
import { IViewBased, IViewOptions } from '../../types';
import { Storage } from '../storage';
import { error, i18n, isDestructable, isFunction, isVoid } from '../helpers';
import { BASE_PATH } from '../constants';
import {
	Component,
	STATUSES,
	EventsNative,
	ProgressBar,
	Create,
	Dom,
	ViewComponent
} from '../../modules';
import { Async } from '../async';
import { modules } from '../global';
import { hook } from '../decorators';

export abstract class View
	extends Component
	implements IViewBased<IViewOptions> {
	readonly isView: true = true;

	/**
	 * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
	 */
	id: string;

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

	readonly version: string = appVersion; // from webpack.config.js

	/**
	 * Return default timeout period in milliseconds for some debounce or throttle functions.
	 * By default return {observer.timeout} options
	 *
	 * @return {number}
	 */
	get defaultTimeout(): number {
		return isVoid(this.o.defaultTimeout) ? 100 : this.o.defaultTimeout;
	}

	async: IAsync = new Async();

	/**
	 * Some extra data inside editor
	 *
	 * @type {{}}
	 * @see copyformat plugin
	 */
	buffer: IStorage = Storage.makeStorage();

	create!: ICreate;
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

	events!: EventsNative;
	get e(): this['events'] {
		return this.events;
	}

	/**
	 * progress_bar Progress bar
	 */
	progressbar!: IProgressBar;

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
	 *
	 * @param text
	 * @param params
	 */
	i18n(text: string, ...params: Array<string | number>): string {
		return i18n(text, params, this.options);
	}

	private __isFullSize: boolean = false;

	/**
	 * @override
	 * @param isFullSize
	 */
	toggleFullSize(isFullSize?: boolean): void {
		if (isFullSize === undefined) {
			isFullSize = !this.__isFullSize;
		}

		if (isFullSize === this.__isFullSize) {
			return;
		}

		this.__isFullSize = isFullSize;

		if (this.events) {
			this.e.fire('toggleFullSize', isFullSize);
		}
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
		return this.version;
	}

	/** @override */
	protected initOptions(options?: IViewOptions): void {
		this.options = {
			...(this.options || {}),
			...View.defaultOptions,
			...options
		};
	}

	/**
	 * Can change ownerWindow here
	 */
	protected initOwners(): void {}

	constructor(options?: IViewOptions, readonly isJodit: boolean = false) {
		super();

		this.id = new Date().getTime().toString();
		this.buffer = Storage.makeStorage();

		this.initOptions(options);
		this.initOwners();

		this.events = new EventsNative(this.od);
		this.create = new Create(this.od);
		this.container = this.c.div();
		this.container.classList.add('jodit');

		this.progressbar = new ProgressBar(this);
	}

	private __modulesInstances: Map<string, IComponent> = new Map();

	/**
	 * Make one instance of one module
	 *
	 * @param moduleName
	 * @param options
	 */
	getInstance<T extends IComponent>(moduleName: string, options?: object): T {
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

	/**
	 * Call before destruct
	 */
	@hook(STATUSES.beforeDestruct)
	protected beforeDestruct(): void {
		this.e.fire(STATUSES.beforeDestruct);

		this.components.forEach(component => {
			if (isDestructable(component) && !component.isInDestruct) {
				component.destruct();
			}
		});

		this.components.clear();
	}

	/** @override */
	destruct() {
		if (this.isDestructed) {
			return;
		}

		if (this.async) {
			this.async.destruct();
		}

		if (this.events) {
			this.e.destruct();
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
	textIcons: false,
	removeButtons: [],
	zIndex: 100002,
	defaultTimeout: 100,
	fullsize: false,
	showTooltip: true,
	useNativeTooltip: false,
	buttons: [],
	globalFullSize: true
};
