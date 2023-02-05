/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { $$, attr } from '../utils';
import { Dom } from 'jodit/core/dom/dom';

type safeOptions = {
	removeOnError: boolean;
	safeJavaScriptLink: boolean;
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

	if (options.removeOnError) {
		sanitizeHTMLElement(box);
		$$('[onerror]', box).forEach(elm => sanitizeHTMLElement(elm, options));
	}

	if (options.safeJavaScriptLink) {
		sanitizeHTMLElement(box);
		$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(elm =>
			sanitizeHTMLElement(elm, options)
		);
	}
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
