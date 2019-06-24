/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config, OptionsDefault } from '../../Config';
import * as consts from '../../constants';
import { ContextMenu } from '../ContextMenu';
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
	ISourcesFiles
} from '../../types/fileBrowser';

import { ImageEditorActionBox } from '../../types/types';
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
import { Collection } from '../helpers/array/collection';
import { Dom } from '../Dom';
import { debounce } from '../helpers/async';
import { Alert } from '../dialog';
import DataProvider from './dataProvider';

const F_CLASS = 'jodit_filebrowser_';

export const ITEM_CLASS = F_CLASS + 'files_item';

const DEFAULT_SOURCE_NAME = 'default',
	ITEM_ACTIVE_CLASS = ITEM_CLASS + '-active-true',
	CLASS_PREVIEW = F_CLASS + 'preview_',
	preview_tpl_next = (next = 'next', right = 'right') =>
		`<a href="javascript:void(0)" class="${CLASS_PREVIEW}navigation ${CLASS_PREVIEW}navigation-${next}">` +
		'' +
		ToolbarIcon.getIcon('angle-' + right) +
		'</a>',
	ICON_LOADER = '<i class="jodit_icon-loader"></i>';

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

	dataProvider: DataProvider;

	private view: string = 'tiles';
	private sortBy: string = 'changed';

	private dragger: false | HTMLElement = false;

	private statusTimer: number;

	private filterWord: string = '';

	private onlyImages: boolean = false;

	private loadItems(
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

					this.generateItemsBox(respData.data.sources);

					this.activeElements.clear();
				}
			})
			.catch((error: Error) => {
				Alert(error.message);
				this.errorHandler(error);
			});
	}

	private async loadTree(): Promise<any> {
		const path: string = this.dataProvider.currentPath,
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

	private async deleteFile(name: string, source: string): Promise<any> {
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
					'data-path="' +
					normalizePath(source.path + name) +
					'/" ' +
					'data-source="' +
					source_name +
					'">' +
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

	private generateItemsBox(sources: ISourcesFiles) {
		this.elements.clear();

		each<ISource>(sources, (source_name, source) => {
			if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
				this.elements.add(
					this.create.fromHTML(
						`<div class="${F_CLASS}source_title">${source_name +
							(source.path ? ' - ' + source.path : '')}</div>`
					)
				);
			}

			if (source.files && source.files.length) {
				if (typeof this.options.sort === 'function') {
					source.files.sort((a, b) =>
						this.options.sort(a, b, this.sortBy)
					);
				}

				source.files.forEach((item: ISourceFile) => {
					if (
						this.options.filter === undefined ||
						this.options.filter(item, this.filterWord)
					) {
						if (
							!this.onlyImages ||
							item.isImage === undefined ||
							item.isImage
						) {
							const itemElm = this.create.fromHTML(
								this.options.getThumbTemplate.call(
									this,
									item,
									source,
									source_name.toString()
								)
							);

							this.elements.add(itemElm);
						}
					}
				});
			} else {
				this.elements.add(
					this.create.fromHTML(
						`<div class="${F_CLASS + 'no_files'}">${this.i18n(
							'There are no files'
						)}</div>`
					)
				);
			}
		});
	}

	private onSelect(callback: (data: IFileBrowserCallBackData) => void) {
		return () => {
			if (this.activeElements.length) {
				const urls: string[] = [];

				this.activeElements.forEach((elm: HTMLElement) => {
					const url: string | null = elm.getAttribute('data-url');
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
		return this.activeElements.all();
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
		this.onlyImages = onlyImages;
		this.buffer.fileBrowserOnlyImages = onlyImages;

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

			this.events.fire('sort.filebrowser', this.sortBy);

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

	private activeElements = new Collection<HTMLElement>();
	private elements = new Collection<HTMLElement>();

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

		self.events
			.on('view.filebrowser', (view: string) => {
				if (view !== self.view) {
					self.view = view;
					self.buffer.fileBrowserView = view;
					self.files.classList.remove(F_CLASS + 'files_view-tiles');
					self.files.classList.remove(F_CLASS + 'files_view-list');
					self.files.classList.add(
						F_CLASS + 'files_view-' + self.view
					);

					self.storage.set(F_CLASS + 'view', self.view);
				}
			})
			.on('sort.filebrowser', (value: string) => {
				if (value !== self.sortBy) {
					self.sortBy = value;
					this.storage.set(F_CLASS + 'sortby', self.sortBy);
					self.loadItems();
				}
			})
			.on('filter.filebrowser', (value: string) => {
				if (value !== self.filterWord) {
					self.filterWord = value;
					self.loadItems();
				}
			})
			.on('fileRemove.filebrowser', () => {
				if (self.activeElements.length) {
					Confirm(self.i18n('Are you sure?'), '', (yes: boolean) => {
						if (yes) {
							const promises: Array<Promise<any>> = [];

							self.activeElements.forEach((a: HTMLElement) => {
								promises.push(
									self.deleteFile(
										a.getAttribute('data-name') || '',
										a.getAttribute('data-source') || ''
									)
								);
							});

							self.activeElements.clear();

							Promise.all(promises).then(() => {
								return self.loadTree();
							});
						}
					});
				}
			})
			.on('edit.filebrowser', () => {
				if (this.activeElements.length === 1) {
					const [file] = this.activeElements.all();

					self.openImageEditor(
						file.getAttribute('href') || '',
						file.getAttribute('data-name') || '',
						file.getAttribute('data-path') || '',
						file.getAttribute('data-source') || ''
					);
				}
			})
			.on('update.filebrowser', () => {
				self.loadTree();
			})
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
										self.activeElements.clear();
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
						self.dragger = this;
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
						self.dragger
					) {
						let path: string =
							self.dragger.getAttribute('data-path') || '';

						// move folder
						if (
							!self.options.moveFolder &&
							self.dragger.classList.contains(
								F_CLASS + 'tree_item'
							)
						) {
							return false;
						}

						// move file
						if (self.dragger.classList.contains(ITEM_CLASS)) {
							path += self.dragger.getAttribute('data-name');
							if (!self.options.moveFile) {
								return false;
							}
						}

						self.dataProvider
							.move(
								path,
								this.getAttribute('data-path') || '',
								this.getAttribute('data-source') || '',
								self.dragger.classList.contains(ITEM_CLASS)
							)
							.then(resp => {
								if (self.options.isSuccess(resp)) {
									self.loadTree();
								} else {
									self.status(self.options.getMessage(resp));
								}
							}, self.status);

						self.dragger = false;
					}
				},
				'a'
			);

		const contextmenu: ContextMenu = new ContextMenu(self.jodit || self),
			onContext = function(
				this: HTMLElement,
				e: DragEvent
			): boolean | void {
				if (!self.options.contextMenu) {
					return;
				}

				let item: HTMLElement = this,
					opt = self.options,
					ga = (attr: string) => item.getAttribute(attr) || '';

				setTimeout(() => {
					contextmenu.show(
						e.pageX,
						e.pageY,
						[
							ga('data-is-file') !== '1' &&
							opt.editImage &&
							(self.dataProvider.canI('ImageResize') ||
								self.dataProvider.canI('ImageCrop'))
								? {
										icon: 'pencil',
										title: 'Edit',
										exec: () => {
											self.openImageEditor(
												ga('href'),
												ga('data-name'),
												ga('data-path'),
												ga('data-source')
											);
										}
								  }
								: false,

							self.dataProvider.canI('FileRemove')
								? {
										icon: 'bin',
										title: 'Delete',
										exec: async () => {
											await self.deleteFile(
												ga('data-name'),
												ga('data-source')
											);
											self.activeElements.remove(item);
											self.loadTree();
										}
								  }
								: false,

							opt.preview
								? {
										icon: 'eye',
										title: 'Preview',
										exec: () => {
											const preview: Dialog = new Dialog(
													self
												),
												temp_content: HTMLElement = self.create.div(
													F_CLASS + 'preview',
													ICON_LOADER
												),
												preview_box: HTMLElement = self.create.div(
													F_CLASS + 'preview_box'
												),
												next = self.create.fromHTML(
													preview_tpl_next()
												),
												prev = self.create.fromHTML(
													preview_tpl_next(
														'prev',
														'left'
													)
												),
												addLoadHandler = (
													src: string
												) => {
													const image: HTMLImageElement = self.create.element(
														'img'
													);

													image.setAttribute(
														'src',
														src
													);

													const onload = () => {
														image.removeEventListener(
															'load',
															onload as EventListenerOrEventListenerObject
														);

														temp_content.innerHTML =
															'';

														if (
															opt.showPreviewNavigation
														) {
															if (
																Dom.prevWithClass(
																	item,
																	ITEM_CLASS
																)
															) {
																temp_content.appendChild(
																	prev
																);
															}

															if (
																Dom.nextWithClass(
																	item,
																	ITEM_CLASS
																)
															) {
																temp_content.appendChild(
																	next
																);
															}
														}

														temp_content.appendChild(
															preview_box
														);

														preview_box.appendChild(
															image
														);

														preview.setPosition();
													};

													image.addEventListener(
														'load',
														onload
													);
													if (image.complete) {
														onload();
													}
												};

											addLoadHandler(ga('href'));

											self.events.on(
												[next, prev],
												'click',
												function(this: HTMLElement) {
													if (
														this.classList.contains(
															CLASS_PREVIEW +
																'navigation-next'
														)
													) {
														item = <HTMLElement>(
															Dom.nextWithClass(
																item,
																ITEM_CLASS
															)
														);
													} else {
														item = <HTMLElement>(
															Dom.prevWithClass(
																item,
																ITEM_CLASS
															)
														);
													}

													if (!item) {
														throw new Error(
															'Need element'
														);
													}

													Dom.detach(temp_content);
													Dom.detach(preview_box);

													temp_content.innerHTML = ICON_LOADER;

													addLoadHandler(ga('href'));
												}
											);

											preview.setContent(temp_content);
											preview.setPosition();
											preview.open();
										}
								  }
								: false,
							{
								icon: 'upload',
								title: 'Download',
								exec: () => {
									const url = ga('href');

									if (url) {
										self.ownerWindow.open(url);
									}
								}
							}
						],
						self.dialog.getZIndex() + 1
					);
				}, self.defaultTimeout);

				e.stopPropagation();
				e.preventDefault();

				return false;
			};

		self.events
			.on(self.files, 'contextmenu', onContext, 'a')
			.on(self.files, 'click', (e: MouseEvent) => {
				if (!ctrlKey(e)) {
					this.activeElements.clear();
				}
			})
			.on(
				self.files,
				'click',
				function(this: HTMLElement, e: MouseEvent) {
					if (!ctrlKey(e)) {
						self.activeElements.clear();
					}

					self.activeElements.add(this);
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
						self.dragger = this;
					}
				},
				'a'
			)
			.on(self.dialog.container, 'drop', (e: DragEvent) =>
				e.preventDefault()
			);

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

		if (this.storage.get(F_CLASS + 'view') && this.options.view === null) {
			self.view =
				self.storage.get(F_CLASS + 'view') === 'list'
					? 'list'
					: 'tiles';
		} else {
			self.view = self.options.view === 'list' ? 'list' : 'tiles';
		}

		self.files.classList.add(F_CLASS + 'files_view-' + self.view);
		self.buffer.fileBrowserView = self.view;

		self.sortBy =
			['changed', 'name', 'size'].indexOf(self.options.sortBy) !== -1
				? self.options.sortBy
				: 'changed';

		if (self.storage.get(F_CLASS + 'sortby')) {
			self.sortBy =
				['changed', 'name', 'size'].indexOf(
					self.storage.get(F_CLASS + 'sortby') || ''
				) !== -1
					? self.storage.get(F_CLASS + 'sortby') || ''
					: 'changed';
		}

		self.dataProvider.currentBaseUrl = $$('base', editorDoc).length
			? $$('base', editorDoc)[0].getAttribute('href') || ''
			: location.protocol + '//' + location.host;

		const uploaderOptions: IUploaderOptions<IUploader> = extend(
			true,
			{},
			Config.defaultOptions.uploader,
			self.options.uploader,
			editor && editor.options && editor.options.uploader !== null
				? {
						...(editor.options.uploader as IUploaderOptions<
							IUploader
						>)
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

		self.activeElements
			.on('beforeClear', () => {
				this.activeElements.forEach(elm =>
					elm.classList.remove(ITEM_ACTIVE_CLASS)
				);
			})
			.on('change', () => {
				this.events.fire('changeSelection');
				this.activeElements.forEach(elm =>
					elm.classList.add(ITEM_ACTIVE_CLASS)
				);
			});

		self.elements.on(
			'change',
			debounce(() => {
				Dom.detach(self.files);
				this.elements.all().forEach(elm => {
					self.files.appendChild(elm);
				});
			}, this.defaultTimeout)
		);
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
