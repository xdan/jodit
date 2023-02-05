/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/uploader/README.md]]
 * @packageDocumentation
 * @module modules/uploader
 */

import './uploader.less';

import type {
	HandlerError,
	HandlerSuccess,
	IJodit,
	IUploader,
	IUploaderOptions,
	IViewBased
} from 'jodit/types';
import { Config } from 'jodit/config';
import { IS_IE } from 'jodit/core/constants';
import {
	error,
	isJoditObject,
	isFunction,
	ConfigProto
} from 'jodit/core/helpers';
import { ViewComponent, STATUSES } from 'jodit/core/component/';
import {
	ajaxInstances,
	hasFiles,
	hasItems,
	processOldBrowserDrag,
	send,
	sendFiles
} from 'jodit/modules/uploader/helpers';

import './config';

export class Uploader extends ViewComponent implements IUploader {
	override readonly jodit!: IViewBased;

	override get j(): IViewBased {
		return this.jodit;
	}

	/** @override */
	className(): string {
		return 'Uploader';
	}

	path: string = '';
	source: string = 'default';

	readonly options: IUploaderOptions<IUploader>;
	get o(): this['options'] {
		return this.options;
	}

	/**
	 * It sets the path for uploading files
	 */
	setPath(path: string): this {
		this.path = path;
		return this;
	}

	/**
	 * It sets the source for connector
	 */
	setSource(source: string): this {
		this.source = source;
		return this;
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
		const onFinally = (): void => {
			form.classList.remove('jodit_drag_hover');
		};

		const self = this,
			onPaste = (e: ClipboardEvent): false | void => {
				let i: number, file: File | null, extension: string;

				const cData = e.clipboardData;

				const process = (formdata: FormData): void => {
					if (file) {
						formdata.append('extension', extension);
						formdata.append('mimetype', file.type);
					}
				};

				// send data on server
				if (!IS_IE && hasFiles(cData)) {
					sendFiles(
						self,
						cData.files,
						handlerSuccess,
						handlerError
					).finally(onFinally);
					return false;
				}

				if (IS_IE && !isESNext) {
					return processOldBrowserDrag(
						self,
						cData,
						handlerSuccess,
						handlerError,
						onFinally
					);
				}

				if (hasItems(cData)) {
					const { items } = cData;

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

								sendFiles(
									self,
									[file],
									handlerSuccess,
									handlerError,
									process
								).finally(onFinally);
							}

							e.preventDefault();
							break;
						}
					}
				}
			};

		if (self.j && (self.j as IJodit).editor !== form) {
			self.j.e.on(form, 'paste', onPaste);
		} else {
			self.j.e.on('beforePaste', onPaste);
		}

		this.attachEvents(form, handlerSuccess, handlerError, onFinally);
	}

	private attachEvents(
		form: HTMLElement,
		handlerSuccess?: HandlerSuccess,
		handlerError?: HandlerError,
		onFinally?: () => void
	): void {
		const self = this;

		self.j.e
			.on(
				form,
				'dragend dragover dragenter dragleave drop',
				(e: Event) => {
					e.preventDefault();
				}
			)
			.on(form, 'dragover', (event: DragEvent) => {
				if (
					hasFiles(event.dataTransfer) ||
					hasItems(event.dataTransfer)
				) {
					form.classList.add('jodit_drag_hover');
					event.preventDefault();
				}
			})
			.on(form, 'dragend dragleave', (event: DragEvent) => {
				form.classList.remove('jodit_drag_hover');

				if (hasFiles(event.dataTransfer)) {
					event.preventDefault();
				}
			})
			.on(form, 'drop', (event: DragEvent): false | void => {
				form.classList.remove('jodit_drag_hover');

				if (hasFiles(event.dataTransfer)) {
					event.preventDefault();
					event.stopImmediatePropagation();

					sendFiles(
						self,
						event.dataTransfer.files,
						handlerSuccess,
						handlerError
					).finally(onFinally);
				}
			});

		const inputFile: HTMLInputElement | null =
			form.querySelector('input[type=file]');

		if (inputFile) {
			self.j.e.on(inputFile, 'change', () => {
				sendFiles(self, inputFile.files, handlerSuccess, handlerError)
					.then(() => {
						inputFile.value = '';

						if (!/safari/i.test(navigator.userAgent)) {
							inputFile.type = '';
							inputFile.type = 'file';
						}
					})
					.finally(onFinally);
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
		const uploader = this,
			{ o } = uploader;

		const handlerE = isFunction(handlerError)
			? handlerError
			: o.defaultHandlerError;

		send(uploader, {
			action: 'fileUploadRemote',
			url
		})
			.then(resp => {
				if (o.isSuccess.call(uploader, resp)) {
					const handler = isFunction(handlerSuccess)
						? handlerSuccess
						: o.defaultHandlerSuccess;

					handler.call(uploader, o.process.call(uploader, resp));
					return;
				}

				handlerE.call(
					uploader,
					error(o.getMessage.call(uploader, resp))
				);
			})
			.catch(e => handlerE.call(uploader, e));
	}

	constructor(editor: IViewBased, options?: IUploaderOptions<Uploader>) {
		super(editor);

		this.options = ConfigProto(
			options || {},
			ConfigProto(
				Config.defaultOptions.uploader,
				isJoditObject(editor) ? editor.o.uploader : {}
			)
		) as IUploaderOptions<IUploader>;
	}

	override destruct(): any {
		this.setStatus(STATUSES.beforeDestruct);

		const instances = ajaxInstances.get(this);

		if (instances) {
			instances.forEach(ajax => {
				try {
					ajax.destruct();
				} catch {}
			});
			instances.clear();
		}

		super.destruct();
	}
}
