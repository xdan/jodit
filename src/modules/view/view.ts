/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IEventsNative } from '../../types';
import { IViewBased, IViewOptions } from '../../types/view';
import { Component } from '../Component';
import { EventsNative } from '../events/eventsNative';
import { Panel } from './panel';
import { Storage } from '../storage';
import { i18n } from '../../modules/helpers';

declare let appVersion: string;

export class View extends Panel implements IViewBased {
	/**
	 * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
	 */
	id: string;

	/**
	 * Get path for loading extra staff
	 */
	get basePath(): string {
		if (this.options.basePath) {
			return this.options.basePath;
		}

		return BASE_PATH;
	}

	version: string = appVersion; // from webpack.config.js

	private __modulesInstances: IDictionary<Component> = {};

	/**
	 * Return default timeout period in milliseconds for some debounce or throttle functions.
	 * By default return {observer.timeout} options
	 *
	 * @return {number}
	 */
	get defaultTimeout(): number {
		return 100;
	}

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
	progress_bar: HTMLDivElement = this.create.div(
		'jodit_progress_bar',
		this.create.div()
	);

	options: IViewOptions = {
		removeButtons: [],
		zIndex: 100002,
		fullsize: false,
		showTooltip: true,
		useNativeTooltip: false,
		buttons: [],
		globalFullsize: true
	};

	events: IEventsNative;

	components: any = [];

	/**
	 * Internationalization method. Uses Jodit.lang object
	 *
	 * @param text
	 * @param params
	 */
	i18n(text: string, ...params: Array<string | number>): string {
		return i18n(text, params, this?.jodit?.options || this?.options);
	}

	/**
	 * @override
	 * @param isFullSize
	 */
	toggleFullSize(isFullSize?: boolean) {
		super.toggleFullSize(isFullSize);

		if (this.events) {
			this.events.fire('toggleFullSize', isFullSize);
		}
	}

	public getInstance<T = Component>(moduleName: string, options?: object): T {
		if (typeof Jodit.modules[moduleName] !== 'function') {
			throw new Error('Need real module name');
		}

		if (this.__modulesInstances[moduleName] === undefined) {
			this.__modulesInstances[moduleName] = new Jodit.modules[moduleName](
				this.jodit || this,
				options
			);
		}

		return this.__modulesInstances[moduleName] as any;
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

	constructor(jodit?: IViewBased, options?: IViewOptions) {
		super(jodit);

		this.id =
			jodit && jodit.id ? jodit.id : new Date().getTime().toString();

		this.jodit = jodit || this;

		this.events =
			jodit && jodit.events
				? jodit.events
				: new EventsNative(this.ownerDocument);

		this.buffer = jodit && jodit.buffer ? jodit.buffer : Storage.makeStorage();

		this.options = { ...this.options, ...options };
	}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		if (this.events) {
			this.events.destruct();
			delete this.events;
		}

		delete this.options;

		super.destruct();
	}
}

import { Jodit } from '../../Jodit';
import { BASE_PATH } from '../../constants';
