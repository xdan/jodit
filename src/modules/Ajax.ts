/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { IDictionary, IRequest, IViewBased } from '../types';
import { each, error, extend, isPlainObject, parseQuery } from './helpers/';

/**
 * @property {object} defaultAjaxOptions A set of key/value pairs that configure the Ajax request. All settings
 * are optional
 * @property {object} defaultAjaxOptions.headers An object of additional header key/value pairs toWYSIWYG send along
 * with requests using the XMLHttpRequest transport. Uses in {@link FileBrowser|FileBrowser}
 * and {@link Uploader|Uploader}
 * @property {string} defaultAjaxOptions.dataType='json' json or text The type of data that you're expecting back
 * from the server. if `json` the return value passes through the `JSON.parse`
 * @property {string} defaultAjaxOptions.method='GET' The HTTP method toWYSIWYG use for the request
 * (e.g. "POST", "GET", "PUT")
 * @property {string} defaultAjaxOptions.url='' A string containing the URL toWYSIWYG which the request is sent.
 * @property {string} defaultAjaxOptions.async=true By default, all requests are sent asynchronously (i.e. this is
 * set toWYSIWYG true by default). If you need synchronous requests, set this option toWYSIWYG false
 * @property {object|string} defaultAjaxOptions.data=null Data toWYSIWYG be sent toWYSIWYG the server.
 * It is converted toWYSIWYG a query string, if not already a string. It's appended toWYSIWYG the url for GET-requests.
 * @property {string} defaultAjaxOptions.contentType='application/x-www-form-urlencoded; charset=UTF-8'
 * When sending data toWYSIWYG the server, use this content type. Default is "application/x-www-form-urlencoded;
 * charset=UTF-8", which is fine for most cases
 * @property {boolean} defaultAjaxOptions.withCredentials=false
 * Enable or disable Access-Control-Allow-Credentials client side. Useful for cross domain requests
 * @property {function} defaultAjaxOptions.error=function () {} A function toWYSIWYG be called if the request fails
 * @property {function} defaultAjaxOptions.success=function (resp) {} A function toWYSIWYG be called if the
 * request succeeds
 * @property {function} defaultAjaxOptions.xhr=function () { return new XMLHttpRequest(); } Callback for creating
 * the XMLHttpRequest object.
 */

import { AjaxOptions, IAjax } from '../types';
import { buildQuery } from './helpers/buildQuery';

declare module '../Config' {
	interface Config {
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

	private success_response_codes = [200, 201, 202];

	private __buildParams(
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	): string | FormData {
		if (
			this.options.queryBuild &&
			typeof this.options.queryBuild === 'function'
		) {
			return this.options.queryBuild.call(this, obj, prefix);
		}

		if (
			typeof obj === 'string' ||
			((this.jodit.ownerWindow as any).FormData &&
				obj instanceof (this.jodit.ownerWindow as any).FormData)
		) {
			return obj as string | FormData;
		}

		return buildQuery(obj);
	}

	status!: number;

	response!: string;

	options: AjaxOptions;

	jodit: IViewBased;

	abort(): Ajax {
		try {
			this.xhr.abort();
		} catch {}

		return this;
	}

	private resolved = false;
	private activated = false;

	send(): Promise<any> {
		this.activated = true;

		return new Promise(
			(
				resolve: (this: XMLHttpRequest, resp: object) => any,
				reject: (error: Error) => any
			) => {
				const __parse = (resp: string): object => {
					let result: object | null = null;

					if (this.options.dataType === 'json') {
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

					resolve.call(this.xhr, __parse(this.response) || {});
				};

				this.xhr.onreadystatechange = () => {
					if (this.xhr.readyState === XMLHttpRequest.DONE) {
						const resp = this.xhr.responseText;

						this.response = resp;
						this.status = this.xhr.status;
						this.resolved = true;

						if (
							this.success_response_codes.indexOf(
								this.xhr.status
							) > -1
						) {
							resolve.call(this.xhr, __parse(resp));
						} else {
							reject.call(
								this.xhr,
								error(
									this.xhr.statusText ||
										this.jodit.i18n('Connection error!')
								)
							);
						}
					}
				};

				this.xhr.withCredentials =
					this.options.withCredentials || false;

				const { url, data, method } = this.prepareRequest();

				this.xhr.open(method, url, true);

				if (this.options.contentType && this.xhr.setRequestHeader) {
					this.xhr.setRequestHeader(
						'Content-type',
						this.options.contentType
					);
				}

				if (this.options.headers && this.xhr.setRequestHeader) {
					each(this.options.headers, (key, value) => {
						this.xhr.setRequestHeader(key, value);
					});
				}

				// IE
				setTimeout(() => {
					this.xhr.send(data ? this.__buildParams(data) : undefined);
				}, 0);
			}
		);
	}

	prepareRequest(): IRequest {
		if (!this.options.url) {
			throw error('Need URL for AJAX request');
		}

		let url: string = this.options.url;
		const data = this.options.data;
		const method = (this.options.method || 'get').toLowerCase();

		if (method === 'get' && data && isPlainObject(data)) {
			const qIndex = url.indexOf('?');

			if (qIndex !== -1) {
				const urlData = parseQuery(url);
				url =
					url.substr(0, qIndex) +
					'?' +
					buildQuery({ ...urlData, ...(data as IDictionary) });
			} else {
				url += '?' + buildQuery(this.options.data as IDictionary);
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

	constructor(editor: IViewBased, options: AjaxOptions) {
		this.jodit = editor;

		this.options = extend(
			true,
			{},
			Config.prototype.defaultAjaxOptions,
			options
		) as AjaxOptions;

		if (this.options.xhr) {
			this.xhr = this.options.xhr();
		}

		editor &&
			editor.events &&
			editor.events.on('beforeDestruct', () => {
				this.abort();
			});
	}

	destruct(): any {
		if (this.activated && !this.resolved) {
			this.abort();
			this.resolved = true;
		}
	}
}
