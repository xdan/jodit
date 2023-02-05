/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type {
	CanPromise,
	IDestructible,
	IDictionary,
	ImageBox,
	IPermissions,
	Nullable
} from './types';
import type { IUploader, IUploaderOptions } from './uploader';
import type { IViewOptions, IViewWithToolbar } from './view';
import type { IUIGroup } from './ui';
import type { IObservable } from './events';
import type { IAjax } from './ajax';
import type { IDlgs } from './traits';

/**
 * The module creates a web browser dialog box. In a Web browser ,you can select an image, remove, drag it. Upload new
 */
export interface ISourceFile {
	type: 'image' | 'file' | 'folder';
	file?: string;
	fileIsAbsolute?: boolean;
	name?: string;
	thumb?: string;
	thumbIsAbsolute?: boolean;
	changed?: string | number;
	size?: string;
	isImage?: boolean;
}

export interface ISource {
	name: string;
	title?: string;
	path: string;
	baseurl: string;
	files: ISourceFile[];
	folders: string[];
}

export type ISourcesFiles = ISource[];

export interface IFileBrowserAnswer {
	success: boolean;
	time: string;

	data: {
		messages?: string[];
		sources: ISourcesFiles;
		code: number;
		path: string;
		name: string;
		title?: string;
		source: string;
		permissions?: IPermissions | null;
	};
}

export interface IFileBrowserProcessor {
	(resp: IFileBrowserAnswer): IFileBrowserAnswer;
}
export interface IFileBrowserAjaxOptions {
	url?: string;

	data: IDictionary<string | IDictionary>;
	cache?: boolean;
	contentType?: string;

	method?: string;
	processData?: boolean;

	headers?:
		| IDictionary<string>
		| ((this: IAjax<any>) => CanPromise<IDictionary<string>>);

	prepareData?: (data: IDictionary<string>) => IDictionary<string>;
	process?: IFileBrowserProcessor;
}

export interface IFileBrowserOptions extends IViewOptions {
	zIndex?: number;
	fullsize?: boolean;
	showTooltip?: boolean;
	useNativeTooltip?: boolean;
	filter: (item: any, search: any) => boolean;

	sortBy: string;

	sort: false | ((a: any, b: any, sortBy?: string) => number);

	preview: boolean;
	showPreviewNavigation: boolean;
	showSelectButtonInPreview: boolean;

	saveStateInStorage:
		| false
		| {
				storeLastOpenedFolder?: boolean;
				storeView?: boolean;
				storeSortBy?: boolean;
		  };

	contextMenu: boolean;

	howLongShowMsg: number;
	pixelOffsetLoadNewChunk: number;

	/** @deprecated Instead use permissionsPresets.allowImageCrop and permissionsPresets.allowImageResize */
	editImage: boolean;
	/** @deprecated Instead use permissionsPresets.allowFolderCreate */
	createNewFolder: boolean;
	/** @deprecated Instead use permissionsPresets.allowFolderRemove */
	deleteFolder: boolean;
	/** @deprecated Instead use permissionsPresets.allowFolderRename */
	renameFolder: boolean;
	/** @deprecated Instead use permissionsPresets.allowFolderMove */
	moveFolder: boolean;
	/** @deprecated Instead use permissionsPresets.allowFileMove */
	moveFile: boolean;

	permissionsPresets: Partial<IPermissions>,

	showFoldersPanel: boolean;

	width: number;
	height: number;

	view: string | null;

	isSuccess: (resp: IFileBrowserAnswer) => boolean;
	getMessage: (resp: IFileBrowserAnswer) => string;
	showFileName: boolean;
	showFileSize: boolean;
	showFileChangeTime: boolean;

	getThumbTemplate: (
		item: IFileBrowserItem,
		source: ISource,
		source_name: string
	) => string;

	ajax: IFileBrowserAjaxOptions;
	create: IFileBrowserAjaxOptions | null;
	getLocalFileByUrl: IFileBrowserAjaxOptions | null;

	resize: IFileBrowserAjaxOptions | null;
	crop: IFileBrowserAjaxOptions | null;

	fileMove: IFileBrowserAjaxOptions | null;
	folderMove: IFileBrowserAjaxOptions | null;

	/**
	 * AJAX options for delete file
	 * @example
	 * ```javascript
	 * Jodit.make('#editor', {
	 * 	filebrowser: {
	 * 		fileRemove: {
	 * 			url: 'http://xdsoft.net/jodit/connector/index.php?action=fileDelete',
	 * 			method: 'POST',
	 * 		}
	 * 	}
	 * });
	 * ```
	 */
	fileRemove: IFileBrowserAjaxOptions | null;

	folderRemove: IFileBrowserAjaxOptions | null;

	fileRename: IFileBrowserAjaxOptions | null;
	folderRename: IFileBrowserAjaxOptions | null;

	items: IFileBrowserAjaxOptions;
	folder: IFileBrowserAjaxOptions | null;

	permissions: IFileBrowserAjaxOptions | null;

	uploader?: IUploaderOptions<IUploader>; // use default Uploader's settings

	defaultCallback?(data: IFileBrowserCallBackData): void;
}

export interface IFileBrowserCallBackData {
	baseurl: string;
	files: string[];
	isImages?: boolean[];
}

interface IFileBrowserDataProviderItemsMods {
	onlyImages?: boolean;
	withFolders?: boolean;
	foldersPosition?: 'top' | 'bottom' | 'default';
	filterWord?: string;
	sortBy?: string;
	offset?: number;
	limit?: number;
}

export interface IFileBrowserDataProvider extends IDestructible {
	permissions(path: string, source: string): Promise<Nullable<IPermissions>>;

	getPathByUrl(
		url: string
	): Promise<{ path: string; name: string; source: string }>;

	items(
		path: string,
		source: string,
		mods?: IFileBrowserDataProviderItemsMods
	): Promise<IFileBrowserItem[]>;

	itemsEx(
		path: string,
		source: string,
		mods?: IFileBrowserDataProviderItemsMods
	): Promise<{
		items: IFileBrowserItem[];
		loadedTotal: number;
	}>;

	tree(path: string, source: string): Promise<ISourcesFiles>;

	createFolder(name: string, path: string, source: string): Promise<boolean>;

	move(
		filepath: string,
		path: string,
		source: string,
		isFile: boolean
	): Promise<boolean>;

	fileRemove(path: string, file: string, source: string): Promise<string>;

	folderRemove(path: string, file: string, source: string): Promise<string>;

	folderRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<string>;

	fileRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<string>;

	resize(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<boolean>;

	crop(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<boolean>;

	canI(action: string): boolean;

	isSuccess: (resp: IFileBrowserAnswer) => boolean;
	getMessage: (resp: IFileBrowserAnswer) => string;

	onProgress(callback: (percentage: number) => void): void;
}

// TODO - Remove extending
export interface IFileBrowser<
	T extends IFileBrowserOptions = IFileBrowserOptions
> extends IViewWithToolbar<T>,
		IDlgs {
	readonly dataProvider: IFileBrowserDataProvider;
	readonly state: IFileBrowserState & IObservable;

	readonly tree: IUIGroup;
	readonly files: IUIGroup;

	isOpened: boolean;

	open(
		callback?: (data: IFileBrowserCallBackData) => void,
		onlyImages?: boolean
	): Promise<void>;

	close(): void;

	status(message: string | Error, success?: boolean): void;
}

export interface IFileBrowserState {
	currentPath: string;
	currentSource: string;
	currentBaseUrl: string;

	view: 'tiles' | 'list' | 'compact';
	sortBy: string;
	filterWord: string;
	onlyImages: boolean;

	elements: IFileBrowserItem[];
	activeElements: IFileBrowserItem[];
	sources: ISourcesFiles;
}

export interface IFileBrowserFolder {
	name: string;
	source: ISource;
	children: IFileBrowserFolder[];
}

export interface IFileBrowserItemElement extends ISourceFile {
	source: ISource;
	sourceName: string;
}

export interface IUniqueHash {
	uniqueHashKey: string;
}

export interface IFileBrowserItemWrapper
	extends IFileBrowserItemElement,
		IUniqueHash {
	path: string;
	fileURL: string;
	imageURL: string;
	time: string;
}

export type IFileBrowserItem = IFileBrowserItemWrapper &
	IFileBrowserItemElement;
