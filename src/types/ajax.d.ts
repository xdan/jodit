/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDestructible, IDictionary } from './types';
import { IViewBased } from './view';

export type DataVariant =
	| IDictionary<string>
	| null
	| FormData
	| string
	| IDictionary<string | IDictionary>;

export interface IRequest {
	url: string;
	method: string;
	data: DataVariant;
}

export interface IResponse<T> {
	readonly status: number;
	readonly statusText: string;
	readonly url: string;
	readonly request: IRequest;

	json(): Promise<T>;
	text(): Promise<string>;
}

export interface IAjax<T> extends IDestructible {
	options: AjaxOptions;
	o: this['options'];

	jodit: IViewBased;

	abort(): IAjax<T>;

	send(): Promise<IResponse<T>>;

	prepareRequest(): IRequest;
}

export interface AjaxOptions {
	successStatuses: number[];

	/**
	 * json or text The type of data that you're expecting back
	 * from the server. if `json` the return value passes through the `JSON.parse`
	 */
	dataType?: string;

	/**
	 * The HTTP method toWYSIWYG use for the request
	 * (e.g. "POST", "GET", "PUT")
	 */
	method?: string;

	/**
	 * A string containing the URL toWYSIWYG which the request is sent.
	 */
	url?: string;

	/**
	 * Data toWYSIWYG be sent toWYSIWYG the server.
	 * It is converted toWYSIWYG a query string, if not already a string. It's appended toWYSIWYG the url for GET-requests.
	 */
	data: DataVariant;

	/**
	 * When sending data toWYSIWYG the server, use this content type. Default is "application/x-www-form-urlencoded;
	 * charset=UTF-8", which is fine for most cases
	 */
	contentType?: string | false;

	/**
	 * An object of additional header key/value pairs toWYSIWYG send along
	 * with requests using the XMLHttpRequest transport. Uses in {@link FileBrowser|FileBrowser}
	 * and {@link Uploader|Uploader}
	 */
	headers?: IDictionary<string> | null;

	/**
	 * Enable or disable Access-Control-Allow-Credentials client side. Useful for cross domain requests
	 */
	withCredentials?: boolean;

	queryBuild?: (
		this: IAjax<any>,
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	) => string | FormData;

	xhr?: () => XMLHttpRequest;

	onProgress?: (percentage: number) => void;
}
