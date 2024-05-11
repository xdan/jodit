/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type {
	ButtonsOption,
	CallbackFunction,
	CanUndef,
	IDialog,
	IDictionary,
	IFileBrowser,
	IFileBrowserAnswer,
	IFileBrowserCallBackData,
	IFileBrowserDataProvider,
	IFileBrowserOptions,
	IFileBrowserState,
	IJodit,
	IStorage,
	IUploader,
	IUploaderOptions,
	IViewOptions
} from 'jodit/types';
import { STATUSES } from 'jodit/core/component';
import * as consts from 'jodit/core/constants';
import { IS_PROD } from 'jodit/core/constants';
import { autobind, cache, derive } from 'jodit/core/decorators';
import { watch } from 'jodit/core/decorators/watch/watch';
import { observable } from 'jodit/core/event-emitter';
import {
	ConfigProto,
	error,
	isAbortError,
	isFunction,
	isString,
	trim
} from 'jodit/core/helpers';
import { Storage } from 'jodit/core/storage';
import { Dlgs } from 'jodit/core/traits/dlgs';
import { ViewWithToolbar } from 'jodit/core/view/view-with-toolbar';
import { Config } from 'jodit/config';

import './config';

import { loadItems } from './fetch/load-items';
import { loadTree } from './fetch/load-tree';
import { nativeListeners } from './listeners/native-listeners';
import { selfListeners } from './listeners/self-listeners';
import { stateListeners } from './listeners/state-listeners';
import { DEFAULT_SOURCE_NAME } from './data-provider';
import { makeDataProvider } from './factories';
import { FileBrowserFiles, FileBrowserTree } from './ui';

import './styles/index.less';

export interface FileBrowser extends Dlgs {}

@derive(Dlgs)
export class FileBrowser extends ViewWithToolbar implements IFileBrowser, Dlgs {
	/** @override */
	className(): string {
		return 'FileBrowser';
	}

	private browser = this.c.div(this.componentName);
	private status_line = this.c.div(this.getFullElName('status'));

	tree = new FileBrowserTree(this);
	files = new FileBrowserFiles(this);

	state = observable({
		currentPath: '',
		currentSource: DEFAULT_SOURCE_NAME,
		currentBaseUrl: '',

		activeElements: [],
		elements: [],
		sources: [],
		view: 'tiles',
		sortBy: 'changed-desc',
		filterWord: '',
		onlyImages: false
	} as IFileBrowserState);

	@cache
	get dataProvider(): IFileBrowserDataProvider {
		return makeDataProvider(this, this.options);
	}

	// eslint-disable-next-line no-unused-vars
	private onSelect(
		callback?: (_: IFileBrowserCallBackData) => void
	): CallbackFunction {
		return (): boolean => {
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

	private errorHandler = (resp: Error | IFileBrowserAnswer): void => {
		if (isAbortError(resp)) {
			return;
		}

		if (resp instanceof Error) {
			this.status(this.i18n(resp.message));
		} else {
			this.status(this.dataProvider.getMessage(resp));
		}
	};

	override OPTIONS!: IFileBrowserOptions;

	@cache
	private get _dialog(): IDialog {
		const dialog = this.dlg({
			minWidth: Math.min(700, screen.width),
			minHeight: 300,
			buttons: this.o.headerButtons ?? ['fullsize', 'dialog.close']
		});

		['beforeClose', 'afterClose', 'beforeOpen'].forEach(proxyEvent =>
			dialog.events.on(dialog, proxyEvent, () => this.e.fire(proxyEvent))
		);

		dialog.setSize(this.o.width, this.o.height);

		return dialog;
	}

	/**
	 * Container for set/get value
	 */
	@cache
	override get storage(): IStorage {
		return Storage.makeStorage(
			Boolean(this.o.saveStateInStorage),
			this.componentName
		);
	}

	uploader!: IUploader;

	get isOpened(): boolean {
		return this._dialog.isOpened && this.browser.style.display !== 'none';
	}

	/**
	 * It displays a message in the status bar of filebrowser
	 *
	 * @param message - The message that will be displayed
	 * @param success - true It will be shown a message light . If no option is specified ,
	 * ßan error will be shown the red
	 * @example
	 * ```javascript
	 * parent.filebrowser.status('There was an error uploading file', false);
	 * ```
	 */
	@autobind
	status(message: string | Error, success?: boolean): void {
		if (!message || isAbortError(message)) {
			return;
		}

		if (!isString(message)) {
			message = message.message;
		}

		if (!isString(message) || !trim(message).length) {
			return;
		}

		this.message.message(
			message,
			success ? 'success' : 'error',
			this.o.howLongShowMsg
		);
	}

	/**
	 * Close dialog
	 */
	close = (): void => {
		this._dialog.close();
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

		return this.async
			.promise((resolve, reject) => {
				if (!this.o.items || !this.o.items.url) {
					throw error('Need set options.filebrowser.ajax.url');
				}

				let localTimeout: number = 0;

				this.e
					.off(this.files.container, 'dblclick')
					.on(
						this.files.container,
						'dblclick',
						this.onSelect(callback)
					)
					.on(this.files.container, 'touchstart', () => {
						const now = new Date().getTime();

						if (
							now - localTimeout <
							consts.EMULATE_DBLCLICK_TIMEOUT
						) {
							this.onSelect(callback)();
						}

						localTimeout = now;
					})
					.off('select.filebrowser')
					.on('select.filebrowser', this.onSelect(callback));

				const header = this.c.div();

				this.toolbar?.appendTo(header);
				this.__updateToolbarButtons();

				this._dialog.open(this.browser, header);

				this.e.fire('sort.filebrowser', this.state.sortBy);

				loadTree(this)
					.then(resolve, reject)
					.finally(() => {
						if (this.isInDestruct) {
							return;
						}
						this?.e?.fire('fileBrowserReady.filebrowser');
					});
			})
			.catch((e: Error): void => {
				if (!isAbortError(e) && !IS_PROD) {
					throw e;
				}
			}) as Promise<void>;
	}

	private __prevButtons: ButtonsOption = [];
	private __getButtons(): ButtonsOption {
		const options = (this.o.buttons ?? ([] as ButtonsOption)) as Exclude<
			ButtonsOption,
			string
		>;

		return options.filter((btn): boolean => {
			if (!isString(btn)) {
				return true;
			}

			switch (btn) {
				case 'filebrowser.upload':
					return this.dataProvider.canI('FileUpload');

				case 'filebrowser.edit':
					return (
						this.dataProvider.canI('ImageResize') ||
						this.dataProvider.canI('ImageCrop')
					);

				case 'filebrowser.remove':
					return this.dataProvider.canI('FileRemove');
			}

			return true;
		});
	}

	private initUploader(editor?: IFileBrowser | IJodit): void {
		const self = this,
			options = editor?.options?.uploader,
			uploaderOptions: IUploaderOptions<IUploader> = ConfigProto(
				options || {},
				Config.defaultOptions.uploader
			) as IUploaderOptions<IUploader>;

		const uploadHandler = (): Promise<any> => loadItems(this);

		self.uploader = self.getInstance('Uploader', uploaderOptions);
		self.uploader
			.setPath(self.state.currentPath)
			.setSource(self.state.currentSource)
			.bind(self.browser, uploadHandler, self.errorHandler);

		this.state.on(['change.currentPath', 'change.currentSource'], () => {
			this.uploader
				.setPath(this.state.currentPath)
				.setSource(this.state.currentSource);
		});

		self.e.on('bindUploader.filebrowser', (button: HTMLElement) => {
			self.uploader.bind(button, uploadHandler, self.errorHandler);
		});
	}

	constructor(options?: IFileBrowserOptions) {
		super(options);

		this.attachEvents(options as IViewOptions);

		const self = this;

		self.options = ConfigProto(
			options || {},
			Config.defaultOptions.filebrowser
		) as IFileBrowserOptions;

		self.browser.component = this;
		self.container = self.browser;

		if (self.o.showFoldersPanel) {
			self.browser.appendChild(self.tree.container);
		}

		self.browser.appendChild(self.files.container);
		self.browser.appendChild(self.status_line);

		selfListeners.call(self);
		nativeListeners.call(self);
		stateListeners.call(self);

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

		self.files.setMod('view', self.state.view);

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
		self.setStatus(STATUSES.ready);
	}

	override destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		super.destruct();

		this._dialog.destruct();
		this.events && this.e.off('.filebrowser');
		this.uploader && this.uploader.destruct();
	}

	@watch('dataProvider:changePermissions')
	private __updateToolbarButtons(): void {
		const buttons = this.__getButtons();
		if (isEqualButtonList(this.__prevButtons, buttons)) {
			return;
		}
		this.__prevButtons = buttons;
		this.toolbar?.build(buttons);
	}
}

function isEqualButtonList(
	prevButtons: ButtonsOption,
	buttons: ButtonsOption
): boolean {
	if (prevButtons.length !== buttons.length) {
		return false;
	}

	for (let i = 0; i < prevButtons.length; i++) {
		if (prevButtons[i] !== buttons[i]) {
			return false;
		}
	}

	return true;
}
