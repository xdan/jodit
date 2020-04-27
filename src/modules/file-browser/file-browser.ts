/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './styles/index.less';

import { Config, OptionsDefault } from '../../config';
import * as consts from '../../core/constants';
import { Dialog, Confirm, Prompt, Alert } from '../dialog/';

import {
	IFileBrowser,
	IFileBrowserAnswer,
	IFileBrowserCallBackData,
	IFileBrowserOptions,
	ISource,
	ISourceFile,
	ISourcesFiles,
	IFileBrowserState,
	IFileBrowserItem,
	IFileBrowserFolder,
	IFileBrowserDataProvider,
	IJodit,
	IStorage,
	IDictionary,
	ImageEditorActionBox,
	IUploader,
	IUploaderOptions, IDialog
} from '../../types/';

import { ImageEditor } from '..';
import { Storage } from '../../core/storage/';
import {
	each,
	normalizePath,
	ctrlKey,
	extend,
	isValidName,
	attr,
	error, isFunction
} from '../../core/helpers/';
import { ViewWithToolbar } from '../../core/view/view-with-toolbar';

import './config';

import { Dom } from '../../core/dom';
import contextMenu from './builders/context-menu';
import { ObserveObject } from '../../core/events/';
import { FileBrowserItem } from './builders/item';
import { F_CLASS, ICON_LOADER, ITEM_CLASS } from './consts';
import { makeDataProvider } from './factories';
import { Icon } from '../../core/ui';

const DEFAULT_SOURCE_NAME = 'default',
	ITEM_ACTIVE_CLASS = ITEM_CLASS + '-active-true';

export class FileBrowser extends ViewWithToolbar implements IFileBrowser {
	private loader = this.c.div(F_CLASS + '_loader', ICON_LOADER);
	private browser = this.c.div(F_CLASS + ' non-selected');
	private status_line = this.c.div(F_CLASS + '_status');
	private tree = this.c.div(F_CLASS + '_tree');
	private files = this.c.div(F_CLASS + '_files');

	state = ObserveObject.create<IFileBrowserState>({
		activeElements: [],
		elements: [],
		folders: [],
		view: 'tiles',
		sortBy: 'changed-desc',
		filterWord: '',
		onlyImages: false
	});

	dataProvider!: IFileBrowserDataProvider;

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
				Alert(error.message);
				this.errorHandler(error);
			});
	}

	async loadTree(): Promise<any> {
		const path: string = this.dataProvider.currentPath,
			source: string = this.dataProvider.currentSource,
			error = (e: string | Error) => {
				throw e instanceof Error ? e : error(e);
			};

		if (this.uploader) {
			this.uploader.setPath(path);
			this.uploader.setSource(source);
		}

		this.tree.classList.add('active');
		Dom.detach(this.tree);
		this.tree.appendChild(this.loader.cloneNode(true));

		if (this.o.showFoldersPanel) {
			const tree = this.dataProvider
				.tree(path, source)
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
						this.generateFolderTree(respData.data.sources);
					}
				})
				.catch(e => {
					this.errorHandler(
						error(this.i18n('Error on load folders'))
					);

					error(e);
				});

			const items = this.loadItems(path, source);

			return Promise.all([tree, items]).catch(error);
		} else {
			this.tree.classList.remove('active');
		}
	}

	async deleteFile(name: string, source: string): Promise<any> {
		return this.dataProvider
			.fileRemove(this.dataProvider.currentPath, name, source)
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

	private generateFolderTree(sources: ISourcesFiles) {
		const folders: IFileBrowserFolder[] = [];

		each<ISource>(sources, (source_name, source) => {
			source.folders.forEach((name: string) => {
				folders.push({
					name,
					source,
					sourceName: source_name
				});
			});
		});

		this.state.folders = folders;
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

	options!: IFileBrowserOptions;

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
	status = (message: string | Error, success?: boolean) => {
		if (typeof message !== 'string') {
			message = message.message;
		}

		this.status_line.classList.remove('success');

		this.status_line.classList.add('active');

		const messageBox = this.c.div();
		messageBox.textContent = message;
		this.status_line.appendChild(messageBox);

		if (success) {
			this.status_line.classList.add('success');
		}

		this.async.setTimeout(
			() => {
				this.status_line.classList.remove('active');
				Dom.detach(this.status_line);
			},
			{
				timeout: this.o.howLongShowMsg,
				label: 'fileBrowser.status'
			}
		);
	};

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
		callback?: (data: IFileBrowserCallBackData) => void,
		onlyImages: boolean = false
	): Promise<void> => {
		this.state.onlyImages = onlyImages;

		return this.async.promise((resolve, reject) => {
			if (!this.o.items || !this.o.items.url) {
				throw error('Need set options.filebrowser.ajax.url');
			}

			let localTimeout: number = 0;

			this.e
				.off(this.files, 'dblclick')
				.on(this.files, 'dblclick', this.onSelect(callback), 'a')
				.on(
					this.files,
					'touchstart',
					() => {
						const now = new Date().getTime();

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

			const header = this.c.div();

			this.toolbar.build(this.o.buttons).appendTo(header);

			this.dialog.open(this.browser, header);

			this.e.fire('sort.filebrowser', this.state.sortBy);

			this.loadTree().then(resolve, reject);
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

	private elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}> = {};

	private elementToItem(elm: HTMLElement): IFileBrowserItem | void {
		const { key } = elm.dataset,
			{ item } = this.elementsMap[key || ''];

		return item;
	}

	/**
	 * Convert state to view
	 */
	private stateToView() {
		const { state, files, create, options } = this,
			getDomElement = (item: IFileBrowserItem): HTMLElement => {
				const key = item.uniqueHashKey;

				if (this.elementsMap[key]) {
					return this.elementsMap[key].elm;
				}

				const elm = create.fromHTML(
					options.getThumbTemplate.call(
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

		state
			.on('beforeChange.activeElements', () => {
				state.activeElements.forEach(item => {
					const key = item.uniqueHashKey,
						{ elm } = this.elementsMap[key];

					elm && elm.classList.remove(ITEM_ACTIVE_CLASS);
				});
			})

			.on('change.activeElements', () => {
				this.e.fire('changeSelection');

				state.activeElements.forEach(item => {
					const key = item.uniqueHashKey,
						{ elm } = this.elementsMap[key];

					elm && elm.classList.add(ITEM_ACTIVE_CLASS);
				});
			})

			.on('change.view', () => {
				files.classList.remove(F_CLASS + '_files_view-tiles');
				files.classList.remove(F_CLASS + '_files_view-list');
				files.classList.add(F_CLASS + '_files_view-' + state.view);

				this.storage.set(F_CLASS + '_view', state.view);
			})

			.on('change.sortBy', () => {
				this.storage.set(F_CLASS + '_sortby', state.sortBy);
			})

			.on(
				'change.elements',
				this.async.debounce(() => {
					Dom.detach(files);

					if (state.elements.length) {
						state.elements.forEach(item => {
							this.files.appendChild(getDomElement(item));
						});
					} else {
						files.appendChild(
							create.div(
								F_CLASS + '_no_files',
								this.i18n('There are no files')
							)
						);
					}
				}, this.defaultTimeout)
			)

			.on(
				'change.folders',
				this.async.debounce(() => {
					Dom.detach(this.tree);

					let lastSource = DEFAULT_SOURCE_NAME,
						lastSource2: ISource | null = null;

					const appendCreateButton = (
						source: ISource | null,
						sourceName: string,
						force: boolean = false
					) => {
						if (
							source &&
							lastSource2 &&
							(source !== lastSource2 || force) &&
							options.createNewFolder &&
							this.dataProvider.canI('FolderCreate')
						) {
							this.tree.appendChild(
								create.a(
									'jodit-button addfolder',
									{
										href: 'javascript:void(0)',
										'data-path': normalizePath(
											source.path + '/'
										),
										'data-source': sourceName
									},
									Icon.get('plus') +
										' ' +
										this.i18n('Add folder')
								)
							);

							lastSource2 = source;
						}
					};

					state.folders.forEach(folder => {
						const { name, source, sourceName } = folder;

						if (sourceName && sourceName !== lastSource) {
							this.tree.appendChild(
								create.div(
									F_CLASS + '_source_title',
									sourceName
								)
							);
							lastSource = sourceName;
						}

						const folderElm = create.a(
							F_CLASS + '_tree_item',
							{
								draggable: 'draggable',
								href: 'javascript:void(0)',
								'data-path': normalizePath(
									source.path,
									name + '/'
								),
								'data-name': name,
								'data-source': sourceName,
								'data-source-path': source.path
							},
							create.span(F_CLASS + '_tree_item_title', name)
						);

						appendCreateButton(source, sourceName);

						lastSource2 = source;

						this.tree.appendChild(folderElm);

						if (name === '..' || name === '.') {
							return;
						}

						if (
							options.deleteFolder &&
							this.dataProvider.canI('FolderRename')
						) {
							folderElm.appendChild(
								create.element(
									'i',
									{
										class:
											'jodit_icon_folder jodit_icon_folder_rename',
										title: this.i18n('Rename')
									},
									Icon.get('pencil')
								)
							);
						}

						if (
							options.deleteFolder &&
							this.dataProvider.canI('FolderRemove')
						) {
							folderElm.appendChild(
								create.element(
									'i',
									{
										class:
											'jodit_icon_folder jodit_icon_folder_remove',
										title: this.i18n('Delete')
									},
									Icon.get('cancel')
								)
							);
						}
					});

					appendCreateButton(lastSource2, lastSource, true);
				}, this.defaultTimeout)
			);
	}

	private initEventsListeners() {
		const state = this.state,
			self = this;

		self.e
			.on('view.filebrowser', (view: 'tiles' | 'list') => {
				if (view !== state.view) {
					state.view = view;
				}
			})
			.on('sort.filebrowser', (value: string) => {
				if (value !== state.sortBy) {
					state.sortBy = value;
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

							self.state.activeElements.forEach(item => {
								promises.push(
									self.deleteFile(
										item.file || item.name || '',
										item.sourceName
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
						file.fileURL,
						file.file || '',
						file.path,
						file.sourceName
					);
				}
			})
			.on(
				'fileRename.filebrowser',
				(name: string, path: string, source: string) => {
					if (self.state.activeElements.length === 1) {
						Prompt(
							self.i18n('Enter new name'),
							self.i18n('Rename'),
							(newName: string): false | void => {
								if (!isValidName(newName)) {
									self.status(self.i18n('Enter new name'));
									return false;
								}

								self.dataProvider
									.fileRename(path, name, newName, source)
									.then(resp => {
										if (
											self.o.fileRename &&
											self.o.fileRename.process
										) {
											resp = self.o.fileRename.process.call(
												self,
												resp
											);
										}

										if (!self.o.isSuccess(resp)) {
											throw error(
												self.o.getMessage(resp)
											);
										} else {
											self.state.activeElements = [];
											self.status(
												self.o.getMessage(resp),
												true
											);
										}

										self.loadItems();
									})
									.catch(self.status);

								return;
							},
							self.i18n('type name'),
							name
						);
					}
				}
			)
			.on('update.filebrowser', () => {
				self.loadTree();
			});
	}

	private initNativeEventsListeners() {
		let dragElement: false | HTMLElement = false;

		const self = this;

		self.e
			.on(
				self.tree,
				'click',
				function(this: HTMLElement, e: MouseEvent) {
					const a: HTMLAnchorElement = this
							.parentNode as HTMLAnchorElement,
						path = attr(a, '-path') || '';

					Confirm(
						self.i18n('Are you sure?'),
						self.i18n('Delete'),
						(yes: boolean) => {
							if (yes) {
								self.dataProvider
									.folderRemove(
										path,
										attr(a, '-name') || '',
										attr(a, '-source') || ''
									)
									.then(resp => {
										if (
											self.o.folderRemove &&
											self.o.folderRemove.process
										) {
											resp = self.o.folderRemove.process.call(
												self,
												resp
											);
										}

										if (!self.o.isSuccess(resp)) {
											throw error(
												self.o.getMessage(resp)
											);
										} else {
											self.state.activeElements = [];
											self.status(
												self.o.getMessage(resp),
												true
											);
										}

										self.loadTree();
									})
									.catch(self.status);
							}
						}
					);

					e.stopImmediatePropagation();
					return false;
				},
				'a>.jodit_icon_folder_remove'
			)
			.on(
				self.tree,
				'click',
				function(this: HTMLElement, e: MouseEvent) {
					const a: HTMLAnchorElement = this
							.parentNode as HTMLAnchorElement,
						name = attr(a, '-name') || '',
						path = attr(a, '-source-path') || '';

					Prompt(
						self.i18n('Enter new name'),
						self.i18n('Rename'),
						(newName: string): false | void => {
							if (!isValidName(newName)) {
								self.status(self.i18n('Enter new name'));
								return false;
							}

							self.dataProvider
								.folderRename(
									path,
									attr(a, '-name') || '',
									newName,
									attr(a, '-source') || ''
								)
								.then(resp => {
									if (
										self.o.folderRename &&
										self.o.folderRename.process
									) {
										resp = self.o.folderRename.process.call(
											self,
											resp
										);
									}

									if (!self.o.isSuccess(resp)) {
										throw error(self.o.getMessage(resp));
									} else {
										self.state.activeElements = [];
										self.status(
											self.o.getMessage(resp),
											true
										);
									}

									self.loadTree();
								})
								.catch(self.status);

							return;
						},
						self.i18n('type name'),
						name
					);

					e.stopImmediatePropagation();

					return false;
				},
				'a>.jodit_icon_folder_rename'
			)
			.on(
				self.tree,
				'click',
				function(this: HTMLAnchorElement) {
					if (this.classList.contains('addfolder')) {
						Prompt(
							self.i18n('Enter Directory name'),
							self.i18n('Create directory'),
							(name: string) => {
								self.dataProvider
									.createFolder(
										name,
										attr(this, '-path') || '',
										attr(this, '-source') || ''
									)
									.then(resp => {
										if (self.o.isSuccess(resp)) {
											self.loadTree();
										} else {
											self.status(
												self.o.getMessage(resp)
											);
										}

										return resp;
									}, self.status);
							},
							self.i18n('type name')
						);
					} else {
						self.dataProvider.currentPath =
							attr(this, '-path') || '';
						self.dataProvider.currentSource =
							attr(this, '-source') || '';

						self.loadTree();
					}
				},
				'a'
			)
			.on(
				self.tree,
				'dragstart',
				function(this: HTMLAnchorElement) {
					if (self.o.moveFolder) {
						dragElement = this;
					}
				},
				'a'
			)
			.on(
				self.tree,
				'drop',
				function(this: HTMLAnchorElement): boolean | void {
					if ((self.o.moveFile || self.o.moveFolder) && dragElement) {
						let path = attr(dragElement, '-path') || '';

						// move folder
						if (
							!self.o.moveFolder &&
							dragElement.classList.contains(
								F_CLASS + '_tree_item'
							)
						) {
							return false;
						}

						// move file
						if (dragElement.classList.contains(ITEM_CLASS)) {
							path += attr(dragElement, '-name');

							if (!self.o.moveFile) {
								return false;
							}
						}

						self.dataProvider
							.move(
								path,
								attr(this, '-path') || '',
								attr(this, '-source') || '',
								dragElement.classList.contains(ITEM_CLASS)
							)
							.then(resp => {
								if (self.o.isSuccess(resp)) {
									self.loadTree();
								} else {
									self.status(self.o.getMessage(resp));
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
				function(this: HTMLElement, e: MouseEvent): false | void {
					const item = self.elementToItem(this);

					if (!item) {
						return;
					}

					if (!ctrlKey(e)) {
						self.state.activeElements = [item];
					} else {
						self.state.activeElements = [
							...self.state.activeElements,
							item
						];
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
					if (self.o.moveFile) {
						dragElement = this;
					}
				},
				'a'
			)
			.on(self.dialog.container, 'drop', (e: DragEvent) =>
				e.preventDefault()
			);
	}

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
			this.loadItems();
		};

		self.uploader = self.getInstance('Uploader', uploaderOptions);
		self.uploader.setPath(self.dataProvider.currentPath);
		self.uploader.setSource(self.dataProvider.currentSource);
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
			language: this.o.language,
			buttons: ['dialog.fullsize', 'dialog.close']
		});

		if (self.o.showFoldersPanel) {
			self.browser.appendChild(self.tree);
		}
		self.browser.appendChild(self.files);
		self.browser.appendChild(self.status_line);

		this.initEventsListeners();
		this.initNativeEventsListeners();

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
			if (this.options[key] !== null) {
				this.options[key] = extend(
					true,
					{},
					this.o.ajax,
					this.options[key]
				);
			}
		});

		self.stateToView();

		const view = this.storage.get(F_CLASS + '_view');

		if (view && this.o.view === null) {
			self.state.view = view === 'list' ? 'list' : 'tiles';
		} else {
			self.state.view = self.o.view === 'list' ? 'list' : 'tiles';
		}

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

	destruct() {
		if (this.isInDestruct) {
			return;
		}

		this.dialog.destruct();
		delete this.dialog;
		this.events && this.e.off('.filebrowser');
		this.uploader && this.uploader.destruct();
		delete this.uploader;

		super.destruct();
	}
}
