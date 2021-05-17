/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './image-properties.less';

import type {
	IDialog,
	IFileBrowserCallBackData,
	IJodit,
	IUploaderData
} from '../../../types';
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
	attr,
	position,
	isArray,
	markOwner,
	isString,
	refs,
	kebabCase,
	isNumeric
} from '../../../core/helpers';
import { FileSelectorWidget, TabsWidget } from '../../../modules/widget';
import { Button } from '../../../core/ui/button';
import { form, mainTab, positionTab } from './templates/';
import { watch, autobind } from '../../../core/decorators';
import { openImageEditor } from '../../../modules/image-editor/image-editor';
import { hAlignElement } from '../helpers';

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

const normalSizeToString = (value: string): string => {
	value = trim(value);
	return /^[0-9]+$/.test(value) ? value + 'px' : value;
};

const normalSizeFromString = (value: string | number): string | number => {
	return /^[-+]?[0-9.]+px$/.test(value.toString())
		? parseFloat(value.toString())
		: value;
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

	@watch('state.marginIsLocked')
	onChangeMarginIsLocked(): void {
		if (!this.form) {
			return;
		}

		const { marginRight, marginBottom, marginLeft, lockMargin } =
			refs<HTMLInputElement>(this.form);

		[marginRight, marginBottom, marginLeft].forEach(elm => {
			attr(elm, 'disabled', this.state.marginIsLocked || null);
		});

		lockMargin.innerHTML = Icon.get(
			this.state.marginIsLocked ? 'lock' : 'unlock'
		);
	}

	@watch('state.sizeIsLocked')
	onChangeSizeIsLocked(): void {
		if (!this.form) {
			return;
		}

		const { lockSize, imageWidth } = refs<HTMLInputElement>(this.form);

		lockSize.innerHTML = Icon.get(
			this.state.sizeIsLocked ? 'lock' : 'unlock'
		);

		lockSize.classList.remove('jodit-properties__lock');
		lockSize.classList.remove('jodit-properties__unlock');

		lockSize.classList.add(
			this.state.sizeIsLocked
				? 'jodit-properties__lock'
				: 'jodit-properties__unlock'
		);

		this.j.e.fire(imageWidth, 'change');
	}

	private form!: HTMLElement;

	/**
	 * Dialog for form
	 */
	private dialog!: IDialog;

	/**
	 * Open dialog editing image properties
	 *
	 * @example
	 * ```javascript
	 * const editor = Jodit.makeJodit('#editor');
	 *     img = editor.createInside.element('img');
	 *
	 * img.setAttribute('src', 'images/some-image.png');
	 * editor.s.insertImage(img);
	 * // open the properties of the editing window
	 * editor.events.fire('openImageProperties', img);
	 * ```
	 */
	protected open(): void | false {
		this.makeForm();

		this.j.e.fire('hidePopup');

		markOwner(this.j, this.dialog.container);

		this.state.marginIsLocked = true;
		this.state.sizeIsLocked = true;

		this.updateValues();

		this.dialog.open().setModal(true).setPosition();

		return false;
	}

	/**
	 * Create form for edit image properties
	 */
	private makeForm(): void {
		if (this.dialog) {
			return;
		}

		this.dialog = new Dialog({
			fullsize: this.j.o.fullsize,
			globalFullSize: this.j.o.globalFullSize,
			theme: this.j.o.theme,
			language: this.j.o.language,
			minWidth: Math.min(400, screen.width),
			minHeight: 400,
			buttons: ['fullsize', 'dialog.close']
		});

		const editor = this.j,
			opt = editor.o,
			i18n = editor.i18n.bind(editor),
			buttons = {
				check: Button(editor, 'ok', 'Apply'),
				remove: Button(editor, 'bin', 'Delete')
			};

		editor.e.on(this.dialog, 'afterClose', () => {
			if (
				this.state.image.parentNode &&
				opt.image.selectImageAfterClose
			) {
				editor.s.select(this.state.image);
			}
		});

		buttons.remove.onAction(() => {
			editor.s.removeNode(this.state.image);
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

		buttons.check.onAction(this.onApply);

		const { changeImage, editImage } = refs<HTMLInputElement>(this.form);

		editor.e.on(changeImage, 'click', this.openImagePopup);

		if (opt.image.useImageEditor) {
			editor.e.on(editImage, 'click', this.openImageEditor);
		}

		const { lockSize, lockMargin, imageWidth, imageHeight } =
			refs<HTMLInputElement>(mainForm);

		if (lockSize) {
			editor.e.on(lockSize, 'click', () => {
				this.state.sizeIsLocked = !this.state.sizeIsLocked;
			});
		}

		editor.e.on(lockMargin, 'click', (e: MouseEvent) => {
			this.state.marginIsLocked = !this.state.marginIsLocked;
			e.preventDefault();
		});

		const changeSizes = (event: any): void => {
			if (!isNumeric(imageWidth.value) || !isNumeric(imageHeight.value)) {
				return;
			}

			const w = parseFloat(imageWidth.value),
				h = parseFloat(imageHeight.value);

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

				let equal = true,
					wasEmptyField = false;

				[marginTop, marginRight, marginBottom, marginLeft].forEach(
					elm => {
						const id = attr(elm, 'data-ref') || '';

						let value: number | string =
							image.style.getPropertyValue(kebabCase(id));

						if (!value) {
							wasEmptyField = true;
							elm.value = '';
							return;
						}

						if (/^[0-9]+(px)?$/.test(value)) {
							value = parseInt(value, 10);
						}

						elm.value = value.toString() || '';

						if (
							(wasEmptyField && elm.value) ||
							(equal &&
								id !== 'marginTop' &&
								elm.value !== marginTop.value)
						) {
							equal = false;
						}
					}
				);

				this.state.marginIsLocked = equal;
			},
			updateSizes = () => {
				const width =
						attr(image, 'width') ||
						css(image, 'width', undefined, true) ||
						false,
					height =
						attr(image, 'height') ||
						css(image, 'height', undefined, true) ||
						false;

				imageWidth.value =
					width !== false
						? normalSizeFromString(width).toString()
						: image.offsetWidth.toString();

				imageHeight.value =
					height !== false
						? normalSizeFromString(height).toString()
						: image.offsetHeight.toString();

				this.state.sizeIsLocked = ((): boolean => {
					if (
						!isNumeric(imageWidth.value) ||
						!isNumeric(imageHeight.value)
					) {
						return false;
					}

					const w = parseFloat(imageWidth.value),
						h = parseFloat(imageHeight.value);

					return Math.abs(w - h * this.state.ratio) < 1;
				})();
			},
			updateText = () => {
				imageTitle.value = attr(image, 'title') || '';

				imageAlt.value = attr(image, 'alt') || '';

				const a = Dom.closest(image, 'a', this.j.editor);

				if (a) {
					imageLink.value = attr(a, 'href') || '';

					imageLinkOpenInNewTab.checked =
						attr(a, 'target') === '_blank';
				} else {
					imageLink.value = '';
					imageLinkOpenInNewTab.checked = false;
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
	 * Apply form's values to image
	 */
	@autobind
	private onApply(): void {
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

		const opt = this.j.o;
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
			this.dialog.close();
			return;
		}

		// Border radius
		if (borderRadius.value !== '0' && /^[0-9]+$/.test(borderRadius.value)) {
			image.style.borderRadius = borderRadius.value + 'px';
		} else {
			image.style.borderRadius = '';
		}

		// Title
		attr(image, 'title', imageTitle.value || null);

		// Alt
		attr(image, 'alt', imageAlt.value || null);

		// Link
		let link = Dom.closest(image, 'a', this.j.editor);

		if (imageLink.value) {
			if (!link) {
				link = Dom.wrap(image, 'a', this.j.createInside);
			}

			attr(link, 'href', imageLink.value);

			attr(
				link,
				'target',
				imageLinkOpenInNewTab.checked ? '_blank' : null
			);
		} else {
			if (link && link.parentNode) {
				link.parentNode.replaceChild(image, link);
			}
		}

		// Size
		if (
			imageWidth.value !== image.offsetWidth.toString() ||
			imageHeight.value !== image.offsetHeight.toString()
		) {
			css(image, {
				width: trim(imageWidth.value)
					? normalSizeToString(imageWidth.value)
					: null,
				height: trim(imageHeight.value)
					? normalSizeToString(imageHeight.value)
					: null
			});

			attr(image, 'width', null);
			attr(image, 'height', null);
		}

		const margins = [marginTop, marginRight, marginBottom, marginLeft];

		if (opt.image.editMargins) {
			if (!this.state.marginIsLocked) {
				margins.forEach((margin: HTMLInputElement) => {
					const side = attr(margin, 'data-ref') || '';
					css(image, side, normalSizeToString(margin.value));
				});
			} else {
				css(image, 'margin', normalSizeToString(marginTop.value));
			}
		}

		if (opt.image.editClass) {
			attr(image, 'class', classes.value || null);
		}

		if (opt.image.editId) {
			attr(image, 'id', id.value || null);
		}

		if (opt.image.editAlign) {
			hAlignElement(
				image,
				align.value as Parameters<typeof hAlignElement>[1]
			);
		}

		this.j.setEditorValue();

		this.dialog.close();
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
										).bindDestruct(this.j);
									},
									(error: Error) => {
										Alert(
											this.j.i18n(
												'There was an error loading %s',
												error.message
											)
										).bindDestruct(this.j);
									}
								);
							}
						}
					).bindDestruct(this.j);
					return;
				}
			};

		a.href = url;

		this.j.filebrowser.dataProvider
			.getPathByUrl(a.href.toString())
			.then(resp => {
				openImageEditor.call(
					this.j.filebrowser,
					a.href,
					resp.name,
					resp.path,
					resp.source,
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
					error => {
						Alert(error.message).bindDestruct(this.j);
					}
				);
			})
			.catch(error => {
				Alert(error.message, loadExternal).bindDestruct(this.j);
			});
	}

	/**
	 * Open popup with filebrowser/uploader buttons for image
	 * @param event
	 */
	@autobind
	private openImagePopup(event: MouseEvent): void {
		const popup = new Popup(this.j),
			{ changeImage } = refs(this.form);

		popup.setZIndex(this.dialog.getZIndex() + 1);

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
	protected afterInit(editor: IJodit): void {
		const self = this;

		editor.e
			.on('afterConstructor changePlace', () => {
				editor.e
					.off(editor.editor, '.imageproperties')
					.on(
						editor.editor,
						'dblclick.imageproperties',
						(e: MouseEvent) => {
							const image = e.target;

							if (!Dom.isTag(image, 'img')) {
								return;
							}

							if (editor.o.image.openOnDblClick) {
								self.state.image = image;

								if (!editor.o.readonly) {
									e.stopImmediatePropagation();
									e.preventDefault();

									self.open();
								}
							} else {
								e.stopImmediatePropagation();
								editor.s.select(image);
							}
						}
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
	protected beforeDestruct(editor: IJodit): void {
		this.dialog && this.dialog.destruct();
		editor.e.off(editor.editor, '.imageproperties').off('.imageproperties');
	}
}
