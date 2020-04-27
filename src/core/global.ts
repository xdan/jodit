/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IComponent,
	IDictionary,
	IJodit,
	IViewBased,
	IViewComponent
} from '../types';
import { PluginSystem } from './plugin-system';
import { Dom } from './dom';
import { isViewObject, kebabCase } from './helpers/';

export const instances: IDictionary<IJodit> = {};

let counter = 1;

/**
 * Generate global unique uid
 */
export function uniqueUid(): string {
	counter += 10 * (Math.random() + 1);
	return Math.round(counter).toString(16);
}

export const pluginSystem = new PluginSystem();

export const modules: IDictionary<Function> = {};

export const lang: IDictionary<IDictionary<string>> = {};

const boxes = new WeakMap<IComponent, IDictionary<HTMLElement>>();

/**
 * Create unique box(HTMLCotainer) and remove it after destroy
 *
 * @param jodit
 * @param name
 */
export function getContainer(
	jodit: IViewBased | IViewComponent,
	name: string
): HTMLElement {
	const data = boxes.get(jodit) || {};

	if (!data[name]) {
		const c = isViewObject(jodit) ? jodit.c : jodit.j.c;
		const box = c.div(`jodit-${kebabCase(name)}-container jodit-box`);

		jodit.od.body.appendChild(box);

		data[name] = box;

		jodit.hookStatus('beforeDestruct', () => {
			Dom.safeRemove(box);
			delete data[name];

			if (Object.keys(data).length) {
				boxes.delete(jodit);
			}
		});

		boxes.set(jodit, data);
	}

	return data[name];
}
