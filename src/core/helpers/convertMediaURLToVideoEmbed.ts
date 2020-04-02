/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isURL } from './checker/isURL';
import { parseQuery } from './parseQuery';

/**
 *  Javascript url pattern converter replace youtube/vimeo url in embed code.
 *
 * @param {string} url
 * @param {int} [width=400]
 * @param {int} [height=345]
 * return {string} embed code
 */
export const convertMediaURLToVideoEmbed = (
	url: string,
	width: number = 400,
	height: number = 345
): string => {
	if (!isURL(url)) {
		return url;
	}

	const parser: HTMLAnchorElement = document.createElement('a'),
		pattern1: RegExp = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;

	parser.href = url;

	if (!width) {
		width = 400;
	}
	if (!height) {
		height = 345;
	}

	const protocol: string = parser.protocol || '';

	switch (parser.hostname) {
		case 'www.vimeo.com':
		case 'vimeo.com':
			return pattern1.test(url)
				? url.replace(
						pattern1,
						'<iframe width="' +
							width +
							'" height="' +
							height +
							'" src="' +
							protocol +
							'//player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe>'
				  )
				: url;
		case 'youtube.com':
		case 'www.youtube.com':
		case 'youtu.be':
		case 'www.youtu.be':
			const query: any = parser.search
				? parseQuery(parser.search)
				: { v: parser.pathname.substr(1) };
			return query.v
				? '<iframe width="' +
						width +
						'" height="' +
						height +
						'" src="' +
						protocol +
						'//www.youtube.com/embed/' +
						query.v +
						'" frameborder="0" allowfullscreen></iframe>'
				: url;
	}

	return url;
};
