/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { completeUrl } from './completeUrl';
import { IViewBased } from '../../types';
import { isString } from './checker';

export type Loader = (jodit: IViewBased, url: string, doc: Document) => Promise<any>;

export type CallbackAndElement = {
	callback: EventListener;
	element: HTMLElement;
};

const alreadyLoadedList = new Map<string, Promise<any>>();

const cacheLoaders = (loader: Loader): Loader => {
	return async (jodit: IViewBased, url: string, doc: Document): Promise<any> => {
		if (alreadyLoadedList.has(url)) {
			return <Promise<any>>alreadyLoadedList.get(url);
		}

		const promise = loader(jodit, url, doc);

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
	callback: (this: HTMLElement, e?: Event) => any,
	doc: Document
): CallbackAndElement => {
	const
		script = doc.createElement('script');

	script.type = 'text/javascript';

	if (callback !== undefined) {
		script.addEventListener('load', callback);
	}

	if (!script.src) {
		script.src = completeUrl(url);
	}

	doc.body.appendChild(script);

	return {
		callback,
		element: script
	};
};

/**
 * Load script and return promise
 */
export const appendScriptAsync = cacheLoaders(
	(jodit: IViewBased, url: string, doc: Document = document) => {
		return new Promise((resolve, reject) => {
			const { element } = appendScript(jodit, url, resolve, doc);
			element.addEventListener('error', reject);
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
	(jodit: IViewBased, url: string, doc: Document = document): Promise<HTMLElement> => {
		return new Promise((resolve, reject) => {
			const link = doc.createElement('link');

			link.rel = 'stylesheet';
			link.media = 'all';
			link.crossOrigin = 'anonymous';

			const callback = () => resolve(link);

			link.addEventListener('load', callback);
			link.addEventListener('error', reject);

			link.href = completeUrl(url);

			doc.body.appendChild(link);
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

	return appendScriptAsync(
		jodit,
		urls[i],
		jodit.ownerDocument
	).then(() => loadNext(jodit, urls, i + 1));
};

