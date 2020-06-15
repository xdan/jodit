/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Confirm, Prompt } from '../../dialog';
import { ctrlKey, error, isValidName, attr } from '../../../core/helpers';
import { F_CLASS, ITEM_CLASS } from '../consts';
import contextMenu from '../builders/context-menu';
import {
	HTMLTagNames,
	IFileBrowser,
	IFileBrowserItem,
	Nullable
} from '../../../types';
import { Dom } from '../../../core/dom';

export const getItem = (
	node: Nullable<EventTarget>,
	root: HTMLElement,
	tag: HTMLTagNames = 'a'
): Nullable<HTMLElement> =>
	Dom.closest(
		node as Node,
		elm => Dom.isElement(elm) && Dom.isTag(elm, tag),
		root
	);

export function nativeListeners(this: IFileBrowser) {
	let dragElement: false | HTMLElement = false;

	const self = this;

	const elementToItem = (elm: HTMLElement): IFileBrowserItem | void => {
		const { key } = elm.dataset,
			{ item } = self.elementsMap[key || ''];

		return item;
	};

	self.e
		.on(self.tree, 'click', (e: MouseEvent): void | false => {
			const a = getItem(e.target, self.dialog.container, 'i');

			if (!a || !a.classList.contains('jodit-icon_folder_remove')) {
				return;
			}

			const path = attr(a, '-path') || '';

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
									throw error(self.o.getMessage(resp));
								} else {
									self.state.activeElements = [];
									self.status(self.o.getMessage(resp), true);
								}

								self.loadTree();
							})
							.catch(self.status);
					}
				}
			).bindDestruct(self);

			e.stopImmediatePropagation();
			return false;
		})
		.on(self.tree, 'click', (e: MouseEvent): void | false => {
			const a = getItem(e.target, self.dialog.container, 'i');

			if (!a || !a.classList.contains('jodit-icon_folder_rename')) {
				return;
			}

			const name = attr(a, '-name') || '',
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
								self.status(self.o.getMessage(resp), true);
							}

							self.loadTree();
						})
						.catch(self.status);

					return;
				},
				self.i18n('type name'),
				name
			).bindDestruct(self);

			e.stopImmediatePropagation();

			return false;
		})
		.on(self.tree, 'click', (e: MouseEvent): void => {
			const a = getItem(e.target, self.dialog.container);

			if (!a) {
				return;
			}

			if (a.classList.contains('jodit-filebrowser__addfolder')) {
				Prompt(
					self.i18n('Enter Directory name'),
					self.i18n('Create directory'),
					(name: string) => {
						self.dataProvider
							.createFolder(
								name,
								attr(a, '-path') || '',
								attr(a, '-source') || ''
							)
							.then(resp => {
								if (self.o.isSuccess(resp)) {
									self.loadTree();
								} else {
									self.status(self.o.getMessage(resp));
								}

								return resp;
							}, self.status);
					},
					self.i18n('type name')
				).bindDestruct(self);
			} else {
				self.dataProvider.currentPath = attr(a, '-path') || '';
				self.dataProvider.currentSource = attr(a, '-source') || '';

				self.loadTree();
			}
		})
		.on(self.tree, 'dragstart', (e: MouseEvent): void => {
			const a = getItem(e.target, self.dialog.container);

			if (!a) {
				return;
			}

			if (self.o.moveFolder) {
				dragElement = a;
			}
		})
		.on(self.tree, 'drop', (e: MouseEvent): boolean | void => {
			if ((self.o.moveFile || self.o.moveFolder) && dragElement) {
				let path = attr(dragElement, '-path') || '';

				// move folder
				if (
					!self.o.moveFolder &&
					dragElement.classList.contains(F_CLASS + '__tree-item')
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

				const a = getItem(e.target, self.dialog.container);

				if (!a) {
					return;
				}

				self.dataProvider
					.move(
						path,
						attr(a, '-path') || '',
						attr(a, '-source') || '',
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
		})
		.on(self.files, 'contextmenu', contextMenu(self))
		.on(self.files, 'click', (e: MouseEvent): void => {
			if (!ctrlKey(e)) {
				this.state.activeElements = [];
			}
		})
		.on(self.files, 'click', (e: MouseEvent): false | void => {
			const a = getItem(e.target, self.dialog.container);

			if (!a) {
				return;
			}

			const item = elementToItem(a);

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
		})
		.on(self.files, 'dragstart', (e: MouseEvent) => {
			if (self.o.moveFile) {
				const a = getItem(e.target, self.dialog.container);

				if (!a) {
					return;
				}

				dragElement = a;
			}
		})
		.on(self.dialog.container, 'drop', (e: DragEvent) =>
			e.preventDefault()
		);
}
