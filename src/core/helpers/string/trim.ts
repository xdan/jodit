/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

const SPACE = /[\s\u200b]/;
const INVISIBLE = /\uFEFF/;

// Cut the chars matching `char` from both ends; `[…]+$` backtracks on a long run that is not at the end
function trimBy(value: string, char: RegExp): string {
	let start = 0;
	let end = value.length;

	while (start < end && char.test(value.charAt(start))) {
		start += 1;
	}

	while (end > start && char.test(value.charAt(end - 1))) {
		end -= 1;
	}

	return start === 0 && end === value.length
		? value
		: value.slice(start, end);
}

/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs
 * from the beginning and end of the line
 */
export function trim(value: string): string {
	return trimBy(value, SPACE);
}

export function trimChars(value: string, chars: string): string {
	return trimBy(value, RegExp(`[${chars}]`));
}

/**
 * Trim only invisible chars
 */
export function trimInv(value: string): string {
	return trimBy(value, INVISIBLE);
}

/**
 * Without the invisible chars at the end
 */
export function trimInvEnd(value: string): string {
	let end = value.length;

	while (end > 0 && INVISIBLE.test(value.charAt(end - 1))) {
		end -= 1;
	}

	return end === value.length ? value : value.slice(0, end);
}
