/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from '../../../types';
import type { FileBrowser } from '../file-browser';
import { Confirm, Prompt } from '../../dialog';
import { isValidName } from '../../../core/helpers/checker';
import { normalizePath } from '../../../core/helpers';
import { DEFAULT_SOURCE_NAME } from '../data-provider';
import { openImageEditor } from '../../image-editor/image-editor';

export function selfListeners(this: FileBrowser): void {
	const state = this.state,
		dp = this.dataProvider,
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
		.on('openFolder.filebrowser', (data: IDictionary): void => {
			let path;

			if (data.name === '..') {
				path = data.path
					.split('/')
					.filter((p: string) => p.length)
					.slice(0, -1)
					.join('/');
			} else {
				path = normalizePath(data.path, data.name);
			}

			self.state.currentPath = path;
			self.state.currentSource =
				data.name === '.' ? DEFAULT_SOURCE_NAME : data.source;
		})
		.on('removeFolder.filebrowser', (data: IDictionary): void => {
			Confirm(
				self.i18n('Are you sure?'),
				self.i18n('Delete'),
				(yes: boolean) => {
					if (yes) {
						dp.folderRemove(data.path, data.name, data.source)
							.then(message => {
								self.status(message, true);
								self.loadTree();
							})
							.catch(self.status);
					}
				}
			).bindDestruct(self);
		})
		.on('renameFolder.filebrowser', (data: IDictionary): void => {
			Prompt(
				self.i18n('Enter new name'),
				self.i18n('Rename'),
				(newName: string): false | void => {
					if (!isValidName(newName)) {
						self.status(self.i18n('Enter new name'));
						return false;
					}

					dp.folderRename(data.path, data.name, newName, data.source)
						.then(message => {
							self.state.activeElements = [];
							self.status(message, true);
							self.loadTree();
						})
						.catch(self.status);

					return;
				},
				self.i18n('type name'),
				data.name
			).bindDestruct(self);
		})
		.on('addFolder.filebrowser', (data: IDictionary): void => {
			Prompt(
				self.i18n('Enter Directory name'),
				self.i18n('Create directory'),
				(name: string) => {
					dp.createFolder(name, data.path, data.source).then(() => {
						self.loadTree();
					}, self.status);
				},
				self.i18n('type name')
			).bindDestruct(self);
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
				}).bindDestruct(self);
			}
		})
		.on('edit.filebrowser', () => {
			if (self.state.activeElements.length === 1) {
				const [file] = this.state.activeElements;

				openImageEditor.call(
					self,
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

							dp.fileRename(path, name, newName, source)
								.then(message => {
									self.state.activeElements = [];
									self.status(message, true);

									self.loadItems();
								})
								.catch(self.status);

							return;
						},
						self.i18n('type name'),
						name
					).bindDestruct(this);
				}
			}
		)
		.on('update.filebrowser', () => {
			self.loadTree();
		});
}
