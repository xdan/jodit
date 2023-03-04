/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type {
	IExtraPlugin,
	IDictionary,
	IJodit,
	IPluginSystem,
	PluginInstance,
	PluginType,
	CanUndef,
	Nullable
} from 'jodit/types';

import './interface';

import { isDestructable, isString, isArray } from 'jodit/core/helpers/checker';

import { splitArray } from 'jodit/core/helpers/array';
import { eventEmitter } from 'jodit/core/global';
import { loadExtras } from 'jodit/core/plugin/helpers/load';
import { normalizeName } from 'jodit/core/plugin/helpers/utils';
import { makeInstance } from 'jodit/core/plugin/helpers/make-instance';
import { initInstance } from 'jodit/core/plugin/helpers/init-instance';

/**
 * Jodit plugin system
 * @example
 * ```js
 * Jodit.plugins.add('emoji2', {
 * 	init() {
 *  	alert('emoji Inited2')
 * 	},
 *	destruct() {}
 * });
 * ```
 */
export class PluginSystem implements IPluginSystem {
	/**
	 * Add plugin in store
	 */
	add(name: string, plugin: PluginType): void {
		this.__items.set(normalizeName(name), plugin);
		eventEmitter.fire(`plugin:${name}:ready`);
	}

	/**
	 * Get plugin from store
	 */
	get(name: string): PluginType | void {
		return this.__items.get(normalizeName(name));
	}

	/**
	 * Remove plugin from store
	 */
	remove(name: string): void {
		this.__items.delete(normalizeName(name));
	}

	private __items = new Map<string, PluginType>();

	private __filter(
		filter: Nullable<Set<string>>
	): Array<[string, PluginType]> {
		const results: Array<[string, PluginType]> = [];

		this.__items.forEach((plugin, name) => {
			if (!filter || filter.has(name)) {
				results.push([name, plugin]);
			}
		});

		return results;
	}

	/**
	 * Public method for async init all plugins
	 */
	__init(jodit: IJodit): void {
		const { extrasList, disableList, filter } = getSpecialLists(jodit);

		const doneList: Set<string> = new Set();
		const waitingList: IDictionary<PluginInstance> = {};
		const pluginsMap: IDictionary<PluginInstance> = {};

		(jodit as any).__plugins = pluginsMap;

		const initPlugins = (): void => {
			if (jodit.isInDestruct) {
				return;
			}

			let commit: boolean = false;
			this.__filter(filter).forEach(([name, plugin]) => {
				if (
					disableList.has(name) ||
					doneList.has(name) ||
					waitingList[name]
				) {
					return;
				}

				const requires = (plugin as any)?.requires as CanUndef<
					string[]
				>;

				if (
					requires &&
					isArray(requires) &&
					Boolean(requires.some(req => disableList.has(req)))
				) {
					return;
				}

				commit = true;
				const instance = makeInstance(jodit, plugin);

				if (!instance) {
					doneList.add(name);
					delete waitingList[name];
					return;
				}

				initInstance(jodit, name, instance, doneList, waitingList);

				pluginsMap[name] = instance;
			});

			commit && jodit.e.fire('updatePlugins');
		};

		if (!extrasList || !extrasList.length) {
			loadExtras(this.__items, jodit, extrasList, initPlugins);
		}

		initPlugins();
		bindOnBeforeDestruct(jodit, pluginsMap);
	}

	/**
	 * Returns the promise to wait for the plugin to load.
	 */
	wait(name: string): Promise<void> {
		return new Promise<void>((resolve): void => {
			if (this.get(name)) {
				return resolve();
			}

			const onReady = (): void => {
				resolve();
				eventEmitter.off(`plugin:${name}:ready`, onReady);
			};

			eventEmitter.on(`plugin:${name}:ready`, onReady);
		});
	}
}

/**
 * Destroy all plugins before - Jodit will be destroyed
 */
function bindOnBeforeDestruct(
	jodit: IJodit,
	plugins: IDictionary<PluginInstance>
): void {
	jodit.e.on('beforeDestruct', () => {
		Object.keys(plugins).forEach(name => {
			const instance = plugins[name];

			if (isDestructable(instance)) {
				instance.destruct(jodit);
			}

			delete plugins[name];
		});

		delete (jodit as any).__plugins;
	});
}

function getSpecialLists(jodit: IJodit): {
	extrasList: IExtraPlugin[];
	disableList: Set<string>;
	filter: Nullable<Set<string>>;
} {
	const extrasList: IExtraPlugin[] = jodit.o.extraPlugins.map(s =>
		isString(s) ? { name: s } : s
	);

	const disableList = new Set(
		splitArray(jodit.o.disablePlugins).map(normalizeName)
	);

	const filter = jodit.o.safeMode ? new Set(jodit.o.safePluginsList) : null;

	return { extrasList, disableList, filter };
}
