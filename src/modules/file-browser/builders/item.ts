/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IDictionary,
	IFileBrowserItemElement,
	IFileBrowserItemWrapper,
	ISource
} from '../../../types';
import { normalizePath, normalizeUrl } from '../../../core/helpers/';

export class FileBrowserItem implements IFileBrowserItemWrapper {
	source!: ISource;
	sourceName!: string;
	type!: IFileBrowserItemWrapper['type'];

	private constructor(readonly data: IFileBrowserItemElement) {
		Object.keys(data).forEach(key => {
			(this as IDictionary)[key] = (data as IDictionary)[key];
		});
	}

	static create(
		data: IFileBrowserItemElement
	): FileBrowserItem & IFileBrowserItemElement {
		if (data instanceof FileBrowserItem) {
			return data;
		}

		return new FileBrowserItem(data) as any;
	}

	get path(): string {
		return normalizePath(
			this.data.source.path ? this.data.source.path + '/' : '/'
		);
	}

	get imageURL(): string {
		const timestamp: string = new Date().getTime().toString(),
			{ thumbIsAbsolute, source, thumb, file } = this.data,
			path = thumb || file;

		return thumbIsAbsolute && path
			? path
			: normalizeUrl(source.baseurl, source.path, path || '') +
					'?_tmst=' +
					timestamp;
	}

	get fileURL(): string {
		let { name } = this.data;
		const { file, fileIsAbsolute, source } = this.data;

		if (file !== undefined) {
			name = file;
		}

		return fileIsAbsolute && name
			? name
			: normalizeUrl(source.baseurl, source.path, name || '');
	}

	get time(): string {
		const { changed } = this.data;

		return (
			(changed &&
				(typeof changed === 'number'
					? new Date(changed).toLocaleString()
					: changed)) ||
			''
		);
	}

	get uniqueHashKey(): string {
		const data = this.data;

		let key = [
			data.sourceName,
			data.name,
			data.file,
			this.time,
			data.thumb
		].join('_');

		key = key.toLowerCase().replace(/[^0-9a-z\-.]/g, '-');

		return key;
	}

	toJSON(): object {
		return this.data;
	}
}
