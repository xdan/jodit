/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dialog } from '../../dialog';
import { Dom } from '../../Dom';
import { ToolbarIcon } from '../..';
import { F_CLASS, ICON_LOADER, ITEM_CLASS } from '../consts';

const CLASS_PREVIEW = F_CLASS + '_preview_',
	preview_tpl_next = (next = 'next', right = 'right') =>
		`<a href="javascript:void(0)" class="${CLASS_PREVIEW}navigation ${CLASS_PREVIEW}navigation-${next}">` +
		'' +
		ToolbarIcon.getIcon('angle-' + right) +
		'</a>';

export default (self: FileBrowser) => {
	if (!self.options.contextMenu) {
		return () => {};
	}

	const contextmenu = makeContextMenu(self.jodit || self);

	return function(this: HTMLElement, e: DragEvent): boolean | void {
		let item: HTMLElement = this,
			opt = self.options,
			ga = (attr: string) => item.getAttribute(attr) || '';

		self.async.setTimeout(() => {
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

					self.dataProvider.canI('FileRename')
						? {
								icon: 'italic',
								title: 'Rename',
								exec: async () => {
									self.events.fire(
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

									await self.loadTree();
								}
						  }
						: false,

					opt.preview
						? {
								icon: 'eye',
								title: 'Preview',
								exec: () => {
									const preview = new Dialog(self),
										temp_content = self.create.div(
											F_CLASS + '_preview',
											ICON_LOADER
										),
										preview_box = self.create.div(
											F_CLASS + '_preview_box'
										),
										next = self.create.fromHTML(
											preview_tpl_next()
										),
										prev = self.create.fromHTML(
											preview_tpl_next('prev', 'left')
										),
										addLoadHandler = (src: string) => {
											const image = self.create.element(
												'img'
											);

											image.setAttribute('src', src);

											const onload = () => {
												if (self.isInDestruct) {
													return;
												}

												self.events.off(image, 'load');

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

											self.events.on(
												image,
												'load',
												onload
											);

											if (image.complete) {
												onload();
											}
										};

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
												throw error('Need element');
											}

											Dom.detach(temp_content);
											Dom.detach(preview_box);

											temp_content.innerHTML = ICON_LOADER;

											addLoadHandler(ga('href'));
										}
									);

									preview.container.classList.add(F_CLASS + '_preview_dialog');
									preview.setContent(temp_content);
									preview.setPosition();
									preview.open();

									addLoadHandler(ga('href'));

									self?.events
										?.on('beforeDestruct', () => {
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
								self.ownerWindow.open(url);
							}
						}
					}
				],
				self.dialog.getZIndex() + 1
			);
		}, self.defaultTimeout);

		self?.events.on('beforeDestruct', () => {
			contextmenu.destruct();
		});

		e.stopPropagation();
		e.preventDefault();

		return false;
	};
};

import { FileBrowser } from '../fileBrowser';
import { error } from '../../helpers';
import { makeContextMenu } from '../factories';
