/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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
	IViewComponent,
	IViewOptions
} from 'jodit/types';
import { isJoditObject } from 'jodit/core/helpers/checker/is-jodit-object';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { isViewObject } from 'jodit/core/helpers/checker/is-view-object';
import { kebabCase } from 'jodit/core/helpers/string/kebab-case';
import { css } from 'jodit/core/helpers/utils/css';
import { getClassName } from 'jodit/core/helpers/utils/get-class-name';
import { PluginSystem } from 'jodit/core/plugin/plugin-system';

import { eventEmitter as globalEventEmitter } from './event-emitter/global';
import { lang } from './constants';
import { Dom } from './dom';

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

export const pluginSystem = new PluginSystem({
	getContainer
});

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
	classFunc?: Function | string,
	tag: T = 'div' as T,
	createInsideEditor: boolean = false
): HTMLElementTagNameMap[T] {
	const name = isString(classFunc)
		? classFunc
		: classFunc
			? getClassName(classFunc.prototype)
			: 'jodit-utils';

	const data = boxes.get(jodit) || {},
		key = name + tag;

	const view = isViewObject(jodit) ? jodit : jodit.j;

	let body: HTMLElement | ShadowRoot | null = null;

	if (!data[key]) {
		let c = view.c;

		body = getPopupViewRoot(view.o, view.container, jodit.od.body);

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
			view.events.off(box);

			Dom.safeRemove(box);
			delete data[key];

			if (Object.keys(data).length) {
				boxes.delete(jodit);
			}
		});

		boxes.set(jodit, data);

		view.events.fire('getContainer', box);
	}

	data[key].classList.remove('jodit_theme_default', 'jodit_theme_dark');
	data[key].classList.add(`jodit_theme_${view.o.theme || 'default'}`);

	return data[key] as HTMLElementTagNameMap[T];
}

/**
 * Get root element for view
 * @internal
 */
export function getPopupViewRoot(
	o: IViewOptions,
	container: HTMLElement,
	defaultRoot: HTMLElement
): HTMLElement {
	return (
		o.popupRoot ??
		(o.shadowRoot as unknown as HTMLElement) ??
		Dom.closest<HTMLElement>(
			container,
			parentElement =>
				Dom.isHTMLElement(parentElement) &&
				(Dom.isTag(parentElement, 'dialog') ||
					['fixed', 'absolute'].includes(
						css(parentElement, 'position') as string
					)),
			defaultRoot
		) ??
		defaultRoot
	);
}

/**
 * Global event emitter
 * @deprecated use `import { eventEmitter } from 'jodit/core/event-emitter/global';`
 */
export const eventEmitter = globalEventEmitter;
