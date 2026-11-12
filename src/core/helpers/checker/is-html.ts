/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { isString } from './is-string';

const NAME_START = /[A-Za-z]/;
const NAME_CHAR = /[A-Za-z0-9]/;
const WORD_CHAR = /\w/;

// The tag name at `from`, or '' when there is none
function readTagName(str: string, from: number): string {
	if (!NAME_START.test(str.charAt(from))) {
		return '';
	}

	let end = from + 1;

	while (NAME_CHAR.test(str.charAt(end))) {
		end += 1;
	}

	return str.slice(from, end);
}

// Is there an element `<name ...>` closed later by `</name>`? One pass for the closing tags, one for the opening ones
function hasElement(str: string): boolean {
	const lastClose = new Map<string, number>();
	let index = str.indexOf('</');

	while (index !== -1) {
		const name = readTagName(str, index + 2);

		if (name !== '' && str.charAt(index + 2 + name.length) === '>') {
			lastClose.set(name, index);
		}

		index = str.indexOf('</', index + 2);
	}

	if (lastClose.size === 0) {
		return false;
	}

	let gt = -1;
	index = str.indexOf('<');

	while (index !== -1) {
		const name = readTagName(str, index + 1);
		const after = index + 1 + name.length;

		if (name !== '' && !WORD_CHAR.test(str.charAt(after))) {
			if (gt < after) {
				gt = str.indexOf('>', after);
			}

			if (gt === -1) {
				return false;
			}

			const close = lastClose.get(name);

			if (close !== undefined && close > gt) {
				return true;
			}
		}

		index = str.indexOf('<', index + 1);
	}

	return false;
}

/**
 * Check if a string is html or not
 *
 * The pasted text is attacker controlled, so the check walks the string with
 * `indexOf`: the former regex `<(\w+)[^>]*>(.*?)<\/\1>` was quadratic on a
 * long run of `<a>` and froze the tab.
 */
export const isHTML = (str: unknown): str is string =>
	isString(str) && hasElement(str);
