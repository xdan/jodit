/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
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

import { error, extend, normalizeRelativePath } from '../../core/helpers';
import { Ajax } from '../../core/ajax';

export const DEFAULT_SOURCE_NAME = 'default';

const possibleRules = [
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

		if (!isProd) {
			if (!possibleRules.includes(rule)) {
				throw error('Wrong action ' + action);
			}
		}

		return (
			this.__currentPermissions == null ||
			this.__currentPermissions[rule] === undefined ||
			this.__currentPermissions[rule]
		);
	}

	constructor(
		readonly parent: IViewBased,
		readonly options: IFileBrowserOptions
	) {}

	/**
	 * Alias for options
	 */
	get o(): this['options'] {
		return this.options;
	}

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
			this.o.ajax,
			this.options[name] !== undefined ? this.options[name] : this.o.ajax
		);

		if (opts.prepareData) {
			opts.data = opts.prepareData.call(this, opts.data as IDictionary);
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
	async permissions(path: string, source: string): Promise<void> {
		if (!this.o.permissions) {
			return Promise.resolve();
		}

		this.o.permissions.data.path = path;
		this.o.permissions.data.source = source;

		if (this.o.permissions.url) {
			return this.get('permissions').then(resp => {
				let process:
					| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
					| undefined = (this.o.permissions as any).process;

				if (!process) {
					process = this.o.ajax.process;
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
	async items(path: string, source: string): Promise<IFileBrowserAnswer> {
		const opt = this.options;

		if (!opt.items) {
			return Promise.reject('Set Items api options');
		}

		opt.items.data.path = path;
		opt.items.data.source = source;

		return this.get('items');
	}

	async tree(path: string, source: string): Promise<IFileBrowserAnswer> {
		path = normalizeRelativePath(path);

		await this.permissions(path, source);

		if (!this.o.folder) {
			return Promise.reject('Set Folder Api options');
		}

		this.o.folder.data.path = path;
		this.o.folder.data.source = source;

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
				if (this.o.isSuccess(resp)) {
					success(resp.data.path, resp.data.name, resp.data.source);
				} else {
					onFailed(error(this.o.getMessage(resp)));
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
		const { create } = this.o;

		if (!create) {
			return Promise.reject('Set Create api options');
		}

		create.data.source = source;
		create.data.path = path;
		create.data.name = name;

		return this.get('create');
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
		if (!this.o.fileRemove) {
			return Promise.reject('Set fileRemove api options');
		}

		this.o.fileRemove.data.path = path;
		this.o.fileRemove.data.name = file;
		this.o.fileRemove.data.source = source;

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
		if (!this.o.folderRemove) {
			return Promise.reject('Set folderRemove api options');
		}

		this.o.folderRemove.data.path = path;
		this.o.folderRemove.data.name = file;
		this.o.folderRemove.data.source = source;

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
		if (!this.o.folderRename) {
			return Promise.reject('Set folderRename api options');
		}

		this.o.folderRename.data.path = path;
		this.o.folderRename.data.name = name;
		this.o.folderRename.data.newname = newname;
		this.o.folderRename.data.source = source;

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
		if (!this.o.fileRename) {
			return Promise.reject('Set fileRename api options');
		}

		this.o.fileRename.data.path = path;
		this.o.fileRename.data.name = name;
		this.o.fileRename.data.newname = newname;
		this.o.fileRename.data.source = source;

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
		if (!this.o.crop) {
			this.o.crop = {
				data: {}
			};
		}
		if (this.o.crop.data === undefined) {
			this.o.crop.data = {
				action: 'crop'
			};
		}

		this.o.crop.data.newname = newname || name;

		if (box) {
			this.o.crop.data.box = box;
		}

		this.o.crop.data.path = path;
		this.o.crop.data.name = name;
		this.o.crop.data.source = source;

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
		if (!this.o.resize) {
			this.o.resize = {
				data: {}
			};
		}
		if (this.o.resize.data === undefined) {
			this.o.resize.data = {
				action: 'resize'
			};
		}

		this.o.resize.data.newname = newname || name;

		if (box) {
			this.o.resize.data.box = box;
		}

		this.o.resize.data.path = path;
		this.o.resize.data.name = name;
		this.o.resize.data.source = source;

		return this.get('resize');
	}

	destruct(): any {
		this.ajaxInstances.forEach(a => a.destruct());
		this.ajaxInstances.length = 0;
	}
}
