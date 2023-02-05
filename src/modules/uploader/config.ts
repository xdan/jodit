/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type {
	IUploader,
	IUploaderAnswer,
	IUploaderData,
	IUploaderOptions
} from 'jodit/types';
import { Config } from 'jodit/config';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { isJoditObject } from 'jodit/core/helpers/checker/is-jodit-object';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Enable drag and drop file editor
		 */
		enableDragAndDropFileToEditor: boolean;
		uploader: IUploaderOptions<IUploader>;
	}
}

/**
 * Module for processing download documents and images by Drag and Drop
 * Drag and Drop files
 */

Config.prototype.enableDragAndDropFileToEditor = true;

Config.prototype.uploader = {
	url: '',

	insertImageAsBase64URI: false,
	imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
	headers: null,
	data: null,

	filesVariableName(i: number): string {
		return `files[${i}]`;
	},

	withCredentials: false,
	pathVariableName: 'path',

	format: 'json',

	method: 'POST',

	prepareData(this: IUploader, formData: FormData) {
		return formData;
	},

	isSuccess(this: IUploader, resp: IUploaderAnswer): boolean {
		return resp.success;
	},

	getMessage(this: IUploader, resp: IUploaderAnswer) {
		return resp.data.messages !== undefined && isArray(resp.data.messages)
			? resp.data.messages.join(' ')
			: '';
	},

	/**
	 * @see [[IUploader.processFileName]]
	 */
	processFileName(
		this: IUploader,
		key: string,
		file: File,
		name: string
	): [string, File, string] {
		return [key, file, name];
	},

	process(this: IUploader, resp: IUploaderAnswer): IUploaderData {
		return resp.data;
	},

	error(this: IUploader, e: Error) {
		this.j.e.fire('errorMessage', e.message, 'error', 4000);
	},

	getDisplayName(this: IUploader, baseurl: string, filename: string): string {
		return baseurl + filename;
	},

	defaultHandlerSuccess(this: IUploader, resp: IUploaderData) {
		const j = this.j || this;

		if (!isJoditObject(j)) {
			return;
		}

		if (resp.files && resp.files.length) {
			resp.files.forEach((filename, index: number) => {
				const [tagName, attr]: string[] =
					resp.isImages && resp.isImages[index]
						? ['img', 'src']
						: ['a', 'href'];

				const elm = j.createInside.element(tagName);

				elm.setAttribute(attr, resp.baseurl + filename);

				if (tagName === 'a') {
					elm.textContent = j.o.uploader.getDisplayName.call(
						this,
						resp.baseurl,
						filename
					);
				}

				if (tagName === 'img') {
					j.s.insertImage(
						elm as HTMLImageElement,
						null,
						j.o.imageDefaultWidth
					);
				} else {
					j.s.insertNode(elm);
				}
			});
		}
	},

	defaultHandlerError(this: IUploader, e: Error) {
		this.j.e.fire('errorMessage', e.message);
	},

	contentType(this: IUploader, requestData: any) {
		return (this.ow as any).FormData !== undefined &&
			typeof requestData !== 'string'
			? false
			: 'application/x-www-form-urlencoded; charset=UTF-8';
	}
} as IUploaderOptions<IUploader>;
