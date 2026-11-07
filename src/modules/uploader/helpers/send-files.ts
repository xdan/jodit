/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type {
	HandlerError,
	HandlerSuccess,
	IDictionary,
	IDlgs,
	IUploader,
	IUploaderData,
	IUploadPlan,
	IViewBased
} from 'jodit/types';
import { ERROR_CODE_CONFLICT } from 'jodit/core/constants';
import {
	error,
	isArray,
	isFunction,
	isPlainObject,
	toArray
} from 'jodit/core/helpers';
import { Dlgs } from 'jodit/core/traits/dlgs';
import { Prompt } from 'jodit/modules/dialog/prompt';
import { normalizeUploaderData } from 'jodit/modules/uploader/helpers/normalize-uploader-data';
import { send } from 'jodit/modules/uploader/helpers/send';
import { UploadError } from 'jodit/modules/uploader/helpers/upload-error';

/**
 * Send files to server
 */
export async function sendFiles(
	uploader: IUploader,
	files: FileList | File[] | null,
	handlerSuccess?: HandlerSuccess,
	handlerError?: HandlerError,
	process?: (form: FormData) => void,
	// Set when a refused upload is sent again: `beforeUpload` already had its say
	retryOf?: Partial<IUploadPlan>
): Promise<any> {
	if (!files) {
		throw error('Need files');
	}

	const { o } = uploader;

	let fileList: File[] = toArray(files);

	if (!fileList.length) {
		throw error('Need files');
	}

	let extraData: IDictionary<string> | undefined = retryOf?.data;

	// Client-side validation hook — returning `false` aborts the upload, and it may hand back the files to send instead
	// See https://github.com/xdan/jodit/issues/1329
	if (!retryOf && isFunction(o.beforeUpload)) {
		let plan: boolean | void | File[] | IUploadPlan;

		try {
			plan = await o.beforeUpload.call(uploader, fileList);
		} catch (e) {
			(handlerError || o.defaultHandlerError).call(uploader, e as Error);
			throw e;
		}

		if (plan === false) {
			const err = error('Upload canceled');
			(handlerError || o.defaultHandlerError).call(uploader, err);
			throw err;
		}

		if (isArray(plan)) {
			fileList = plan;
		} else if (isPlainObject(plan) && isArray(plan.files)) {
			fileList = plan.files;
			extraData = (plan as IUploadPlan).data;
		}

		if (!fileList.length) {
			return [];
		}
	}

	const promises: Array<Promise<unknown>> = [];

	if (o.insertImageAsBase64URI) {
		readImagesWithReader(
			fileList,
			o.imagesExtensions,
			promises,
			uploader,
			handlerSuccess,
			o.defaultHandlerSuccess
		);
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
				const hasRealExtension = /\.\w+$/.test(file.name);
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

		if (extraData) {
			Object.keys(extraData).forEach((key: string) => {
				form.append(key, extraData[key]);
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

						handler.call(
							uploader,
							normalizeUploaderData(
								o.process.call(uploader, resp)
							)
						);

						return resp;
					}

					const err = new UploadError(
						o.getMessage.call(uploader, resp),
						resp,
						fileList,
						plan =>
							sendFiles(
								uploader,
								plan?.files ?? fileList,
								handlerSuccess,
								handlerError,
								process,
								{ data: { ...extraData, ...plan?.data } }
							)
					);

					// A taken name is part of the upload, not a failure: ask for another one first
					if (err.code === ERROR_CODE_CONFLICT && o.promptOnExists) {
						return askAnotherName(uploader, err);
					}

					const handler = isFunction(handlerError)
						? handlerError
						: o.defaultHandlerError;

					handler.call(uploader, err);

					return resp;
				})
				.then(() => {
					uploader.j.events && uploader.j.e.fire('filesWereUploaded');
				})
		);
	}

	return Promise.all(promises);
}

function askAnotherName(
	uploader: IUploader,
	err: UploadError
): Promise<unknown> {
	const { files } = err;

	// A batch is refused as a whole (the connector saved nothing) and the answer does not say which name is taken,
	// so the files go again one by one: the free ones are simply stored, the taken one answers 409 alone and gets its prompt
	if (files.length > 1) {
		return files.reduce<Promise<unknown>>(
			(chain, file) => chain.then(() => err.retry({ files: [file] })),
			Promise.resolve()
		);
	}

	const [file] = files;
	const { j, o } = uploader;

	return new Promise(resolve => {
		let answered = false;

		// `Dlgs.prototype.dlg`: the uploader's view does not always carry the Dlgs trait
		const dialog = Prompt.call(
			Dlgs.prototype.dlg.call(j as IViewBased & IDlgs, {
				closeOnClickOverlay: true
			}),
			j.i18n(err.message),
			j.i18n('Rename'),
			(newName: string): false | void => {
				newName = newName.trim();

				if (!newName) {
					return false;
				}

				answered = true;
				resolve(
					err.retry({
						files: [new File([file], newName, { type: file.type })]
					})
				);
			},
			j.i18n('Enter new name'),
			o.promptOnExistsSuggestName.call(uploader, file.name)
		);

		dialog.e.on(dialog, 'afterClose', () => {
			!answered && resolve(undefined);
		});
	});
}

function readImagesWithReader(
	fileList: File[],
	imagesExtensions: string[],
	promises: Array<Promise<any>>,
	uploader: IUploader,
	handlerSuccess: ((resp: IUploaderData) => void) | undefined,
	defaultHandlerSuccess: (resp: IUploaderData) => void
): void {
	const readerPromises: Array<Promise<unknown>> = [];
	let file: File, i: number;

	for (i = 0; i < fileList.length; i += 1) {
		file = fileList[i];

		if (file && file.type) {
			const mime = file.type.match(/\/([a-z0-9]+)/i) as string[];

			const extension = mime[1] ? mime[1].toLowerCase() : '';

			if (!imagesExtensions.includes(extension)) {
				continue;
			}

			const reader = new FileReader();
			const { name } = file;

			const readerPromise = uploader.j.async.promise<IUploaderData>(
				(resolve, reject) => {
					reader.onerror = reject;
					reader.onloadend = (): void => {
						const resp = normalizeUploaderData({
							baseurl: '',
							items: [
								{
									file: reader.result as string,
									isImage: true,
									name
								}
							]
						} as IUploaderData);

						const handler = isFunction(handlerSuccess)
							? handlerSuccess
							: defaultHandlerSuccess;

						handler.call(uploader, resp);

						resolve(resp);
					};

					reader.readAsDataURL(file);
				}
			);

			readerPromises.push(readerPromise);
			promises.push(readerPromise);

			(fileList[i] as any) = null;
		}
	}

	// Images inserted as base64 never reach the server branch in `sendFiles`,
	// which is the only other place that fires `filesWereUploaded`
	if (readerPromises.length) {
		Promise.all(readerPromises)
			.then(() => {
				uploader.j.events && uploader.j.e.fire('filesWereUploaded');
			})
			.catch(() => {
				// Read errors are propagated to the caller via `promises`
			});
	}
}
