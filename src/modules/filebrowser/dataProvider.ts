/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IFileBrowserAjaxOptions,
	IFileBrowserAnswer,
	IFileBrowserOptions,
	IViewBased,
	IPermissions,
	IFileBrowserDataProvider,
	ImageBox,
	IDictionary,
	IAjax
} from '../../types';

import { error, extend, normalizeRelativePath } from '../helpers';
import { Ajax } from '../Ajax';

export const DEFAULT_SOURCE_NAME = 'default';

const possableRules = [
	'allowFiles',
	'allowFileMove',
	'allowFileUpload',
	'allowFileUploadRemote',
	'allowFileRemove',
	'allowFileRename',
	'allowFolders',
	'allowFolderMove',
	'allowFolderCreate',
	'allowFolderRemove',
	'allowFolderRename',
	'allowImageResize',
	'allowImageCrop'
];

export default class DataProvider implements IFileBrowserDataProvider {
	private __currentPermissions: IPermissions | null = null;

	canI(action: string): boolean {
		const rule = 'allow' + action;

		if (process.env.NODE_ENV !== 'production') {
			if (!possableRules.includes(rule)) {
				throw error('Wrong action ' + action);
			}
		}

		return (
			this.__currentPermissions === null ||
			this.__currentPermissions[rule] === undefined ||
			this.__currentPermissions[rule]
		);
	}

	currentPath: string = '';
	currentSource: string = DEFAULT_SOURCE_NAME;
	currentBaseUrl: string = '';

	constructor(
		readonly parent: IViewBased,
		readonly options: IFileBrowserOptions
	) {}

	private ajaxInstances: IAjax[] = [];

	/**
	 *
	 * @param {string} name
	 * @param {Function} success
	 * @param {Function} error
	 * @return {Promise}
	 */
	private get(
		name: string,
		success?: (resp: IFileBrowserAnswer) => void,
		error?: (error: Error) => void
	): Promise<IFileBrowserAnswer> {
		const opts: IFileBrowserAjaxOptions = extend(
			true,
			{},
			this.options.ajax,
			this.options[name] !== undefined
				? this.options[name]
				: this.options.ajax
		);

		if (opts.prepareData) {
			opts.data = opts.prepareData.call(this, <IDictionary>opts.data);
		}

		const ajax = new Ajax(this.parent, opts);

		const promise = ajax.send();

		this.ajaxInstances.push(ajax);

		if (success) {
			promise.then(success);
		}

		if (error) {
			promise.catch(error);
		}

		return promise;
	}

	/**
	 * Load permissions for path and source
	 *
	 * @param path
	 * @param source
	 */
	async permissions(
		path: string = this.currentPath,
		source: string = this.currentSource
	): Promise<void> {
		if (!this.options.permissions) {
			return Promise.resolve();
		}

		this.options.permissions.data.path = path;
		this.options.permissions.data.source = source;

		if (this.options.permissions.url) {
			return this.get('permissions').then(resp => {
				let process:
					| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
					| undefined = (this.options.permissions as any).process;

				if (!process) {
					process = this.options.ajax.process;
				}

				if (process) {
					const respData: IFileBrowserAnswer = process.call(
						self,
						resp
					) as IFileBrowserAnswer;

					if (respData.data.permissions) {
						this.__currentPermissions = respData.data.permissions;
					}
				}
			});
		}

		return Promise.resolve();
	}

	/**
	 * Load items list by path and source
	 *
	 * @param path
	 * @param source
	 */
	async items(
		path: string = this.currentPath,
		source: string = this.currentSource
	): Promise<IFileBrowserAnswer> {
		const opt = this.options;

		if (!opt.items) {
			return Promise.reject('Set Items api options');
		}

		opt.items.data.path = path;
		opt.items.data.source = source;

		return this.get('items');
	}

	async tree(
		path: string = this.currentPath,
		source: string = this.currentSource
	): Promise<IFileBrowserAnswer> {
		path = normalizeRelativePath(path);

		await this.permissions(path, source);

		if (!this.options.folder) {
			return Promise.reject('Set Folder Api options');
		}

		this.options.folder.data.path = path;
		this.options.folder.data.source = source;

		return this.get('folder');
	}

	/**
	 * Get path by url. You can use this method in another modules
	 *
	 * @method getPathByUrl
	 * @param {string} url Full url
	 * @param {function} success
	 * @param {string} success.path path toWYSIWYG file from connector's root (without filename)
	 * @param {string} success.name filename
	 * @param {function} onFailed filename
	 * @param {string} onFailed.message
	 */
	getPathByUrl = (
		url: string,
		success: (path: string, name: string, source: string) => void,
		onFailed: (error: Error) => void
	): Promise<any> => {
		const action: string = 'getLocalFileByUrl';

		this.options[action].data.url = url;

		return this.get(
			action,
			(resp: IFileBrowserAnswer) => {
				if (this.options.isSuccess(resp)) {
					success(resp.data.path, resp.data.name, resp.data.source);
				} else {
					onFailed(error(this.options.getMessage(resp)));
				}
			},
			onFailed
		);
	};

	/**
	 * Create a directory on the server
	 *
	 * @method create
	 * @param {string} name Name the new folder
	 * @param {string} path Relative toWYSIWYG the directory in which you want toWYSIWYG create a folder
	 * @param {string} source Server source key
	 */
	createFolder(
		name: string,
		path: string,
		source: string
	): Promise<IFileBrowserAnswer> {
		if (!this.options.create) {
			return Promise.reject('Set Create api options');
		}

		this.options.create.data.source = source;
		this.options.create.data.path = path;
		this.options.create.data.name = name;

		return this.get('create').then(resp => {
			this.currentPath = path;
			this.currentSource = source;
			return resp;
		});
	}

	/**
	 * Move a file / directory on the server
	 *
	 * @method move
	 * @param {string} filepath The relative path toWYSIWYG the file / folder source
	 * @param {string} path Relative toWYSIWYG the directory where you want toWYSIWYG move the file / folder
	 * @param {string} source Source
	 * @param {boolean} isFile
	 */
	move(
		filepath: string,
		path: string,
		source: string,
		isFile: boolean
	): Promise<IFileBrowserAnswer> {
		const mode: 'fileMove' | 'folderMove' = isFile
			? 'fileMove'
			: 'folderMove';

		const option = this.options[mode];

		if (!option) {
			return Promise.reject('Set Move api options');
		}

		option.data.from = filepath;
		option.data.path = path;
		option.data.source = source;

		return this.get(mode);
	}

	/**
	 * Deleting a file
	 *
	 * @param path Relative path
	 * @param file The filename
	 * @param source Source
	 */
	fileRemove(
		path: string,
		file: string,
		source: string
	): Promise<IFileBrowserAnswer> {
		if (!this.options.fileRemove) {
			return Promise.reject('Set fileRemove api options');
		}

		this.options.fileRemove.data.path = path;
		this.options.fileRemove.data.name = file;
		this.options.fileRemove.data.source = source;

		return this.get('fileRemove');
	}

	/**
	 * Deleting a folder
	 *
	 * @param path Relative path
	 * @param file The filename
	 * @param source Source
	 */
	folderRemove(
		path: string,
		file: string,
		source: string
	): Promise<IFileBrowserAnswer> {
		if (!this.options.folderRemove) {
			return Promise.reject('Set folderRemove api options');
		}

		this.options.folderRemove.data.path = path;
		this.options.folderRemove.data.name = file;
		this.options.folderRemove.data.source = source;

		return this.get('folderRemove');
	}

	/**
	 * Rename folder
	 *
	 * @param path Relative path
	 * @param name Old filename
	 * @param newname New filename
	 * @param source Source
	 */
	folderRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<IFileBrowserAnswer> {
		if (!this.options.folderRename) {
			return Promise.reject('Set folderRename api options');
		}

		this.options.folderRename.data.path = path;
		this.options.folderRename.data.name = name;
		this.options.folderRename.data.newname = newname;
		this.options.folderRename.data.source = source;

		return this.get('folderRename');
	}

	/**
	 * Rename file
	 *
	 * @param path Relative path
	 * @param name Old filename
	 * @param newname New filename
	 * @param source Source
	 */
	fileRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<IFileBrowserAnswer> {
		if (!this.options.fileRename) {
			return Promise.reject('Set fileRename api options');
		}

		this.options.fileRename.data.path = path;
		this.options.fileRename.data.name = name;
		this.options.fileRename.data.newname = newname;
		this.options.fileRename.data.source = source;

		return this.get('fileRename');
	}

	/**
	 * Send command to server to crop image
	 * @param path
	 * @param source
	 * @param name
	 * @param newname
	 * @param box
	 */
	crop(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<IFileBrowserAnswer> {
		if (!this.options.crop) {
			this.options.crop = {
				data: {}
			};
		}
		if (this.options.crop.data === undefined) {
			this.options.crop.data = {
				action: 'crop'
			};
		}

		this.options.crop.data.newname = newname || name;

		if (box) {
			this.options.crop.data.box = box;
		}

		this.options.crop.data.path = path;
		this.options.crop.data.name = name;
		this.options.crop.data.source = source;

		return this.get('crop');
	}

	/**
	 * Send command to server to resize image
	 *
	 * @param path
	 * @param source
	 * @param name
	 * @param newname
	 * @param box
	 */
	resize(
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<IFileBrowserAnswer> {
		if (!this.options.resize) {
			this.options.resize = {
				data: {}
			};
		}
		if (this.options.resize.data === undefined) {
			this.options.resize.data = {
				action: 'resize'
			};
		}

		this.options.resize.data.newname = newname || name;

		if (box) {
			this.options.resize.data.box = box;
		}

		this.options.resize.data.path = path;
		this.options.resize.data.name = name;
		this.options.resize.data.source = source;

		return this.get('resize');
	}

	destruct(): any {
		this.ajaxInstances.forEach(a => a.destruct());
		this.ajaxInstances.length = 0;
	}
}
