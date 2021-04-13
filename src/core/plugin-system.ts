/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IExtraPlugin,
	IDictionary,
	IJodit,
	IPlugin,
	IPluginSystem,
	PluginInstance,
	PluginType,
	CanPromise,
	CanUndef
} from '../types';

import {
	isInitable,
	isDestructable,
	isFunction,
	appendScriptAsync,
	splitArray,
	appendStyleAsync,
	isString,
	kebabCase,
	callPromise,
	isArray
} from './helpers';

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
	private normalizeName(name: string): string {
		return kebabCase(name).toLowerCase();
	}

	private items = new Map<string, PluginType>();

	/**
	 * Add plugin in store
	 *
	 * @param name
	 * @param plugin
	 */
	add(name: string, plugin: PluginType): void {
		this.items.set(this.normalizeName(name), plugin);
	}

	/**
	 * Get plugin from store
	 * @param name
	 */
	get(name: string): PluginType | void {
		return this.items.get(this.normalizeName(name));
	}

	/**
	 * Remove plugin from store
	 * @param name
	 */
	remove(name: string): void {
		this.items.delete(this.normalizeName(name));
	}

	/**
	 * Public method for async init all plugins
	 * @param jodit
	 */
	init(jodit: IJodit): CanPromise<void> {
		const extrasList: IExtraPlugin[] = jodit.o.extraPlugins.map(s =>
				isString(s) ? { name: s } : s
			),
			disableList = splitArray(jodit.o.disablePlugins).map(s =>
				this.normalizeName(s)
			),
			doneList: string[] = [],
			promiseList: IDictionary<PluginInstance | undefined> = {},
			plugins: PluginInstance[] = [],
			pluginsMap: IDictionary<PluginInstance> = {},
			makeAndInit = (plugin: PluginType, name: string) => {
				if (
					disableList.includes(name) ||
					doneList.includes(name) ||
					promiseList[name]
				) {
					return;
				}

				const requires = (plugin as any)?.requires as CanUndef<
					string[]
				>;

				if (
					requires &&
					isArray(requires) &&
					this.hasDisabledRequires(disableList, requires)
				) {
					return;
				}

				const instance = PluginSystem.makePluginInstance(jodit, plugin);

				this.initOrWait(jodit, name, instance, doneList, promiseList);

				plugins.push(instance);
				pluginsMap[name] = instance;
			};

		const resultLoadExtras = this.loadExtras(jodit, extrasList);

		return callPromise(resultLoadExtras, () => {
			if (jodit.isInDestruct) {
				return;
			}

			this.items.forEach(makeAndInit);

			this.addListenerOnBeforeDestruct(jodit, plugins);

			(jodit as any).__plugins = pluginsMap;
		});
	}

	/**
	 * Plugin type has disabled requires
	 * @param disableList
	 * @param requires
	 */
	private hasDisabledRequires(
		disableList: string[],
		requires: string[]
	): boolean {
		return Boolean(
			requires?.length &&
				disableList.some(disabled => requires.includes(disabled))
		);
	}

	/**
	 * Create instance of plugin
	 *
	 * @param jodit
	 * @param plugin
	 */
	static makePluginInstance(
		jodit: IJodit,
		plugin: PluginType
	): PluginInstance {
		return isFunction(plugin) ? new plugin(jodit) : plugin;
	}

	/**
	 * Init plugin if it has not dependencies in another case wait requires plugins will be init
	 *
	 * @param jodit
	 * @param pluginName
	 * @param instance
	 * @param doneList
	 * @param promiseList
	 */
	private initOrWait(
		jodit: IJodit,
		pluginName: string,
		instance: PluginInstance,
		doneList: string[],
		promiseList: IDictionary<PluginInstance | undefined>
	) {
		const initPlugin = (name: string, plugin: PluginInstance): boolean => {
			if (isInitable(plugin)) {
				const req = (plugin as IPlugin).requires;

				if (
					!req?.length ||
					req.every(name => doneList.includes(name))
				) {
					plugin.init(jodit);
					doneList.push(name);
				} else {
					promiseList[name] = plugin;
					return false;
				}
			} else {
				doneList.push(name);
			}

			if ((plugin as IPlugin).hasStyle) {
				PluginSystem.loadStyle(jodit, name);
			}

			return true;
		};

		initPlugin(pluginName, instance);

		Object.keys(promiseList).forEach(name => {
			const plugin = promiseList[name];

			if (!plugin) {
				return;
			}

			if (initPlugin(name, plugin)) {
				promiseList[name] = undefined;
				delete promiseList[name];
			}
		});
	}

	/**
	 * Destroy all plugins before - Jodit will be destroyed
	 *
	 * @param jodit
	 * @param plugins
	 */
	private addListenerOnBeforeDestruct(
		jodit: IJodit,
		plugins: PluginInstance[]
	) {
		jodit.e.on('beforeDestruct', () => {
			plugins.forEach(instance => {
				if (isDestructable(instance)) {
					instance.destruct(jodit);
				}
			});

			plugins.length = 0;

			delete (jodit as any).__plugins;
		});
	}

	/**
	 * Download plugins
	 *
	 * @param jodit
	 * @param pluginList
	 */
	private load(jodit: IJodit, pluginList: IExtraPlugin[]): Promise<any> {
		const reflect = (p: Promise<any>) =>
			p.then(
				(v: any) => ({ v, status: 'fulfilled' }),
				(e: any) => ({ e, status: 'rejected' })
			);

		return Promise.all(
			pluginList.map(extra => {
				const url =
					extra.url ||
					PluginSystem.getFullUrl(jodit, extra.name, true);

				return reflect(appendScriptAsync(jodit, url));
			})
		);
	}

	/**
	 * @param jodit
	 * @param pluginName
	 */
	private static async loadStyle(
		jodit: IJodit,
		pluginName: string
	): Promise<void> {
		const url = PluginSystem.getFullUrl(jodit, pluginName, false);

		if (this.styles.has(url)) {
			return;
		}

		this.styles.add(url);

		return appendStyleAsync(jodit, url);
	}

	private static styles: Set<string> = new Set();

	/**
	 * Call full url to the script or style file
	 *
	 * @param jodit
	 * @param name
	 * @param js
	 */
	private static getFullUrl(
		jodit: IJodit,
		name: string,
		js: boolean
	): string {
		name = kebabCase(name);

		return (
			jodit.basePath +
			'plugins/' +
			name +
			'/' +
			name +
			'.' +
			(js ? 'js' : 'css')
		);
	}

	private loadExtras(
		jodit: IJodit,
		extrasList: IExtraPlugin[]
	): CanPromise<void> {
		if (extrasList && extrasList.length) {
			try {
				const needLoadExtras = extrasList.filter(
					extra => !this.items.has(this.normalizeName(extra.name))
				);

				if (needLoadExtras.length) {
					return this.load(jodit, needLoadExtras);
				}
			} catch (e) {
				if (!isProd) {
					throw e;
				}
			}
		}
	}
}
