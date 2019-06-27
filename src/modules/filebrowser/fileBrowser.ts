/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license;
 * For GPL see LICENSE.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config, OptionsDefault } from '../../Config';
import * as consts from '../../constants';
import { Dialog } from '../dialog/dialog';
import { Confirm } from '../dialog/confirm';
import { Promt } from '../dialog/promt';
import { ToolbarIcon } from '../toolbar/icon';

import {
	IFileBrowser,
	IFileBrowserAnswer,
	IFileBrowserCallBackData,
	IFileBrowserOptions,
	ISource,
	ISourceFile,
	ISourcesFiles,
	IFileBrowserState,
	IFileBrowserItem
} from '../../types/fileBrowser';

import { IDictionary, ImageEditorActionBox } from '../../types/types';
import { IUploader, IUploaderOptions } from '../../types/uploader';
import { ImageEditor } from '../ImageEditor';
import { LocalStorageProvider } from '../storage/localStorageProvider';
import { Storage } from '../storage/storage';
import { each } from '../helpers/each';
import { normalizePath } from '../helpers/normalize/';
import { $$ } from '../helpers/selector';
import { ctrlKey } from '../helpers/ctrlKey';
import { extend } from '../helpers/extend';
import { setTimeout } from '../helpers/async/setTimeout';
import { ViewWithToolbar } from '../view/viewWithToolbar';
import { IJodit } from '../../types';
import './config';
import { Dom } from '../Dom';
import { debounce } from '../helpers/async';
import { Alert } from '../dialog';
import DataProvider from './dataProvider';
import contextMenu from './builders/contextMenu';
import { ObserveObject } from '../events/observeObject';
import { FileBrowserItem } from './builders/item';

export const F_CLASS = 'jodit_filebrowser_';

export const ITEM_CLASS = F_CLASS + 'files_item';
export const ICON_LOADER = '<i class="jodit_icon-loader"></i>';

const
	DEFAULT_SOURCE_NAME = 'default',
	ITEM_ACTIVE_CLASS = ITEM_CLASS + '-active-true';

export class FileBrowser extends ViewWithToolbar implements IFileBrowser {
	/**
	 * Return default timeout period in milliseconds for some debounce or throttle functions. By default return {observer.timeout} options
	 *
	 * @return {number}
	 */
	get defaultTimeout(): number {
		return this.jodit && this.jodit !== this
			? this.jodit.defaultTimeout
			: Config.defaultOptions.observer.timeout;
	}

	private loader = this.create.div(F_CLASS + 'loader', ICON_LOADER);
	private browser = this.create.div('jodit_filebrowser non-selected');
	private status_line = this.create.div(F_CLASS + 'status');
	private tree = this.create.div(F_CLASS + 'tree');
	private files = this.create.div(F_CLASS + 'files');

	state = ObserveObject.create<IFileBrowserState>({
		activeElements: [],
		elements: [],
		view: 'tiles',
		sortBy: 'changed',
		filterWord: '',
		onlyImages: false
	});

	dataProvider: DataProvider;

	private statusTimer: number;

	async loadItems(
		path: string = this.dataProvider.currentPath,
		source: string = this.dataProvider.currentSource
	): Promise<any> {
		this.files.classList.add('active');
		this.files.appendChild(this.loader.cloneNode(true));

		return this.dataProvider
			.items(path, source)
			.then(resp => {
				let process:
					| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
					| undefined = (this.options.items as any).process;

				if (!process) {
					process = this.options.ajax.process;
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
				Alert(error.message);
				this.errorHandler(error);
			});
	}

	async loadTree(): Promise<any> {
		const
			path: string = this.dataProvider.currentPath,
			source: string = this.dataProvider.currentSource;

		if (this.uploader) {
			this.uploader.setPath(path);
			this.uploader.setSource(source);
		}

		this.tree.classList.add('active');
		Dom.detach(this.tree);
		this.tree.appendChild(this.loader.cloneNode(true));

		if (this.options.showFoldersPanel) {
			const tree = this.dataProvider
				.tree(path, source)
				.then(resp => {
					let process:
						| ((resp: IFileBrowserAnswer) => IFileBrowserAnswer)
						| undefined = (this.options.folder as any).process;
					if (!process) {
						process = this.options.ajax.process;
					}
					if (process) {
						const respData = process.call(
							self,
							resp
						) as IFileBrowserAnswer;
						this.generateFolderTree(respData.data.sources);
					}
				})
				.catch(() => {
					this.errorHandler(
						new Error(this.jodit.i18n('Error on load folders'))
					);
				});

			const items = this.loadItems(path, source);

			return Promise.all([tree, items]);
		} else {
			this.tree.classList.remove('active');
		}
	}

	async deleteFile(name: string, source: string): Promise<any> {
		return this.dataProvider
			.fileRemove(this.dataProvider.currentPath, name, source)
			.then(resp => {
				if (this.options.remove && this.options.remove.process) {
					resp = this.options.remove.process.call(this, resp);
				}

				if (!this.options.isSuccess(resp)) {
					throw new Error(this.options.getMessage(resp));
				} else {
					this.status(
						this.options.getMessage(resp) ||
						this.i18n('File "%s" was deleted', name),
						true
					);
				}
			})
			.catch(this.status);
	}

	private generateFolderTree(sources: ISourcesFiles) {
		const folders: string[] = [];

		each<ISource>(sources, (source_name, source) => {
			if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
				folders.push(
					'<div class="' +
					F_CLASS +
					'source_title">' +
					source_name +
					'</div>'
				);
			}

			source.folders.forEach((name: string) => {
				let folder: string =
					'<a draggable="draggable" ' +
					'class="' +
					F_CLASS +
					'tree_item" ' +
					'href="javascript:void(0)" ' +
					'data-path="' + normalizePath(source.path + name) + '/" ' +
					'data-source="' + source_name + '">' +
					'<span>' +
					name +
					'</span>';

				if (
					this.options.deleteFolder &&
					name !== '..' &&
					name !== '.'
				) {
					folder +=
						'<i class="remove" data-path="' +
						normalizePath(source.path + name + '/') +
						'">&times;</i>';
				}

				folder += '</a>';

				folders.push(folder);
			});

			if (
				this.options.createNewFolder &&
				this.dataProvider.canI('FolderCreate')
			) {
				folders.push(
					'<a class="jodit_button addfolder" href="javascript:void(0)" data-path="' +
					normalizePath(source.path + name) +
					'/" data-source="' +
					source_name +
					'">' +
					ToolbarIcon.getIcon('plus') +
					' ' +
					this.i18n('Add folder') +
					'</a>'
				);
			}
		});

		this.tree.innerHTML = folders.join('');
	}

	private generateItemsList(sources: ISourcesFiles) {
		const elements: IFileBrowserItem[] = [];

		const
			state = this.state,
			canBeFile = (item: ISourceFile): boolean => (
				!this.state.onlyImages ||
				item.isImage === undefined ||
				item.isImage
			),
			inFilter = (item: ISourceFile): boolean => (
				!state.filterWord.length ||
				this.options.filter === undefined ||
				this.options.filter(item, state.filterWord)
			);

		each<ISource>(sources, (source_name, source) => {
			if (source.files && source.files.length) {
				if (typeof this.options.sort === 'function') {
					source.files.sort((a, b) =>
						this.options.sort(a, b, state.sortBy)
					);
				}

				source.files.forEach((item: ISourceFile) => {
					if (inFilter(item) && canBeFile(item)) {
						elements.push(FileBrowserItem.create({
							...item,
							sourceName: source_name,
							source
						}));
					}
				});
			}
		});

		this.state.elements = elements;
	}

	private onSelect(callback: (data: IFileBrowserCallBackData) => void) {
		return () => {
			if (this.state.activeElements.length) {
				const urls: string[] = [];

				this.state.activeElements.forEach((elm) => {
					const url = elm.file;
					url && urls.push(url);
				});

				this.close();

				if (typeof callback === 'function') {
					callback({
						baseurl: '',
						files: urls
					} as IFileBrowserCallBackData);
				}
			}

			return false;
		};
	}

	private errorHandler = (resp: Error | IFileBrowserAnswer) => {
		if (resp instanceof Error) {
			this.status(this.i18n(resp.message));
		} else {
			this.status(this.options.getMessage(resp));
		}
	};

	options: IFileBrowserOptions;

	dialog: Dialog;

	/**
	 * Container for set/get value
	 * @type {Storage}
	 */
	storage: Storage = new Storage(new LocalStorageProvider());

	uploader: IUploader;

	/**
	 *
	 * @return {boolean}
	 */
	isOpened(): boolean {
		return this.dialog.isOpened() && this.browser.style.display !== 'none';
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
	status = (message: string | Error, success?: boolean) => {
		if (typeof message !== 'string') {
			message = message.message;
		}

		clearTimeout(this.statusTimer);

		this.status_line.classList.remove('success');

		this.status_line.classList.add('active');

		const messageBox = this.create.div();
		messageBox.textContent = message;
		this.status_line.appendChild(messageBox);

		if (success) {
			this.status_line.classList.add('success');
		}

		this.statusTimer = setTimeout(() => {
			this.status_line.classList.remove('active');
			Dom.detach(this.status_line);
		}, this.options.howLongShowMsg);
	};

	getActiveElements(): HTMLElement[] {
		return [];
		//return this.state.activeElements;
	}

	/**
	 * Close dialog
	 * @method close
	 */
	close = () => {
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
	 *         parent.selection.insertImage(data.baseurl + data.files[i]);
	 *     }
	 * });
	 * ```
	 * @return Promise
	 */
	open = (
		callback: (data: IFileBrowserCallBackData) => void,
		onlyImages: boolean = false
	): Promise<void> => {
		this.state.onlyImages = onlyImages;

		return new Promise(resolve => {
			if (!this.options.items || !this.options.items.url) {
				throw new Error('Need set options.filebrowser.ajax.url');
			}

			let localTimeout: number = 0;

			this.events
				.off(this.files, 'dblclick')
				.on(this.files, 'dblclick', this.onSelect(callback), 'a')
				.on(
					this.files,
					'touchstart',
					() => {
						const now: number = new Date().getTime();

						if (
							now - localTimeout <
							consts.EMULATE_DBLCLICK_TIMEOUT
						) {
							this.onSelect(callback)();
						}

						localTimeout = now;
					},
					'a'
				)
				.off('select.filebrowser')
				.on('select.filebrowser', this.onSelect(callback));

			const header = this.create.div();

			this.toolbar.build(this.options.buttons, header);

			this.dialog.dialogbox_header.classList.add(F_CLASS + 'title_box');
			this.dialog.open(this.browser, header);

			this.events.fire('sort.filebrowser', this.state.sortBy);

			this.loadTree().then(resolve);
		});
	};

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
		return (this.getInstance('ImageEditor') as ImageEditor).open(
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
						if (this.options.isSuccess(resp)) {
							this.loadTree().then(() => {
								success();

								if (onSuccess) {
									onSuccess();
								}
							});
						} else {
							failed(new Error(this.options.getMessage(resp)));

							if (onFailed) {
								onFailed(
									new Error(this.options.getMessage(resp))
								);
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


	private elementsMap: IDictionary<{ elm: HTMLElement, item: IFileBrowserItem }> = {};

	private elementToItem(elm: HTMLElement): IFileBrowserItem | void {
		const
			{ key } = elm.dataset,
			{ item } = this.elementsMap[key || ''];

		return item;
	}

	private initElementsEventsConstructor() {
		const
			hashKey = (item: IFileBrowserItem): string => {
				let key = [item.sourceName, item.name, item.file, item.time, item.thumb].join('_');

				key = key.toLowerCase().replace(/[^0-9a-z\-\.]/g, '-');

				return key;
			};

		const getDomElement = (item: IFileBrowserItem): HTMLElement => {
			const key = hashKey(item);

			if (this.elementsMap[key]) {
				return this.elementsMap[key].elm;
			}

			const elm = this.create.fromHTML(
				this.options.getThumbTemplate.call(
					this,
					item,
					item.source,
					item.sourceName.toString()
				)
			);

			elm.dataset.key = key;

			this.elementsMap[key] = {
				item,
				elm
			};

			return this.elementsMap[key].elm;
		};

		this.state
			.on('beforeChange.activeElements', () => {
				this.state.activeElements.forEach(item => {
					const
						key = hashKey(item),
						{ elm } = this.elementsMap[key];

					elm && elm.classList.remove(ITEM_ACTIVE_CLASS);
				});
			})
			.on('change.activeElements', () => {
				this.events.fire('changeSelection');

				this.state.activeElements.forEach(item => {
					const
						key = hashKey(item),
						{ elm } = this.elementsMap[key];

					elm && elm.classList.add(ITEM_ACTIVE_CLASS);
				});
			});

		this.state.on('change.elements', debounce(() => {
				Dom.detach(this.files);

				if (this.state.elements.length) {
					this.state.elements.forEach(item => {
						this.files.appendChild(getDomElement(item));
					});
				} else {
					this.files.appendChild(
						this.create.div(F_CLASS + 'no_files', this.i18n('There are no files'))
					);
				}
			}, this.defaultTimeout)
		);
	}

	private initEventsListeners() {
		const
			state = this.state,
			self = this;

		self.events
			.on('view.filebrowser', (view: 'tiles' | 'list') => {
				if (view !== state.view) {
					state.view = view;
					self.files.classList.remove(F_CLASS + 'files_view-tiles');
					self.files.classList.remove(F_CLASS + 'files_view-list');
					self.files.classList.add(
						F_CLASS + 'files_view-' + state.view
					);

					self.storage.set(F_CLASS + 'view', state.view);
				}
			})
			.on('sort.filebrowser', (value: string) => {
				if (value !== state.sortBy) {
					state.sortBy = value;
					this.storage.set(F_CLASS + 'sortby', state.sortBy);
					self.loadItems();
				}
			})
			.on('filter.filebrowser', (value: string) => {
				if (value !== state.filterWord) {
					state.filterWord = value;
					self.loadItems();
				}
			})
			.on('fileRemove.filebrowser', () => {
				if (self.state.activeElements.length) {
					Confirm(self.i18n('Are you sure?'), '', (yes: boolean) => {
						if (yes) {
							const promises: Array<Promise<any>> = [];

							self.state.activeElements.forEach((a) => {
								promises.push(
									self.deleteFile(
										a.name || '',
										a.sourceName || ''
									)
								);
							});

							self.state.activeElements = [];

							Promise.all(promises).then(() => {
								return self.loadTree();
							});
						}
					});
				}
			})
			.on('edit.filebrowser', () => {
				if (self.state.activeElements.length === 1) {
					const [file] = this.state.activeElements;

					self.openImageEditor(
						file.file || '',
						file.name || '',
						file.path,
						file.sourceName
					);
				}
			})
			.on('update.filebrowser', () => {
				self.loadTree();
			});
	}

	private initNativeEventsListeners() {
		let
			dragElement: false | HTMLElement = false;

		const
			self = this;

		self.events
			.on(
				self.tree,
				'click',
				function(this: HTMLElement, e: MouseEvent) {
					const a: HTMLAnchorElement = this
							.parentNode as HTMLAnchorElement,
						path: string = a.getAttribute('data-path') || '';

					Confirm(self.i18n('Are you sure?'), '', (yes: boolean) => {
						if (yes) {
							self.dataProvider
								.folderRemove(
									path,
									a.getAttribute('data-name') || '',
									a.getAttribute('data-source') || ''
								)
								.then(resp => {
									if (
										self.options.remove &&
										self.options.remove.process
									) {
										resp = self.options.remove.process.call(
											self,
											resp
										);
									}
									if (!self.options.isSuccess(resp)) {
										throw new Error(
											self.options.getMessage(resp)
										);
									} else {
										self.state.activeElements = [];
										self.status(
											self.options.getMessage(resp),
											true
										);
									}

									self.loadTree();
								})
								.catch(self.status);
						}
					});

					e.stopImmediatePropagation();
					return false;
				},
				'a>i.remove'
			)
			.on(
				self.tree,
				'click',
				function(this: HTMLAnchorElement) {
					if (this.classList.contains('addfolder')) {
						Promt(
							self.i18n('Enter Directory name'),
							self.i18n('Create directory'),
							(name: string) => {
								self.dataProvider
									.createFolder(
										name,
										this.getAttribute('data-path') || '',
										this.getAttribute('data-source') || ''
									)
									.then(resp => {
										if (self.options.isSuccess(resp)) {
											self.loadTree();
										} else {
											self.status(
												self.options.getMessage(resp)
											);
										}

										return resp;
									}, self.status);
							},
							self.i18n('type name')
						);
					} else {
						self.dataProvider.currentPath =
							this.getAttribute('data-path') || '';
						self.dataProvider.currentSource =
							this.getAttribute('data-source') || '';
						self.loadTree();
					}
				},
				'a'
			)
			.on(
				self.tree,
				'dragstart',
				function(this: HTMLAnchorElement) {
					if (self.options.moveFolder) {
						dragElement = this;
					}
				},
				'a'
			)
			.on(
				self.tree,
				'drop',
				function(this: HTMLAnchorElement): boolean | void {
					if (
						(self.options.moveFile || self.options.moveFolder) &&
						dragElement
					) {
						let path: string =
							dragElement.getAttribute('data-path') || '';

						// move folder
						if (
							!self.options.moveFolder &&
							dragElement.classList.contains(
								F_CLASS + 'tree_item'
							)
						) {
							return false;
						}

						// move file
						if (dragElement.classList.contains(ITEM_CLASS)) {
							path += dragElement.getAttribute('data-name');
							if (!self.options.moveFile) {
								return false;
							}
						}

						self.dataProvider
							.move(
								path,
								this.getAttribute('data-path') || '',
								this.getAttribute('data-source') || '',
								dragElement.classList.contains(ITEM_CLASS)
							)
							.then(resp => {
								if (self.options.isSuccess(resp)) {
									self.loadTree();
								} else {
									self.status(self.options.getMessage(resp));
								}
							}, self.status);

						dragElement = false;
					}
				},
				'a'
			)
			.on(self.files, 'contextmenu', contextMenu(self), 'a')
			.on(self.files, 'click', (e: MouseEvent) => {
				if (!ctrlKey(e)) {
					this.state.activeElements = [];
				}
			})
			.on(
				self.files,
				'click',
				function(this: HTMLElement, e: MouseEvent) {
					const
						item = self.elementToItem(this);

					if (!item) {
						return;
					}

					if (!ctrlKey(e)) {
						self.state.activeElements = [item];
					} else {
						self.state.activeElements = [...self.state.activeElements, item];
					}


					e.stopPropagation();

					return false;
				},
				'a'
			)
			.on(
				self.files,
				'dragstart',
				function() {
					if (self.options.moveFile) {
						dragElement = this;
					}
				},
				'a'
			)
			.on(self.dialog.container, 'drop', (e: DragEvent) =>
				e.preventDefault()
			);

	}

	private initUploader(editor?: IJodit) {
		const
			self = this,
			uploaderOptions: IUploaderOptions<IUploader> = extend(
				true,
				{},
				Config.defaultOptions.uploader,
				self.options.uploader,
				editor && editor.options && editor.options.uploader !== null
					? {
						...(editor.options.uploader as IUploaderOptions<IUploader>)
					}
					: {}
			) as IUploaderOptions<IUploader>;

		const uploadHandler = () => {
			this.loadItems();
		};

		self.uploader = self.getInstance('Uploader', uploaderOptions);
		self.uploader.setPath(self.dataProvider.currentPath);
		self.uploader.setSource(self.dataProvider.currentSource);
		self.uploader.bind(self.browser, uploadHandler, self.errorHandler);

		self.events.on('bindUploader.filebrowser', (button: HTMLElement) => {
			self.uploader.bind(button, uploadHandler, self.errorHandler);
		});
	}

	constructor(editor?: IJodit, options?: IFileBrowserOptions) {
		super(editor, options);

		const self: FileBrowser = this,
			doc: HTMLDocument = editor ? editor.ownerDocument : document,
			editorDoc: HTMLDocument = editor ? editor.editorDocument : doc;

		if (editor) {
			this.id = editor.id;
		}

		self.options = new OptionsDefault(
			extend(
				true,
				{},
				self.options,
				Config.defaultOptions.filebrowser,
				options,
				editor ? editor.options.filebrowser : void 0
			)
		) as IFileBrowserOptions;

		self.dataProvider = new DataProvider(self.options, self.jodit || self);
		self.dialog = new Dialog(editor || self, {
			fullsize: self.options.fullsize,
			buttons: ['dialog.fullsize', 'dialog.close']
		});

		if (self.options.showFoldersPanel) {
			self.browser.appendChild(self.tree);
		}
		self.browser.appendChild(self.files);
		self.browser.appendChild(self.status_line);

		this.initEventsListeners();
		this.initNativeEventsListeners();

		self.dialog.setSize(self.options.width, self.options.height);

		[
			'getLocalFileByUrl',
			'crop',
			'resize',
			'create',
			'fileMove',
			'folderMove',
			'fileRemove',
			'folderRemove',
			'folder',
			'items',
			'permissions'
		].forEach(key => {
			if (this.options[key] !== null) {
				this.options[key] = extend(
					true,
					{},
					this.options.ajax,
					this.options[key]
				);
			}
		});

		const view = this.storage.get(F_CLASS + 'view');
		if (view && this.options.view === null) {
			self.state.view = view === 'list' ? 'list' : 'tiles';
		} else {
			self.state.view = self.options.view === 'list' ? 'list' : 'tiles';
		}

		self.files.classList.add(F_CLASS + 'files_view-' + self.state.view);
		self.state.sortBy = self.options.sortBy || 'changed';

		const sortBy = self.storage.get(F_CLASS + 'sortby');
		if (sortBy) {
			self.state.sortBy = ['changed', 'name', 'size'].includes(sortBy) ? sortBy : 'changed';
		}

		self.dataProvider.currentBaseUrl = $$('base', editorDoc).length
			? $$('base', editorDoc)[0].getAttribute('href') || ''
			: location.protocol + '//' + location.host;

		self.initUploader(editor);
		self.initElementsEventsConstructor();
	}

	destruct() {
		this.dialog.destruct();
		delete this.dialog;
		this.events && this.events.off('.filebrowser');
		this.uploader && this.uploader.destruct();
		delete this.uploader;
		super.destruct();
	}
}
