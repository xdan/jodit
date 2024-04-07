/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type {
	IJodit,
	IPlugin,
	Nullable,
	PluginInstance,
	PluginType
} from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';
import { getContainer } from 'jodit/core/global';
import { isInitable } from 'jodit/core/helpers/checker';

import { loadStyle } from './load';

/**
 * Init plugin if it has no dependencies, in another case wait requires plugins will be init
 * @private
 */
export function init(
	jodit: IJodit,
	pluginName: string,
	plugin: PluginType,
	instance: PluginInstance,
	doneList: Map<string, Nullable<PluginInstance>>,
	waitingList: Set<string>
): void {
	if (isInitable(instance)) {
		try {
			instance.init(jodit);
		} catch (e) {
			console.error(e);

			if (!IS_PROD) {
				throw e;
			}
		}
	}

	doneList.set(pluginName, instance);
	waitingList.delete(pluginName);

	if ((instance as IPlugin).hasStyle) {
		loadStyle(jodit, pluginName).catch(e => {
			!IS_PROD && console.error(e);
		});
	}

	if ((instance as IPlugin).styles) {
		const style = getContainer(jodit, pluginName, 'style');
		style.innerHTML = (instance as IPlugin).styles as string;
	}
}
