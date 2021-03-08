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
	const pattern = new RegExp(
		'^(https?:\\/\\/)' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-zа-яё\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-zа-яё\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-zа-яё\\d_]*)?$',
		'i'
	); // fragment locator

	return pattern.test(str);
}
