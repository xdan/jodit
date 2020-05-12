/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './image-properties.less';

import autobind from 'autobind-decorator';

import { Config } from '../../../config';
import {
	Alert,
	Confirm,
	Dialog,
	Dom,
	Popup,
	Icon,
	Plugin
} from '../../../modules';

import {
	css,
	trim,
	clearCenterAlign,
	attr,
	position,
	isArray,
	markOwner,
	isString,
	refs
} from '../../../core/helpers';

import {
	IDialog,
	IFileBrowserCallBackData,
	IJodit,
	IUploaderData
} from '../../../types';
import { FileSelectorWidget, TabsWidget } from '../../../modules/widget';
import { Button } from '../../../core/ui/button';
import { form, mainTab, positionTab } from './templates/';

/**
 * Plug-in for image editing window
 *
 */
/**
 * @property{object} image Plugin {@link Image|Image}'s options
 * @property{boolean} image.openOnDblClick=true Open editing dialog after double click on image
 * @property{boolean} image.editSrc=true Show edit 'src' input
 * @property{boolean} image.useImageEditor=true Show crop/resize btn
 * @property{boolean} image.editTitle=true Show edit 'title' input
 * @property{boolean} image.editAlt=true Show edit 'alt' input
 * @property{boolean} image.editLink=true Show edit image link's options
 * @property{boolean} image.editSize=true Show edit image size's inputs
 * @property{boolean} image.editMargins=true Show edit margin inputs
 * @property{boolean} image.editStyle=true Show style edit input
 * @property{boolean} image.editClass=true Show edit classNames input
 * @property{boolean} image.editId=true Show edit ID input
 * @property{boolean} image.editAlign=true Show Alignment selector
 * @property{boolean} image.showPreview=true Show preview image
 * @property{boolean} image.selectImageAfterClose=true Select image after close dialog
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
 * ```
 */

declare module '../../../config' {
	interface Config {
		image: {
			dialogWidth: number;
			openOnDblClick: boolean;
			editSrc: boolean;
			useImageEditor: boolean;
			editTitle: boolean;
			editAlt: boolean;
			editLink: boolean;
			editSize: boolean;
			editMargins: boolean;
			editBorderRadius: boolean;
			editClass: boolean;
			editStyle: boolean;
			editId: boolean;
			editAlign: boolean;
			showPreview: boolean;
			selectImageAfterClose: boolean;
		};
	}
}

Config.prototype.image = {
	dialogWidth: 600,
	openOnDblClick: true,
	editSrc: true,
	useImageEditor: true,
	editTitle: true,
	editAlt: true,
	editLink: true,
	editSize: true,
	editBorderRadius: true,
	editMargins: true,
	editClass: true,
	editStyle: true,
	editId: true,
	editAlign: true,
	showPreview: true,
	selectImageAfterClose: true
};

/**
 * Show dialog with image's options
 */
export class imageProperties extends Plugin {
	state: {
		image: HTMLImageElement;
		ratio: number;
		sizeIsLocked: boolean;
		marginIsLocked: boolean;
	} = {
		image: new Image(),
		get ratio(): number {
			return this.image.naturalWidth / this.image.naturalHeight || 1;
		},
		sizeIsLocked: true,
		marginIsLocked: true
	};

	private form!: HTMLElement;

	/**
	 * Dialog for form
	 */
	private dialog: IDialog = new Dialog({
		fullsize: this.j.o.fullsize,
		language: this.j.o.language,
		buttons: ['dialog.fullsize', 'dialog.close']
	});

	/**
	 * Open dialog editing image properties
	 *
	 * @example
	 * ```javascript
	 * const editor = Jodit.makeJodit('#editor');
	 *     img = editor.createInside.element('img');
	 *
	 * img.setAttribute('src', 'images/some-image.png');
	 * editor.selection.insertImage(img);
	 * // open the properties of the editing window
	 * editor.events.fire('openImageProperties', img);
	 * ```
	 */
	protected open(): void | false {
		this.j.e.fire('hidePopup');

		markOwner(this.j, this.dialog.container);

		this.state.marginIsLocked = true;
		this.state.sizeIsLocked = true;

		this.updateValues();

		this.dialog.open().setPosition();

		return false;
	}

	/**
	 * Create form for edit image properties
	 */
	private makeForm(): void {
		const editor = this.j,
			opt = editor.o,
			i18n = editor.i18n.bind(editor),
			buttons = {
				check: Button(editor, 'check', 'Apply'),
				remove: Button(editor, 'bin', 'Delete')
			};

		editor.e.on(this.dialog, 'afterClose', () => {
			if (
				this.state.image.parentNode &&
				opt.image.selectImageAfterClose
			) {
				editor.selection.select(this.state.image);
			}
		});

		buttons.remove.onAction(() => {
			editor.selection.removeNode(this.state.image);
			this.dialog.close();
		});

		const { dialog } = this;

		dialog.setHeader(i18n('Image properties'));

		const mainForm = form(editor);
		this.form = mainForm;

		dialog.setContent(mainForm);

		const { tabsBox } = refs<HTMLInputElement>(this.form);

		if (tabsBox) {
			tabsBox.appendChild(
				TabsWidget(editor, [
					{ name: 'Image', content: mainTab(editor) },
					{ name: 'Advanced', content: positionTab(editor) }
				])
			);
		}

		const {
			style,
			imageSrc,
			borderRadius,
			imageTitle,
			imageAlt,
			imageLink,
			imageWidth,
			imageHeight,
			marginTop,
			marginRight,
			marginBottom,
			marginLeft,
			imageLinkOpenInNewTab,
			align,
			classes,
			id
		} = refs<HTMLInputElement>(this.form);

		buttons.check.onAction(() => {
			const { image } = this.state;

			// styles
			if (opt.image.editStyle) {
				attr(image, 'style', style.value || null);
			}

			// Src
			if (imageSrc.value) {
				attr(image, 'src', imageSrc.value);
			} else {
				Dom.safeRemove(image);
				dialog.close();
				return;
			}

			// Border radius
			if (
				borderRadius.value !== '0' &&
				/^[0-9]+$/.test(borderRadius.value)
			) {
				image.style.borderRadius = borderRadius.value + 'px';
			} else {
				image.style.borderRadius = '';
			}

			// Title
			attr(image, 'title', imageTitle.value || null);

			// Alt
			attr(image, 'alt', imageAlt.value || null);

			// Link
			let link: HTMLAnchorElement | null = Dom.closest(
				image,
				'a',
				editor.editor
			) as HTMLAnchorElement;

			if (imageLink.value) {
				if (!link) {
					link = Dom.wrap(image, 'a', editor) as HTMLAnchorElement;
				}

				attr(link, 'href', imageLink.value);

				attr(
					link,
					'target',
					imageLinkOpenInNewTab.checked ? '_blank' : 'null'
				);
			} else {
				if (link && link.parentNode) {
					link.parentNode.replaceChild(image, link);
				}
			}

			const normalSize = (value: string): string => {
				value = trim(value);
				return /^[0-9]+$/.test(value) ? value + 'px' : value;
			};

			// Size
			if (
				imageWidth.value !== image.offsetWidth.toString() ||
				imageHeight.value !== image.offsetHeight.toString()
			) {
				css(image, {
					width: trim(imageWidth.value)
						? normalSize(imageWidth.value)
						: null,
					height: trim(imageHeight.value)
						? normalSize(imageHeight.value)
						: null
				});
			}

			const margins = [marginTop, marginRight, marginBottom, marginLeft];

			if (opt.image.editMargins) {
				if (!this.state.marginIsLocked) {
					margins.forEach((margin: HTMLInputElement) => {
						const side = attr(margin, 'data-ref') || '';
						css(image, side, normalSize(margin.value));
					});
				} else {
					css(image, 'margin', normalSize(marginTop.value));
				}
			}

			if (opt.image.editClass) {
				attr(image, 'class', classes.value || null);
			}

			if (opt.image.editId) {
				attr(image, 'id', id.value || null);
			}

			if (opt.image.editAlign) {
				if (align.value) {
					if (['right', 'left'].includes(align.value.toLowerCase())) {
						css(image, 'float', align.value);
						clearCenterAlign(image);
					} else {
						css(image, {
							float: '',
							display: 'block',
							marginLeft: 'auto',
							marginRight: 'auto'
						});
					}
				} else {
					if (
						css(image, 'float') &&
						['right', 'left'].indexOf(
							css(image, 'float')
								.toString()
								.toLowerCase()
						) !== -1
					) {
						css(image, 'float', '');
					}

					clearCenterAlign(image);
				}
			}

			editor.setEditorValue();

			dialog.close();
		});

		const { changeImage, editImage } = refs<HTMLInputElement>(this.form);

		editor.e.on(changeImage, 'click', this.openImagePopup);

		if (opt.image.useImageEditor) {
			editor.e.on(editImage, 'click', this.openImageEditor);
		}

		const { lockSize, lockMargin } = refs<HTMLInputElement>(mainForm);

		if (lockSize) {
			editor.e.on(lockSize, 'click', () => {
				this.state.sizeIsLocked = !this.state.sizeIsLocked;

				lockSize.innerHTML = Icon.get(
					this.state.sizeIsLocked ? 'lock' : 'unlock'
				);

				editor.e.fire(imageWidth, 'change');
			});
		}

		if (lockMargin) {
			editor.e.on(lockMargin, 'click', () => {
				this.state.marginIsLocked = !this.state.marginIsLocked;

				lockMargin.innerHTML = Icon.get(
					this.state.marginIsLocked ? 'lock' : 'unlock'
				);

				[marginRight, marginBottom, marginLeft].forEach(elm => {
					attr(elm, 'disabled', this.state.marginIsLocked || null);
				});
			});
		}

		const changeSizes = (event: any): void => {
			const w = parseInt(imageWidth.value, 10),
				h = parseInt(imageHeight.value, 10);

			if (event.target === imageWidth) {
				imageHeight.value = Math.round(w / this.state.ratio).toString();
			} else {
				imageWidth.value = Math.round(h * this.state.ratio).toString();
			}
		};

		editor.e.on(
			[imageWidth, imageHeight],
			'change keydown mousedown paste',
			(event: any) => {
				if (!this.state.sizeIsLocked) {
					return;
				}

				editor.async.setTimeout(changeSizes.bind(this, event), {
					timeout: editor.defaultTimeout,
					label: 'image-properties-changeSize'
				});
			}
		);

		dialog.setFooter([buttons.remove, buttons.check]);

		dialog.setSize(this.j.o.image.dialogWidth);
	}

	/**
	 * Set input values from image
	 */
	private updateValues(): void {
		const opt = this.j.o;

		const { image } = this.state;

		const {
			marginTop,
			marginRight,
			marginBottom,
			marginLeft,
			lockMargin,
			imageSrc,
			id,
			classes,
			align,
			style,
			imageTitle,
			imageAlt,
			borderRadius,
			imageLink,
			imageWidth,
			imageHeight,
			imageLinkOpenInNewTab,
			imageViewSrc,
			lockSize
		} = refs<HTMLInputElement>(this.form);

		const updateLock = () => {
				lockMargin.checked = this.state.marginIsLocked;
				lockSize.checked = this.state.sizeIsLocked;
			},
			updateAlign = () => {
				if (
					image.style.cssFloat &&
					['left', 'right'].indexOf(
						image.style.cssFloat.toLowerCase()
					) !== -1
				) {
					align.value = css(image, 'float') as string;
				} else {
					if (
						(css(image, 'display') as string) === 'block' &&
						image.style.marginLeft === 'auto' &&
						image.style.marginRight === 'auto'
					) {
						align.value = 'center';
					}
				}
			},
			updateBorderRadius = () => {
				borderRadius.value = (
					parseInt(image.style.borderRadius || '0', 10) || '0'
				).toString();
			},
			updateId = () => {
				id.value = attr(image, 'id') || '';
			},
			updateStyle = () => {
				style.value = attr(image, 'style') || '';
			},
			updateClasses = () => {
				classes.value = (attr(image, 'class') || '').replace(
					/jodit_focused_image[\s]*/,
					''
				);
			},
			updateMargins = () => {
				if (!opt.image.editMargins) {
					return;
				}

				let notequal = false;

				[marginTop, marginRight, marginBottom, marginLeft].forEach(
					elm => {
						const id = attr(elm, 'data-refs') || '';

						let value: number | string = (image.style as any)[
							id
						] as string;

						if (!value) {
							return;
						}

						if (/^[0-9]+(px)?$/.test(value)) {
							value = parseInt(value, 10);
						}

						elm.value = value.toString() || '';

						if (
							!notequal &&
							id !== 'marginTop' &&
							elm.value !== marginTop.value
						) {
							notequal = true;
						}
					}
				);

				this.state.marginIsLocked = !notequal;

				if (lockMargin) {
					lockMargin.innerHTML = Icon.get(
						this.state.marginIsLocked ? 'lock' : 'unlock'
					);
				}

				[
					marginBottom,
					marginLeft,
					marginRight
				].forEach((elm: HTMLElement) =>
					attr(elm, 'disabled', this.state.marginIsLocked || null)
				);
			},
			updateSizes = () => {
				imageWidth.value = image.offsetWidth.toString();
				imageHeight.value = image.offsetHeight.toString();
			},
			updateText = () => {
				if (image.hasAttribute('title')) {
					imageTitle.value = attr(image, 'title') || '';
				}

				if (image.hasAttribute('alt')) {
					imageAlt.value = attr(image, 'alt') || '';
				}

				const a = Dom.closest(image, 'a', this.j.editor);

				if (a) {
					imageLink.value = attr(a, 'href') || '';

					imageLinkOpenInNewTab.checked =
						attr(a, 'target') === '_blank';
				}
			},
			updateSrc = () => {
				imageSrc.value = attr(image, 'src') || '';

				if (imageViewSrc) {
					attr(imageViewSrc, 'src', attr(image, 'src') || '');
				}
			};

		updateLock();
		updateSrc();
		updateText();
		updateSizes();
		updateMargins();
		updateClasses();
		updateId();
		updateBorderRadius();
		updateAlign();
		updateStyle();
	}

	/**
	 * Open image editor dialog
	 */
	@autobind
	private openImageEditor(): void {
		const url: string = attr(this.state.image, 'src') || '',
			a = this.j.c.element('a'),
			loadExternal = () => {
				if (a.host !== location.host) {
					Confirm(
						this.j.i18n(
							'You can only edit your own images. Download this image on the host?'
						),
						(yes: boolean) => {
							if (yes && this.j.uploader) {
								this.j.uploader.uploadRemoteImage(
									a.href.toString(),
									(resp: IUploaderData) => {
										Alert(
											this.j.i18n(
												'The image has been successfully uploaded to the host!'
											),
											() => {
												if (
													isString(resp.newfilename)
												) {
													attr(
														this.state.image,
														'src',
														resp.baseurl +
															resp.newfilename
													);

													this.updateValues();
												}
											}
										);
									},
									(error: Error) => {
										Alert(
											this.j.i18n(
												'There was an error loading %s',
												error.message
											)
										);
									}
								);
							}
						}
					);
					return;
				}
			};

		a.href = url;

		this.j.filebrowser.dataProvider.getPathByUrl(
			a.href.toString(),
			(path: string, name: string, source: string) => {
				this.j.filebrowser.openImageEditor(
					a.href,
					name,
					path,
					source,
					() => {
						const timestamp: number = new Date().getTime();
						attr(
							this.state.image,
							'src',
							url +
								(url.indexOf('?') !== -1 ? '' : '?') +
								'&_tmp=' +
								timestamp.toString()
						);

						this.updateValues();
					},
					(error: Error) => {
						Alert(error.message);
					}
				);
			},
			(error: Error) => {
				Alert(error.message, loadExternal);
			}
		);
	}

	/**
	 * Open popup with filebrowser/uploader buttons for image
	 * @param event
	 */
	@autobind
	private openImagePopup(event: MouseEvent): void {
		const popup = new Popup(this.j),
			{ changeImage } = refs(this.form);

		popup
			.setContent(
				FileSelectorWidget(
					this.j,
					{
						upload: (data: IFileBrowserCallBackData) => {
							if (data.files && data.files.length) {
								attr(
									this.state.image,
									'src',
									data.baseurl + data.files[0]
								);
							}

							this.updateValues();

							popup.close();
						},

						filebrowser: (data: IFileBrowserCallBackData) => {
							if (
								data &&
								isArray(data.files) &&
								data.files.length
							) {
								attr(this.state.image, 'src', data.files[0]);
								popup.close();

								this.updateValues();
							}
						}
					},
					this.state.image,
					popup.close
				)
			)
			.open(() => position(changeImage));

		event.stopPropagation();
	}

	/** @override **/
	protected afterInit(editor: IJodit) {
		const self = this;
		editor.o.image.openOnDblClick && this.makeForm();

		editor.e
			.on('afterConstructor changePlace', () => {
				editor.e.off(editor.editor, '.imageproperties').on(
					editor.editor,
					'dblclick.imageproperties',
					function(this: HTMLImageElement, e: MouseEvent) {
						if (editor.o.image.openOnDblClick) {
							self.state.image = this;

							if (!editor.o.readonly) {
								e.stopImmediatePropagation();
								e.preventDefault();

								self.open();
							}
						} else {
							e.stopImmediatePropagation();
							editor.selection.select(this);
						}
					},
					'img'
				);
			})
			.on(
				'openImageProperties.imageproperties',
				(image: HTMLImageElement) => {
					this.state.image = image;
					this.open();
				}
			);
	}

	/** @override */
	protected beforeDestruct(editor: IJodit) {
		this.dialog.destruct();
		editor.e.off(editor.editor, '.imageproperties').off('.imageproperties');
	}
}
