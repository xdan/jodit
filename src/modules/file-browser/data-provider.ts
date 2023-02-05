/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
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
} from 'jodit/types';

import {
	ConfigProto,
	error,
	isFunction,
	normalizeRelativePath,
	set
} from 'jodit/core/helpers';
import { Ajax } from 'jodit/core/request';
import { autobind } from 'jodit/core/decorators';
import { FileBrowserItem } from 'jodit/modules/file-browser/builders/item';

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

@autobind
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

	private ajaxInstances: Map<string, IAjax<IFileBrowserAnswer>> = new Map();

	protected get<T extends IFileBrowserAnswer = IFileBrowserAnswer>(
		name: keyof IFileBrowserOptions
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

		const ajax = new Ajax<T>(opts);
		ai.set(name, ajax);

		const promise = ajax.send();

		promise
			.finally(() => {
				ajax.destruct();
				ai.delete(name);

				this.progressHandler(100);
			})
			.catch(() => null);

		return promise
			.then(resp => resp.json())
			.then(resp => {
				if (resp && !this.isSuccess(resp)) {
					throw new Error(this.getMessage(resp));
				}

				return resp;
			});
	}

	private progressHandler = (ignore: number): void => {};

	onProgress(callback: (percentage: number) => void): void {
		this.progressHandler = callback;
	}

	/**
	 * Load permissions for path and source
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
					const respData = process.call(
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
		const rule: keyof IPermissions = 'allow' + action;

		if (!isProd) {
			if (!possibleRules.includes(rule)) {
				throw error('Wrong action ' + action);
			}
		}

		const preset = this.o.permissionsPresets[rule];
		if (preset !== undefined) {
			return preset;
		}

		return (
			this.__currentPermissions == null ||
			this.__currentPermissions[rule] === undefined ||
			this.__currentPermissions[rule]
		);
	}

	private __items<Result>(
		path: string,
		source: string,
		mods: IFileBrowserDataProviderItemsMods,
		onResult: (resp: IFileBrowserAnswer) => Result
	): Promise<Result> {
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

			return onResult(resp);
		});
	}

	/**
	 * Load items list by path and source
	 */
	items(
		path: string,
		source: string,
		mods: IFileBrowserDataProviderItemsMods = {}
	): Promise<IFileBrowserItem[]> {
		return this.__items(path, source, mods, resp =>
			this.generateItemsList(resp.data.sources, mods)
		);
	}

	/**
	 * Load items list by path and source
	 */
	itemsEx(
		path: string,
		source: string,
		mods: IFileBrowserDataProviderItemsMods = {}
	): ReturnType<IFileBrowserDataProvider['itemsEx']> {
		const calcTotal = (sources: ISourcesFiles): number =>
			sources.reduce((acc, source) => acc + source.files.length, 0);

		return this.__items(path, source, mods, resp => ({
			items: this.generateItemsList(resp.data.sources, mods),
			loadedTotal: calcTotal(resp.data.sources)
		}));
	}

	private generateItemsList(
		sources: ISourcesFiles,
		mods: IFileBrowserDataProviderItemsMods = {}
	): IFileBrowserItem[] {
		const elements: IFileBrowserItem[] = [];

		const canBeFile = (item: ISourceFile): boolean =>
			item.type === 'folder' ||
			!mods.onlyImages ||
			item.isImage === undefined ||
			item.isImage;

		const inFilter = (item: ISourceFile): boolean =>
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

		if (!this.o.folder) {
			return Promise.reject('Set Folder Api options');
		}

		await this.permissions(path, source);

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
	 */
	getPathByUrl(url: string): Promise<any> {
		set('options.getLocalFileByUrl.data.url', url, this);

		return this.get('getLocalFileByUrl').then(resp => {
			if (this.isSuccess(resp)) {
				return resp.data;
			}

			throw error(this.getMessage(resp));
		});
	}

	/**
	 * Create a directory on the server
	 *
	 * @param name - Name the new folder
	 * @param path - Relative directory in which you want create a folder
	 * @param source - Server source key
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
	 * @param filepath - The relative path to the file / folder source
	 * @param path - Relative to the directory where you want to move the file / folder
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
	 * @param path - Relative path
	 * @param file - The filename
	 * @param source - Source
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

			return this.getMessage(resp);
		});
	}

	/**
	 * Deleting a file
	 *
	 * @param path - Relative path
	 * @param file - The filename
	 * @param source - Source
	 */
	fileRemove(path: string, file: string, source: string): Promise<string> {
		return this.remove('fileRemove', path, file, source);
	}

	/**
	 * Deleting a folder
	 *
	 * @param path - Relative path
	 * @param file - The filename
	 * @param source - Source
	 */
	folderRemove(path: string, file: string, source: string): Promise<string> {
		return this.remove('folderRemove', path, file, source);
	}

	/**
	 * Rename action
	 *
	 * @param path - Relative path
	 * @param name - Old name
	 * @param newname - New name
	 * @param source - Source
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
	): Promise<true> {
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

		return this.get(type).then(() => {
			return true;
		});
	}

	/**
	 * Send command to server to crop image
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

	isSuccess(resp: IFileBrowserAnswer): boolean {
		return this.options.isSuccess(resp);
	}

	destruct(): any {
		this.ajaxInstances.forEach(a => a.destruct());
		this.ajaxInstances.clear();
	}
}
