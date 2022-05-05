/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dom } from 'jodit/core/dom/dom';
import { $$, attr } from '../utils';

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(
	box: HTMLElement,
	options: {
		removeOnError: boolean;
		safeJavaScriptLink: boolean;
	}
): void {
	if (!Dom.isElement(box)) {
		return;
	}

	const removeOnError = (elm: HTMLElement): void =>
			attr(elm, 'onerror', null),
		safeLink = (elm: HTMLElement): void => {
			const href = elm.getAttribute('href');

			if (href && href.trim().indexOf('javascript') === 0) {
				attr(elm, 'href', location.protocol + '//' + href);
			}
		};

	if (options.removeOnError) {
		removeOnError(box);
		$$('[onerror]', box).forEach(removeOnError);
	}

	if (options.safeJavaScriptLink) {
		safeLink(box);
		$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(safeLink);
	}
}
