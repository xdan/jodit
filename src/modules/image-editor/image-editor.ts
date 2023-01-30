/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/image-editor/README.md]]
 * @packageDocumentation
 * @module modules/image-editor
 */

import './image-editor.less';

import type {
	ImageEditorActionBox,
	IJodit,
	ImageEditorOptions,
	ImageAction,
	IUIButton,
	IDictionary,
	IFileBrowserDataProvider,
	IDialog,
	IViewWithToolbar,
	IDlgs
} from 'jodit/types';
import { Config } from 'jodit/config';
import { ViewComponent } from 'jodit/core/component';
import { $$, attr, call, css, refs, toArray, trim } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { Button } from 'jodit/core/ui/button';
import { form } from './templates/form';
import { component, debounce, throttle, autobind } from 'jodit/core/decorators';
import './config';

interface onSave {
	(
		/**
		 * new filename
		 */
		newname: string | void,

		/*
		 * Bound box for resize and crop operation
		 */
		box: ImageEditorActionBox,

		/**
		 * called after success operation
		 */
		success: () => void,

		/**
		 * called after failed operation
		 */
		failed: (error: Error) => void
	): void;
}

const jie = 'jodit-image-editor';

const TABS = {
	resize: 'resize' as ImageAction,
	crop: 'crop' as ImageAction
};

/**
 * The module allows you to edit the image: resize or cut any part of it
 *
 */
@component
export class ImageEditor extends ViewComponent<IViewWithToolbar & IDlgs> {
	/** @override */
	override className(): string {
		return 'ImageEditor';
	}

	private __resizeUseRatio: boolean = true;
	private __cropUseRatio: boolean = true;

	private readonly __dialog: IDialog;
	private __image!: HTMLImageElement;
	private __cropImage!: HTMLImageElement;
	private __clicked = false;
	private __target!: HTMLElement;

	private __startX: number = 0;
	private __startY: number = 0;
	private __topX: number = 0;
	private __topY: number = 0;

	private __width: number = 0;
	private __height: number = 0;

	private __activeTab: ImageAction = TABS.resize;

	private __naturalWidth: number = 0;
	private __naturalHeight: number = 0;

	private __ratio: number = 0;
	private __newH: number = 0;
	private __newW: number = 0;
	private __diffX: number = 0;
	private __diffY: number = 0;

	private readonly __buttons: IDictionary<IUIButton>;
	private readonly __editor: HTMLElement;
	private readonly __resizeBox: HTMLElement;
	private readonly __cropBox: HTMLElement;

	private __sizes: HTMLElement;

	private readonly __resizeHandler: HTMLElement;
	private readonly __cropHandler: HTMLElement;

	private readonly __cropBoxRect = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	private readonly __resizeBoxRect = {
		w: 0,
		h: 0
	};

	private static __calcValueByPercent = (
		value: number | string,
		percent: string | number
	): number => {
		const percentStr = percent.toString();
		const valueNbr = parseFloat(value.toString());

		let match: string[] | null;

		match = /^[-+]?[0-9]+(px)?$/.exec(percentStr);
		if (match) {
			return parseInt(percentStr, 10);
		}

		match = /^([-+]?[0-9.]+)%$/.exec(percentStr);

		if (match) {
			return Math.round(valueNbr * (parseFloat(match[1]) / 100));
		}

		return valueNbr || 0;
	};

	@autobind
	private __calcCropBox(): void {
		const node = this.__cropBox.parentNode as HTMLElement,
			w = node.offsetWidth * 0.8,
			h = node.offsetHeight * 0.8;

		let wn: number = w,
			hn: number = h;

		const { __naturalWidth: nw, __naturalHeight: nh } = this;

		if (w > nw && h > nh) {
			wn = nw;
			hn = nh;
		} else if (this.__ratio > w / h) {
			wn = w;
			hn = nh * (w / nw);
		} else {
			wn = nw * (h / nh);
			hn = h;
		}

		css(this.__cropBox, {
			width: wn,
			height: hn
		});
	}

	@autobind
	private __showCrop(): void {
		if (!this.__cropImage) {
			return;
		}

		this.__calcCropBox();

		const w =
			this.__cropImage.offsetWidth ||
			this.__image.offsetWidth ||
			this.__image.naturalWidth;

		this.__newW = ImageEditor.__calcValueByPercent(
			w,
			this.o.cropDefaultWidth
		);

		const h =
			this.__cropImage.offsetHeight ||
			this.__image.offsetHeight ||
			this.__image.naturalHeight;

		if (this.__cropUseRatio) {
			this.__newH = this.__newW / this.__ratio;
		} else {
			this.__newH = ImageEditor.__calcValueByPercent(
				h,
				this.o.cropDefaultHeight
			);
		}

		css(this.__cropHandler, {
			backgroundImage: 'url(' + attr(this.__cropImage, 'src') + ')',
			width: this.__newW,
			height: this.__newH,
			left: w / 2 - this.__newW / 2,
			top: h / 2 - this.__newH / 2
		});

		this.j.e.fire(this.__cropHandler, 'updatesize');
	}

	@autobind
	private __updateCropBox(): void {
		if (!this.__cropImage) {
			return;
		}

		const ratioX = this.__cropImage.offsetWidth / this.__naturalWidth,
			ratioY = this.__cropImage.offsetHeight / this.__naturalHeight;

		this.__cropBoxRect.x =
			(css(this.__cropHandler, 'left') as number) / ratioX;
		this.__cropBoxRect.y =
			(css(this.__cropHandler, 'top') as number) / ratioY;
		this.__cropBoxRect.w = this.__cropHandler.offsetWidth / ratioX;
		this.__cropBoxRect.h = this.__cropHandler.offsetHeight / ratioY;

		this.__sizes.textContent =
			this.__cropBoxRect.w.toFixed(0) +
			'x' +
			this.__cropBoxRect.h.toFixed(0);
	}

	@autobind
	private __updateResizeBox(): void {
		this.__resizeBoxRect.w =
			this.__image.offsetWidth || this.__naturalWidth;
		this.__resizeBoxRect.h =
			this.__image.offsetHeight || this.__naturalHeight;
	}

	@autobind
	private __setHandlers(): void {
		const self: ImageEditor = this;

		const { widthInput, heightInput } = refs<HTMLInputElement>(
			this.__editor
		);

		self.j.e
			.on(
				[
					self.__editor.querySelector('.jodit_bottomright'),
					self.__cropHandler
				],
				`mousedown.${jie}`,
				this.__onResizeHandleMouseDown
			)

			.on(this.j.ow, `resize.${jie}`, () => {
				this.j.e.fire(self.__resizeHandler, 'updatesize');
				self.__showCrop();
				this.j.e.fire(self.__cropHandler, 'updatesize');
			});

		self.j.e
			.on(
				toArray(
					this.__editor.querySelectorAll(`.${jie}__slider-title`)
				),
				'click',
				this.__onTitleModeClick
			)
			.on([widthInput, heightInput], 'input', this.__onChangeSizeInput);

		const { keepAspectRatioResize, keepAspectRatioCrop } =
			refs<HTMLInputElement>(this.__editor);

		if (keepAspectRatioResize) {
			keepAspectRatioResize.addEventListener('change', () => {
				this.__resizeUseRatio = keepAspectRatioResize.checked;
			});
		}

		if (keepAspectRatioCrop) {
			keepAspectRatioCrop.addEventListener('change', () => {
				this.__cropUseRatio = keepAspectRatioCrop.checked;
			});
		}

		self.j.e
			.on(self.__resizeHandler, 'updatesize', () => {
				css(self.__resizeHandler, {
					top: 0,
					left: 0,
					width: self.__image.offsetWidth || self.__naturalWidth,
					height: self.__image.offsetHeight || self.__naturalHeight
				});

				this.__updateResizeBox();
			})
			.on(self.__cropHandler, 'updatesize', () => {
				if (!self.__cropImage) {
					return;
				}

				let new_x = css(self.__cropHandler, 'left') as number,
					new_y = css(self.__cropHandler, 'top') as number,
					new_width = self.__cropHandler.offsetWidth,
					new_height = self.__cropHandler.offsetHeight;

				if (new_x < 0) {
					new_x = 0;
				}

				if (new_y < 0) {
					new_y = 0;
				}

				if (new_x + new_width > self.__cropImage.offsetWidth) {
					new_width = self.__cropImage.offsetWidth - new_x;

					if (self.__cropUseRatio) {
						new_height = new_width / self.__ratio;
					}
				}

				if (new_y + new_height > self.__cropImage.offsetHeight) {
					new_height = self.__cropImage.offsetHeight - new_y;

					if (self.__cropUseRatio) {
						new_width = new_height * self.__ratio;
					}
				}

				css(self.__cropHandler, {
					width: new_width,
					height: new_height,
					left: new_x,
					top: new_y,
					backgroundPosition:
						-new_x - 1 + 'px ' + (-new_y - 1) + 'px',
					backgroundSize:
						self.__cropImage.offsetWidth +
						'px ' +
						self.__cropImage.offsetHeight +
						'px'
				});

				self.__updateCropBox();
			});

		Object.values(self.__buttons).forEach(button => {
			button.onAction(() => {
				const data = {
					action: self.__activeTab,
					box:
						self.__activeTab === TABS.resize
							? self.__resizeBoxRect
							: self.__cropBoxRect
				} as ImageEditorActionBox;

				switch (button) {
					case self.__buttons.saveas:
						self.j.prompt(
							'Enter new name',
							'Save in new file',
							(name: string): false | void => {
								if (!trim(name)) {
									self.j.alert(
										'The name should not be empty'
									);

									return false;
								}

								self.onSave(
									name,
									data,
									self.hide,
									(e: Error) => {
										self.j.alert(e.message);
									}
								);
							}
						);
						break;

					case self.__buttons.save:
						self.onSave(undefined, data, self.hide, (e: Error) => {
							self.j.alert(e.message);
						});
						break;

					case self.__buttons.reset:
						if (self.__activeTab === TABS.resize) {
							css(self.__image, {
								width: null,
								height: null
							});

							widthInput.value = self.__naturalWidth.toString();
							heightInput.value = self.__naturalHeight.toString();

							self.j.e.fire(self.__resizeHandler, 'updatesize');
						} else {
							self.__showCrop();
						}

						break;
				}
			});
		});
	}

	@autobind
	private __onTitleModeClick(e: MouseEvent): void {
		const self = this,
			title = e.target as HTMLElement;

		const slide = title?.parentElement;

		if (!slide) {
			return;
		}

		$$(`.${jie}__slider,.${jie}__area`, self.__editor).forEach(elm =>
			elm.classList.remove(`${jie}_active`)
		);

		slide.classList.add(`${jie}_active`);
		this.__activeTab = (attr(slide, '-area') as ImageAction) || TABS.resize;

		const tab = self.__editor.querySelector(
			`.${jie}__area.${jie}__area_` + self.__activeTab
		);

		if (tab) {
			tab.classList.add(`${jie}_active`);
		}

		if (self.__activeTab === TABS.crop) {
			self.__showCrop();
		}
	}

	@debounce()
	@autobind
	private __onChangeSizeInput(e: MouseEvent): void {
		const self = this,
			input = e.target as HTMLInputElement,
			{ widthInput, heightInput } = refs<HTMLInputElement>(this.__editor),
			isWidth = attr(input, 'data-ref') === 'widthInput',
			x = parseInt(input.value, 10),
			minX = isWidth ? self.o.min_width : self.o.min_height,
			minY = !isWidth ? self.o.min_width : self.o.min_height;

		let y: number;

		if (x > minX) {
			css(self.__image, isWidth ? 'width' : 'height', x);

			if (self.__resizeUseRatio) {
				y = isWidth
					? Math.round(x / self.__ratio)
					: Math.round(x * self.__ratio);

				if (y > minY) {
					css(self.__image, !isWidth ? 'width' : 'height', y);

					if (isWidth) {
						heightInput.value = y.toString();
					} else {
						widthInput.value = y.toString();
					}
				}
			}
		}

		this.j.e.fire(self.__resizeHandler, 'updatesize');
	}

	@autobind
	private __onResizeHandleMouseDown(e: MouseEvent): void {
		const self = this;

		self.__target = e.target as HTMLElement;

		e.preventDefault();
		e.stopImmediatePropagation();

		self.__clicked = true;

		self.__startX = e.clientX;
		self.__startY = e.clientY;

		if (self.__activeTab === TABS.crop) {
			self.__topX = css(self.__cropHandler, 'left') as number;
			self.__topY = css(self.__cropHandler, 'top') as number;
			self.__width = self.__cropHandler.offsetWidth;
			self.__height = self.__cropHandler.offsetHeight;
		} else {
			self.__width = self.__image.offsetWidth;
			self.__height = self.__image.offsetHeight;
		}

		self.j.e
			.on(this.j.ow, 'mousemove', this.__onGlobalMouseMove)
			.one(this.j.ow, 'mouseup', this.__onGlobalMouseUp);
	}

	@autobind
	private __onGlobalMouseUp(e: MouseEvent): void {
		if (this.__clicked) {
			this.__clicked = false;
			e.stopImmediatePropagation();

			this.j.e.off(this.j.ow, 'mousemove', this.__onGlobalMouseMove);
		}
	}

	@throttle(10)
	private __onGlobalMouseMove(e: MouseEvent): void {
		const self = this;
		if (!self.__clicked) {
			return;
		}
		const { widthInput, heightInput } = refs<HTMLInputElement>(
			this.__editor
		);

		self.__diffX = e.clientX - self.__startX;
		self.__diffY = e.clientY - self.__startY;

		if (
			(self.__activeTab === TABS.resize && self.__resizeUseRatio) ||
			(self.__activeTab === TABS.crop && self.__cropUseRatio)
		) {
			if (self.__diffX) {
				self.__newW = self.__width + self.__diffX;
				self.__newH = Math.round(self.__newW / self.__ratio);
			} else {
				self.__newH = self.__height + self.__diffY;
				self.__newW = Math.round(self.__newH * self.__ratio);
			}
		} else {
			self.__newW = self.__width + self.__diffX;
			self.__newH = self.__height + self.__diffY;
		}

		if (self.__activeTab === TABS.resize) {
			if (self.__newW > self.o.resizeMinWidth) {
				css(self.__image, 'width', self.__newW + 'px');
				widthInput.value = self.__newW.toString();
			}

			if (self.__newH > self.o.resizeMinHeight) {
				css(self.__image, 'height', self.__newH + 'px');
				heightInput.value = self.__newH.toString();
			}

			this.j.e.fire(self.__resizeHandler, 'updatesize');
		} else {
			if (self.__target !== self.__cropHandler) {
				if (self.__topX + self.__newW > self.__cropImage.offsetWidth) {
					self.__newW = self.__cropImage.offsetWidth - self.__topX;
				}
				if (self.__topY + self.__newH > self.__cropImage.offsetHeight) {
					self.__newH = self.__cropImage.offsetHeight - self.__topY;
				}
				css(self.__cropHandler, {
					width: self.__newW,
					height: self.__newH
				});
			} else {
				if (
					self.__topX +
						self.__diffX +
						self.__cropHandler.offsetWidth >
					self.__cropImage.offsetWidth
				) {
					self.__diffX =
						self.__cropImage.offsetWidth -
						self.__topX -
						self.__cropHandler.offsetWidth;
				}

				css(self.__cropHandler, 'left', self.__topX + self.__diffX);

				if (
					self.__topY +
						self.__diffY +
						self.__cropHandler.offsetHeight >
					self.__cropImage.offsetHeight
				) {
					self.__diffY =
						self.__cropImage.offsetHeight -
						self.__topY -
						self.__cropHandler.offsetHeight;
				}
				css(self.__cropHandler, 'top', self.__topY + self.__diffY);
			}
			this.j.e.fire(self.__cropHandler, 'updatesize');
		}
	}

	options: ImageEditorOptions;
	get o(): this['options'] {
		return this.options;
	}

	onSave!: (
		name: void | string,
		data: ImageEditorActionBox,
		hide: () => void,
		failed: (e: Error) => void
	) => void;

	/**
	 * Hide image editor
	 */
	@autobind
	hide(): void {
		this.__dialog.close();
	}

	/**
	 * Open image editor
	 * @example
	 * ```javascript
	 * var jodit = Jodit.make('.editor', {
	 *		 imageeditor: {
	 *				 crop: false,
	 *				 closeAfterSave: true,
	 *				 width: 500
	 *		 }
	 * });
	 * jodit.imageeditor.open('http://xdsoft.net/jodit/images/test.png', function (name, data, success, failed) {
	 *		 var img = jodit.node.c('img');
	 *		 img.setAttribute('src', 'http://xdsoft.net/jodit/images/test.png');
	 *		 if (box.action !== 'resize') {
	 *					return failed('Sorry it is work only in resize mode. For croping use FileBrowser');
	 *		 }
	 *		 img.style.width = data.w;
	 *		 img.style.height = data.h;
	 *		 jodit.s.insertNode(img);
	 *		 success();
	 * });
	 * ```
	 */
	@autobind
	open(url: string, save: onSave): Promise<IDialog> {
		return this.j.async.promise<IDialog>((resolve: Function): void => {
			const timestamp = new Date().getTime();

			this.__image = this.j.c.element('img');

			$$('img,.jodit-icon_loader', this.__resizeBox).forEach(
				Dom.safeRemove
			);

			$$('img,.jodit-icon_loader', this.__cropBox).forEach(
				Dom.safeRemove
			);

			css(this.__cropHandler, 'background', 'transparent');

			this.onSave = save;

			this.__resizeBox.appendChild(
				this.j.c.element('i', { class: 'jodit-icon_loader' })
			);

			this.__cropBox.appendChild(
				this.j.c.element('i', { class: 'jodit-icon_loader' })
			);

			if (/\?/.test(url)) {
				url += '&_tst=' + timestamp;
			} else {
				url += '?_tst=' + timestamp;
			}

			this.__image.setAttribute('src', url);

			this.__dialog.open();

			const { widthInput, heightInput } = refs<HTMLInputElement>(
				this.__editor
			);

			const onload = (): void => {
				if (this.isDestructed) {
					return;
				}

				this.__image.removeEventListener('load', onload);
				this.__naturalWidth = this.__image.naturalWidth;
				this.__naturalHeight = this.__image.naturalHeight;

				widthInput.value = this.__naturalWidth.toString();
				heightInput.value = this.__naturalHeight.toString();

				this.__ratio = this.__naturalWidth / this.__naturalHeight;

				this.__resizeBox.appendChild(this.__image);

				this.__cropImage = this.__image.cloneNode(
					true
				) as HTMLImageElement;

				this.__cropBox.appendChild(this.__cropImage);

				Dom.safeRemove.apply(
					null,
					$$('.jodit-icon_loader', this.__editor)
				);

				if (this.__activeTab === TABS.crop) {
					this.__showCrop();
				}

				this.j.e.fire(this.__resizeHandler, 'updatesize');
				this.j.e.fire(this.__cropHandler, 'updatesize');

				this.__dialog.setPosition();

				this.j.e.fire('afterImageEditor');

				resolve(this.__dialog);
			};

			this.__image.addEventListener('load', onload);

			if (this.__image.complete) {
				onload();
			}
		});
	}

	constructor(editor: IViewWithToolbar & IDlgs) {
		super(editor);

		this.options =
			editor && (editor as IJodit).o && (editor as IJodit).o.imageeditor
				? (editor as IJodit).o.imageeditor
				: Config.defaultOptions.imageeditor;

		const o = this.options;

		this.__resizeUseRatio = o.resizeUseRatio;
		this.__cropUseRatio = o.cropUseRatio;

		this.__buttons = {
			reset: Button(this.j, 'update', 'Reset'),
			save: Button(this.j, 'save', 'Save'),
			saveas: Button(this.j, 'save', 'Save as ...')
		};

		this.__activeTab = o.resize ? TABS.resize : TABS.crop;

		this.__editor = form(this.j, this.options);

		const { resizeBox, cropBox } = refs<HTMLInputElement>(this.__editor);

		this.__resizeBox = resizeBox;
		this.__cropBox = cropBox;

		this.__sizes = this.__editor.querySelector(
			`.${jie}__area.${jie}__area_crop .jodit-image-editor__sizes`
		) as HTMLElement;

		this.__resizeHandler = this.__editor.querySelector(
			`.${jie}__resizer`
		) as HTMLElement;

		this.__cropHandler = this.__editor.querySelector(
			`.${jie}__croper`
		) as HTMLElement;

		this.__dialog = this.j.dlg({
			buttons: ['fullsize', 'dialog.close']
		});

		this.__dialog.setContent(this.__editor);

		this.__dialog.setSize(this.o.width, this.o.height);
		this.__dialog.setHeader([
			this.__buttons.reset,
			this.__buttons.save,
			this.__buttons.saveas
		]);

		this.__setHandlers();
	}

	/** @override */
	override destruct(): any {
		if (this.isDestructed) {
			return;
		}

		if (this.__dialog && !this.__dialog.isInDestruct) {
			this.__dialog.destruct();
		}

		Dom.safeRemove(this.__editor);

		if (this.j.e) {
			this.j.e
				.off(this.j.ow, 'mousemove', this.__onGlobalMouseMove)
				.off(this.j.ow, 'mouseup', this.__onGlobalMouseUp)
				.off(this.ow, `.${jie}`)
				.off(`.${jie}`);
		}

		super.destruct();
	}
}

/**
 * Open Image Editor
 */
export function openImageEditor(
	this: IViewWithToolbar & { dataProvider: IFileBrowserDataProvider },
	href: string,
	name: string,
	path: string,
	source: string,
	onSuccess?: () => void,
	onFailed?: (error: Error) => void
): Promise<IDialog> {
	return this.getInstance<ImageEditor>('ImageEditor', this.o).open(
		href,
		(
			newname: string | void,
			box: ImageEditorActionBox,
			success: () => void,
			failed: (error: Error) => void
		) =>
			call(
				box.action === 'resize'
					? this.dataProvider.resize
					: this.dataProvider.crop,
				path,
				source,
				name,
				newname,
				box.box
			)
				.then(ok => {
					if (ok) {
						success();

						if (onSuccess) {
							onSuccess();
						}
					}
				})
				.catch(error => {
					failed(error);

					if (onFailed) {
						onFailed(error);
					}
				})
	);
}
