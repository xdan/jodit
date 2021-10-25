/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IDictionary,
	IRequest,
	IViewBased,
	AjaxOptions,
	IAjax,
	RejectablePromise,
	IResponse
} from '../../types';

import { Config } from '../../config';

import {
	error,
	isPlainObject,
	parseQuery,
	buildQuery,
	isString,
	isFunction,
	ConfigProto
} from '../helpers';
import { Response } from './response';

import './config';

export class Ajax<T extends object = any> implements IAjax<T> {
	static log: IRequest[] = [];

	private readonly xhr!: XMLHttpRequest;

	private __buildParams(
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	): string | FormData {
		if (isFunction(this.o.queryBuild)) {
			return this.o.queryBuild.call(this, obj, prefix);
		}

		if (
			isString(obj) ||
			((this.j.ow as any).FormData &&
				obj instanceof (this.j.ow as any).FormData)
		) {
			return obj as string | FormData;
		}

		return buildQuery(obj);
	}

	options: AjaxOptions;
	get o(): this['options'] {
		return this.options;
	}

	/**
	 * Alias for this.jodit
	 */
	get j(): this['jodit'] {
		return this.jodit;
	}

	abort(): Ajax {
		try {
			this.xhr.abort();
		} catch {}

		return this;
	}

	private resolved = false;

	private activated = false;

	send(): RejectablePromise<IResponse<T>> {
		this.activated = true;

		const { xhr, o } = this;

		const request = this.prepareRequest();

		return this.j.async.promise((resolve, reject) => {
			const onReject = () => {
				reject(error('Connection error'));
			};

			const onResolve = () => {
				this.resolved = true;

				resolve(
					new Response<T>(
						request,
						xhr.status,
						xhr.statusText,
						xhr.responseText
					)
				);
			};

			xhr.onabort = onReject;
			xhr.onerror = onReject;
			xhr.ontimeout = onReject;

			xhr.onload = onResolve;

			xhr.onprogress = (e): void => {
				let percentComplete = 0;

				if (e.lengthComputable) {
					percentComplete = (e.loaded / e.total) * 100;
				}

				this.options.onProgress?.(percentComplete);
			};

			xhr.onreadystatechange = () => {
				this.options.onProgress?.(10);

				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (o.successStatuses.includes(xhr.status)) {
						onResolve();
					} else {
						reject(error(xhr.statusText || 'Connection error'));
					}
				}
			};

			xhr.withCredentials = o.withCredentials ?? false;

			const { url, data, method } = request;

			xhr.open(method, url, true);

			if (o.contentType && xhr.setRequestHeader) {
				xhr.setRequestHeader('Content-type', o.contentType);
			}

			const { headers } = o;

			if (headers && xhr.setRequestHeader) {
				Object.keys(headers).forEach(key => {
					xhr.setRequestHeader(key, headers[key]);
				});
			}

			// IE
			this.j.async.setTimeout(() => {
				xhr.send(data ? this.__buildParams(data) : undefined);
			}, 0);
		});
	}

	prepareRequest(): IRequest {
		if (!this.o.url) {
			throw error('Need URL for AJAX request');
		}

		let url: string = this.o.url;

		const data = this.o.data;
		const method = (this.o.method || 'get').toLowerCase();

		if (method === 'get' && data && isPlainObject(data)) {
			const qIndex = url.indexOf('?');

			if (qIndex !== -1) {
				const urlData = parseQuery(url);

				url =
					url.substr(0, qIndex) +
					'?' +
					buildQuery({ ...urlData, ...(data as IDictionary) });
			} else {
				url += '?' + buildQuery(this.o.data as IDictionary);
			}
		}

		const request = {
			url,
			method,
			data
		};

		Ajax.log.splice(100);
		Ajax.log.push(request);

		return request;
	}

	constructor(readonly jodit: IViewBased, options: Partial<AjaxOptions>) {
		this.options = ConfigProto(
			options || {},
			Config.prototype.defaultAjaxOptions
		) as AjaxOptions;

		this.xhr = this.o.xhr ? this.o.xhr() : new XMLHttpRequest();

		jodit && jodit.e && jodit.e.on('beforeDestruct', () => this.destruct());
	}

	destruct(): void {
		if (this.activated && !this.resolved) {
			this.abort();
			this.resolved = true;
		}
	}
}
