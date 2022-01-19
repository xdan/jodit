/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type {
	HTMLTagNames,
	IDictionary,
	IUIElement,
	Nullable
} from 'jodit/types/';
import { IS_IE } from 'jodit/core/constants';
import { isString } from 'jodit/core/helpers/checker';
import { attr, error } from 'jodit/core/helpers/utils';
import { Dom } from 'jodit/core/dom';
import { camelCase } from 'jodit/core/helpers/string';
import { toArray } from 'jodit/core/helpers/array';
import { UIElement } from 'jodit/core/ui';

let temp = 1;

const $$temp = () => {
	temp++;
	return temp;
};

/**
 * Find all elements by selector and return Array. If it did not find any element it return empty array
 *
 * @example
 * ```javascript
 * Jodit.modules.Helpers.$$('.someselector').forEach(function (elm) {
 *      elm.addEventListener('click', function () {
 *          alert(''Clicked');
 *      });
 * })
 * ```
 * @param selector - CSS like selector
 *
 */
export function $$<K extends HTMLTagNames>(
	selector: K,
	root: HTMLElement | HTMLDocument
): Array<HTMLElementTagNameMap[K]>;

export function $$<T extends HTMLElement>(
	selector: string,
	root: HTMLElement | HTMLDocument
): T[];

export function $$<T extends Element>(
	selector: string | HTMLTagNames,
	root: HTMLElement | HTMLDocument
): T[] {
	let result: NodeList;

	if (
		!isESNext &&
		/:scope/.test(selector) &&
		IS_IE &&
		!(root && root.nodeType === Node.DOCUMENT_NODE)
	) {
		const id: string = (root as Element).id,
			temp_id: string =
				id ||
				'_selector_id_' + String(Math.random()).slice(2) + $$temp();

		selector = selector.replace(/:scope/g, '#' + temp_id);

		!id && (root as Element).setAttribute('id', temp_id);

		result = (root.parentNode as Element).querySelectorAll(selector);

		if (!id) {
			(root as Element).removeAttribute('id');
		}
	} else {
		result = root.querySelectorAll(selector);
	}

	return [].slice.call(result);
}

/**
 * Calculate XPath selector
 */
export const getXPathByElement = (
	element: HTMLElement,
	root: HTMLElement
): string => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) {
		return '';
	}

	if (!element.parentNode || root === element) {
		return '';
	}

	if (element.id) {
		return "//*[@id='" + element.id + "']";
	}

	const sames: Node[] = [].filter.call(
		element.parentNode.childNodes,
		(x: Node) => x.nodeName === element.nodeName
	);

	return (
		getXPathByElement(element.parentNode as HTMLElement, root) +
		'/' +
		element.nodeName.toLowerCase() +
		(sames.length > 1
			? '[' + (toArray(sames).indexOf(element) + 1) + ']'
			: '')
	);
};

/**
 * Find all `ref` or `data-ref` elements inside HTMLElement
 */
export const refs = <T extends HTMLElement>(
	root: HTMLElement | IUIElement
): IDictionary<T> => {
	if (root instanceof UIElement) {
		root = root.container;
	}

	return $$('[ref],[data-ref]', <HTMLElement>root).reduce((def, child) => {
		const key = attr(child, '-ref');

		if (key && isString(key)) {
			def[camelCase(key)] = child as T;
			def[key] = child as T;
		}

		return def;
	}, {} as IDictionary<T>);
};

/**
 * Calculate full CSS selector
 */
export const cssPath = (el: Element): Nullable<string> => {
	if (!Dom.isElement(el)) {
		return null;
	}

	const path: string[] = [];

	let start: Nullable<Element> = el;

	while (start && start.nodeType === Node.ELEMENT_NODE) {
		let selector = start.nodeName.toLowerCase();

		if (start.id) {
			selector += '#' + start.id;
			path.unshift(selector);
			break;
		} else {
			let sib: Nullable<Element> = start,
				nth = 1;

			do {
				sib = sib.previousElementSibling;

				if (sib && sib.nodeName.toLowerCase() === selector) {
					nth++;
				}
			} while (sib);

			selector += ':nth-of-type(' + nth + ')';
		}

		path.unshift(selector);

		start = start.parentNode as Element;
	}

	return path.join(' > ');
};

/**
 * Try to find element by selector
 */
export function resolveElement(
	element: string | HTMLElement,
	od: ShadowRoot | Document
): HTMLElement {
	let resolved = element;

	if (isString(element)) {
		try {
			resolved = od.querySelector(element) as HTMLInputElement;
		} catch {
			throw error(
				'String "' + element + '" should be valid HTML selector'
			);
		}
	}

	// Duck checking
	if (
		!resolved ||
		typeof resolved !== 'object' ||
		!Dom.isElement(resolved) ||
		!resolved.cloneNode
	) {
		throw error(
			'Element "' + element + '" should be string or HTMLElement instance'
		);
	}

	return resolved;
}
