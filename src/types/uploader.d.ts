/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { CanPromise, IDictionary, IViewComponent } from './types';
import type { IViewBased } from './view';
import type { IAjax } from './ajax';

interface IUploaderData {
	code?: number;
	messages?: string[];
	files: string[];
	isImages?: boolean[];
	path?: string;
	baseurl: string;
	newfilename?: string;

	/**
	 * The names the files had on the user's device. Only set when the
	 * images were read as base64 (`insertImageAsBase64URI`), where `files`
	 * holds data URIs.
	 */
	fileNames?: string[];
}

interface IUploaderAnswer {
	success: boolean;
	time: string;
	data: IUploaderData;
}

export type HandlerSuccess = (resp: IUploaderData) => void;

/**
 * Error the handler gets when the connector refused an upload: the answer,
 * its `code`, the sent `files` and `retry` to send them again, changed
 */
export interface IUploadError extends Error {
	code?: number;
	answer: IUploaderAnswer;
	files: File[];
	retry(plan?: Partial<IUploadPlan>): Promise<unknown>;
}

/**
 * What `beforeUpload` decided: the files to send and extra fields of the request
 */
export interface IUploadPlan {
	files: File[];
	data?: IDictionary<string>;
}
export type HandlerError = (e: Error) => void;
export type BuildDataResult =
	| FormData
	| IDictionary<string>
	| Promise<FormData | IDictionary<string>>
	| string;

export interface IUploaderOptions<T> {
	url:
		string | ((request: FormData | IDictionary<string> | string) => string);
	insertImageAsBase64URI: boolean;

	/**
	 * Show the `Upload` tab in the image/file insert popup.
	 * Set to `false` when the uploader is configured only for the
	 * file browser and direct drag-and-drop upload should not be offered.
	 * @default true
	 * @example
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://example.com/upload',
	 * 		showTabInFileSelector: false
	 * 	}
	 * });
	 * ```
	 */
	showTabInFileSelector: boolean;

	/**
	 * List of extensions for images
	 * @default ['jpg', 'png', 'jpeg', 'gif']
	 * @example
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		insertImageAsBase64URI: true,
	 * 		imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp']
	 * 	}
	 * });
	 * ```
	 */
	imagesExtensions: string[];
	headers?:
		| IDictionary<string>
		| null
		| ((this: IAjax<any>) => CanPromise<IDictionary<string> | null>);
	data: null | object;
	format: string;
	method: string;

	filesVariableName: (i: number) => string;

	/**
	 * The method can be used to change the name of the uploaded file
	 * This is the name the file will have when it is sent to the server
	 * ```js
	 * Jodit.make('#editor', {
	 *  uploader: {
	 *    url: 'some-connector.php',
	 *    processFileName: (key, file, name) => {
	 *      return [key, file, 'some-prefix_' + name];
	 *    }
	 *  }
	 * });
	 * ```
	 */
	processFileName(
		this: T,
		key: string,
		file: File,
		name: string
	): [string, File, string];

	/**
	 * The method can be used to change the displayed name of the uploaded file
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://sitename.net/jodit/connector/index.php?action=fileUpload',
	 * 		getDisplayName: (_, name) => 'File:' + name
	 * 	}
	 * });
	 * ```
	 */
	getDisplayName(this: T, baseurl: string, filename: string): string;

	pathVariableName: string;
	withCredentials: boolean;

	/**
	 * Called with the files right before they are sent (or read as base64).
	 * What it returns decides what happens:
	 *
	 * - `false` cancels the upload, the error handler gets `Upload canceled`
	 * - `undefined` (or `true`) sends the files as they are
	 * - an array of `File` sends those files instead, so files can be renamed
	 *   with `new File([file], 'other.png', { type: file.type })` or left out
	 * - an object `{ files, data }` ({@link IUploadPlan}) sends those files
	 *   and adds the fields of `data` to the request
	 * - a promise of any of the above is awaited, so the user can be asked first
	 *
	 * Throwing an error cancels the upload and routes the message through
	 * the error handler.
	 *
	 * Client-side validation (size, type, count):
	 *
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://example.com/connector/?action=fileUpload',
	 * 		beforeUpload(files) {
	 * 			if (files.some(file => file.size > 2 * 1024 * 1024)) {
	 * 				this.j.message.error('Max 2MB');
	 * 				return false;
	 * 			}
	 * 		}
	 * 	}
	 * });
	 * ```
	 *
	 * Ask the user, say for a target folder the connector takes as a field:
	 *
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://example.com/connector/?action=fileUpload',
	 * 		beforeUpload(files) {
	 * 			return new Promise(resolve =>
	 * 				this.j.prompt('Folder', 'Upload to', folder =>
	 * 					resolve({ files, data: { path: folder } })
	 * 				)
	 * 			);
	 * 		}
	 * 	}
	 * });
	 * ```
	 *
	 * A name that is already taken is not this hook's job: see `promptOnExists`.
	 */
	beforeUpload?: (
		this: T,
		files: File[]
	) => CanPromise<boolean | void | File[] | IUploadPlan>;

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

	/**
	 * Shows a failed upload. When the connector refused it, the error is an
	 * {@link IUploadError}: `message` is the connector's text (`getMessage`),
	 * `answer` the whole answer, `code` its `data.code`, `files` the files
	 * that were sent and `retry(plan)` sends them again with other files or
	 * extra request fields, without running `beforeUpload` a second time.
	 *
	 * Connectors answer `409` when an uploaded name is already taken and
	 * `saveSameFileNameStrategy` is `error` (jodit-nodejs 2.1.1, PHP 3.0.61,
	 * jodit-python). With `promptOnExists` off, ask the user here:
	 *
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://example.com/connector/?action=fileUpload',
	 * 		promptOnExists: false,
	 * 		defaultHandlerError(e) {
	 * 			if (e.code === 409) {
	 * 				this.j.confirm('Replace?', yes => yes && e.retry({ data: { onExists: 'replace' } }));
	 * 				return;
	 * 			}
	 *
	 * 			this.j.message.error(e.message);
	 * 		}
	 * 	}
	 * });
	 * ```
	 *
	 * Or keep both files under another name:
	 *
	 * ```javascript
	 * e.retry({
	 * 	files: e.files.map(file => new File([file], 'copy-' + file.name, { type: file.type }))
	 * });
	 * ```
	 */
	defaultHandlerError: HandlerError;

	/**
	 * When the connector answers `409` (the name is already taken), ask the
	 * user for another name in a prompt and send the file again under it,
	 * before the error handler gets a say: this is part of the upload, not a
	 * failure. The prompt comes with `promptOnExistsSuggestName(name)` filled
	 * in; Cancel drops the file. Several files sent together are sent again
	 * one by one, so only the taken names ask.
	 *
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		url: 'https://example.com/connector/?action=fileUpload',
	 * 		promptOnExists: true,
	 * 		promptOnExistsSuggestName: name => name.replace(/(\.\w+)?$/, '-copy$1')
	 * 	}
	 * });
	 * ```
	 */
	promptOnExists: boolean;

	/**
	 * The name the `promptOnExists` prompt offers for a taken name. Default: the same name
	 */
	promptOnExistsSuggestName: (this: T, name: string) => string;

	contentType: (this: T, requestData: any) => string | false;

	/**
	 * This method can be used to replace the function of uploading files
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	uploader: {
	 * 		customUploadFunction: (requestData, showProgress) => fetch(requestData).then((res)=>{
	 *			showProgress(100)
	 *			return res.json()
	 *		})
	 * 	}
	 * });
	 * ```
	 */
	customUploadFunction?: (
		requestData: any,
		showProgress: (progress: number) => void
	) => Promise<IUploaderAnswer>;
}

export interface IUploader extends IViewComponent {
	readonly jodit: IViewBased;
	readonly j: this['jodit'];

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

	upload(files: FileList | File[] | null): Promise<IUploaderData>;

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
