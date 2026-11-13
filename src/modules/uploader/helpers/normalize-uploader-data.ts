/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type {
	IUploadedFile,
	IUploaderData,
	IUploaderProcessData
} from 'jodit/types';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { isString } from 'jodit/core/helpers/checker/is-string';

type FilesData = Partial<
	Pick<IUploaderData, 'items' | 'files' | 'isImages' | 'fileNames'>
>;

type Normalized<T> = T & IUploaderData & { items: IUploadedFile[] };

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
 * [[getItems]], unless `files` is empty and `items` isn't, as from a
 * `process` that spreads the server's answer and adds `items`. Anything but
 * an object, such as the `null` a custom `process` may return, is passed on
 * as it is.
 */
export function normalizeUploaderData<T extends IUploaderProcessData>(
	data: T
): Normalized<T> {
	if (!data || typeof data !== 'object') {
		return data as Normalized<T>;
	}

	const { files, items } = data;

	if (!items || (isArray(files) && (files.length || !items.length))) {
		return { ...data, items: getItems(data) } as Normalized<T>;
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
