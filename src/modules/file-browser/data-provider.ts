/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	IAjax,
	Nullable,
	IFileBrowserProcessor,
	IFileBrowserDataProviderItemsMods,
	IFileBrowserItem,
	ISourceFile,
	ISourcesFiles
} from '../../types';

import {
	ConfigProto,
	error,
	isFunction,
	normalizeRelativePath,
	set
} from '../../core/helpers';
import { Ajax } from '../../core/ajax';
import { autobind } from '../../core/decorators';
import { FileBrowserItem } from './builders/item';

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
	private __currentPermissions: Nullable<IPermissions> = null;

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

	private ajaxInstances: Map<string, IAjax> = new Map();

	/**
	 *
	 * @param {string} name
	 * @param {Function} success
	 * @param {Function} error
	 * @return {Promise}
	 */
	protected get<T = IFileBrowserAnswer>(
		name: keyof IFileBrowserOptions,
		success?: (resp: IFileBrowserAnswer) => void,
		error?: (error: Error) => void
	): Promise<T> {
		const ai = this.ajaxInstances;

		if (ai.has(name)) {
			const ajax = ai.get(name);
			ajax?.abort();
			ai.delete(name);
		}

		const opts = <IFileBrowserAjaxOptions>ConfigProto(
			this.options[name] !== undefined
				? (this.options[name] as IDictionary)
				: {},

			ConfigProto(
				{
					onProgress: this.progressHandler
				},
				this.o.ajax
			)
		);

		if (opts.prepareData) {
			opts.data = opts.prepareData.call(this, opts.data as IDictionary);
		}

		const ajax = new Ajax(this.parent, opts);

		let promise = ajax.send();

		ai.set(name, ajax);

		promise = promise.then(resp => {
			if (!this.isSuccess(resp)) {
				throw new Error(this.getMessage(resp));
			}

			return resp;
		});

		if (success) {
			promise = promise.then(success);
		}

		if (error) {
			promise = promise.catch(error);
		}

		return promise.finally(() => {
			ajax.destruct();
			ai.delete(name);
			this.progressHandler(100);
		});
	}

	private progressHandler = (ignore: number): void => {};

	onProgress(callback: (percentage: number) => void) {
		this.progressHandler = callback;
	}

	/**
	 * Load permissions for path and source
	 *
	 * @param path
	 * @param source
	 */
	async permissions(
		path: string,
		source: string
	): Promise<Nullable<IPermissions>> {
		if (!this.o.permissions) {
			return null;
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

				return this.__currentPermissions;
			});
		}

		return null;
	}

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

	/**
	 * Load items list by path and source
	 *
	 * @param path
	 * @param source
	 * @param mods
	 */
	async items(
		path: string,
		source: string,
		mods: IFileBrowserDataProviderItemsMods = {}
	): Promise<IFileBrowserItem[]> {
		const opt = this.options;

		if (!opt.items) {
			return Promise.reject('Set Items api options');
		}

		opt.items.data.path = path;
		opt.items.data.source = source;
		opt.items.data.mods = mods;

		return this.get('items').then(resp => {
			let process: IFileBrowserProcessor | undefined =
				this.o.items.process;

			if (!process) {
				process = this.o.ajax.process;
			}

			if (process) {
				resp = process.call(self, resp);
			}

			return this.generateItemsList(resp.data.sources, mods);
		});
	}

	private generateItemsList(
		sources: ISourcesFiles,
		mods: IFileBrowserDataProviderItemsMods = {}
	): IFileBrowserItem[] {
		const elements: IFileBrowserItem[] = [];

		const canBeFile = (item: ISourceFile): boolean =>
				!mods.onlyImages || item.isImage === undefined || item.isImage,
			inFilter = (item: ISourceFile): boolean =>
				!mods.filterWord?.length ||
				this.o.filter === undefined ||
				this.o.filter(item, mods.filterWord);

		sources.forEach(source => {
			if (source.files && source.files.length) {
				const { sort } = this.o;
				if (isFunction(sort) && mods.sortBy) {
					source.files.sort((a, b) => sort(a, b, mods.sortBy));
				}

				source.files.forEach((item: ISourceFile) => {
					if (inFilter(item) && canBeFile(item)) {
						elements.push(
							FileBrowserItem.create({
								...item,
								sourceName: source.name,
								source
							})
						);
					}
				});
			}
		});

		return elements;
	}

	async tree(path: string, source: string): Promise<ISourcesFiles> {
		path = normalizeRelativePath(path);

		await this.permissions(path, source);

		if (!this.o.folder) {
			return Promise.reject('Set Folder Api options');
		}

		this.o.folder.data.path = path;
		this.o.folder.data.source = source;

		return this.get('folder').then(resp => {
			let process:
				| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
				| undefined = (this.o.folder as any).process;

			if (!process) {
				process = this.o.ajax.process;
			}

			if (process) {
				resp = process.call(self, resp) as IFileBrowserAnswer;
			}

			return resp.data.sources;
		});
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
	getPathByUrl(url: string): Promise<any> {
		set('options.getLocalFileByUrl.data.url', url, this);

		return this.get('getLocalFileByUrl', resp => {
			if (this.isSuccess(resp)) {
				return resp.data;
			}

			throw error(this.getMessage(resp));
		});
	}

	/**
	 * Create a directory on the server
	 *
	 * @method create
	 * @param {string} name Name the new folder
	 * @param {string} path Relative toWYSIWYG the directory in which you want toWYSIWYG create a folder
	 * @param {string} source Server source key
	 */
	createFolder(name: string, path: string, source: string): Promise<boolean> {
		const { create } = this.o;

		if (!create) {
			throw error('Set Create api options');
		}

		create.data.source = source;
		create.data.path = path;
		create.data.name = name;

		return this.get('create').then(resp => {
			if (this.isSuccess(resp)) {
				return true;
			}

			throw error(this.getMessage(resp));
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
	): Promise<boolean> {
		const mode: 'fileMove' | 'folderMove' = isFile
			? 'fileMove'
			: 'folderMove';

		const option = this.options[mode];

		if (!option) {
			throw error('Set Move api options');
		}

		option.data.from = filepath;
		option.data.path = path;
		option.data.source = source;

		return this.get(mode).then(resp => {
			if (this.isSuccess(resp)) {
				return true;
			}

			throw error(this.getMessage(resp));
		});
	}

	/**
	 * Deleting item
	 *
	 * @param action
	 * @param path Relative path
	 * @param file The filename
	 * @param source Source
	 */
	private remove(
		action: 'fileRemove' | 'folderRemove',
		path: string,
		file: string,
		source: string
	): Promise<string> {
		const fr = this.o[action];

		if (!fr) {
			throw error(`Set "${action}" api options`);
		}

		fr.data.path = path;
		fr.data.name = file;
		fr.data.source = source;

		return this.get(action).then(resp => {
			if (fr.process) {
				resp = fr.process.call(this, resp);
			}

			if (!this.isSuccess(resp)) {
				throw error(this.getMessage(resp));
			}

			return this.getMessage(resp);
		});
	}

	/**
	 * Deleting a file
	 *
	 * @param path Relative path
	 * @param file The filename
	 * @param source Source
	 */
	fileRemove(path: string, file: string, source: string): Promise<string> {
		return this.remove('fileRemove', path, file, source);
	}

	/**
	 * Deleting a folder
	 *
	 * @param path Relative path
	 * @param file The filename
	 * @param source Source
	 */
	folderRemove(path: string, file: string, source: string): Promise<string> {
		return this.remove('folderRemove', path, file, source);
	}

	/**
	 * Rename action
	 *
	 * @param path Relative path
	 * @param name Old name
	 * @param newname New name
	 * @param source Source
	 */
	private rename(
		action: 'fileRename' | 'folderRename',
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<string> {
		const fr = this.o[action];

		if (!fr) {
			throw error(`Set "${action}" api options`);
		}

		fr.data.path = path;
		fr.data.name = name;
		fr.data.newname = newname;
		fr.data.source = source;

		return this.get(action).then(resp => {
			if (fr.process) {
				resp = fr.process.call(self, resp);
			}

			if (!this.isSuccess(resp)) {
				throw error(this.getMessage(resp));
			}

			return this.getMessage(resp);
		});
	}

	/**
	 * Rename folder
	 */
	folderRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<string> {
		return this.rename('folderRename', path, name, newname, source);
	}

	/**
	 * Rename file
	 */
	fileRename(
		path: string,
		name: string,
		newname: string,
		source: string
	): Promise<string> {
		return this.rename('fileRename', path, name, newname, source);
	}

	private changeImage(
		type: 'resize' | 'crop',
		path: string,
		source: string,
		name: string,
		newname: string | void,
		box: ImageBox | void
	): Promise<boolean> {
		if (!this.o[type]) {
			this.o[type] = {
				data: {}
			};
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const query = this.o[type]!;

		if (query.data === undefined) {
			query.data = {
				action: type
			};
		}

		query.data.newname = newname || name;

		if (box) {
			query.data.box = box;
		}

		query.data.path = path;
		query.data.name = name;
		query.data.source = source;

		return this.get(type).then(resp => {
			if (this.isSuccess(resp)) {
				return true;
			}

			throw error(this.getMessage(resp));
		});
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
	): Promise<boolean> {
		return this.changeImage('crop', path, source, name, newname, box);
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
	): Promise<boolean> {
		return this.changeImage('resize', path, source, name, newname, box);
	}

	getMessage(resp: IFileBrowserAnswer): string {
		return this.options.getMessage(resp);
	}

	@autobind
	isSuccess(resp: IFileBrowserAnswer): boolean {
		return this.options.isSuccess(resp);
	}

	destruct(): any {
		this.ajaxInstances.forEach(a => a.destruct());
		this.ajaxInstances.clear();
	}
}
