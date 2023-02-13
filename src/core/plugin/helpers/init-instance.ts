/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type { IDictionary, IJodit, IPlugin, PluginInstance } from 'jodit/types';
import { isInitable } from 'jodit/core/helpers/checker';
import { loadStyle } from './load';

/**
 * Init plugin and try init waiting list
 * @private
 */
export function initInstance(
	jodit: IJodit,
	pluginName: string,
	instance: PluginInstance,
	doneList: Set<string>,
	waitingList: IDictionary<PluginInstance>
): void {
	if (init(jodit, pluginName, instance, doneList, waitingList)) {
		Object.keys(waitingList).forEach(name => {
			const plugin = waitingList[name];
			init(jodit, name, plugin, doneList, waitingList);
		});
	}
}

/**
 * Init plugin if it has not dependencies in another case wait requires plugins will be init
 * @private
 */
export function init(
	jodit: IJodit,
	pluginName: string,
	instance: PluginInstance,
	doneList: Set<string>,
	waitingList: IDictionary<PluginInstance>
): boolean {
	const req = (instance as IPlugin).requires;

	if (req?.length && !req.every(name => doneList.has(name))) {
		// @ts-ignore
		if (!isProd && !isTest && !waitingList[pluginName]) {
			console.log('Await plugin: ', pluginName);
		}

		waitingList[pluginName] = instance;
		return false;
	}

	if (isInitable(instance)) {
		try {
			instance.init(jodit);
		} catch (e) {
			console.error(e);

			// @ts-ignore
			if (!isProd) {
				throw e;
			}
		}
	}

	doneList.add(pluginName);
	delete waitingList[pluginName];

	if ((instance as IPlugin).hasStyle) {
		loadStyle(jodit, pluginName).catch(e => {
			!isProd && console.log(e);
		});
	}

	return true;
}
