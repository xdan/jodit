/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import { globalDocument } from 'jodit/core/constants';
import { isURL } from 'jodit/core/helpers/checker/is-url';

import { parseQuery } from './parse-query';

/**
 * Javascript url pattern converter replace youtube/vimeo url in embed code.
 */
export const convertMediaUrlToVideoEmbed = (
	url: string,
	{
		width = 400,
		height = 345
	}: {
		width?: number;
		height?: number;
	} = {}
): string => {
	if (!isURL(url)) {
		return url;
	}

	const parser: HTMLAnchorElement = globalDocument.createElement('a');
	const pattern1: RegExp =
		/(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;

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
		case 'www.youtu.be': {
			const query: any = parser.search
				? parseQuery(parser.search)
				: { v: parser.pathname.substring(1) };

			if (/^embed\/.*/.test(query.v)) {
				query.v = query.v.substring(6);
			}

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
	}

	return url;
};
