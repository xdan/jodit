/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IViewBased } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';

import { completeUrl } from './complete-url';

export type Loader = (jodit: IViewBased, url: string) => Promise<any>;

export interface CallbackAndElement {
	callback: EventListener;
	element: HTMLElement;
}

const alreadyLoadedList = new Map<string, Promise<any>>();

const cacheLoaders = (loader: Loader): Loader => {
	return async (jodit: IViewBased, url: string): Promise<any> => {
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

			jodit.od.body.appendChild(script);
			jodit.e.on(script, 'error', reject).on(script, 'load', resolve);
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

			const link = jodit.c.element('link');

			link.rel = 'stylesheet';
			link.media = 'all';
			link.crossOrigin = 'anonymous';

			const callback = (): void => resolve(link);

			!jodit.isInDestruct &&
				jodit.e.on(link, 'load', callback).on(link, 'error', reject);

			link.href = completeUrl(url);

			if (jodit.o.shadowRoot) {
				jodit.o.shadowRoot.appendChild(link);
			} else {
				jodit.od.body.appendChild(link);
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
