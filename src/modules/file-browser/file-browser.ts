/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './styles';

import { Config } from '../../config';
import * as consts from '../../core/constants';
import { Dialog } from '../dialog/';

import type {
	IFileBrowser,
	IFileBrowserAnswer,
	IFileBrowserCallBackData,
	IFileBrowserOptions,
	IFileBrowserState,
	IFileBrowserItem,
	IFileBrowserDataProvider,
	IJodit,
	IStorage,
	IDictionary,
	IUploader,
	IUploaderOptions,
	IDialog,
	CanUndef,
	IViewOptions
} from '../../types/';

import { Storage } from '../../core/storage/';
import { error, isFunction, isString, ConfigProto } from '../../core/helpers/';
import { ViewWithToolbar } from '../../core/view/view-with-toolbar';

import './config';

import { Dom } from '../../core/dom';
import { ObserveObject } from '../../core/events/';
import { makeDataProvider } from './factories';
import { stateListeners } from './listeners/state-listeners';
import { nativeListeners } from './listeners/native-listeners';
import { selfListeners } from './listeners/self-listeners';
import { DEFAULT_SOURCE_NAME } from './data-provider';
import { autobind } from '../../core/decorators';
import { FileBrowserFiles, FileBrowserTree } from './ui';

export class FileBrowser extends ViewWithToolbar implements IFileBrowser {
	/** @override */
	className(): string {
		return 'Filebrowser';
	}

	private loader = this.c.div(
		this.getFullElName('loader'),
		'<div class="jodit-icon_loader"></div>'
	);

	private browser = this.c.div(this.componentName);
	private status_line = this.c.div(this.getFullElName('status'));

	tree = new FileBrowserTree(this);
	files = new FileBrowserFiles(this);

	state = ObserveObject.create<IFileBrowserState>({
		currentPath: '',
		currentSource: DEFAULT_SOURCE_NAME,
		currentBaseUrl: '',

		activeElements: [],
		elements: [],
		messages: [],
		sources: [],
		view: 'tiles',
		sortBy: 'changed-desc',
		filterWord: '',
		onlyImages: false
	});

	dataProvider!: IFileBrowserDataProvider;

	async loadItems(): Promise<any> {
		this.files.setMod('active', true);
		this.files.container.appendChild(this.loader.cloneNode(true));

		return this.dataProvider
			.items(this.state.currentPath, this.state.currentSource, {
				sortBy: this.state.sortBy,
				onlyImages: this.state.onlyImages,
				filterWord: this.state.filterWord
			})
			.then(resp => {
				this.state.elements = resp;
				this.state.activeElements = [];
			})
			.catch(this.status);
	}

	async loadTree(): Promise<any> {
		const errorUni = (e: string | Error) => {
			throw e instanceof Error ? e : error(e);
		};

		if (this.uploader) {
			this.uploader.setPath(this.state.currentPath);
			this.uploader.setSource(this.state.currentSource);
		}

		this.tree.setMod('active', true);

		Dom.detach(this.tree.container);

		this.tree.container.appendChild(this.loader.cloneNode(true));

		const items = this.loadItems();

		if (this.o.showFoldersPanel) {
			const tree = this.dataProvider
				.tree(this.state.currentPath, this.state.currentSource)
				.then(resp => {
					this.state.sources = resp;
				})
				.catch(e => {
					this.errorHandler(
						errorUni(this.i18n('Error on load folders'))
					);

					errorUni(e);
				});

			return Promise.all([tree, items]).catch(error);
		} else {
			this.tree.setMod('active', false);
		}

		return items.catch(error);
	}

	deleteFile(name: string, source: string): Promise<void> {
		return this.dataProvider
			.fileRemove(this.state.currentPath, name, source)
			.then(message => {
				this.status(
					message || this.i18n('File "%s" was deleted', name),
					true
				);
			})
			.catch(this.status);
	}

	// eslint-disable-next-line no-unused-vars
	private onSelect(callback?: (_: IFileBrowserCallBackData) => void) {
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
			this.status(this.dataProvider.getMessage(resp));
		}
	};

	override OPTIONS!: IFileBrowserOptions;

	dialog!: IDialog;

	/**
	 * Container for set/get value
	 */
	override storage!: IStorage;

	uploader!: IUploader;

	get isOpened(): boolean {
		return this.dialog.isOpened && this.browser.style.display !== 'none';
	}

	/**
	 * It displays a message in the status bar of filebrowser
	 *
	 * @param success - true It will be shown a message light . If no option is specified ,
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

		const successClass = this.getFullElName('status', 'success', true),
			activeClass = this.getFullElName('status', 'active', true);

		this.status_line.classList.remove(successClass);
		this.status_line.classList.add(activeClass);

		const messageBox = this.c.div();
		messageBox.textContent = message;
		this.status_line.appendChild(messageBox);

		if (success) {
			this.status_line.classList.add(successClass);
		}

		this.async.setTimeout(
			() => {
				this.status_line.classList.remove(activeClass);
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
	 */
	close = (): void => {
		this.dialog.close();
	};

	/**
	 * It opens a web browser window
	 *
	 * @param callback - The function that will be called after the file selection in the browser
	 * @param onlyImages - Show only images
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
	 */
	@autobind
	open(
		callback: CanUndef<(_: IFileBrowserCallBackData) => void> = this.o
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
				.off(this.files.container, 'dblclick')
				.on(this.files.container, 'dblclick', this.onSelect(callback))
				.on(this.files.container, 'touchstart', () => {
					const now = new Date().getTime();

					if (now - localTimeout < consts.EMULATE_DBLCLICK_TIMEOUT) {
						this.onSelect(callback)();
					}

					localTimeout = now;
				})
				.off('select.filebrowser')
				.on('select.filebrowser', this.onSelect(callback));

			const header = this.c.div();

			this.toolbar.build(this.o.buttons ?? []).appendTo(header);

			this.dialog.open(this.browser, header);

			this.e.fire('sort.filebrowser', this.state.sortBy);

			this.loadTree().then(resolve, reject);
		});
	}

	elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}> = {};

	private initUploader(editor?: IFileBrowser | IJodit) {
		const self = this,
			options = editor?.options?.uploader,
			uploaderOptions: IUploaderOptions<IUploader> = ConfigProto(
				options || {},
				Config.defaultOptions.uploader
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

		this.attachEvents(options as IViewOptions);

		const self: FileBrowser = this;

		self.options = ConfigProto(
			options || {},
			Config.defaultOptions.filebrowser
		) as IFileBrowserOptions;

		self.storage = Storage.makeStorage(
			Boolean(this.o.saveStateInStorage),
			this.componentName
		);

		self.dataProvider = makeDataProvider(self, self.options);

		self.dialog = new Dialog({
			fullsize: self.o.fullsize,
			ownerWindow: self.ownerWindow,
			theme: self.o.theme,
			globalFullSize: self.o.globalFullSize,
			language: this.o.language,
			minWidth: Math.min(700, screen.width),
			minHeight: 300,
			buttons: this.o.headerButtons ?? ['fullsize', 'dialog.close']
		});

		['afterClose', 'beforeOpen'].forEach(proxyEvent => {
			self.dialog.events.on(self.dialog, proxyEvent, () => {
				this.e.fire(proxyEvent);
			});
		});

		self.browser.component = this;

		if (self.o.showFoldersPanel) {
			self.browser.appendChild(self.tree.container);
		}

		self.browser.appendChild(self.files.container);
		self.browser.appendChild(self.status_line);

		selfListeners.call(self);
		nativeListeners.call(self);
		stateListeners.call(self);

		self.dialog.setSize(self.o.width, self.o.height);

		const keys: Array<keyof IFileBrowserOptions> = [
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
		];

		keys.forEach(key => {
			if (this.options[key] != null) {
				(this.options as IDictionary)[key] = ConfigProto(
					this.options[key] as IDictionary,
					this.o.ajax
				);
			}
		});

		const { storeView, storeSortBy, storeLastOpenedFolder } = this.o
			.saveStateInStorage || {
			storeLastOpenedFolder: false,
			storeView: false,
			storeSortBy: false
		};

		const view = storeView && this.storage.get('view');

		if (view && this.o.view == null) {
			self.state.view = view === 'list' ? 'list' : 'tiles';
		} else {
			self.state.view = self.o.view === 'list' ? 'list' : 'tiles';
		}

		this.state.fire('change.view');

		const sortBy = storeSortBy && self.storage.get<string>('sortBy');

		if (sortBy) {
			const parts = sortBy.split('-');

			self.state.sortBy = ['changed', 'name', 'size'].includes(parts[0])
				? sortBy
				: 'changed-desc';
		} else {
			self.state.sortBy = self.o.sortBy || 'changed-desc';
		}

		if (storeLastOpenedFolder) {
			const currentPath = self.storage.get<string>('currentPath'),
				currentSource = self.storage.get<string>('currentSource');

			self.state.currentPath = currentPath ?? '';
			self.state.currentSource = currentSource ?? '';
		}

		self.initUploader(self);
	}

	override destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		this.dialog.destruct();
		this.events && this.e.off('.filebrowser');
		this.uploader && this.uploader.destruct();

		super.destruct();
	}
}
