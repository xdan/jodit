/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { IDictionary, IUploader, IUploaderAnswer } from 'jodit/types';
import { isFunction, isPromise } from 'jodit/core/helpers';
import { Ajax } from 'jodit/core/request';
import { buildData } from 'jodit/modules/uploader/helpers/build-data';

export const ajaxInstances: WeakMap<IUploader, Set<Ajax>> = new WeakMap();

export function send(
	uploader: IUploader,
	data: FormData | IDictionary<string>
): Promise<IUploaderAnswer> {
	const requestData = buildData(uploader, data);

	const showProgress = (progress: number): void => {
		uploader.j.progressbar.show().progress(progress);
		if (progress >= 100) {
			uploader.j.progressbar.hide();
		}
	};

	let sendData = (
		request: FormData | IDictionary<string> | string,
		showProgress: (progress: number) => void
	): Promise<any> => {
		const ajax = new Ajax<IUploaderAnswer>({
			xhr: (): XMLHttpRequest => {
				const xhr = new XMLHttpRequest();

				if (
					(uploader.j.ow as any).FormData !== undefined &&
					xhr.upload
				) {
					showProgress(10);
					xhr.upload.addEventListener(
						'progress',
						evt => {
							if (evt.lengthComputable) {
								let percentComplete = evt.loaded / evt.total;

								percentComplete *= 100;
								showProgress(percentComplete);
							}
						},
						false
					);
				} else {
					showProgress(100);
				}

				return xhr;
			},
			method: uploader.o.method || 'POST',
			data: request,
			url: isFunction(uploader.o.url)
				? uploader.o.url(request)
				: uploader.o.url,
			headers: uploader.o.headers,
			queryBuild: uploader.o.queryBuild,
			contentType: uploader.o.contentType.call(uploader, request),
			withCredentials: uploader.o.withCredentials || false
		});

		let instances = ajaxInstances.get(uploader);

		if (!instances) {
			instances = new Set<Ajax>();
			ajaxInstances.set(uploader, instances);
		}

		instances.add(ajax);

		uploader.j.e.one('beforeDestruct', ajax.destruct);

		return ajax
			.send()
			.then(resp => resp.json())
			.catch(error => {
				return {
					success: false,
					data: {
						messages: [error]
					}
				};
			})
			.finally(() => {
				ajax.destruct();
				instances?.delete(ajax);
			});
	};

	if (isFunction(uploader.o.customUploadFunction)) {
		sendData = uploader.o.customUploadFunction;
	}

	if (isPromise(requestData)) {
		return requestData
			.then(data => sendData(data, showProgress))
			.catch(error => {
				uploader.o.error.call(uploader, error);
			});
	}

	return sendData(requestData, showProgress);
}
