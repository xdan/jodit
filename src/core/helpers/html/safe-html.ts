/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { $$, attr } from '../utils';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(
	box: HTMLElement | DocumentFragment,
	options: {
		removeOnError: boolean;
		safeJavaScriptLink: boolean;
	}
): void {
	if (!Dom.isElement(box) && !Dom.isFragment(box)) {
		return;
	}

	if (options.removeOnError) {
		sanitizeHTMLElement(box);
		$$('[onerror]', box).forEach(sanitizeHTMLElement);
	}

	if (options.safeJavaScriptLink) {
		sanitizeHTMLElement(box);
		$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(
			sanitizeHTMLElement
		);
	}
}

export function sanitizeHTMLElement(elm: Element | DocumentFragment): boolean {
	if (!Dom.isElement(elm)) {
		return false;
	}

	let effected = false;

	if (elm.hasAttribute('onerror')) {
		attr(elm, 'onerror', null);
		effected = true;
	}

	const href = elm.getAttribute('href');

	if (href && href.trim().indexOf('javascript') === 0) {
		attr(elm, 'href', location.protocol + '//' + href);
		effected = true;
	}

	return effected;
}
