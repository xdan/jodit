/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	HTMLTagNames,
	IFileBrowserItem,
	Nullable,
	IDictionary
} from '../../../types';
import type { FileBrowser } from '../file-browser';
import { ctrlKey, attr } from '../../../core/helpers';
import contextMenu from '../builders/context-menu';
import { Dom } from '../../../core/dom';

export const getItem = (
	node: Nullable<EventTarget>,
	root: HTMLElement,
	tag: HTMLTagNames = 'a'
): Nullable<HTMLElement> =>
	Dom.closest(node as Node, elm => Dom.isTag(elm, tag), root);

export const elementToItem = (
	elm: HTMLElement,
	elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}>
): IFileBrowserItem | void => {
	const { key } = elm.dataset,
		{ item } = elementsMap[key || ''];

	return item;
};

export function nativeListeners(this: FileBrowser): void {
	let dragElement: false | HTMLElement = false;

	const self = this;

	self.e
		.on(self.tree.container, 'dragstart', (e: MouseEvent): void => {
			const a = getItem(e.target, self.dialog.container);

			if (!a) {
				return;
			}

			if (self.o.moveFolder) {
				dragElement = a;
			}
		})
		.on(self.tree.container, 'drop', (e: MouseEvent): boolean | void => {
			if ((self.o.moveFile || self.o.moveFolder) && dragElement) {
				let path = attr(dragElement, '-path') || '';

				// move folder
				if (
					!self.o.moveFolder &&
					dragElement.classList.contains(
						this.tree.getFullElName('item')
					)
				) {
					return false;
				}

				// move file
				if (
					dragElement.classList.contains(
						this.files.getFullElName('item')
					)
				) {
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
						dragElement.classList.contains(
							this.files.getFullElName('item')
						)
					)
					.then(() => {
						self.loadTree();
					}, self.status);

				dragElement = false;
			}
		})
		.on(self.files.container, 'contextmenu', contextMenu(self))
		.on(self.files.container, 'click', (e: MouseEvent): void => {
			if (!ctrlKey(e)) {
				this.state.activeElements = [];
			}
		})
		.on(self.files.container, 'click', (e: MouseEvent): false | void => {
			const a = getItem(e.target, self.dialog.container);

			if (!a) {
				return;
			}

			const item = elementToItem(a, self.elementsMap);

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
		.on(self.files.container, 'dragstart', (e: MouseEvent) => {
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
