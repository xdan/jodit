/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type {
	HandlerError,
	HandlerSuccess,
	IUploader,
	IUploaderData
} from 'jodit/types';
import { error, isFunction, isPlainObject, toArray } from 'jodit/core/helpers';
import { send } from 'jodit/modules/uploader/helpers/send';

/**
 * Send files to server
 */
export function sendFiles(
	uploader: IUploader,
	files: FileList | File[] | null,
	handlerSuccess?: HandlerSuccess,
	handlerError?: HandlerError,
	process?: (form: FormData) => void
): Promise<any> {
	if (!files) {
		return Promise.reject(error('Need files'));
	}

	const { o } = uploader;

	let fileList: File[] = toArray(files);

	if (!fileList.length) {
		return Promise.reject(error('Need files'));
	}

	const promises: Array<Promise<any>> = [];

	if (o.insertImageAsBase64URI) {
		let file: File, i: number;

		for (i = 0; i < fileList.length; i += 1) {
			file = fileList[i];

			if (file && file.type) {
				const mime = file.type.match(/\/([a-z0-9]+)/i) as string[];

				const extension = mime[1] ? mime[1].toLowerCase() : '';

				if (o.imagesExtensions.includes(extension)) {
					const reader = new FileReader();

					promises.push(
						uploader.j.async.promise((resolve, reject) => {
							reader.onerror = reject;
							reader.onloadend = (): void => {
								const resp = {
									baseurl: '',
									files: [reader.result],
									isImages: [true]
								} as IUploaderData;

								const handler = isFunction(handlerSuccess)
									? handlerSuccess
									: o.defaultHandlerSuccess;

								handler.call(uploader, resp);

								resolve(resp);
							};
							reader.readAsDataURL(file);
						})
					);

					(fileList[i] as any) = null;
				}
			}
		}
	}

	fileList = fileList.filter(a => a);

	if (fileList.length) {
		const form = new FormData();

		form.append(o.pathVariableName, uploader.path);
		form.append('source', uploader.source);

		let file: File;
		for (let i = 0; i < fileList.length; i += 1) {
			file = fileList[i];

			if (file) {
				const hasRealExtension = /\.[\d\w]+$/.test(file.name);
				const mime = file.type.match(/\/([a-z0-9]+)/i) as string[];

				const extension: string =
					mime && mime[1] ? mime[1].toLowerCase() : '';

				let newName =
					fileList[i].name ||
					Math.random().toString().replace('.', '');

				if (!hasRealExtension && extension) {
					let extForReg = extension;

					if (['jpeg', 'jpg'].includes(extForReg)) {
						extForReg = 'jpeg|jpg';
					}

					const reEnd = new RegExp('.(' + extForReg + ')$', 'i');

					if (!reEnd.test(newName)) {
						newName += '.' + extension;
					}
				}

				const [key, iFile, name] = o.processFileName.call(
					uploader,
					o.filesVariableName(i),
					fileList[i],
					newName
				);

				form.append(key, iFile, name);
			}
		}

		if (process) {
			process(form);
		}

		if (o.data && isPlainObject(o.data)) {
			Object.keys(o.data).forEach((key: string) => {
				form.append(key, (o.data as any)[key]);
			});
		}

		o.prepareData.call(uploader, form);

		promises.push(
			send(uploader, form)
				.then(resp => {
					if (o.isSuccess.call(uploader, resp)) {
						const handler = isFunction(handlerSuccess)
							? handlerSuccess
							: o.defaultHandlerSuccess;

						handler.call(uploader, o.process.call(uploader, resp));

						return resp;
					}

					const handler = isFunction(handlerError)
						? handlerError
						: o.defaultHandlerError;

					handler.call(
						uploader,
						error(o.getMessage.call(uploader, resp))
					);

					return resp;
				})
				.then(() => {
					uploader.j.events && uploader.j.e.fire('filesWereUploaded');
				})
		);
	}

	return Promise.all(promises);
}
