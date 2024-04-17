/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/image-properties/README.md]]
 * @packageDocumentation
 * @module plugins/image-properties
 */

import type {
	IDestructible,
	IDialog,
	IFileBrowserCallBackData,
	IJodit,
	ImageHAlign
} from 'jodit/types';
import { autobind, cache, cached, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import {
	attr,
	css,
	hAlignElement,
	isArray,
	isNumeric,
	isString,
	kebabCase,
	markOwner,
	position
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin/plugin';
import { Button } from 'jodit/core/ui/button';
import { Popup } from 'jodit/core/ui/popup/popup';
import { openImageEditor } from 'jodit/modules/image-editor/image-editor';
import { FileSelectorWidget } from 'jodit/modules/widget';

import './config';

import { UIImagePropertiesForm } from './ui/ui-image-form';
import { normalSizeFromString, normalSizeToString } from './utils/utils';
import type { ImagePropertiesState } from './interface';

/**
 * Plug-in for image editing window
 *
 * @example
 * ```javascript
 * const editor = Jodit.make('#editor', {
 *     image: {
 *         editSrc: false,
 *         editLink: false
 *     }
 * });
 * ```
 */

/**
 * Show dialog with image's options
 */
export class imageProperties extends Plugin {
	protected state: ImagePropertiesState = {
		image: new Image(),
		sourceImage: new Image(),
		get ratio(): number {
			const { naturalWidth, naturalHeight } = this.sourceImage;
			return naturalWidth / naturalHeight || 1;
		},
		updateTick: 0,
		sizeIsLocked: true,
		marginIsLocked: true,
		values: {
			style: '',
			imageSrc: '',
			borderRadius: 0,
			imageTitle: '',
			imageAlt: '',
			imageLink: '',
			imageLinkOpenInNewTab: false,
			imageWidth: 0,
			imageHeight: 0,
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			classes: '',
			id: '',
			align: ''
		}
	};

	private activeTabState: { activeTab: 'Image' | 'Advanced' } = {
		activeTab: 'Image'
	};

	@cache
	private get form(): UIImagePropertiesForm {
		return new UIImagePropertiesForm(
			this.j,
			this.state,
			this.activeTabState,
			{
				openImageEditor: this.openImageEditor.bind(this),
				openImagePopup: this.openImagePopup.bind(this)
			}
		);
	}

	/**
	 * Dialog for form
	 */
	@cache
	private get dialog(): IDialog {
		const { j } = this;
		const dialog = j.dlg({
			minWidth: Math.min(400, screen.width),
			minHeight: 590,
			buttons: ['fullsize', 'dialog.close']
		});

		const buttons = {
			check: Button(j, 'ok', 'Apply', 'primary'),
			remove: Button(j, 'bin', 'Delete'),
			cancel: Button(j, 'cancel', 'Cancel')
		};

		buttons.check.onAction(() => {
			this.__applyValuesToImage();
			j.synchronizeValues();
			dialog.close();
		});

		buttons.remove.onAction(() => {
			j.s.removeNode(this.state.sourceImage);
			dialog.close();
		});

		buttons.cancel.onAction(() => {
			dialog.close();
		});

		dialog.setHeader(j.i18n('Image properties'));

		dialog.setContent(this.form);

		dialog.setFooter([[buttons.remove, buttons.cancel], buttons.check]);

		j.e.on(dialog, 'afterClose', () => {
			if (
				this.state.image.parentNode &&
				j.o.image.selectImageAfterClose
			) {
				j.s.select(this.state.sourceImage);
			}
		});

		dialog.setSize(j.o.image.dialogWidth);
		markOwner(j, dialog.container);

		return dialog;
	}

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
		this.activeTabState.activeTab = 'Image';

		this.j.e.fire('hidePopup');

		this.dialog.open().setModal(true).setPosition();

		this.__readValuesFromImage();

		return false;
	}

	/**
	 * Open image editor dialog
	 */
	protected openImageEditor(): void {
		const url: string = attr(this.state.image, 'src') || '',
			a = this.j.c.element('a'),
			loadExternal = (): void => {
				if (a.host !== location.host) {
					this.j.confirm(
						'You can only edit your own images. Download this image on the host?',
						yes => {
							if (yes && this.j.uploader) {
								this.j.uploader.uploadRemoteImage(
									a.href.toString(),
									resp => {
										this.j.alert(
											'The image has been successfully uploaded to the host!',
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

													this.state.updateTick++;
												}
											}
										);
									},
									error => {
										this.j.alert(
											'There was an error loading %s',
											error.message
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

						this.state.updateTick++;
					},
					error => {
						this.j.alert(error.message);
					}
				);
			})
			.catch(error => {
				this.j.alert(error.message, loadExternal);
			});
	}

	protected openImagePopup(e: MouseEvent): void {
		const { j } = this;

		const popup = new Popup(this.dialog);

		const closePopup = (): void => {
			popup.close();
			popup.destruct();
		};

		const changeImage = e.target as HTMLElement;

		// popup.setZIndex(/*this.dialog.getZIndex()*/ +1);

		popup
			.setContent(
				FileSelectorWidget(
					j,
					{
						upload: (data: IFileBrowserCallBackData) => {
							if (data.files && data.files.length) {
								this.state.values.imageSrc =
									data.baseurl + data.files[0];
							}

							j.e.fire(this, 'update');
							closePopup();
						},

						filebrowser: async (data: IFileBrowserCallBackData) => {
							if (
								data &&
								isArray(data.files) &&
								data.files.length
							) {
								this.state.values.imageSrc = data.files[0];
								closePopup();
							}
						}
					},
					this.state.image,
					closePopup
				)
			)
			.open(() => position(changeImage));
	}

	/**
	 * Apply form's values to image
	 */
	@autobind
	private __applyValuesToImage(): void {
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
		} = this.state.values;

		const opt = this.j.o;
		const { sourceImage: image } = this.state;

		// styles
		if (opt.image.editStyle) {
			attr(image, 'style', style || null);
		}

		// Src
		if (imageSrc) {
			attr(image, 'src', imageSrc);
		} else {
			Dom.safeRemove(image);
			return;
		}

		// Border radius
		image.style.borderRadius = borderRadius ? borderRadius + 'px' : '';

		// Title
		attr(image, 'title', imageTitle || null);

		// Alt
		attr(image, 'alt', imageAlt || null);

		// Link
		let link = Dom.closest(image, 'a', this.j.editor);

		if (imageLink) {
			if (!link) {
				link = Dom.wrap(image, 'a', this.j.createInside);
			}

			attr(link, 'href', imageLink);
			attr(link, 'target', imageLinkOpenInNewTab ? '_blank' : null);
		} else {
			if (link && link.parentNode) {
				link.parentNode.replaceChild(image, link);
			}
		}

		// Size
		if (
			imageWidth !== image.offsetWidth ||
			imageHeight !== image.offsetHeight
		) {
			const updatedtWidth = imageWidth
				? normalSizeToString(imageWidth)
				: null;

			const updatedHeight = imageHeight
				? normalSizeToString(imageHeight)
				: null;

			css(image, {
				width: updatedtWidth,
				height: updatedHeight
			});

			attr(image, 'width', attr(image, 'width') ? updatedtWidth : null);
			attr(image, 'height', attr(image, 'height') ? updatedHeight : null);
		}

		const margins = [marginTop, marginRight, marginBottom, marginLeft];

		if (opt.image.editMargins) {
			const applyMargin = (key: string, value: number | string): void => {
				const oldValue = css(image, key);
				const v = normalSizeToString(value);
				if (oldValue.toString() !== v.toString()) {
					css(image, key, v);
				}
			};
			if (!this.state.marginIsLocked) {
				const sides = [
					'margin-top',
					'margin-right',
					'margin-bottom',
					'margin-left'
				];
				margins.forEach((margin, index) => {
					const side = sides[index];
					applyMargin(side, margin);
				});
			} else {
				applyMargin('margin', marginTop);
			}
		}

		if (opt.image.editClass) {
			attr(image, 'class', classes || null);
		}

		if (opt.image.editId) {
			attr(image, 'id', id || null);
		}

		if (opt.image.editAlign) {
			hAlignElement(image, align);
		}
	}

	/**
	 * Read values from image and set it to state
	 * @private
	 */
	@watch('state.updateTick')
	private __readValuesFromImage(): void {
		const { sourceImage: image } = this.state;

		// Align
		if (
			image.style.cssFloat &&
			['left', 'right'].indexOf(image.style.cssFloat.toLowerCase()) !== -1
		) {
			this.state.values.align = css(image, 'float') as ImageHAlign;
		} else {
			if (
				(css(image, 'display') as string) === 'block' &&
				image.style.marginLeft === 'auto' &&
				image.style.marginRight === 'auto'
			) {
				this.state.values.align = 'center';
			} else {
				this.state.values.align = '';
			}
		}

		// Border radius
		this.state.values.borderRadius =
			parseInt(image.style.borderRadius || '0', 10) || 0;

		// Id
		this.state.values.id = attr(image, 'id') || '';

		// Title
		this.state.values.imageTitle = attr(image, 'title') || '';

		// Alt
		this.state.values.imageAlt = attr(image, 'alt') || '';

		// Style
		this.state.values.style = attr(image, 'style') || '';

		// Classes
		this.state.values.classes = (attr(image, 'class') || '').replace(
			/jodit_focused_image[\s]*/,
			''
		);

		// Margins
		let equal = true,
			wasEmptyField = false;

		(
			['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const
		).forEach(id => {
			let value: number | string = image.style.getPropertyValue(
				kebabCase(id)
			);

			if (!value) {
				wasEmptyField = true;
				this.state.values[id] = 0;
				return;
			}

			if (/^[0-9]+(px)?$/.test(value)) {
				value = parseInt(value, 10);
			}

			this.state.values[id] = value;

			if (
				(wasEmptyField && this.state.values[id]) ||
				(equal &&
					id !== 'marginTop' &&
					this.state.values[id] !== this.state.values.marginTop)
			) {
				equal = false;
			}
		});

		this.state.marginIsLocked = equal;

		// Image size
		const width =
			attr(image, 'width') || css(image, 'width', true) || false;

		const height =
			attr(image, 'height') || css(image, 'height', true) || false;

		this.state.values.imageWidth =
			width !== false
				? normalSizeFromString(width)
				: image.offsetWidth || image.naturalWidth;

		this.state.values.imageHeight =
			height !== false
				? normalSizeFromString(height)
				: image.offsetHeight || image.naturalHeight;

		this.state.sizeIsLocked = ((): boolean => {
			const { imageWidth, imageHeight } = this.state.values;
			if (!isNumeric(imageWidth) || !isNumeric(imageHeight)) {
				return false;
			}

			const w = parseFloat(imageWidth.toString()),
				h = parseFloat(imageHeight.toString());

			return Math.abs(w - h * this.state.ratio) < 2;
		})();

		// Link
		const a = Dom.closest(this.state.sourceImage, 'a', this.j.editor);

		if (a) {
			this.state.values.imageLink = attr(a, 'href') || '';
			this.state.values.imageLinkOpenInNewTab =
				attr(a, 'target') === '_blank';
		} else {
			this.state.values.imageLink = '';
			this.state.values.imageLinkOpenInNewTab = false;
		}

		// Src
		this.state.values.imageSrc = attr(image, 'src') || '';
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
								if (
									this.j.e.fire('openOnDblClick', image) ===
									false
								) {
									return;
								}

								self.state.sourceImage = image;
								self.state.image = image.cloneNode(
									true
								) as HTMLImageElement;

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
					self.state.sourceImage = image;
					this.state.image = image.cloneNode(
						true
					) as HTMLImageElement;
					this.open();
				}
			);
	}

	/** @override */
	protected beforeDestruct(editor: IJodit): void {
		cached<IDestructible>(this, 'dialog')?.destruct();
		cached<IDestructible>(this, 'form')?.destruct();
		editor.e.off(editor.editor, '.imageproperties').off('.imageproperties');
	}
}

pluginSystem.add('imageProperties', imageProperties);
