/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	HTMLTagNames,
	IComponent,
	IDictionary,
	IJodit,
	IViewBased,
	IViewComponent
} from '../types';
import { PluginSystem } from './plugin-system';
import { Dom } from './dom';
import { isJoditObject, isViewObject, kebabCase } from './helpers/';
import { EventsNative } from './events';

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
 * @param [tag]
 */
export function getContainer<T extends HTMLTagNames = HTMLTagNames>(
	jodit: IViewBased | IViewComponent,
	name: string,
	tag: T = <T>'div',
	inside: boolean = false
): HTMLElementTagNameMap[T] {
	const data = boxes.get(jodit) || {};

	if (!data[name]) {
		let c = isViewObject(jodit) ? jodit.c : jodit.j.c,
			body = jodit.od.body;

		if (
			inside &&
			isJoditObject(jodit) &&
			jodit.od !== jodit.editorDocument
		) {
			c = jodit.createInside;
			body =
				tag === 'style'
					? jodit.editorDocument.head
					: jodit.editorDocument.body;
		}

		const box = c.element(tag, {
			className: `jodit-${kebabCase(name)}-container jodit-box`
		});

		body.appendChild(box);

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

	return data[name] as HTMLElementTagNameMap[T];
}

/**
 * Global event emitter
 */
export const eventEmitter = new EventsNative();
