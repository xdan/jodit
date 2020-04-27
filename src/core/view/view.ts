/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IAsync, IComponent, IProgressBar } from '../../types';
import { IViewBased, IViewOptions } from '../../types';
import { Panel } from './panel';
import { Storage } from '../storage';
import { error, i18n, isFunction } from '../helpers';
import { BASE_PATH } from '../constants';
import { ViewComponent, EventsNative, ProgressBar } from '../../modules';
import { Async } from '../async';
import { modules } from '../global';
import autobind from 'autobind-decorator';

export abstract class View extends Panel implements IViewBased {
	isView: true = true;

	/**
	 * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
	 */
	id: string;

	components: Set<IComponent> = new Set();

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
		return this.o.defaultTimeout || 100;
	}

	events: EventsNative = new EventsNative(this.od);
	get e(): this['events'] {
		return this.events;
	}

	async: IAsync = new Async();

	/**
	 * Some extra data inside editor
	 *
	 * @type {{}}
	 * @see copyformat plugin
	 */
	buffer = Storage.makeStorage();

	/**
	 * progress_bar Progress bar
	 */
	progressbar: IProgressBar = new ProgressBar(this);

	options!: IViewOptions;

	/**
	 * Internationalization method. Uses Jodit.lang object
	 *
	 * @param text
	 * @param params
	 */
	@autobind
	i18n(text: string, ...params: Array<string | number>): string {
		return i18n(text, params, this.options);
	}

	/**
	 * @override
	 * @param isFullSize
	 */
	toggleFullSize(isFullSize?: boolean) {
		super.toggleFullSize(isFullSize);

		if (this.events) {
			this.e.fire('toggleFullSize', isFullSize);
		}
	}

	/**
	 * Return current version
	 *
	 * @method getVersion
	 * @return {string}
	 */
	getVersion = (): string => {
		return this.version;
	};

	/** @override */
	protected initOptions(options?: IViewOptions): void {
		super.initOptions({
			extraButtons: [],
			textIcons: false,
			removeButtons: [],
			zIndex: 100002,
			defaultTimeout: 100,
			fullsize: false,
			showTooltip: true,
			useNativeTooltip: false,
			buttons: [],
			globalFullsize: true,
			...options
		});
	}

	constructor(options?: IViewOptions) {
		super(options);

		this.id = new Date().getTime().toString();
		this.buffer = Storage.makeStorage();
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

			mi.set(moduleName, instance);
		}

		return mi.get(moduleName) as any;
	}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		if (this.async) {
			this.async.destruct();
			delete this.async;
		}

		if (this.events) {
			this.e.destruct();
			delete this.events;
		}

		super.destruct();
	}
}
