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
	AjaxOptions,
	IAjax,
	RejectablePromise,
	IResponse,
	IAsync
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
import { Async } from 'jodit/core/async';
import { autobind } from 'jodit/core/decorators';

import './config';

export class Ajax<T extends object = any> implements IAjax<T> {
	private __async: IAsync = new Async();

	constructor(
		options: Partial<AjaxOptions>,
		defaultAjaxOptions: AjaxOptions = Config.prototype.defaultAjaxOptions
	) {
		this.options = ConfigProto(
			options || {},
			defaultAjaxOptions
		) as AjaxOptions;

		this.__xhr = this.o.xhr ? this.o.xhr() : new XMLHttpRequest();
	}

	static log: IRequest[] = [];

	private readonly __xhr!: XMLHttpRequest;

	private __buildParams(
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	): string | FormData {
		if (
			isPlainObject(obj) &&
			this.options.contentType &&
			this.options.contentType.includes('application/json')
		) {
			return JSON.stringify(obj);
		}

		if (isFunction(this.o.queryBuild)) {
			return this.o.queryBuild.call(this, obj, prefix);
		}

		if (
			isString(obj) ||
			obj instanceof window.FormData ||
			(typeof obj === 'object' && obj != null && isFunction(obj.append))
		) {
			return obj as string | FormData;
		}

		return buildQuery(obj);
	}

	options: AjaxOptions;
	get o(): this['options'] {
		return this.options;
	}

	abort(): Ajax {
		if (this.__isFulfilled) {
			return this;
		}

		try {
			this.__isFulfilled = true;
			this.__xhr.abort();
		} catch {}

		return this;
	}

	private __isFulfilled = false;

	private __activated = false;

	send(): RejectablePromise<IResponse<T>> {
		this.__activated = true;

		const { __xhr, o } = this;

		const request = this.prepareRequest();

		return this.__async.promise(async (resolve, reject) => {
			const onReject = (): void => {
				this.__isFulfilled = true;
				reject(error.connection('Connection error'));
			};

			const onResolve = (): void => {
				this.__isFulfilled = true;

				resolve(
					new Response<T>(
						request,
						__xhr.status,
						__xhr.statusText,
						!__xhr.responseType ? __xhr.responseText : __xhr.response
					)
				);
			};

			__xhr.onload = onResolve;
			__xhr.onabort = (): void => {
				this.__isFulfilled = true;
				reject(error.abort('Abort connection'));
			};

			__xhr.onerror = onReject;
			__xhr.ontimeout = onReject;

			if (o.responseType) {
				__xhr.responseType = o.responseType;
			}

			__xhr.onprogress = (e): void => {
				let percentComplete = 0;

				if (e.lengthComputable) {
					percentComplete = (e.loaded / e.total) * 100;
				}

				this.options.onProgress?.(percentComplete);
			};

			__xhr.onreadystatechange = (): void => {
				this.options.onProgress?.(10);

				if (__xhr.readyState === XMLHttpRequest.DONE) {
					if (o.successStatuses.includes(__xhr.status)) {
						onResolve();
					} else if (__xhr.statusText) {
						this.__isFulfilled = true;
						reject(error.connection(__xhr.statusText));
					}
				}
			};

			__xhr.withCredentials = o.withCredentials ?? false;

			const { url, data, method } = request;

			__xhr.open(method, url, true);

			if (o.contentType && __xhr.setRequestHeader) {
				__xhr.setRequestHeader('Content-type', o.contentType);
			}

			let { headers } = o;
			if (isFunction(headers)) {
				headers = await headers.call(this);
			}

			if (headers && __xhr.setRequestHeader) {
				Object.keys(headers).forEach(key => {
					__xhr.setRequestHeader(
						key,
						(headers as IDictionary<string>)[key]
					);
				});
			}

			// IE
			this.__async.setTimeout(() => {
				__xhr.send(data ? this.__buildParams(data) : undefined);
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

	private __isDestructed: boolean = false;

	@autobind
	destruct(): void {
		if (!this.__isDestructed) {
			this.__isDestructed = true;

			if (this.__activated && !this.__isFulfilled) {
				this.abort();
				this.__isFulfilled = true;
			}

			this.__async.destruct();
		}
	}
}
