/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/uploader/README.md]]
 * @packageDocumentation
 * @module modules/uploader
 */

import './uploader.less';

import type {
	BuildDataResult,
	HandlerError,
	HandlerSuccess,
	IAjax,
	IDictionary,
	IJodit,
	IUploader,
	IUploaderAnswer,
	IUploaderData,
	IUploaderOptions,
	IViewBased,
	Nullable
} from 'jodit/types';
import { Config } from 'jodit/config';
import { IS_IE, TEXT_PLAIN } from 'jodit/core/constants';
import { Ajax } from 'jodit/core/request';
import {
	attr,
	error,
	isPlainObject,
	isJoditObject,
	isArray,
	isFunction,
	toArray,
	isString,
	ConfigProto
} from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { ViewComponent, STATUSES } from 'jodit/core/component/';
import { getContainer } from 'jodit/core/global';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Enable drag and drop file editor
		 */
		enableDragAndDropFileToEditor: boolean;
		uploader: IUploaderOptions<Uploader>;
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

	prepareData(this: Uploader, formData: FormData) {
		return formData;
	},

	isSuccess(this: Uploader, resp: IUploaderAnswer): boolean {
		return resp.success;
	},

	getMessage(this: Uploader, resp: IUploaderAnswer) {
		return resp.data.messages !== undefined && isArray(resp.data.messages)
			? resp.data.messages.join(' ')
			: '';
	},

	process(this: Uploader, resp: IUploaderAnswer): IUploaderData {
		return resp.data;
	},

	error(this: Uploader, e: Error) {
		this.j.e.fire('errorMessage', e.message, 'error', 4000);
	},

	defaultHandlerSuccess(this: Uploader, resp: IUploaderData) {
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
					elm.textContent = resp.baseurl + filename;
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

	defaultHandlerError(this: Uploader, e: Error) {
		this.j.e.fire('errorMessage', e.message);
	},

	contentType(this: Uploader, requestData: any) {
		return (this.j.ow as any).FormData !== undefined &&
			typeof requestData !== 'string'
			? false
			: 'application/x-www-form-urlencoded; charset=UTF-8';
	}
} as IUploaderOptions<Uploader>;

export class Uploader extends ViewComponent implements IUploader {
	/** @override */
	className(): string {
		return 'Uploader';
	}

	/**
	 * Convert dataURI to Blob
	 */
	static dataURItoBlob(dataURI: string): Blob {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

		const byteString: string = atob(dataURI.split(',')[1]),
			// separate out the mime component
			mimeString: string = dataURI
				.split(',')[0]
				.split(':')[1]
				.split(';')[0],
			// write the bytes of the string to an ArrayBuffer
			ab: ArrayBuffer = new ArrayBuffer(byteString.length),
			ia: Uint8Array = new Uint8Array(ab);

		for (let i: number = 0; i < byteString.length; i += 1) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done

		return new Blob([ia], { type: mimeString });
	}

	private path: string = '';
	private source: string = 'default';

	options: IUploaderOptions<Uploader>;
	get o(): this['options'] {
		return this.options;
	}

	buildData(data: FormData | IDictionary<string> | string): BuildDataResult {
		if (this.o.buildData && typeof this.o.buildData === 'function') {
			return this.o.buildData.call(this, data);
		}

		const FD: typeof FormData = (this.j.ow as any).FormData;

		if (FD !== undefined) {
			if (data instanceof FD) {
				return data;
			}

			if (isString(data)) {
				return data;
			}

			const newdata: FormData = new FD();

			Object.keys(data).forEach(key => {
				newdata.append(key, data[key]);
			});

			return newdata;
		}

		return data;
	}

	private ajaxInstances: IAjax<IUploaderAnswer>[] = [];

	private send(
		data: FormData | IDictionary<string>,
		success: (resp: IUploaderAnswer) => void
	): Promise<any> {
		const requestData: BuildDataResult = this.buildData(data),
			sendData = (
				request: FormData | IDictionary<string> | string
			): Promise<any> => {
				const ajax = new Ajax<IUploaderAnswer>(this.j, {
					xhr: () => {
						const xhr = new XMLHttpRequest();

						if (
							(this.j.ow as any).FormData !== undefined &&
							xhr.upload
						) {
							this.j.progressbar.show().progress(10);

							xhr.upload.addEventListener(
								'progress',
								evt => {
									if (evt.lengthComputable) {
										let percentComplete =
											evt.loaded / evt.total;

										percentComplete *= 100;

										console.log(
											'progress',
											percentComplete
										);

										this.j.progressbar
											.show()
											.progress(percentComplete);

										if (percentComplete >= 100) {
											this.j.progressbar.hide();
										}
									}
								},
								false
							);
						} else {
							this.j.progressbar.hide();
						}

						return xhr;
					},
					method: this.o.method || 'POST',
					data: request,
					url: isFunction(this.o.url)
						? this.o.url(request)
						: this.o.url,
					headers: this.o.headers,
					queryBuild: this.o.queryBuild,
					contentType: this.o.contentType.call(this, request),
					dataType: this.o.format || 'json',
					withCredentials: this.o.withCredentials || false
				});

				this.ajaxInstances.push(ajax);

				const removeAjaxInstanceFromList = () => {
					const index = this.ajaxInstances.indexOf(ajax);

					if (index !== -1) {
						this.ajaxInstances.splice(index, 1);
					}
				};

				return ajax
					.send()
					.then(resp => resp.json())
					.then(resp => {
						removeAjaxInstanceFromList();
						success.call(this, resp);
					})
					.catch(error => {
						removeAjaxInstanceFromList();
						this.o.error.call(this, error);
					});
			};

		if (requestData instanceof Promise) {
			return requestData.then(sendData).catch(error => {
				this.o.error.call(this, error);
			});
		} else {
			return sendData(requestData);
		}
	}

	/**
	 * Send files to server
	 */
	private sendFiles(
		files: FileList | File[] | null,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError,
		process?: (form: FormData) => void
	): Promise<any> {
		if (!files) {
			return Promise.reject(error('Need files'));
		}

		const uploader: Uploader = this;

		let fileList: File[] = toArray(files);

		if (!fileList.length) {
			return Promise.reject(error('Need files'));
		}

		const promises: Array<Promise<any>> = [];

		if (this.o.insertImageAsBase64URI) {
			let file: File, i: number;

			for (i = 0; i < fileList.length; i += 1) {
				file = fileList[i];
				if (file && file.type) {
					const mime: string[] = file.type.match(
						/\/([a-z0-9]+)/i
					) as string[];
					const extension: string = mime[1]
						? mime[1].toLowerCase()
						: '';
					if (this.o.imagesExtensions.includes(extension)) {
						const reader: FileReader = new FileReader();

						promises.push(
							new Promise<any>((resolve, reject) => {
								reader.onerror = reject;
								reader.onloadend = () => {
									const resp: IUploaderData = {
										baseurl: '',
										files: [reader.result],
										isImages: [true]
									} as IUploaderData;

									if (
										typeof (
											handlerSuccess ||
											uploader.options
												.defaultHandlerSuccess
										) === 'function'
									) {
										(
											(handlerSuccess ||
												uploader.options
													.defaultHandlerSuccess) as HandlerSuccess
										).call(uploader, resp);
									}

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
			const form: FormData = new FormData();

			form.append(this.o.pathVariableName, uploader.path);
			form.append('source', uploader.source);

			let file: File;
			for (let i = 0; i < fileList.length; i += 1) {
				file = fileList[i];
				if (file) {
					const mime: string[] = file.type.match(
						/\/([a-z0-9]+)/i
					) as string[];

					const extension: string =
						mime && mime[1] ? mime[1].toLowerCase() : '';

					let newName =
						fileList[i].name ||
						Math.random().toString().replace('.', '');

					if (extension) {
						let extForReg = extension;

						if (['jpeg', 'jpg'].includes(extForReg)) {
							extForReg = 'jpeg|jpg';
						}

						const reEnd = new RegExp('.(' + extForReg + ')$', 'i');

						if (!reEnd.test(newName)) {
							newName += '.' + extension;
						}
					}

					form.append(
						this.o.filesVariableName(i),
						fileList[i],
						newName
					);
				}
			}

			if (process) {
				process(form);
			}

			if (uploader.o.data && isPlainObject(uploader.o.data)) {
				Object.keys(uploader.o.data).forEach((key: string) => {
					form.append(key, (uploader.o.data as any)[key]);
				});
			}

			uploader.o.prepareData.call(this, form);

			promises.push(
				uploader
					.send(form, (resp: IUploaderAnswer) => {
						if (this.o.isSuccess.call(uploader, resp)) {
							if (
								typeof (
									handlerSuccess ||
									uploader.o.defaultHandlerSuccess
								) === 'function'
							) {
								(
									(handlerSuccess ||
										uploader.options
											.defaultHandlerSuccess) as HandlerSuccess
								).call(
									uploader,
									uploader.o.process.call(
										uploader,
										resp
									) as IUploaderData
								);
							}
						} else {
							if (
								isFunction(
									handlerError ||
										uploader.o.defaultHandlerError
								)
							) {
								(
									(handlerError ||
										uploader.options
											.defaultHandlerError) as HandlerError
								).call(
									uploader,
									error(
										uploader.o.getMessage.call(
											uploader,
											resp
										)
									)
								);
								return;
							}
						}
					})
					.then(() => {
						this.j.events && this.j.e.fire('filesWereUploaded');
					})
			);
		}

		return Promise.all(promises);
	}

	/**
	 * It sets the path for uploading files
	 */
	setPath(path: string): void {
		this.path = path;
	}

	/**
	 * It sets the source for connector
	 */
	setSource(source: string): void {
		this.source = source;
	}

	/**
	 * Set the handlers Drag and Drop to `$form`
	 *
	 * @param form - Form or any Node on which you can drag and drop the file. In addition will be processed
	 * <code>&lt;input type="file" &gt;</code>
	 * @param handlerSuccess - The function be called when a successful uploading files
	 * to the server
	 * @param handlerError - The function that will be called during a failed download files a server
	 * @example
	 * ```javascript
	 * var $form = jQuery('<form><input type="text" typpe="file"></form>');
	 * jQuery('body').append($form);
	 * Jodit.editors.someidfoeditor.uploader.bind($form[0], function (files) {
	 *     var i;
	 *     for (i = 0; i < data.files.length; i += 1) {
	 *         parent.s.insertImage(data.files[i])
	 *     }
	 * });
	 * ```
	 */

	bind(
		form: HTMLElement,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	): void {
		const self: Uploader = this,
			onPaste = (e: ClipboardEvent): false | void => {
				let i: number, file: File | null, extension: string;

				const cData = e.clipboardData;

				const process = (formdata: FormData) => {
					if (file) {
						formdata.append('extension', extension);
						formdata.append('mimetype', file.type);
					}
				};

				// send data on server
				if (!IS_IE && hasFiles(cData)) {
					this.sendFiles(cData.files, handlerSuccess, handlerError);

					return false;
				}

				if (IS_IE && !isESNext) {
					if (
						cData &&
						(!cData.types.length || cData.types[0] !== TEXT_PLAIN)
					) {
						const div = this.j.c.div('', {
							tabindex: -1,
							style:
								'left: -9999px; top: 0; width: 0; height: 100%;line-height: 140%; ' +
								'overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;',
							contenteditable: true
						});

						getContainer(this.j, Uploader).appendChild(div);

						const selection = isJoditObject(this.j)
								? this.j.s.save()
								: null,
							restore = () =>
								selection &&
								isJoditObject(this.j) &&
								this.j.s.restore();

						div.focus();

						this.j.async.setTimeout(() => {
							const child: HTMLDivElement | null =
								div.firstChild as HTMLDivElement;

							Dom.safeRemove(div);

							if (child && child.hasAttribute('src')) {
								const src = attr(child, 'src') || '';

								restore();

								self.sendFiles(
									[Uploader.dataURItoBlob(src) as File],
									handlerSuccess,
									handlerError
								);
							}
						}, this.j.defaultTimeout);
					}
					return;
				}

				if (cData && cData.items && cData.items.length) {
					const items = cData.items;

					for (i = 0; i < items.length; i += 1) {
						if (
							items[i].kind === 'file' &&
							items[i].type === 'image/png'
						) {
							file = items[i].getAsFile();

							if (file) {
								const mime = file.type.match(
									/\/([a-z0-9]+)/i
								) as string[];

								extension = mime[1]
									? mime[1].toLowerCase()
									: '';

								this.sendFiles(
									[file],
									handlerSuccess,
									handlerError,
									process
								);
							}

							e.preventDefault();
							break;
						}
					}
				}
			};

		if (this.j && (this.j as IJodit).editor !== form) {
			self.j.e.on(form, 'paste', onPaste);
		} else {
			self.j.e.on('beforePaste', onPaste);
		}

		const hasFiles = (data: Nullable<DataTransfer>): data is DataTransfer =>
			Boolean(data && data.files && data.files.length !== 0);

		self.j.e
			.on(
				form,
				'dragend dragover dragenter dragleave drop',
				(e: DragEvent) => {
					e.preventDefault();
				}
			)
			.on(form, 'dragover', (event: DragEvent) => {
				if (hasFiles(event.dataTransfer)) {
					form.classList.contains('jodit_draghover') ||
						form.classList.add('jodit_draghover');
					event.preventDefault();
				}
			})
			.on(form, 'dragend', (event: DragEvent) => {
				if (hasFiles(event.dataTransfer)) {
					form.classList.contains('jodit_draghover') &&
						form.classList.remove('jodit_draghover');
					event.preventDefault();
				}
			})
			.on(form, 'drop', (event: DragEvent): false | void => {
				form.classList.remove('jodit_draghover');

				if (hasFiles(event.dataTransfer)) {
					event.preventDefault();
					event.stopImmediatePropagation();

					this.sendFiles(
						event.dataTransfer.files,
						handlerSuccess,
						handlerError
					);
				}
			});

		const inputFile: HTMLInputElement | null =
			form.querySelector('input[type=file]');

		if (inputFile) {
			self.j.e.on(inputFile, 'change', function (this: HTMLInputElement) {
				self.sendFiles(this.files, handlerSuccess, handlerError).then(
					() => {
						inputFile.value = '';

						if (!/safari/i.test(navigator.userAgent)) {
							inputFile.type = '';
							inputFile.type = 'file';
						}
					}
				);
			});
		}
	}

	/**
	 * Upload images to a server by its URL, making it through the connector server.
	 */
	uploadRemoteImage(
		url: string,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	): void {
		const uploader = this;
		uploader.send(
			{
				action: 'fileUploadRemote',
				url
			},
			(resp: IUploaderAnswer) => {
				if (uploader.o.isSuccess.call(uploader, resp)) {
					if (typeof handlerSuccess === 'function') {
						handlerSuccess.call(
							uploader,
							this.o.process.call(this, resp)
						);
					} else {
						this.o.defaultHandlerSuccess.call(
							uploader,
							this.o.process.call(this, resp)
						);
					}
				} else {
					if (
						typeof (
							handlerError || uploader.o.defaultHandlerError
						) === 'function'
					) {
						(handlerError || this.o.defaultHandlerError).call(
							uploader,
							error(uploader.o.getMessage.call(this, resp))
						);
						return;
					}
				}
			}
		);
	}

	constructor(editor: IViewBased, options?: IUploaderOptions<Uploader>) {
		super(editor);

		this.options = ConfigProto(
			options || {},
			ConfigProto(
				Config.defaultOptions.uploader,
				isJoditObject(editor) ? editor.o.uploader : {}
			)
		) as IUploaderOptions<Uploader>;
	}

	override destruct(): any {
		this.setStatus(STATUSES.beforeDestruct);

		this.ajaxInstances.forEach(ajax => {
			try {
				ajax.destruct();
			} catch {}
		});

		super.destruct();
	}
}
