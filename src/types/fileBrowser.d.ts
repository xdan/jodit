/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Buttons } from './toolbar';
import { IDestructible, IDictionary, ImageBox, IPermissions } from './types';
import { IUploader, IUploaderOptions } from './uploader';
import { IViewOptions, IViewWithToolbar } from './view';
import { Dialog } from '../modules/dialog';
import { IStorage } from '../types';

/**
 * The module creates a web browser dialog box. In a Web browser ,you can select an image, remove, drag it. Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */

export interface ISourceFile {
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
	path: string;
	baseurl: string;
	files: ISourceFile[];
	folders: string[];
}

export interface ISourcesFiles {
	[key: string]: ISource;
}

export interface IFileBrowserAnswer {
	success: boolean;
	time: string;
	data: {
		messages?: string[];
		sources: ISourcesFiles;
		code: number;
		path: string;
		name: string;
		source: string;
		permissions?: IPermissions | null;
	};
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

	process?: (resp: IFileBrowserAnswer) => IFileBrowserAnswer;
}

export interface IFileBrowserOptions extends IViewOptions {
	removeButtons: string[];
	buttons: Buttons;
	zIndex?: number;
	fullsize?: boolean;
	showTooltip?: boolean;
	useNativeTooltip?: boolean;
	filter: (item: any, search: any) => boolean;

	sortBy: string;

	sort: (a: any, b: any, sortBy?: string) => number;

	editImage: boolean;
	preview: boolean;
	showPreviewNavigation: boolean;
	showSelectButtonInPreview: boolean;
	saveStateInStorage: boolean;

	contextMenu: boolean;

	howLongShowMsg: number;

	createNewFolder: boolean;
	deleteFolder: boolean;
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

	uploader: null | IUploaderOptions<IUploader>; // use default Uploader's settings

	defaultCallback: (
		filebrowser: IFileBrowser,
		data: IFileBrowserCallBackData
	) => void;
	[key: string]: any;
}

export interface IFileBrowserCallBackData {
	baseurl: string;
	files: string[];
	isImages?: boolean[];
}

export interface IFileBrowserDataProvider extends IDestructible {
	currentPath: string;
	currentSource: string;
	currentBaseUrl: string;

	getPathByUrl(
		url: string,
		success: (path: string, name: string, source: string) => void,
		onFailed: (error: Error) => void
	): Promise<IFileBrowserAnswer>;

	tree(path: string, source: string): Promise<IFileBrowserAnswer>;

	items(path: string, source: string): Promise<IFileBrowserAnswer>;

	permissions(path: string, source: string): Promise<any>;

	createFolder(
		name: string,
		path: string,
		source: string
	): Promise<IFileBrowserAnswer>;

	move(
		filepath: string,
		path: string,
		source: string,
		isFile: boolean
	): Promise<IFileBrowserAnswer>;

	fileRemove(
		path: string,
		file: string,
		source: string
	): Promise<IFileBrowserAnswer>;

	folderRemove(
		path: string,
		file: string,
		source: string
	): Promise<IFileBrowserAnswer>;

	folderRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<IFileBrowserAnswer>;

	fileRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<IFileBrowserAnswer>;

	resize(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<IFileBrowserAnswer>;

	crop(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<IFileBrowserAnswer>;

	canI(action: string): boolean;
}

export interface IFileBrowser extends IViewWithToolbar<IFileBrowserOptions> {
	uploader: IUploader;
	dataProvider: IFileBrowserDataProvider;

	state: IFileBrowserState;

	storage: IStorage;
	dialog: Dialog;

	isOpened(): boolean;

	close: () => void;

	openImageEditor(
		href: string,
		name: string,
		path: string,
		source: string,
		onSuccess?: () => void,
		onFailed?: (error: Error) => void
	): Promise<Dialog>;

	open(
		callback?: (data: IFileBrowserCallBackData) => void,
		onlyImages?: boolean
	): Promise<void>;
}

export interface IFileBrowserState {
	view: 'tiles' | 'list';
	sortBy: string;
	filterWord: string;
	onlyImages: boolean;

	elements: IFileBrowserItem[];
	activeElements: IFileBrowserItem[];
	folders: IFileBrowserFolder[];
}

export interface IFileBrowserFolder {
	name: string;
	source: ISource;
	sourceName: string;
}

export interface IFileBrowserItemElement extends ISourceFile {
	source: ISource;
	sourceName: string;
}

export interface IFileBrowserItemWrapper {
	path: string;
	fileURL: string;
	imageURL: string;
	time: string;
	uniqueHashKey: string;
}

export type IFileBrowserItem = IFileBrowserItemWrapper &
	IFileBrowserItemElement;
