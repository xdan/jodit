/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { CanPromise, IDestructible, IDictionary } from './types';
import type { IViewBased } from './view';

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
	blob(): Promise<Blob>;
}

export interface IAjax<T> extends IDestructible {
	options: AjaxOptions;
	o: this['options'];

	abort(): IAjax<T>;
	send(): Promise<IResponse<T>>;

	prepareRequest(): IRequest;
}

export interface AjaxOptions {
	successStatuses: number[];

	/**
	 * The HTTP method to use for the request
	 * (e.g. "POST", "GET", "PUT")
	 */
	method?: string;

	/**
	 * A string containing the URL which the request is sent.
	 */
	url?: string;

	/**
	 * Data be sent to the server.
	 * It is converted to a query string, if not already a string. It's appended to the url for GET-requests.
	 */
	data: DataVariant;

	/**
	 * When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded;
	 * charset=UTF-8", which is fine for most cases
	 */
	contentType?: string | false;

	/**
	 * An object (or a function which returns an object) of additional header key/value pairs to send along
	 * with requests using the XMLHttpRequest transport. Uses in [[FileBrowser]]
	 * and [[Uploader]]
	 */
	headers?:
		| IDictionary<string>
		| null
		| ((this: IAjax<any>) => CanPromise<IDictionary<string> | null>);

	responseType?: XMLHttpRequestResponseType;

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
