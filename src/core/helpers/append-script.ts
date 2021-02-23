/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IViewBased } from '../../types';
import { completeUrl } from './complete-url';
import { isFunction, isString } from './checker';

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
 * Append script in document and call callback function after download
 *
 * @param url
 * @param callback
 * @param className
 * @param doc
 */
export const appendScript = (
	jodit: IViewBased,
	url: string,
	callback: (this: HTMLElement, e?: Event) => any
): CallbackAndElement => {
	const script = jodit.c.element('script');

	script.type = 'text/javascript';
	script.async = true;

	if (isFunction(callback) && !jodit.isInDestruct) {
		jodit.e.on(script, 'load', callback);
	}

	if (!script.src) {
		script.src = completeUrl(url);
	}

	jodit.od.body.appendChild(script);

	return {
		callback,
		element: script
	};
};

/**
 * Load script and return promise
 */
export const appendScriptAsync = cacheLoaders(
	(jodit: IViewBased, url: string) => {
		return new Promise((resolve, reject) => {
			const { element } = appendScript(jodit, url, resolve);
			!jodit.isInDestruct && jodit.e.on(element, 'error', reject);
		});
	}
);

/**
 * Download CSS style script
 *
 * @param url
 * @param doc
 */
export const appendStyleAsync = cacheLoaders(
	(jodit: IViewBased, url: string): Promise<HTMLElement> => {
		return new Promise((resolve, reject) => {
			const link = jodit.c.element('link');

			link.rel = 'stylesheet';
			link.media = 'all';
			link.crossOrigin = 'anonymous';

			const callback = () => resolve(link);

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

export const loadNext = (
	jodit: IViewBased,
	urls: string[],
	i: number = 0
): Promise<void> => {
	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	return appendScriptAsync(jodit, urls[i]).then(() =>
		loadNext(jodit, urls, i + 1)
	);
};
