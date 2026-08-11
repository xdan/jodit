/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IViewBased } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isString } from 'jodit/core/helpers/checker/is-string';

import { attr } from './attr';
import { completeUrl } from './complete-url';

export type Loader = (jodit: IViewBased, url: string) => Promise<any>;

export const alreadyLoadedList = new Map<string, Promise<any>>();

const cacheLoaders = (loader: Loader): Loader => {
	return (jodit: IViewBased, url: string): Promise<any> => {
		if (alreadyLoadedList.has(url)) {
			return alreadyLoadedList.get(url) as Promise<any>;
		}

		const promise = loader(jodit, url);

		alreadyLoadedList.set(url, promise);

		return promise;
	};
};

/**
 * Load script and return promise
 */
export const appendScriptAsync = cacheLoaders(
	(jodit: IViewBased, url: string) => {
		return jodit.async.promise((resolve, reject) => {
			if (jodit.isInDestruct) {
				return reject();
			}

			const script = jodit.c.element('script', {
				type: 'text/javascript',
				crossorigin: 'anonymous',
				referrerpolicy: 'no-referrer',
				async: true,
				src: completeUrl(url)
			});

			if (jodit.o.nonce) {
				attr(script, 'nonce', jodit.o.nonce);
			}

			jodit.e.one(script, 'error', reject).one(script, 'load', resolve);
			Dom.append(jodit.od.body, script);
		});
	}
);

/**
 * Download CSS style script
 */
export const appendStyleAsync = cacheLoaders(
	(jodit: IViewBased, url: string): Promise<HTMLElement> => {
		return jodit.async.promise((resolve, reject) => {
			if (jodit.isInDestruct) {
				return reject();
			}

			const link = jodit.c.element('link', {
				rel: 'stylesheet',
				media: 'all',
				crossorigin: 'anonymous'
			});

			if (jodit.o.nonce) {
				attr(link, 'nonce', jodit.o.nonce);
			}

			const callback = (): void => resolve(link);

			!jodit.isInDestruct &&
				jodit.e.on(link, 'load', callback).on(link, 'error', reject);

			attr(link, 'href', completeUrl(url));

			if (jodit.o.shadowRoot) {
				Dom.append(jodit.o.shadowRoot, link);
			} else {
				Dom.append(jodit.od.body, link);
			}
		});
	}
);

export function loadNext(
	jodit: IViewBased,
	urls: string[],
	i: number = 0
): Promise<void> {
	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	return appendScriptAsync(jodit, urls[i]).then(() =>
		loadNext(jodit, urls, i + 1)
	);
}

export function loadNextStyle(
	jodit: IViewBased,
	urls: string[],
	i: number = 0
): Promise<void> {
	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	return appendStyleAsync(jodit, urls[i]).then(() =>
		loadNextStyle(jodit, urls, i + 1)
	);
}
