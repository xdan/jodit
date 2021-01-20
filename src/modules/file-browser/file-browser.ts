/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './styles';

import { Config, OptionsDefault } from '../../config';
import * as consts from '../../core/constants';
import { Dialog, Alert } from '../dialog/';

import type {
	IFileBrowser,
	IFileBrowserAnswer,
	IFileBrowserCallBackData,
	IFileBrowserOptions,
	ISource,
	ISourceFile,
	ISourcesFiles,
	IFileBrowserState,
	IFileBrowserItem,
	IFileBrowserDataProvider,
	IJodit,
	IStorage,
	IDictionary,
	ImageEditorActionBox,
	IUploader,
	IUploaderOptions,
	IDialog,
	CanUndef
} from '../../types/';

import { ImageEditor } from '..';
import { Storage } from '../../core/storage/';
import { each, extend, error, isFunction, isString } from '../../core/helpers/';
import { ViewWithToolbar } from '../../core/view/view-with-toolbar';

import './config';

import { Dom } from '../../core/dom';
import { ObserveObject } from '../../core/events/';
import { FileBrowserItem } from './builders/item';
import { F_CLASS, ICON_LOADER } from './consts';
import { makeDataProvider } from './factories';
import { stateListeners } from './listeners/state-listeners';
import { nativeListeners } from './listeners/native-listeners';
import { selfListeners } from './listeners/self-listeners';
import { DEFAULT_SOURCE_NAME } from './data-provider';
import { autobind } from '../../core/decorators';

export class FileBrowser extends ViewWithToolbar implements IFileBrowser {
	/** @override */
	className(): string {
		return 'FileBrowser';
	}

	private loader = this.c.div(F_CLASS + '__loader', ICON_LOADER);
	private browser = this.c.div(F_CLASS + ' non-selected');
	private status_line = this.c.div(F_CLASS + '__status');

	tree = this.c.div(F_CLASS + '__tree');
	files = this.c.div(F_CLASS + '__files');

	state = ObserveObject.create<IFileBrowserState>({
		currentPath: '',
		currentSource: DEFAULT_SOURCE_NAME,
		currentBaseUrl: '',

		activeElements: [],
		elements: [],
		sources: {},
		view: 'tiles',
		sortBy: 'changed-desc',
		filterWord: '',
		onlyImages: false
	});

	dataProvider!: IFileBrowserDataProvider;

	async loadItems(): Promise<any> {
		this.files.classList.add('jodit-filebrowser_active');
		this.files.appendChild(this.loader.cloneNode(true));

		return this.dataProvider
			.items(this.state.currentPath, this.state.currentSource)
			.then(resp => {
				let process:
					| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
					| undefined = (this.o.items as any).process;

				if (!process) {
					process = this.o.ajax.process;
				}

				if (process) {
					const respData: IFileBrowserAnswer = process.call(
						self,
						resp
					) as IFileBrowserAnswer;

					this.generateItemsList(respData.data.sources);

					this.state.activeElements = [];
				}
			})
			.catch((error: Error) => {
				Alert(error.message).bindDestruct(this);
				this.errorHandler(error);
			});
	}

	async loadTree(): Promise<any> {
		const errorUni = (e: string | Error) => {
			throw e instanceof Error ? e : error(e);
		};

		if (this.uploader) {
			this.uploader.setPath(this.state.currentPath);
			this.uploader.setSource(this.state.currentSource);
		}

		this.tree.classList.add('jodit-filebrowser_active');
		Dom.detach(this.tree);
		this.tree.appendChild(this.loader.cloneNode(true));
		const items = this.loadItems();

		if (this.o.showFoldersPanel) {
			const tree = this.dataProvider
				.tree(this.state.currentPath, this.state.currentSource)
				.then(resp => {
					let process:
						| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
						| undefined = (this.o.folder as any).process;

					if (!process) {
						process = this.o.ajax.process;
					}

					if (process) {
						const respData = process.call(
							self,
							resp
						) as IFileBrowserAnswer;

						this.state.sources = respData.data.sources;
					}
				})
				.catch(e => {
					this.errorHandler(
						errorUni(this.i18n('Error on load folders'))
					);

					errorUni(e);
				});

			return Promise.all([tree, items]).catch(error);
		} else {
			this.tree.classList.remove('jodit-filebrowser_active');
		}

		return items.catch(error);
	}

	async deleteFile(name: string, source: string): Promise<any> {
		return this.dataProvider
			.fileRemove(this.state.currentPath, name, source)
			.then(resp => {
				if (this.o.remove && this.o.remove.process) {
					resp = this.o.remove.process.call(this, resp);
				}

				if (!this.o.isSuccess(resp)) {
					throw error(this.o.getMessage(resp));
				} else {
					this.status(
						this.o.getMessage(resp) ||
							this.i18n('File "%s" was deleted', name),
						true
					);
				}
			})
			.catch(this.status);
	}

	private generateItemsList(sources: ISourcesFiles) {
		const elements: IFileBrowserItem[] = [];

		const state = this.state,
			canBeFile = (item: ISourceFile): boolean =>
				!this.state.onlyImages ||
				item.isImage === undefined ||
				item.isImage,
			inFilter = (item: ISourceFile): boolean =>
				!state.filterWord.length ||
				this.o.filter === undefined ||
				this.o.filter(item, state.filterWord);

		each<ISource>(sources, (source_name, source) => {
			if (source.files && source.files.length) {
				if (typeof this.o.sort === 'function') {
					source.files.sort((a, b) =>
						this.o.sort(a, b, state.sortBy)
					);
				}

				source.files.forEach((item: ISourceFile) => {
					if (inFilter(item) && canBeFile(item)) {
						elements.push(
							FileBrowserItem.create({
								...item,
								sourceName: source_name,
								source
							})
						);
					}
				});
			}
		});

		this.state.elements = elements;
	}

	private onSelect(callback?: (data: IFileBrowserCallBackData) => void) {
		return () => {
			if (this.state.activeElements.length) {
				const files: string[] = [];
				const isImages: boolean[] = [];

				this.state.activeElements.forEach(elm => {
					const url = elm.fileURL;

					if (url) {
						files.push(url);
						isImages.push(elm.isImage || false);
					}
				});

				this.close();

				const data = {
					baseurl: '',
					files,
					isImages
				} as IFileBrowserCallBackData;

				if (isFunction(callback)) {
					callback(data);
				}

				this.close();
			}

			return false;
		};
	}

	private errorHandler = (resp: Error | IFileBrowserAnswer) => {
		if (resp instanceof Error) {
			this.status(this.i18n(resp.message));
		} else {
			this.status(this.o.getMessage(resp));
		}
	};

	OPTIONS!: IFileBrowserOptions;

	dialog!: IDialog;

	/**
	 * Container for set/get value
	 */
	storage!: IStorage;

	uploader!: IUploader;

	/**
	 *
	 * @return {boolean}
	 */
	isOpened(): boolean {
		return this.dialog.isOpened && this.browser.style.display !== 'none';
	}

	/**
	 * It displays a message in the status bar of filebrowser
	 *
	 * @method status
	 * @param {string|Error} message Message
	 * @param {boolean} [success] true It will be shown a message light . If no option is specified ,
	 * ßan error will be shown the red
	 * @example
	 * ```javascript
	 * parent.filebrowser.status('There was an error uploading file', false);
	 * ```
	 */
	@autobind
	status(message: string | Error, success?: boolean): void {
		if (!isString(message)) {
			message = message.message;
		}

		this.status_line.classList.remove('jodit-filebrowser_success');

		this.status_line.classList.add('jodit-filebrowser_active');

		const messageBox = this.c.div();
		messageBox.textContent = message;
		this.status_line.appendChild(messageBox);

		if (success) {
			this.status_line.classList.add('jodit-filebrowser_success');
		}

		this.async.setTimeout(
			() => {
				this.status_line.classList.remove('jodit-filebrowser_active');
				Dom.detach(this.status_line);
			},
			{
				timeout: this.o.howLongShowMsg,
				label: 'fileBrowser.status'
			}
		);
	}

	/**
	 * Close dialog
	 * @method close
	 */
	close = (): void => {
		this.dialog.close();
	};

	/**
	 * It opens a web browser window
	 *
	 * @param {Function} callback The function that will be called after the file selection in the browser
	 * @param {boolean} [onlyImages=false] Show only images
	 * @example
	 * ```javascript
	 * var fb = new Jodit.modules.FileBrowser(parent);
	 * fb.open(function (data) {
	 *     var i;
	 *     for (i = 0;i < data.files.length; i += 1) {
	 *         parent.s.insertImage(data.baseurl + data.files[i]);
	 *     }
	 * });
	 * ```
	 * @return Promise
	 */
	@autobind
	open(
		callback: CanUndef<(data: IFileBrowserCallBackData) => void> = this.o
			.defaultCallback,
		onlyImages: boolean = false
	): Promise<void> {
		this.state.onlyImages = onlyImages;

		return this.async.promise((resolve, reject) => {
			if (!this.o.items || !this.o.items.url) {
				throw error('Need set options.filebrowser.ajax.url');
			}

			let localTimeout: number = 0;

			this.e
				.off(this.files, 'dblclick')
				.on(this.files, 'dblclick', this.onSelect(callback))
				.on(this.files, 'touchstart', () => {
					const now = new Date().getTime();

					if (now - localTimeout < consts.EMULATE_DBLCLICK_TIMEOUT) {
						this.onSelect(callback)();
					}

					localTimeout = now;
				})
				.off('select.filebrowser')
				.on('select.filebrowser', this.onSelect(callback));

			const header = this.c.div();

			this.toolbar.build(this.o.buttons).appendTo(header);

			this.dialog.open(this.browser, header);

			this.e.fire('sort.filebrowser', this.state.sortBy);

			this.loadTree().then(resolve, reject);
		});
	}

	/**
	 * Open Image Editor
	 *
	 * @method openImageEditor
	 */
	openImageEditor = (
		href: string,
		name: string,
		path: string,
		source: string,
		onSuccess?: () => void,
		onFailed?: (error: Error) => void
	): Promise<Dialog> => {
		return this.getInstance<ImageEditor>('ImageEditor', this.o).open(
			href,
			(
				newname: string | void,
				box: ImageEditorActionBox,
				success: () => void,
				failed: (error: Error) => void
			) => {
				let promise: Promise<any>;

				if (box.action === 'resize') {
					promise = this.dataProvider.resize(
						path,
						source,
						name,
						newname,
						box.box
					);
				} else {
					promise = this.dataProvider.crop(
						path,
						source,
						name,
						newname,
						box.box
					);
				}

				promise
					.then(resp => {
						if (this.o.isSuccess(resp)) {
							this.loadTree().then(() => {
								success();

								if (onSuccess) {
									onSuccess();
								}
							});
						} else {
							failed(error(this.o.getMessage(resp)));

							if (onFailed) {
								onFailed(error(this.o.getMessage(resp)));
							}
						}
					})
					.catch(error => {
						failed(error);

						if (onFailed) {
							onFailed(error);
						}
					});
			}
		);
	};

	elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}> = {};

	private initUploader(editor?: IFileBrowser | IJodit) {
		const self = this,
			uploaderOptions: IUploaderOptions<IUploader> = extend(
				true,
				{},
				Config.defaultOptions.uploader,
				self.o.uploader,
				{
					...(editor?.options?.uploader as IUploaderOptions<
						IUploader
					>)
				}
			) as IUploaderOptions<IUploader>;

		const uploadHandler = () => {
			return this.loadItems();
		};

		self.uploader = self.getInstance('Uploader', uploaderOptions);
		self.uploader.setPath(self.state.currentPath);
		self.uploader.setSource(self.state.currentSource);
		self.uploader.bind(self.browser, uploadHandler, self.errorHandler);

		self.e.on('bindUploader.filebrowser', (button: HTMLElement) => {
			self.uploader.bind(button, uploadHandler, self.errorHandler);
		});
	}

	constructor(options?: IFileBrowserOptions) {
		super(options);

		const self: FileBrowser = this;

		self.options = new OptionsDefault(
			extend(
				true,
				{},
				self.options,
				Config.defaultOptions.filebrowser,
				options
			)
		) as IFileBrowserOptions;

		self.storage = Storage.makeStorage(
			this.o.filebrowser.saveStateInStorage
		);

		self.dataProvider = makeDataProvider(self, self.options);

		self.dialog = new Dialog({
			fullsize: self.o.fullsize,
			theme: self.o.theme,
			globalFullSize: self.o.globalFullSize,
			language: this.o.language,
			minWidth: Math.min(700, screen.width),
			minHeight: 300,
			buttons: ['fullsize', 'dialog.close']
		});

		if (self.o.showFoldersPanel) {
			self.browser.appendChild(self.tree);
		}

		self.browser.appendChild(self.files);
		self.browser.appendChild(self.status_line);

		selfListeners.call(self);
		nativeListeners.call(self);
		stateListeners.call(self);

		self.dialog.setSize(self.o.width, self.o.height);

		[
			'getLocalFileByUrl',
			'crop',
			'resize',
			'create',
			'fileMove',
			'folderMove',
			'fileRename',
			'folderRename',
			'fileRemove',
			'folderRemove',
			'folder',
			'items',
			'permissions'
		].forEach(key => {
			if (this.options[key] != null) {
				(this.options as IDictionary)[key] = extend(
					true,
					{},
					this.o.ajax,
					this.options[key]
				);
			}
		});

		const view = this.storage.get(F_CLASS + '_view');

		if (view && this.o.view == null) {
			self.state.view = view === 'list' ? 'list' : 'tiles';
		} else {
			self.state.view = self.o.view === 'list' ? 'list' : 'tiles';
		}

		this.state.fire('change.view');

		const sortBy = self.storage.get<string>(F_CLASS + '_sortby');

		if (sortBy) {
			const parts = sortBy.split('-');

			self.state.sortBy = ['changed', 'name', 'size'].includes(parts[0])
				? sortBy
				: 'changed-desc';
		} else {
			self.state.sortBy = self.o.sortBy || 'changed-desc';
		}

		// TODO
		// self.dataProvider.currentBaseUrl = $$('base', editorDoc).length
		// 	? attr($$('base', editorDoc)[0], 'href') || ''
		// 	: location.protocol + '//' + location.host;

		self.initUploader(self);
	}

	destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		this.dialog.destruct();
		this.events && this.e.off('.filebrowser');
		this.uploader && this.uploader.destruct();

		super.destruct();
	}
}
