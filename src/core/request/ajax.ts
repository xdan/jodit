/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/request/README.md]]
 * @packageDocumentation
 * @module request
 */

import type {
	IDictionary,
	IRequest,
	IViewBased,
	AjaxOptions,
	IAjax,
	RejectablePromise,
	IResponse
} from 'jodit/types';

import { Config } from 'jodit/config';

import {
	isPlainObject,
	parseQuery,
	buildQuery,
	isString,
	isFunction,
	ConfigProto
} from 'jodit/core/helpers';
import * as error from 'jodit/core/helpers/utils/error';
import { Response } from './response';

import './config';

export class Ajax<T extends object = any> implements IAjax<T> {
	constructor(readonly jodit: IViewBased, options: Partial<AjaxOptions>) {
		this.options = ConfigProto(
			options || {},
			Config.prototype.defaultAjaxOptions
		) as AjaxOptions;

		this.xhr = this.o.xhr ? this.o.xhr() : new XMLHttpRequest();

		jodit && jodit.e && jodit.e.on('beforeDestruct', () => this.destruct());
	}

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
		if (this.isFulfilled) {
			return this;
		}

		try {
			this.isFulfilled = true;
			this.xhr.abort();
		} catch {}

		return this;
	}

	private isFulfilled = false;

	private activated = false;

	send(): RejectablePromise<IResponse<T>> {
		this.activated = true;

		const { xhr, o } = this;

		const request = this.prepareRequest();

		return this.j.async.promise(async (resolve, reject) => {
			const onReject = (): void => {
				this.isFulfilled = true;
				reject(error.connection('Connection error'));
			};

			const onResolve = (): void => {
				this.isFulfilled = true;

				resolve(
					new Response<T>(
						request,
						xhr.status,
						xhr.statusText,
						!xhr.responseType ? xhr.responseText : xhr.response
					)
				);
			};

			xhr.onload = onResolve;
			xhr.onabort = (): void => {
				this.isFulfilled = true;
				reject(error.abort('Abort connection'));
			};

			xhr.onerror = onReject;
			xhr.ontimeout = onReject;

			if (o.responseType) {
				xhr.responseType = o.responseType;
			}

			xhr.onprogress = (e): void => {
				let percentComplete = 0;

				if (e.lengthComputable) {
					percentComplete = (e.loaded / e.total) * 100;
				}

				this.options.onProgress?.(percentComplete);
			};

			xhr.onreadystatechange = (): void => {
				this.options.onProgress?.(10);

				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (o.successStatuses.includes(xhr.status)) {
						onResolve();
					} else if (xhr.statusText) {
						this.isFulfilled = true;
						reject(error.connection(xhr.statusText));
					}
				}
			};

			xhr.withCredentials = o.withCredentials ?? false;

			const { url, data, method } = request;

			xhr.open(method, url, true);

			if (o.contentType && xhr.setRequestHeader) {
				xhr.setRequestHeader('Content-type', o.contentType);
			}

			let { headers } = o;
			if (isFunction(headers)) {
				headers = await headers.call(this);
			}

			if (headers && xhr.setRequestHeader) {
				Object.keys(headers).forEach(key => {
					xhr.setRequestHeader(
						key,
						(headers as IDictionary<string>)[key]
					);
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
			throw error.error('Need URL for AJAX request');
		}

		let url: string = this.o.url;

		const data = this.o.data;
		const method = (this.o.method || 'get').toLowerCase();

		if (method === 'get' && data && isPlainObject(data)) {
			const qIndex = url.indexOf('?');

			if (qIndex !== -1) {
				const urlData = parseQuery(url);

				url =
					url.substring(0, qIndex) +
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

	destruct(): void {
		if (this.activated && !this.isFulfilled) {
			this.abort();
			this.isFulfilled = true;
		}
	}
}
