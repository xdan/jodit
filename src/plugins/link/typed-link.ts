/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/link
 */

import { isURL } from 'jodit/core/helpers/checker/is-url';

import { TLDS } from './tlds';

/**
 * An email address, for `mailto:`
 * @private
 */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OPENING = new Set(['(', '[', '"', "'", '“', '‘', '<']);
const CLOSING = new Set([
	'.',
	',',
	';',
	':',
	'!',
	'?',
	'"',
	"'",
	'”',
	'’',
	'>'
]);
const BRACKETS: Record<string, string> = { ')': '(', ']': '[' };

const LABEL = /^[a-z\d][a-z\d-]{0,62}$/i;

/**
 * The address that ends at `end` in a line of text typed, back to the
 * whitespace before it, as `[start, end, href]`. Punctuation round it, such as
 * a sentence's full stop or a bracket the address doesn't open, stays out.
 * An address counts with a scheme, with `www.`, as an email address, or as a
 * bare domain that `isBareDomain` accepts, so `Node.js` or `e.g.` don't
 * @private
 */
export function findTypedLink(
	text: string,
	end: number,
	fileEndings: string[]
): [number, number, string] | null {
	let start = end;

	while (start > 0 && !/\s/.test(text[start - 1])) {
		start -= 1;
	}

	while (start < end && OPENING.has(text[start])) {
		start += 1;
	}

	while (end > start) {
		const char = text[end - 1];
		const opening = BRACKETS[char];

		if (
			CLOSING.has(char) ||
			(opening && !text.slice(start, end - 1).includes(opening))
		) {
			end -= 1;
		} else {
			break;
		}
	}

	const href = typedLinkHref(text.slice(start, end), fileEndings);

	return href ? [start, end, href] : null;
}

function typedLinkHref(address: string, fileEndings: string[]): string {
	const email = address.replace(/^mailto:/i, '');

	if (EMAIL.test(email)) {
		return `mailto:${email}`;
	}

	if (
		/^www\.[^\s.]+\.\S+$/i.test(address) ||
		isBareDomain(address, fileEndings)
	) {
		return `https://${address}`;
	}

	return /^[a-z][a-z\d+.-]*:\/\//i.test(address) && isURL(address)
		? address
		: '';
}

/**
 * A domain typed without a scheme or `www.`, as `example.com`, `elections.nz`
 * or `bit.ly/enrol`. Its ending has to be a real one, typed in lower case, so
 * `Node.js` and a sentence run on, as in `home.It`, don't count, and not one
 * in `fileEndings`, as in `photos.zip`. The first part has a letter, which
 * leaves out a time or a numbered step such as `11.am`
 */
function isBareDomain(address: string, fileEndings: string[]): boolean {
	const cut = address.search(/[/?#]/);
	const host = cut < 0 ? address : address.slice(0, cut);
	const labels = host.split('.');
	const ending = labels[labels.length - 1];

	return (
		labels.length > 1 &&
		labels.every(label => LABEL.test(label) && !label.endsWith('-')) &&
		TLDS.has(ending) &&
		!fileEndings.includes(ending) &&
		/[a-z]/i.test(labels[0])
	);
}
