/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { IUploadedFile, IUploaderData } from 'jodit/types';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { isString } from 'jodit/core/helpers/checker/is-string';

type FilesData = Partial<
	Pick<IUploaderData, 'items' | 'files' | 'isImages' | 'fileNames'>
>;

/**
 * The files in upload or file browser data, one object each. While the
 * deprecated `files` array is set, it and `isImages` and `fileNames` win
 * over `items`, so a handler that edits them and passes the data on to a
 * default handler still gets its edits inserted. A file browser that
 * passes only the arrays works too.
 */
export function getItems(data: FilesData): IUploadedFile[] {
	const { files, isImages, fileNames, items } = data;

	if (!isArray(files)) {
		return items ?? [];
	}

	return files.map((file, i): IUploadedFile => {
		const name = fileNames?.[i];

		return {
			file,
			isImage: Boolean(isImages?.[i]),
			...(name !== undefined ? { name } : {})
		};
	});
}

/**
 * Gives the data both `items` and the deprecated `files`, `isImages` and
 * `fileNames` arrays, building whichever is missing, so a handler can read
 * either. When both are given, `items` is rebuilt from the arrays, as in
 * [[getItems]].
 */
export function normalizeUploaderData<T extends IUploaderData>(
	data: T
): T & { items: IUploadedFile[] } {
	const { files, items } = data;

	if (isArray(files) || !items) {
		return { ...data, items: getItems(data) };
	}

	const names = items.map(({ name }) => name);

	return {
		...data,
		files: items.map(({ file }) => file),
		isImages: items.map(({ isImage }) => isImage),
		...(names.every(isString) ? { fileNames: names } : {}),
		items
	};
}
