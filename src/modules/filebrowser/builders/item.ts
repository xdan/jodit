/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IFileBrowserItemElement, IFileBrowserItemWrapper } from '../../../types';
import { extend } from '../../helpers/extend';
import { normalizePath, normalizeURL } from '../../helpers/normalize';

export class FileBrowserItem implements IFileBrowserItemWrapper {
	private constructor(readonly data: IFileBrowserItemElement) {
		extend(this, data);
	}

	static create(data: IFileBrowserItemElement): FileBrowserItem & IFileBrowserItemElement {
		return <any>(new FileBrowserItem(data));
	}

	get path(): string {
		return normalizePath(this.data.source.path ? this.data.source.path + '/' : '/');
	}

	get imageURL(): string {
		const
			timestamp: string = new Date().getTime().toString(),
			{ thumbIsAbsolute, source, thumb, file } = this.data,
			path = thumb || file;

		return (thumbIsAbsolute && path) ?
			path :
			normalizeURL(source.baseurl, source.path, path || '') + '?_tmst=' + timestamp;
	}

	get fileURL(): string {
		let { name, file, fileIsAbsolute, source } = this.data;

		if (file !== undefined) {
			name = file;
		}

		return (fileIsAbsolute && name) ? name : normalizeURL(source.baseurl, source.path, name || '');
	}

	get time(): string {
		const { changed } = this.data;

		return (
			changed &&
			(typeof changed === 'number' ? new Date(changed).toLocaleString() : changed)
		) || '';
	}

	get uniqueHashKey(): string {
		const data = this.data;

		let key = [data.sourceName, data.name, data.file, this.time, data.thumb].join('_');

		key = key.toLowerCase().replace(/[^0-9a-z\-.]/g, '-');

		return key;
	}
}
