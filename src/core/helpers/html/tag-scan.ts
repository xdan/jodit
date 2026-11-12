/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

// Single passes over HTML that comes from the clipboard or the editor value.
// A regex with `[^>]*` or `.*?` before a required literal backtracks
// quadratically on a long run of tag openers, so these walk with `indexOf`.

const TAG_NAME = /[a-z0-9:-]/i;

// The tags the Word clean-up strips: `<html>`, `<colgroup>`, `<col>`, `<o:p>` and their closers
const WORD_WRAPPER_TAGS = ['<html', '</html', '<col', '</col', '<o:p', '</o:p'];

function startsWithIgnoreCase(
	html: string,
	index: number,
	prefix: string
): boolean {
	return html.substr(index, prefix.length).toLowerCase() === prefix;
}

// The first `<` at or after `from` that opens one of the prefixes (`<meta`, `</html`, `<!--`)
function indexOfPrefix(
	html: string,
	prefixes: string[],
	from: number
): [number, string] {
	let index = html.indexOf('<', from);

	while (index !== -1) {
		for (const prefix of prefixes) {
			if (startsWithIgnoreCase(html, index, prefix)) {
				return [index, prefix];
			}
		}

		index = html.indexOf('<', index + 1);
	}

	return [-1, ''];
}

/**
 * The first `</name>` at or after `from`, case-insensitive, or -1
 */
export function indexOfClosingTag(
	html: string,
	name: string,
	from: number
): number {
	const closing = '</' + name + '>';
	let index = html.indexOf('</', from);

	while (index !== -1) {
		if (startsWithIgnoreCase(html, index, closing)) {
			return index;
		}

		index = html.indexOf('</', index + 2);
	}

	return -1;
}

/**
 * Remove every tag that starts with one of the prefixes, up to its `>`:
 * `removeTagsByPrefix(html, ['<meta', '<!--'])`
 */
export function removeTagsByPrefix(html: string, prefixes: string[]): string {
	const lower = prefixes.map(prefix => prefix.toLowerCase());
	let result = '';
	let cursor = 0;

	for (;;) {
		const [start] = indexOfPrefix(html, lower, cursor);

		if (start === -1) {
			break;
		}

		const end = html.indexOf('>', start);

		if (end === -1) {
			break;
		}

		result += html.slice(cursor, start);
		cursor = end + 1;
	}

	return cursor === 0 ? html : result + html.slice(cursor);
}

/**
 * Strip the Word wrapper tags and then the comments, as the clean-up always did
 */
export function removeWordWrappers(html: string): string {
	return removeTagsByPrefix(removeTagsByPrefix(html, WORD_WRAPPER_TAGS), [
		'<!--'
	]);
}

// Every `</name>` position by name, so the closer of an element is found by a binary search
function closingTagPositions(html: string): Map<string, number[]> {
	const positions = new Map<string, number[]>();
	let index = html.indexOf('</');

	while (index !== -1) {
		const name = readTagName(html, index + 2).toLowerCase();

		if (name !== '' && html.charAt(index + 2 + name.length) === '>') {
			const list = positions.get(name);

			if (list) {
				list.push(index);
			} else {
				positions.set(name, [index]);
			}
		}

		index = html.indexOf('</', index + 2);
	}

	return positions;
}

// The first position in the sorted list that is >= from, or -1
function firstAfter(list: number[] | undefined, from: number): number {
	if (!list) {
		return -1;
	}

	let low = 0;
	let high = list.length;

	while (low < high) {
		const middle = (low + high) >> 1;

		if (list[middle] < from) {
			low = middle + 1;
		} else {
			high = middle;
		}
	}

	return low < list.length ? list[low] : -1;
}

/**
 * The index of the first `<name>` or `<name …>` tag, or -1
 */
export function indexOfOpenTag(html: string, name: string): number {
	const prefix = '<' + name.toLowerCase();
	let cursor = 0;

	for (;;) {
		const [start] = indexOfPrefix(html, [prefix], cursor);

		if (start === -1) {
			return -1;
		}

		const next = html.charAt(start + prefix.length);

		if (next === '>') {
			return start;
		}

		if (/\s/.test(next)) {
			if (html.indexOf('>', start) === -1) {
				return -1;
			}

			return start;
		}

		cursor = start + 1;
	}
}

function readTagName(html: string, from: number): string {
	let end = from;

	while (TAG_NAME.test(html.charAt(end))) {
		end += 1;
	}

	return html.slice(from, end);
}

/**
 * Replace every `<name … marker …>inner</name>` with `inner`.
 * `name` null takes any tag; `keep` can refuse an element by its inner HTML.
 */
export function unwrapMarkedTags(
	html: string,
	name: string | null,
	marker: string,
	keep?: (inner: string) => boolean
): string {
	const lowerMarker = marker.toLowerCase();
	const prefixes = [name == null ? '<' : '<' + name.toLowerCase()];
	const closings = closingTagPositions(html);
	let result = '';
	let cursor = 0;

	for (;;) {
		const [start] = indexOfPrefix(html, prefixes, cursor);

		if (start === -1) {
			break;
		}

		const tagName = (name ?? readTagName(html, start + 1)).toLowerCase();
		const gt = html.indexOf('>', start);

		if (gt === -1) {
			break;
		}

		const close =
			tagName !== '' &&
			html.slice(start, gt).toLowerCase().includes(lowerMarker)
				? firstAfter(closings.get(tagName), gt + 1)
				: -1;

		// Not a marked element: the `<` is text, the next one may still open an element
		if (close === -1) {
			result += html.slice(cursor, start + 1);
			cursor = start + 1;
			continue;
		}

		const inner = html.slice(gt + 1, close);
		const after = close + tagName.length + 3;

		result += html.slice(cursor, start);
		result +=
			inner !== '' && (!keep || keep(inner))
				? inner
				: html.slice(start, after);
		cursor = after;
	}

	return cursor === 0 ? html : result + html.slice(cursor);
}

// The first `literal` at or after `from`, case-insensitive, or -1
function indexOfLiteral(html: string, literal: string, from: number): number {
	const head = literal.charAt(0);
	let index = html.indexOf(head, from);

	while (index !== -1) {
		if (startsWithIgnoreCase(html, index, literal)) {
			return index;
		}

		index = html.indexOf(head, index + 1);
	}

	return -1;
}

/**
 * Remove every `open … openEnd … close` block whose opener holds `marker` (any opener when it is ''):
 * `removeBetween(html, '<style', '>', '</style>', 'jodit-box')`
 */
export function removeBetween(
	html: string,
	open: string,
	openEnd: string,
	close: string,
	marker: string = ''
): string {
	const lowerOpen = open.toLowerCase();
	const lowerMarker = marker.toLowerCase();
	let result = '';
	let cursor = 0;

	for (;;) {
		const start = indexOfLiteral(html, lowerOpen, cursor);

		if (start === -1) {
			break;
		}

		const end = indexOfLiteral(html, openEnd, start + open.length);

		if (end === -1) {
			break;
		}

		if (
			lowerMarker !== '' &&
			!html.slice(start, end).toLowerCase().includes(lowerMarker)
		) {
			result += html.slice(cursor, end + openEnd.length);
			cursor = end + openEnd.length;
			continue;
		}

		const closeIndex = indexOfLiteral(html, close, end + openEnd.length);

		if (closeIndex === -1) {
			break;
		}

		result += html.slice(cursor, start);
		cursor = closeIndex + close.length;
	}

	return cursor === 0 ? html : result + html.slice(cursor);
}

/**
 * Remove every empty `<name … marker …></name>` element
 */
export function removeEmptyMarkedTags(
	html: string,
	name: string,
	marker: string
): string {
	const lowerName = name.toLowerCase();
	const lowerMarker = marker.toLowerCase();
	const closing = '</' + lowerName + '>';
	let result = '';
	let cursor = 0;

	for (;;) {
		const [start] = indexOfPrefix(html, ['<' + lowerName], cursor);

		if (start === -1) {
			break;
		}

		const gt = html.indexOf('>', start);

		if (gt === -1) {
			break;
		}

		if (
			html.slice(start, gt).toLowerCase().includes(lowerMarker) &&
			startsWithIgnoreCase(html, gt + 1, closing)
		) {
			result += html.slice(cursor, start);
			cursor = gt + 1 + closing.length;
			continue;
		}

		result += html.slice(cursor, gt + 1);
		cursor = gt + 1;
	}

	return cursor === 0 ? html : result + html.slice(cursor);
}
