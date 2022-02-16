/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDictionary, IViewComponent } from './types';

interface IUploaderData {
	messages?: string[];
	files: string[];
	isImages?: boolean[];
	path?: string;
	baseurl: string;
	newfilename?: string;
}

interface IUploaderAnswer {
	success: boolean;
	time: string;
	data: IUploaderData;
}

export type HandlerSuccess = (resp: IUploaderData) => void;
export type HandlerError = (e: Error) => void;
export type BuildDataResult =
	| FormData
	| IDictionary<string>
	| Promise<FormData | IDictionary<string>>
	| string;

export interface IUploaderOptions<T> {
	url:
		| string
		| ((request: FormData | IDictionary<string> | string) => string);
	insertImageAsBase64URI: boolean;
	imagesExtensions: string[];
	headers?: IDictionary<string> | null;
	data: null | object;
	format: string;
	method: string;

	filesVariableName: (i: number) => string;
	pathVariableName: string;
	withCredentials: boolean;

	prepareData: (this: T, formData: FormData) => any;
	buildData?: (this: T, formData: any) => BuildDataResult;
	queryBuild?: (
		obj: string | IDictionary<string | object> | FormData,
		prefix?: string
	) => string | FormData;

	isSuccess: (this: T, resp: IUploaderAnswer) => boolean;

	getMessage: (this: T, resp: IUploaderAnswer) => string;

	process: (this: T, resp: IUploaderAnswer) => IUploaderData;

	error: (this: T, e: Error) => void;

	defaultHandlerSuccess: HandlerSuccess;
	defaultHandlerError: HandlerError;

	contentType: (this: T, requestData: any) => string | false;
}

export interface IUploader extends IViewComponent {
	readonly options: IUploaderOptions<IUploader>;
	readonly o: this['options'];

	bind(
		form: HTMLElement,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	): void;

	uploadRemoteImage(
		url: string,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	): void;

	readonly path: string;

	readonly source: string;

	/**
	 * It sets the path for uploading files
	 */
	setPath(path: string): this;

	/**
	 * It sets the source for connector
	 */
	setSource(source: string): this;
}
