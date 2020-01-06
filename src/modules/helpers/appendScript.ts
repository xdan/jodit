/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	return (jodit: IViewBased, url: string, doc: Document): Promise<any> => {
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
	callback: (this: HTMLElement, e: Event) => any,
	className: string,
	doc: Document
): CallbackAndElement => {
	const script = doc.createElement('script');

	script.className = className;
	script.type = 'text/javascript';

	if (callback !== undefined) {
		script.addEventListener('load', callback);
		jodit.events?.on('beforeDestruct', () => {
			script.removeEventListener('load', callback);
		});
	}

	script.src = completeUrl(url);

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
		return jodit.async.promise((resolve, reject) => {
			const { element } = appendScript(jodit, url, resolve, '', doc);
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
		return jodit.async.promise((resolve, reject) => {
			const link = doc.createElement('link');

			link.rel = 'stylesheet';
			link.media = 'all';
			link.crossOrigin = 'anonymous';

			const callback = () => resolve(link);
			link.addEventListener('load', callback);
			jodit.events?.on('beforeDestruct', () => {
				link.removeEventListener('load', callback);
				reject();
			});

			link.addEventListener('error', reject);

			link.href = completeUrl(url);

			doc.body.appendChild(link);
		});
	}
);

export const loadNext = (
	jodit: IViewBased,
	urls: string[],
	eventOnFinalize: false | string,
	i: number = 0
): Promise<void> => {

	if (jodit.isInDestruct) {
		return Promise.reject();
	}

	if (eventOnFinalize && urls[i] === undefined && !jodit.isDestructed) {
		jodit?.events?.fire(eventOnFinalize);
		jodit?.events?.fire(jodit.ownerWindow, eventOnFinalize);
		return Promise.resolve();
	}

	if (!isString(urls[i])) {
		return Promise.resolve();
	}

	if (urls[i] !== undefined) {
		return appendScriptAsync(
			jodit,
			urls[i],
			jodit.ownerDocument
		).then(() => loadNext(jodit, urls, eventOnFinalize, i + 1));
	}

	return Promise.reject();
};

