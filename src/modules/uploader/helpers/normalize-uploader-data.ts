/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { IUploadedFile, IUploaderData } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';

/**
 * Builds `items` from the deprecated `files`, `isImages` and `fileNames`
 * arrays, or the arrays from `items` when it's set, so a handler can read
 * either
 */
export function normalizeUploaderData<T extends IUploaderData>(
	data: T
): T & { items: IUploadedFile[] } {
	const { items } = data;

	if (items) {
		const names = items.map(({ name }) => name);

		return {
			...data,
			files: items.map(({ file }) => file),
			isImages: items.map(({ isImage }) => isImage),
			...(names.every(isString) ? { fileNames: names } : {}),
			items
		};
	}

	const { files = [], isImages, fileNames } = data;

	return {
		...data,
		items: files.map((file, i): IUploadedFile => {
			const name = fileNames?.[i];

			return {
				file,
				isImage: Boolean(isImages?.[i]),
				...(name !== undefined ? { name } : {})
			};
		})
	};
}
