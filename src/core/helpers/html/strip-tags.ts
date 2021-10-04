/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isString } from '../checker';
import { $$ } from '../selector';
import { trim } from '../string';
import { Dom } from '../../dom';
import { attr } from '../utils';

/**
 * Extract plain text from HTML text
 */
export function stripTags(
	html: string | Node,
	doc: Document = document
): string {
	const tmp = doc.createElement('div');

	if (isString(html)) {
		tmp.innerHTML = html;
	} else {
		tmp.appendChild(html);
	}

	$$('DIV, P, BR, H1, H2, H3, H4, H5, H6, HR', tmp).forEach(p => {
		const pr = p.parentNode;
		if (!pr) {
			return;
		}

		const nx = p.nextSibling;

		if (Dom.isText(nx) && /^\s/.test(nx.nodeValue || '')) {
			return;
		}

		if (nx) {
			pr.insertBefore(doc.createTextNode(' '), nx);
		}
	});

	return trim(tmp.innerText) || '';
}

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(box: HTMLElement): void {
	const removeOnError = (elm: HTMLElement) =>
			Dom.isElement(elm) && attr(elm, 'onerror', null),
		safeLink = (elm: HTMLElement) => {
			if (!Dom.isElement(elm)) {
				return;
			}

			const href = elm.getAttribute('href');

			if (href && href.trim().indexOf('javascript') === 0) {
				attr(elm, 'href', location.protocol + '//' + href);
			}
		};

	removeOnError(box);
	safeLink(box);

	$$('[onerror]', box).forEach(removeOnError);
	$$<HTMLAnchorElement>('a[href^="javascript"]', box).forEach(safeLink);
}
