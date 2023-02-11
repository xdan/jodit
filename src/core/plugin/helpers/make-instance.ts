/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type { IJodit, Nullable, PluginInstance, PluginType } from 'jodit/types';
import { isFunction } from 'jodit/core/helpers/checker';

/**
 * Create instance of plugin
 * @private
 */
export function makeInstance(
	jodit: IJodit,
	plugin: PluginType
): Nullable<PluginInstance> {
	try {
		try {
			// @ts-ignore
			return isFunction(plugin) ? new plugin(jodit) : plugin;
		} catch (e) {
			if (isFunction(plugin) && !plugin.prototype) {
				return (plugin as Function)(jodit);
			}
		}
	} catch (e) {
		console.error(e);
		// @ts-ignore
		if (!isProd) {
			throw e;
		}
	}

	return null;
}
