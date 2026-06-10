/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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
		case 'vimeo.com': {
			// The numeric video id can be preceded by `channels/<name>/` or
			// `groups/<name>/videos/` and followed by tracking params (e.g.
			// `?share=copy`). Unlisted videos keep a hash right after the id
			// (`vimeo.com/<id>/<hash>`). Extract the id (+ hash) from the path
			// so all of those forms produce a valid embed. See #1209
			const segments = parser.pathname.split('/').filter(Boolean);
			const idIndex = segments.findIndex(s => /^\d+$/.test(s));

			if (idIndex === -1) {
				return url;
			}

			let path = segments[idIndex];
			const hash = segments[idIndex + 1];

			if (hash && idIndex === 0) {
				path += '/' + hash;
			}

			return (
				'<iframe width="' +
				width +
				'" height="' +
				height +
				'" src="' +
				protocol +
				'//player.vimeo.com/video/' +
				path +
				'" frameborder="0" allowfullscreen></iframe>'
			);
		}
		case 'youtube.com':
		case 'www.youtube.com':
		case 'm.youtube.com':
		case 'music.youtube.com':
		case 'youtu.be':
		case 'www.youtu.be': {
			const query: any = parser.search ? parseQuery(parser.search) : {};

			// `youtube.com/watch` keeps the video id in the `v` query
			// parameter, while the short `youtu.be/<id>` links and the
			// `/embed/`, `/shorts/`, `/live/` paths keep it in the pathname.
			// Modern share urls add tracking params (e.g. `?si=`, `?t=`), so
			// the pathname must still be used as a fallback when there is no
			// `v`. See #1209
			let v: string = query.v || parser.pathname.substring(1);

			v = v
				.replace(/^(watch|embed|shorts|live|v)\//, '')
				.replace(/\/$/, '');

			return v
				? '<iframe width="' +
						width +
						'" height="' +
						height +
						'" src="' +
						protocol +
						'//www.youtube.com/embed/' +
						v +
						'" frameborder="0" allowfullscreen></iframe>'
				: url;
		}
	}

	return url;
};
