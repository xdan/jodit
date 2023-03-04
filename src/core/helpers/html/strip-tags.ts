/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import type { Nullable, HTMLTagNames } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { $$ } from 'jodit/core/helpers/utils';
import { trim } from 'jodit/core/helpers/string/trim';
import { Dom } from 'jodit/core/dom/dom';

const NEW_LINE_TAGS: Set<HTMLTagNames> = new Set([
	'div',
	'p',
	'br',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr'
]);

const INVISIBLE_TAGS: Set<'script' | 'style'> = new Set(['script', 'style']);

/**
 * Extract plain text from HTML text
 */
export function stripTags(
	html: string | Node,
	doc: Document = document,
	exclude: Nullable<Set<HTMLTagNames>> = null
): string {
	const tmp = doc.createElement('div');

	if (isString(html)) {
		tmp.innerHTML = html;
	} else {
		tmp.appendChild(html);
	}

	$$('*', tmp).forEach(p => {
		const pr = p.parentNode;
		if (!pr) {
			return;
		}

		if (exclude && Dom.isTag(p, exclude)) {
			const tag = p.nodeName.toLowerCase();
			const text = !Dom.isTag(p, ['br', 'hr', 'input'])
				? `%%%jodit-${tag}%%%${stripTags(
						p.innerHTML,
						doc,
						exclude
				  )}%%%/jodit-${tag}%%%`
				: `%%%jodit-single-${tag}%%%`;
			Dom.before(p, doc.createTextNode(text));
			Dom.safeRemove(p);
			return;
		}

		if (Dom.isTag(p, INVISIBLE_TAGS)) {
			Dom.safeRemove(p);
			return;
		}

		if (!Dom.isTag(p, NEW_LINE_TAGS)) {
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

	return restoreTags(trim(tmp.innerText));
}

function restoreTags(content: string): string {
	return content.replace(
		/%%%(\/)?jodit(-single)?-([\w\n]+)%%%/g,
		(_, isClosed, isSingle, tag) => `<${isClosed ? '/' : ''}${tag}>`
	);
}
