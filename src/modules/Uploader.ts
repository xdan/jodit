/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Config } from '../Config';
import { IS_IE, TEXT_PLAIN } from '../constants';
import {
	BuildDataResult,
	HandlerError,
	HandlerSuccess, IAjax,
	IDictionary,
	IJodit,
	IUploader,
	IUploaderAnswer,
	IUploaderData,
	IUploaderOptions,
	IViewBased
} from '../types/';
import { Ajax } from './Ajax';
import { browser, error, extend, isPlainObject } from './helpers/';
import { Dom } from './Dom';
import { isJoditObject } from './helpers/checker/isJoditObject';
import { Component, STATUSES } from './Component';

declare module '../Config' {
	interface Config {
		enableDragAndDropFileToEditor: boolean;
		uploader: IUploaderOptions<Uploader>;
	}
}

/**
 * Module for processing download documents and images by Drag and Drop
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and
 * Drag and Drop files}
 * @module Uploader
 * @params {Object} parent Jodit main object
 */
/**
 * @property {boolean} enableDragAndDropFileToEditor=true Enable drag and drop file toWYSIWYG editor
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
		return resp.data.messages !== undefined &&
			Array.isArray(resp.data.messages)
			? resp.data.messages.join(' ')
			: '';
	},

	process(this: Uploader, resp: IUploaderAnswer): IUploaderData {
		return resp.data;
	},

	error(this: Uploader, e: Error) {
		this.jodit.events.fire('errorMessage', e.message, 'error', 4000);
	},

	defaultHandlerSuccess(this: Uploader, resp: IUploaderData) {
		if (resp.files && resp.files.length) {
			resp.files.forEach((filename, index: number) => {
				const [tagName, attr]: string[] =
					resp.isImages && resp.isImages[index]
						? ['img', 'src']
						: ['a', 'href'];

				const elm: HTMLElement = this.jodit.create.inside.element(
					<'img' | 'a'>tagName
				);

				elm.setAttribute(attr, resp.baseurl + filename);

				if (tagName === 'a') {
					elm.textContent = resp.baseurl + filename;
				}

				if (isJoditObject(this.jodit)) {
					if (tagName === 'img') {
						this.jodit.selection.insertImage(
							elm as HTMLImageElement,
							null,
							this.jodit.options.imageDefaultWidth
						);
					} else {
						this.jodit.selection.insertNode(elm);
					}
				}
			});
		}
	},

	defaultHandlerError(this: Uploader, e: Error) {
		this.jodit.events.fire('errorMessage', e.message);
	},

	contentType(this: Uploader, requestData: any) {
		return (this.jodit.ownerWindow as any).FormData !== undefined &&
			typeof requestData !== 'string'
			? false
			: 'application/x-www-form-urlencoded; charset=UTF-8';
	}
} as IUploaderOptions<Uploader>;

export class Uploader extends Component implements IUploader {
	/**
	 * Convert dataURI to Blob
	 *
	 * @param {string} dataURI
	 * @return {Blob}
	 */
	public static dataURItoBlob(dataURI: string): Blob {
		// convert base64 toWYSIWYG raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

		const byteString: string = atob(dataURI.split(',')[1]),
			// separate out the mime component
			mimeString: string = dataURI
				.split(',')[0]
				.split(':')[1]
				.split(';')[0],
			// write the bytes of the string toWYSIWYG an ArrayBuffer
			ab: ArrayBuffer = new ArrayBuffer(byteString.length),
			ia: Uint8Array = new Uint8Array(ab);

		for (let i: number = 0; i < byteString.length; i += 1) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer toWYSIWYG a blob, and you're done

		return new Blob([ia], { type: mimeString });
	}

	private path: string = '';
	private source: string = 'default';

	private options: IUploaderOptions<Uploader>;

	jodit!: IViewBased;

	buildData(data: FormData | IDictionary<string> | string): BuildDataResult {
		if (
			this.options.buildData &&
			typeof this.options.buildData === 'function'
		) {
			return this.options.buildData.call(this, data);
		}

		const FD: typeof FormData = (this.jodit.ownerWindow as any).FormData;

		if (FD !== undefined) {
			if (data instanceof FD) {
				return data;
			}

			if (typeof data === 'string') {
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

	private ajaxInstances: IAjax[] = [];

	send(
		data: FormData | IDictionary<string>,
		success: (resp: IUploaderAnswer) => void
	): Promise<any> {
		const requestData: BuildDataResult = this.buildData(data),
			sendData = (
				request: FormData | IDictionary<string> | string
			): Promise<any> => {
				const ajax = new Ajax(this.jodit || this, {
					xhr: () => {
						const xhr = new XMLHttpRequest();

						if (
							(this.jodit.ownerWindow as any).FormData !==
								undefined &&
							xhr.upload
						) {
							xhr.upload.addEventListener(
								'progress',
								evt => {
									if (evt.lengthComputable) {
										let percentComplete =
											evt.loaded / evt.total;

										percentComplete *= 100;

										this.jodit.progressbar
											.show()
											.progress(percentComplete);

										if (percentComplete >= 100) {
											this.jodit.progressbar.hide();
										}
									}
								},
								false
							);
						} else {
							this.jodit.progressbar.hide();
						}

						return xhr;
					},
					method: this.options.method || 'POST',
					data: request,
					url: this.options.url,
					headers: this.options.headers,
					queryBuild: this.options.queryBuild,
					contentType: this.options.contentType.call(this, request),
					dataType: this.options.format || 'json',
					withCredentials: this.options.withCredentials || false
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
					.then(resp => {
						removeAjaxInstanceFromList();
						success.call(this, resp);
					})
					.catch(error => {
						removeAjaxInstanceFromList();
						this.options.error.call(this, error);
					});
			};

		if (requestData instanceof Promise) {
			return requestData.then(sendData).catch(error => {
				this.options.error.call(this, error);
			});
		} else {
			return sendData(requestData);
		}
	}

	/**
	 * Send files to server
	 *
	 * @param files
	 * @param handlerSuccess
	 * @param handlerError
	 * @param process
	 */
	sendFiles(
		files: FileList | File[] | null,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError,
		process?: (form: FormData) => void
	): Promise<any> {
		if (!files) {
			return Promise.reject(error('Need files'));
		}

		const uploader: Uploader = this;

		let fileList: File[] = Array.from(files);

		if (!fileList.length) {
			return Promise.reject(error('Need files'));
		}

		const promises: Array<Promise<any>> = [];

		if (this.options.insertImageAsBase64URI) {
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
					if (this.options.imagesExtensions.includes(extension)) {
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
										((handlerSuccess ||
											uploader.options
												.defaultHandlerSuccess) as HandlerSuccess).call(
											uploader,
											resp
										);
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

			form.append(this.options.pathVariableName, uploader.path);
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
						Math.random()
							.toString()
							.replace('.', '');

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
						this.options.filesVariableName(i),
						fileList[i],
						newName
					);
				}
			}

			if (process) {
				process(form);
			}

			if (uploader.options.data && isPlainObject(uploader.options.data)) {
				Object.keys(uploader.options.data).forEach((key: string) => {
					form.append(key, (uploader.options.data as any)[key]);
				});
			}

			uploader.options.prepareData.call(this, form);

			promises.push(
				uploader
					.send(form, (resp: IUploaderAnswer) => {
						if (this.options.isSuccess.call(uploader, resp)) {
							if (
								typeof (
									handlerSuccess ||
									uploader.options.defaultHandlerSuccess
								) === 'function'
							) {
								((handlerSuccess ||
									uploader.options
										.defaultHandlerSuccess) as HandlerSuccess).call(
									uploader,
									uploader.options.process.call(
										uploader,
										resp
									) as IUploaderData
								);
							}
						} else {
							if (
								typeof (
									handlerError ||
									uploader.options.defaultHandlerError
								)
							) {
								((handlerError ||
									uploader.options
										.defaultHandlerError) as HandlerError).call(
									uploader,
									error(
										uploader.options.getMessage.call(
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
						this.jodit.events &&
							this.jodit.events.fire('filesWereUploaded');
					})
			);
		}

		return Promise.all(promises);
	}

	/**
	 * It sets the path for uploading files
	 * @method setPath
	 * @param {string} path
	 */
	setPath(path: string) {
		this.path = path;
	}

	/**
	 * It sets the source for connector
	 *
	 * @method setSource
	 * @param {string} source
	 */
	setSource(source: string) {
		this.source = source;
	}

	/**
	 * Set the handlers Drag and Drop toWYSIWYG `$form`
	 *
	 * @method bind
	 * @param {HTMLElement} form Form or any Node on which you can drag and drop the file. In addition will be processed
	 * <code>&lt;input type="file" &gt;</code>
	 * @param {function} [handlerSuccess] The function toWYSIWYG be called when a successful uploading files
	 * toWYSIWYG the server
	 * @param {function} [handlerError] The function that will be called during a failed download files
	 * toWYSIWYG a server
	 * @example
	 * ```javascript
	 * var $form = jQuery('<form><input type="text" typpe="file"></form>');
	 * jQuery('body').append($form);
	 * Jodit.editors.someidfoeditor.uploader.bind($form[0], function (files) {
	 *     var i;
	 *     for (i = 0; i < data.files.length; i += 1) {
	 *         parent.selection.insertImage(data.files[i])
	 *     }
	 * });
	 * ```
	 */

	bind(
		form: HTMLElement,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	) {
		const self: Uploader = this,
			onPaste = (e: ClipboardEvent): false | void => {
				let i: number,
					file: File | null,
					extension: string,
					cData = e.clipboardData;

				const process = (formdata: FormData) => {
					if (file) {
						formdata.append('extension', extension);
						formdata.append('mimetype', file.type);
					}
				};

				// send data on server
				if (cData && cData.files && cData.files.length) {
					this.sendFiles(cData.files, handlerSuccess, handlerError);

					return false;
				}

				if (browser('ff') || IS_IE) {
					if (
						cData &&
						(!cData.types.length ||
							cData.types[0] !== TEXT_PLAIN)
					) {
						const div = this.jodit.create.div('', {
							tabindex: -1,
							style:
								'left: -9999px; top: 0; width: 0; height: 100%;line-height: 140%; ' +
								'overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;',
							contenteditable: true
						});

						this.jodit.ownerDocument.body.appendChild(div);

						const selection =
								this.jodit && isJoditObject(this.jodit)
									? this.jodit.selection.save()
									: null,
							restore = () =>
								selection &&
								this.jodit &&
								isJoditObject(this.jodit) &&
								this.jodit.selection.restore(selection);

						div.focus();

						this.jodit.async.setTimeout(() => {
							const child: HTMLDivElement | null = div.firstChild as HTMLDivElement;

							Dom.safeRemove(div);

							if (child && child.hasAttribute('src')) {
								const src: string =
									child.getAttribute('src') || '';
								restore();
								self.sendFiles(
									[Uploader.dataURItoBlob(src) as File],
									handlerSuccess,
									handlerError
								);
							}
						}, this.jodit.defaultTimeout);
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
								const mime: string[] = file.type.match(
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

		if (this.jodit && (<IJodit>this.jodit).editor !== form) {
			self.jodit.events.on(form, 'paste', onPaste);
		} else {
			self.jodit.events.on('beforePaste', onPaste);
		}

		const hasFiles = (event: DragEvent): boolean =>
			Boolean(
				event.dataTransfer &&
					event.dataTransfer.files &&
					event.dataTransfer.files.length !== 0
			);

		self.jodit.events
			.on(
				form,
				'dragend dragover dragenter dragleave drop',
				(e: DragEvent) => {
					e.preventDefault();
				}
			)
			.on(form, 'dragover', (event: DragEvent) => {
				if (hasFiles(event)) {
					form.classList.contains('jodit_draghover') ||
						form.classList.add('jodit_draghover');
					event.preventDefault();
				}
			})
			.on(form, 'dragend', (event: DragEvent) => {
				if (hasFiles(event)) {
					form.classList.contains('jodit_draghover') &&
						form.classList.remove('jodit_draghover');
					event.preventDefault();
				}
			})
			.on(form, 'drop', (event: DragEvent): false | void => {
				form.classList.remove('jodit_draghover');

				if (
					hasFiles(event) &&
					event.dataTransfer &&
					event.dataTransfer.files
				) {
					event.preventDefault();
					event.stopImmediatePropagation();
					this.sendFiles(
						event.dataTransfer.files,
						handlerSuccess,
						handlerError
					);
				}
			});

		const inputFile: HTMLInputElement | null = form.querySelector(
			'input[type=file]'
		);

		if (inputFile) {
			self.jodit.events.on(inputFile, 'change', function(
				this: HTMLInputElement
			) {
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
	 * Upload images toWYSIWYG a server by its URL, making it through the connector server.
	 *
	 * @param {string} url
	 * @param {HandlerSuccess} [handlerSuccess]
	 * @param {HandlerError} [handlerError]
	 */
	uploadRemoteImage(
		url: string,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError
	) {
		const uploader = this;
		uploader.send(
			{
				action: 'fileUploadRemote',
				url
			},
			(resp: IUploaderAnswer) => {
				if (uploader.options.isSuccess.call(uploader, resp)) {
					if (typeof handlerSuccess === 'function') {
						handlerSuccess.call(
							uploader,
							this.options.process.call(this, resp)
						);
					} else {
						this.options.defaultHandlerSuccess.call(
							uploader,
							this.options.process.call(this, resp)
						);
					}
				} else {
					if (
						typeof (
							handlerError || uploader.options.defaultHandlerError
						) === 'function'
					) {
						(handlerError || this.options.defaultHandlerError).call(
							uploader,
							error(
								uploader.options.getMessage.call(this, resp)
							)
						);
						return;
					}
				}
			}
		);
	}

	constructor(editor: IViewBased, options?: IUploaderOptions<Uploader>) {
		super(editor);

		this.options = extend(
			true,
			{},
			Config.defaultOptions.uploader,
			isJoditObject(editor) ? editor.options.uploader : null,
			options
		) as IUploaderOptions<Uploader>;
	}

	destruct(): any {
		this.setStatus(STATUSES.beforeDestruct);

		this.ajaxInstances.forEach(ajax => {
			try {
				ajax.destruct();
			} catch {}
		});

		delete this.options;

		super.destruct();
	}
}
