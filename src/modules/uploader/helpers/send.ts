/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { IDictionary, IUploader, IUploaderAnswer } from 'jodit/types';
import { Ajax } from 'jodit/core/request';
import { isFunction, isPromise } from 'jodit/core/helpers';
import { buildData } from 'jodit/modules/uploader/helpers/build-data';

export const ajaxInstances: WeakMap<IUploader, Set<Ajax>> = new WeakMap();

export function send(
	uploader: IUploader,
	data: FormData | IDictionary<string>
): Promise<IUploaderAnswer> {
	const requestData = buildData(uploader, data);

	const sendData = (
		request: FormData | IDictionary<string> | string
	): Promise<any> => {
		const ajax = new Ajax<IUploaderAnswer>({
			xhr: (): XMLHttpRequest => {
				const xhr = new XMLHttpRequest();

				if (
					(uploader.j.ow as any).FormData !== undefined &&
					xhr.upload
				) {
					uploader.j.progressbar.show().progress(10);

					xhr.upload.addEventListener(
						'progress',
						evt => {
							if (evt.lengthComputable) {
								let percentComplete = evt.loaded / evt.total;

								percentComplete *= 100;

								console.log('progress', percentComplete);

								uploader.j.progressbar
									.show()
									.progress(percentComplete);

								if (percentComplete >= 100) {
									uploader.j.progressbar.hide();
								}
							}
						},
						false
					);
				} else {
					uploader.j.progressbar.hide();
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
				uploader.o.error.call(uploader, error);
			})
			.finally(() => {
				ajax.destruct();
				instances?.delete(ajax);
			});
	};

	if (isPromise(requestData)) {
		return requestData.then(sendData).catch(error => {
			uploader.o.error.call(uploader, error);
		});
	}

	return sendData(requestData);
}
