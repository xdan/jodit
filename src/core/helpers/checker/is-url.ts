/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check if a string is a url
 *
 * @method isURL
 * @param {string} str
 * @return {boolean}
 */
export function isURL(str: string): boolean {
	if (str.includes(' ')) {
		return false;
	}

	if (typeof URL !== 'undefined') {
		try {
			const url = new URL(str);
			return ['https:', 'http:', 'ftp:', 'file:'].includes(url.protocol);
		} catch (e) {
			return false;
		}
	}

	const a = document.createElement('a');
	a.href = str;

	return Boolean(a.hostname);
}
