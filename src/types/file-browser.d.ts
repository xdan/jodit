/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Buttons } from './toolbar';
import type {
	IDestructible,
	IDictionary,
	ImageBox,
	IPermissions,
	Nullable
} from './types';
import type { IUploader, IUploaderOptions } from './uploader';
import type { IViewBased, IViewOptions } from './view';

/**
 * The module creates a web browser dialog box. In a Web browser ,you can select an image, remove, drag it. Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */
export interface ISourceFile {
	type: 'folder' | 'image' | 'file';
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
	async?: boolean;

	data: IDictionary<string | IDictionary>;
	cache?: boolean;
	contentType?: string;

	method?: string;
	processData?: boolean;
	dataType?: string;

	headers?: IDictionary<string>;

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

	editImage: boolean;
	preview: boolean;
	showPreviewNavigation: boolean;
	showSelectButtonInPreview: boolean;
	saveStateInStorage: boolean;

	contextMenu: boolean;

	howLongShowMsg: number;
	pixelOffsetLoadNewChunk: number;

	createNewFolder: boolean;
	deleteFolder: boolean;
	renameFolder: boolean;
	moveFolder: boolean;
	moveFile: boolean;
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

export interface IFileBrowser<
	T extends IFileBrowserOptions = IFileBrowserOptions
> extends IViewBased<T> {
	readonly dataProvider: IFileBrowserDataProvider;
	readonly state: IFileBrowserState;

	isOpened: boolean;

	open(
		callback?: (data: IFileBrowserCallBackData) => void,
		onlyImages?: boolean
	): Promise<void>;

	close(): void;

	status(message: string | Error, success?: boolean): void;
}

export interface IFileBrowserMessage {
	message: string;
	type: 'success' | 'error';
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

	messages: IFileBrowserMessage[];
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

export interface IFileBrowserItemWrapper extends IFileBrowserItemElement {
	path: string;
	fileURL: string;
	imageURL: string;
	time: string;
	uniqueHashKey: string;
}

export type IFileBrowserItem = IFileBrowserItemWrapper &
	IFileBrowserItemElement;
