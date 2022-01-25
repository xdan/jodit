/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type { IFileBrowser } from 'jodit/types';
import { Dialog } from 'jodit/modules/dialog';

import { Dom } from 'jodit/core/dom';
import { attr, error } from 'jodit/core/helpers';
import { makeContextMenu } from 'jodit/modules/file-browser/factories';
import { Icon } from 'jodit/core/ui';
import { elementToItem, getItem } from '../listeners/native-listeners';
import { openImageEditor } from '../../image-editor/image-editor';
import { elementsMap } from 'jodit/modules/file-browser/builders/elements-map';
import { loadTree } from 'jodit/modules/file-browser/fetch/load-tree';
import { deleteFile } from 'jodit/modules/file-browser/fetch/delete-file';

const CLASS_PREVIEW = 'jodit-filebrowser-preview',
	preview_tpl_next = (next = 'next', right = 'right') =>
		`<div class="${CLASS_PREVIEW}__navigation ${CLASS_PREVIEW}__navigation_arrow_${next}">` +
		'' +
		Icon.get('angle-' + right) +
		'</a>';

export default (self: IFileBrowser): ((e: DragEvent) => boolean | void) => {
	if (!self.o.contextMenu) {
		return () => {};
	}

	const contextmenu = makeContextMenu(self);

	return (e: DragEvent): boolean | void => {
		const a = getItem(e.target, self.container);

		if (!a) {
			return;
		}

		let item: HTMLElement = a;

		const opt = self.options,
			ga = (key: string) => attr(item, key) || '';

		self.async.setTimeout(() => {
			const selectedItem = elementToItem(a, elementsMap(self));

			if (!selectedItem) {
				return;
			}

			self.state.activeElements = [selectedItem];

			contextmenu.show(e.clientX, e.clientY, [
				ga('data-is-file') !== '1' &&
				opt.editImage &&
				(self.dataProvider.canI('ImageResize') ||
					self.dataProvider.canI('ImageCrop'))
					? {
							icon: 'pencil',
							title: 'Edit',
							exec: () => {
								return openImageEditor.call(
									self,
									ga('href'),
									ga('data-name'),
									ga('data-path'),
									ga('data-source')
								);
							}
					  }
					: false,

				self.dataProvider.canI('FileRename')
					? {
							icon: 'italic',
							title: 'Rename',
							exec: async () => {
								self.e.fire(
									'fileRename.filebrowser',
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
								try {
									await deleteFile(
										self,
										ga('data-name'),
										ga('data-source')
									);
								} catch (e: any) {
									return self.status(e);
								}

								self.state.activeElements = [];

								return loadTree(self).catch(self.status);
							}
					  }
					: false,

				opt.preview
					? {
							icon: 'eye',
							title: 'Preview',
							exec: () => {
								const preview = new Dialog({
										fullsize: self.o.fullsize,
										language: self.o.language,
										buttons: ['fullsize', 'dialog.close']
									}),
									temp_content = self.c.div(
										CLASS_PREVIEW,
										'<div class="jodit-icon_loader"></div>'
									),
									preview_box = self.c.div(
										CLASS_PREVIEW + '__box'
									),
									next = self.c.fromHTML(preview_tpl_next()),
									prev = self.c.fromHTML(
										preview_tpl_next('prev', 'left')
									),
									addLoadHandler = (src: string) => {
										const image = self.c.element('img');

										image.setAttribute('src', src);

										const onload = () => {
											if (self.isInDestruct) {
												return;
											}

											self.e.off(image, 'load');

											Dom.detach(temp_content);

											if (opt.showPreviewNavigation) {
												if (
													Dom.prevWithClass(
														item,
														self.files.getFullElName(
															'item'
														)
													)
												) {
													temp_content.appendChild(
														prev
													);
												}

												if (
													Dom.nextWithClass(
														item,
														self.files.getFullElName(
															'item'
														)
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

											preview_box.appendChild(image);

											preview.setPosition();

											self?.events?.fire(
												'previewOpenedAndLoaded'
											);
										};

										self.e.on(image, 'load', onload);

										if (image.complete) {
											onload();
										}
									};

								self.e.on(
									[next, prev],
									'click',
									function (this: HTMLElement) {
										if (this === next) {
											item = Dom.nextWithClass(
												item,
												self.files.getFullElName('item')
											) as HTMLElement;
										} else {
											item = Dom.prevWithClass(
												item,
												self.files.getFullElName('item')
											) as HTMLElement;
										}

										if (!item) {
											throw error('Need element');
										}

										Dom.detach(temp_content);
										Dom.detach(preview_box);

										temp_content.innerHTML =
											'<div class="jodit-icon_loader"></div>';

										addLoadHandler(ga('href'));
									}
								);

								self.e.on('beforeDestruct', () => {
									preview.destruct();
								});

								preview.container.classList.add(
									CLASS_PREVIEW + '__dialog'
								);
								preview.setContent(temp_content);
								preview.setPosition();
								preview.open();

								addLoadHandler(ga('href'));

								self.events
									.on('beforeDestruct', () => {
										preview.destruct();
									})
									.fire('previewOpened');
							}
					  }
					: false,
				{
					icon: 'upload',
					title: 'Download',
					exec: () => {
						const url = ga('href');

						if (url) {
							self.ow.open(url);
						}
					}
				}
			]);
		}, self.defaultTimeout);

		self.e
			.on('beforeClose', () => contextmenu.close())
			.on('beforeDestruct', () => contextmenu.destruct());

		e.stopPropagation();
		e.preventDefault();

		return false;
	};
};
