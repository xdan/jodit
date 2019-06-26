/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const normalizeURL = (...urls: string[]) => {
	return urls
		.filter(url => url.length)
		.map(url => url.replace(/\/$/, ''))
		.join('/')
		.replace(/([^:])[\\\/]+/g, '$1/');
};
