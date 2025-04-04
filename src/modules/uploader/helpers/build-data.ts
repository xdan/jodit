/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { BuildDataResult, IDictionary, IUploader } from 'jodit/types';
import { isFunction, isString } from 'jodit/core/helpers';

export function buildData(
	uploader: IUploader,
	data: FormData | IDictionary<string> | string
): BuildDataResult {
	if (isFunction(uploader.o.buildData)) {
		return uploader.o.buildData.call(uploader, data);
	}

	const FD: typeof FormData = (uploader.ow as any).FormData;

	if (FD !== undefined) {
		if (data instanceof FD) {
			return data;
		}

		if (isString(data)) {
			return data;
		}

		const newData = new FD();

		const dict = data as IDictionary<string>;
		Object.keys(dict).forEach(key => {
			newData.append(key, dict[key]);
		});

		return newData;
	}

	return data;
}
