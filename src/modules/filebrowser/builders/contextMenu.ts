import { ContextMenu } from '../../ContextMenu';
import { setTimeout } from '../../helpers/async';
import { Dialog } from '../../dialog';
import { Dom } from '../../Dom';
import { F_CLASS, FileBrowser, ICON_LOADER, ITEM_CLASS } from '../fileBrowser';
import { ToolbarIcon } from '../..';

const
	CLASS_PREVIEW = F_CLASS + 'preview_',
	preview_tpl_next = (next = 'next', right = 'right') =>
		`<a href="javascript:void(0)" class="${CLASS_PREVIEW}navigation ${CLASS_PREVIEW}navigation-${next}">` +
		'' +
		ToolbarIcon.getIcon('angle-' + right) +
		'</a>';

export default (self: FileBrowser) => {
	if (!self.options.contextMenu) {
		return () => {
		};
	}

	const
		contextmenu = new ContextMenu(self.jodit || self);

	return function(
		this: HTMLElement,
		e: DragEvent
	): boolean | void {
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

					self.dataProvider.canI('FileRename')
						? {
							icon: 'italic',
							title: 'Rename',
							exec: async () => {
								self.events.fire(
									'fileRename.filebrowser',
									ga('data-name'),
									ga('data-path'),
									ga('data-source'),
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
}
