/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IJodit } from '../types';
import { PluginSystem } from './pluginSystem';

export const instances: IDictionary<IJodit> = {};

/**
 * Emits events in all instances
 *
 * @param events
 * @param args
 */
export function fireEach(events: string, ...args: any[]) {
	Object.keys(instances).forEach(key => {
		const editor = instances[key];

		if (!editor.isDestructed && editor.events) {
			editor.events.fire(events, ...args);
		}
	});
}


export const pluginSystem =  new PluginSystem();

export const modules: IDictionary<Function>  =  {};
