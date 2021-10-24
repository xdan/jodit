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
	IAjax
} from '../types';
import { Config } from '../config';
import {
	each,
	error,
	isPlainObject,
	parseQuery,
	buildQuery,
	isString,
	isFunction,
	ConfigProto
} from './helpers';

declare module '../config' {
	interface Config {
		/**
		 * A set of key/value pairs that configure the Ajax request. All settings are optional
		 */
		defaultAjaxOptions: AjaxOptions;
	}
}

Config.prototype.defaultAjaxOptions = {
	dataType: 'json',
	method: 'GET',
	url: '',
	data: null,
	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

	headers: {
		'X-REQUESTED-WITH': 'XMLHttpRequest' // compatible with jQuery
	},

	withCredentials: false,

	xhr(): XMLHttpRequest {
		return new XMLHttpRequest();
	}
} as AjaxOptions;

export class Ajax implements IAjax {
	static log: IRequest[] = [];

	private readonly xhr!: XMLHttpRequest;

	private successResponseCodes = [200, 201, 202];

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

	status!: number;

	response!: string;

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

	send<T = any>(): Promise<T> {
		this.activated = true;

		return new Promise(
			(
				resolve: (this: XMLHttpRequest, resp: T) => any,
				reject: (error: Error) => any
			) => {
				const __parse = (resp: string): T => {
					let result: T | null = null;

					if (this.o.dataType === 'json') {
						result = JSON.parse(resp);
					}

					if (!result) {
						throw error('No JSON format');
					}

					return result;
				};

				this.xhr.onabort = () => {
					reject(error(this.xhr.statusText));
				};

				this.xhr.onerror = () => {
					reject(error(this.xhr.statusText));
				};

				this.xhr.ontimeout = () => {
					reject(error(this.xhr.statusText));
				};

				this.xhr.onload = () => {
					this.response = this.xhr.responseText;
					this.status = this.xhr.status;
					this.resolved = true;

					resolve.call(this.xhr, __parse(this.response) || ({} as T));
				};

				this.xhr.onprogress = (e): void => {
					let percentComplete = 0;

					if (e.lengthComputable) {
						percentComplete = (e.loaded / e.total) * 100;
					}

					this.options.onProgress?.(percentComplete);
				};

				this.xhr.onreadystatechange = () => {
					this.options.onProgress?.(10);

					if (this.xhr.readyState === XMLHttpRequest.DONE) {
						const resp = this.xhr.responseText;

						this.response = resp;
						this.status = this.xhr.status;
						this.resolved = true;

						if (
							this.successResponseCodes.indexOf(this.xhr.status) >
							-1
						) {
							resolve.call(this.xhr, __parse(resp));
						} else {
							reject.call(
								this.xhr,
								error(
									this.xhr.statusText ||
										this.j.i18n('Connection error!')
								)
							);
						}
					}
				};

				this.xhr.withCredentials = this.o.withCredentials || false;

				const { url, data, method } = this.prepareRequest();

				this.xhr.open(method, url, true);

				if (this.o.contentType && this.xhr.setRequestHeader) {
					this.xhr.setRequestHeader(
						'Content-type',
						this.o.contentType
					);
				}

				if (this.o.headers && this.xhr.setRequestHeader) {
					each(this.o.headers, (key, value) => {
						this.xhr.setRequestHeader(key, value);
					});
				}

				// IE
				this.j.async.setTimeout(() => {
					this.xhr.send(data ? this.__buildParams(data) : undefined);
				}, 0);
			}
		);
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

		jodit && jodit.e && jodit.e.on('beforeDestruct', () => this.abort());
	}

	destruct(): void {
		if (this.activated && !this.resolved) {
			this.abort();
			this.resolved = true;
		}
	}
}
