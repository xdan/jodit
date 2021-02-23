/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	HTMLTagNames,
	IComponent,
	IDictionary,
	IJodit,
	IViewBased,
	IViewComponent
} from '../types';

import { PluginSystem } from './plugin-system';

import { Dom } from './dom';

import {
	getClassName,
	isJoditObject,
	isViewObject,
	kebabCase
} from './helpers/';

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
export const extendLang = (langs: IDictionary) => {
	Object.keys(langs).forEach(key => {
		if (lang[key]) {
			Object.assign(lang[key], langs[key]);
		} else {
			lang[key] = langs[key];
		}
	});
};

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
	classFunc: Function,
	tag: T = 'div' as T,
	inside: boolean = false
): HTMLElementTagNameMap[T] {
	const name = getClassName(classFunc.prototype);

	const data = boxes.get(jodit) || {},
		key = name + tag;

	const view = isViewObject(jodit) ? jodit : jodit.j;

	if (!data[key]) {
		let c = view.c,
			body = jodit.od.body;

		if (inside && isJoditObject(jodit) && jodit.od !== jodit.ed) {
			c = jodit.createInside;
			body = tag === 'style' ? jodit.ed.head : jodit.ed.body;
		}

		const box = c.element(tag, {
			className: `jodit jodit-${kebabCase(name)}-container jodit-box`
		});

		box.classList.add(`jodit_theme_${view.o.theme || 'default'}`);

		body.appendChild(box);

		data[key] = box;

		jodit.hookStatus('beforeDestruct', () => {
			Dom.safeRemove(box);
			delete data[key];

			if (Object.keys(data).length) {
				boxes.delete(jodit);
			}
		});

		boxes.set(jodit, data);
	}

	data[key].classList.remove('jodit_theme_default', 'jodit_theme_dark');
	data[key].classList.add(`jodit_theme_${view.o.theme || 'default'}`);

	return data[key] as HTMLElementTagNameMap[T];
}

/**
 * Global event emitter
 */
export const eventEmitter = new EventsNative();
