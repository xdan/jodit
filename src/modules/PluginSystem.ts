import {
	IExtraPlugin,
	IDictionary,
	IJodit,
	IPlugin,
	IPluginSystem,
	PluginInstance,
	PluginType
} from '../types';

import {
	isInitable,
	isDestructable,
	isFunction,
	appendScriptAsync,
	splitArray,
	appendStyleAsync,
	isString
} from './helpers/';

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
	private items = new Map<string, PluginType>();

	/**
	 * Add plugin in store
	 *
	 * @param name
	 * @param plugin
	 */
	add(name: string, plugin: PluginType): void {
		this.items.set(name.toLowerCase(), plugin);
	}

	/**
	 * Get plugin from store
	 * @param name
	 */
	get(name: string): PluginType | void {
		return this.items.get(name.toLowerCase());
	}

	/**
	 * Remove plugin from store
	 * @param name
	 */
	remove(name: string): void {
		this.items.delete(name.toLowerCase());
	}

	/**
	 * Public methos for async init all plugins
	 * @param jodit
	 */
	async init(jodit: IJodit): Promise<void> {
		const extrasList: IExtraPlugin[] = jodit.options.extraPlugins.map(s => {
				return isString(s) ? { name: s.toLowerCase() } : s;
			}),
			disableList = splitArray(jodit.options.disablePlugins).map(s =>
				s.toLowerCase()
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

				const instance = PluginSystem.makePluginInstance(jodit, plugin);

				this.initOrWait(jodit, name, instance, doneList, promiseList);

				plugins.push(instance);
				pluginsMap[name] = instance;
			};

		if (extrasList && extrasList.length) {
			try {
				const needLoadExtras = extrasList.filter(
					extra => !this.items.has(extra.name)
				);

				if (needLoadExtras.length) {
					await this.load(jodit, needLoadExtras);
				}
			} catch (e) {
				console.log(e);
			}
		}

		if (jodit.isInDestruct) {
			return;
		}

		this.items.forEach(makeAndInit);

		this.addListenerOnBeforeDestruct(jodit, plugins);

		(jodit as any).__plugins = pluginsMap;
	}

	/**
	 * Create instance of plugin
	 *
	 * @param jodit
	 * @param plugin
	 */
	private static makePluginInstance(
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
			if ((plugin as IPlugin).hasStyle) {
				PluginSystem.loadStyle(jodit, name);
			}

			if (isInitable(plugin)) {
				if (
					!plugin.requires ||
					!plugin.requires.length ||
					plugin.requires.every(name => doneList.includes(name))
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

			return true;
		};

		initPlugin(pluginName, instance);

		Object.keys(promiseList).forEach(name => {
			const plugin = promiseList[name];

			if (!plugin) {
				return;
			}

			if (initPlugin(name, instance)) {
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
		jodit.events.on('beforeDestruct', () => {
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
					extra.url || PluginSystem.getFullUrl(jodit, name, true);

				return reflect(appendScriptAsync(jodit, url));
			})
		);
	}

	/**
	 *
	 *
	 * @param jodit
	 * @param pluginName
	 */
	private static loadStyle(jodit: IJodit, pluginName: string): Promise<void> {
		return appendStyleAsync(
			jodit,
			PluginSystem.getFullUrl(jodit, pluginName, false)
		);
	}

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
}
