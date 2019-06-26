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
			path = file || thumb;

		return (thumbIsAbsolute && path) ?
			path :
			normalizeURL(source.baseurl, source.path, path || '') + '?_tmst=' + timestamp;
	}

	get fileURL(): string {
		return this.data.fileIsAbsolute ?
			name :
			normalizeURL(this.data.source.baseurl + this.data.source.path + name);
	}

	get time(): string {
		const { changed } = this.data;
		return (
				changed &&
				(typeof changed === 'number' ? new Date(changed).toLocaleString() : changed)
			) ||
			'';
	}
}
