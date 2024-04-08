/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type {
	CanUndef,
	IDictionary,
	IExtraPlugin,
	IJodit,
	IPluginSystem,
	Nullable,
	PluginInstance,
	PluginType
} from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';
import { eventEmitter } from 'jodit/core/global';
import { splitArray } from 'jodit/core/helpers/array';
import { isArray, isDestructable, isString } from 'jodit/core/helpers/checker';
import { init } from 'jodit/core/plugin/helpers/init-instance';
import { loadExtras } from 'jodit/core/plugin/helpers/load';
import { makeInstance } from 'jodit/core/plugin/helpers/make-instance';
import { normalizeName } from 'jodit/core/plugin/helpers/utils';

import './interface';

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
	private __items = new Map<string, PluginType>();

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

	private __getFullPluginsList(
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
		const { extraList, disableList, filter } = getSpecialLists(jodit);
		const doneList: Map<string, Nullable<PluginInstance>> = new Map();
		const pluginsMap: IDictionary<PluginInstance> = {};
		const waitingList: Set<string> = new Set();

		(jodit as any).__plugins = pluginsMap;

		const initPlugins = (): void => {
			if (jodit.isInDestruct) {
				return;
			}

			let commit: boolean = false;
			this.__getFullPluginsList(filter).forEach(([name, plugin]) => {
				if (disableList.has(name) || doneList.has(name)) {
					return;
				}

				const requires = (plugin as any)?.requires as CanUndef<
					string[]
				>;

				if (requires && isArray(requires) && requires.length) {
					if (requires.some(req => disableList.has(req))) {
						return;
					}

					if (!requires.every(name => doneList.has(name))) {
						waitingList.add(name);
						return;
					}
				}

				commit = true;
				const instance = makeInstance(jodit, plugin);
				if (!instance) {
					doneList.set(name, null);
					waitingList.delete(name);
					return;
				}

				init(jodit, name, plugin, instance, doneList, waitingList);

				pluginsMap[name] = instance;
			});

			if (commit) {
				jodit.e.fire('updatePlugins');
				initPlugins();
			}
		};

		if (extraList && extraList.length) {
			loadExtras(this.__items, jodit, extraList, initPlugins);
		}

		initPlugins();
		bindOnBeforeDestruct(jodit, pluginsMap);
		if (!IS_PROD && waitingList.size) {
			console.warn(
				'After init plugin waiting list is not clean:',
				waitingList
			);
		}
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
	extraList: IExtraPlugin[];
	disableList: Set<string>;
	filter: Nullable<Set<string>>;
} {
	const extraList: IExtraPlugin[] = jodit.o.extraPlugins.map(s =>
		isString(s) ? { name: s } : s
	);

	const disableList = new Set(
		splitArray(jodit.o.disablePlugins).map(normalizeName)
	);

	const filter = jodit.o.safeMode ? new Set(jodit.o.safePluginsList) : null;

	return { extraList, disableList, filter };
}
