/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const normalizeURL = (...urls: string[]) => {
	return urls
		.filter(url => url.length)
		.map(url => url.replace(/\/$/, ''))
		.join('/')
		.replace(/([^:])[\\\/]+/g, '$1/');
};
