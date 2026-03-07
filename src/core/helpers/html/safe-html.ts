/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { Dom } from 'jodit/core/dom/dom';
import { $$, attr } from 'jodit/core/helpers/utils';

export type safeOptions = {
	removeOnError: boolean;
	safeJavaScriptLink: boolean;
	removeEventAttributes?: boolean;
	safeLinksTarget?: boolean;
};

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(
	box: HTMLElement | DocumentFragment,
	options: safeOptions
): void {
	if (!Dom.isElement(box) && !Dom.isFragment(box)) {
		return;
	}

	const removeEvents = options.removeEventAttributes ?? options.removeOnError;

	if (removeEvents) {
		removeAllEventAttributes(box);
		$$('*', box).forEach(elm => removeAllEventAttributes(elm));
	} else if (options.removeOnError) {
		sanitizeHTMLElement(box, options);
		$$('[onerror]', box).forEach(elm => sanitizeHTMLElement(elm, options));
	}

	if (options.safeJavaScriptLink) {
		sanitizeHTMLElement(box, options);
		$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(elm =>
			sanitizeHTMLElement(elm, options)
		);
	}

	if (options.safeLinksTarget) {
		$$<HTMLAnchorElement>('a[target="_blank"]', box).forEach(elm => {
			const rel = elm.getAttribute('rel') || '';
			const parts = rel.split(/\s+/).filter(Boolean);

			if (!parts.includes('noopener')) {
				parts.push('noopener');
			}

			if (!parts.includes('noreferrer')) {
				parts.push('noreferrer');
			}

			attr(elm, 'rel', parts.join(' '));
		});
	}
}

/**
 * Remove all on* event handler attributes from an element
 */
function removeAllEventAttributes(elm: Element | DocumentFragment): boolean {
	if (!Dom.isElement(elm)) {
		return false;
	}

	let effected = false;
	const toRemove: string[] = [];

	for (let i = 0; i < elm.attributes.length; i++) {
		if (elm.attributes[i].name.toLowerCase().startsWith('on')) {
			toRemove.push(elm.attributes[i].name);
		}
	}

	for (const name of toRemove) {
		elm.removeAttribute(name);
		effected = true;
	}

	return effected;
}

export function sanitizeHTMLElement(
	elm: Element | DocumentFragment,
	{ safeJavaScriptLink, removeOnError }: safeOptions = {
		safeJavaScriptLink: true,
		removeOnError: true
	}
): boolean {
	if (!Dom.isElement(elm)) {
		return false;
	}

	let effected = false;

	if (removeOnError && elm.hasAttribute('onerror')) {
		attr(elm, 'onerror', null);
		effected = true;
	}

	const href = elm.getAttribute('href');

	if (safeJavaScriptLink && href && href.trim().indexOf('javascript') === 0) {
		attr(elm, 'href', location.protocol + '//' + href);
		effected = true;
	}

	return effected;
}
