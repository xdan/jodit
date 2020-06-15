/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Confirm, Prompt } from '../../dialog';
import { isValidName } from '../../../core/helpers/checker';
import { error } from '../../../core/helpers';
import { IFileBrowser } from '../../../types';

export function selfListeners(this: IFileBrowser) {
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
				}).bindDestruct(self);
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
										throw error(self.o.getMessage(resp));
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
					).bindDestruct(this);
				}
			}
		)
		.on('update.filebrowser', () => {
			self.loadTree();
		});
}
