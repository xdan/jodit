/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isString } from '../checker';
import { $$ } from '../selector';
import { trim } from '../string';
import { Dom } from '../../Dom';

/**
 * Extract plain text from HTML text
 *
 * @param html
 * @param doc
 */
export const stripTags = (
	html: string | Node,
	doc: Document = document
): string => {
	const tmp: HTMLDivElement = doc.createElement('div');

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
};
