/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { ctrlKey, attr } from '../../../core/helpers';
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

export function nativeListeners(this: IFileBrowser): void {
	let dragElement: false | HTMLElement = false;

	const self = this;

	const elementToItem = (elm: HTMLElement): IFileBrowserItem | void => {
		const { key } = elm.dataset,
			{ item } = self.elementsMap[key || ''];

		return item;
	};

	self.e
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
