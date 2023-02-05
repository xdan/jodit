/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module global
 */

import type {
	HTMLTagNames,
	IComponent,
	IDictionary,
	IJodit,
	IViewBased,
	IViewComponent
} from 'jodit/types';

import { PluginSystem } from './plugin/plugin-system';

import { Dom } from './dom';

import { EventEmitter } from './event-emitter';
import { isJoditObject } from './helpers/checker/is-jodit-object';
import { isViewObject } from './helpers/checker/is-view-object';
import { getClassName } from './helpers/utils/get-class-name';
import { kebabCase } from './helpers/string/kebab-case';
import { lang } from './constants';

export const instances: IDictionary<IJodit> = {};

let counter = 1;

const uuids = new Set();
/**
 * Generate global unique uid
 */
export function uniqueUid(): string {
	function gen(): string {
		counter += 10 * (Math.random() + 1);
		return Math.round(counter).toString(16);
	}

	let uid = gen();
	while (uuids.has(uid)) {
		uid = gen();
	}
	uuids.add(uid);

	return uid;
}

export const pluginSystem = new PluginSystem();

export const modules: IDictionary<Function> = {};

export const extendLang = (langs: IDictionary): void => {
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
 */
export function getContainer<T extends HTMLTagNames = HTMLTagNames>(
	jodit: IViewBased | IViewComponent,
	classFunc?: Function,
	tag: T = 'div' as T,
	createInsideEditor: boolean = false
): HTMLElementTagNameMap[T] {
	const name = classFunc ? getClassName(classFunc.prototype) : 'jodit-utils';

	const data = boxes.get(jodit) || {},
		key = name + tag;

	const view = isViewObject(jodit) ? jodit : jodit.j;

	if (!data[key]) {
		let c = view.c,
			body =
				isJoditObject(jodit) && jodit.o.shadowRoot
					? jodit.o.shadowRoot
					: jodit.od.body;

		if (
			createInsideEditor &&
			isJoditObject(jodit) &&
			jodit.od !== jodit.ed
		) {
			c = jodit.createInside;
			const place = tag === 'style' ? jodit.ed.head : jodit.ed.body;

			body =
				isJoditObject(jodit) && jodit.o.shadowRoot
					? jodit.o.shadowRoot
					: place;
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
export const eventEmitter = new EventEmitter();
