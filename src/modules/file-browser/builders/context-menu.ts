/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { FileBrowser } from '../file-browser';
import { Dialog } from '../../dialog';

import { Dom } from '../../../core/dom';
import { F_CLASS, ICON_LOADER, ITEM_CLASS } from '../consts';
import { attr, error } from '../../../core/helpers';
import { makeContextMenu } from '../factories';
import { Icon } from '../../../core/ui';
import { getItem } from '../listeners/native-listeners';
import { openImageEditor } from '../../image-editor/image-editor';

const CLASS_PREVIEW = F_CLASS + '_preview_',
	preview_tpl_next = (next = 'next', right = 'right') =>
		`<a href="javascript:void(0)" class="${CLASS_PREVIEW}navigation ${CLASS_PREVIEW}navigation-${next}">` +
		'' +
		Icon.get('angle-' + right) +
		'</a>';

export default (self: FileBrowser) => {
	if (!self.o.contextMenu) {
		return () => {};
	}

	const contextmenu = makeContextMenu(self);

	return (e: DragEvent): boolean | void => {
		const a = getItem(e.target, self.dialog.container);

		if (!a) {
			return;
		}

		let item: HTMLElement = a;

		const opt = self.options,
			ga = (key: string) => attr(item, key) || '';

		self.async.setTimeout(() => {
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
								await self.deleteFile(
									ga('data-name'),
									ga('data-source')
								);

								self.state.activeElements = [];

								return self.loadTree();
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
										F_CLASS + '_preview',
										ICON_LOADER
									),
									preview_box = self.c.div(
										F_CLASS + '_preview_box'
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
										if (
											this.classList.contains(
												CLASS_PREVIEW +
													'navigation-next'
											)
										) {
											item = Dom.nextWithClass(
												item,
												ITEM_CLASS
											) as HTMLElement;
										} else {
											item = Dom.prevWithClass(
												item,
												ITEM_CLASS
											) as HTMLElement;
										}

										if (!item) {
											throw error('Need element');
										}

										Dom.detach(temp_content);
										Dom.detach(preview_box);

										temp_content.innerHTML = ICON_LOADER;

										addLoadHandler(ga('href'));
									}
								);

								self.e.on('beforeDestruct', () => {
									preview.destruct();
								});

								preview.container.classList.add(
									F_CLASS + '_preview_dialog'
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

		self?.e.on('beforeDestruct', () => {
			contextmenu.destruct();
		});

		e.stopPropagation();
		e.preventDefault();

		return false;
	};
};
