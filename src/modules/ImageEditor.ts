/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import {
	ImageEditorActionBox,
	IJodit,
	ImageEditorOptions,
	ImageAction
} from '../types';
import { IViewBased } from '../types/view';
import { Component } from './Component';
import { Alert, Dialog, Prompt } from './dialog/';
import { $$, css, trim } from './helpers/';
import { ToolbarIcon } from './toolbar/icon';
import { Dom } from './Dom';

declare module '../Config' {
	interface Config {
		imageeditor: ImageEditorOptions;
	}
}

Config.prototype.imageeditor = {
	min_width: 20,
	min_height: 20,
	/**
	 * @property{boolean} imageeditor.closeAfterSave=false Close editor after save image
	 */
	closeAfterSave: false,

	/**
	 * @property{string|int} imageeditor.width=85% Default dialog width by screen
	 */
	width: '85%',

	/**
	 * @property{string|int} imageeditor.height=85% Default dialog height by screen
	 */
	height: '85%',

	/**
	 * @property{boolean} imageeditor.crop=true Show tab cropping
	 */
	crop: true,

	/**
	 * @property{boolean} imageeditor.resize=true Show tab resizing
	 */
	resize: true,

	/**
	 * @property{boolean} imageeditor.resizeUseRatio=true Keep aspect ratio on resize
	 */
	resizeUseRatio: true,

	/**
	 * @property{int} imageeditor.resizeMinWidth=20 minimal width on resize
	 */
	resizeMinWidth: 20,

	/**
	 * @property{boolean} imageeditor.resizeMinHeight=20 minimal height on resize
	 */
	resizeMinHeight: 20,

	/**
	 * @property{boolean} imageeditor.cropUseRatio=true Keep aspect ratio on crop
	 */
	cropUseRatio: true,

	/**
	 * @property{string} imageeditor.cropDefaultWidth=70% In the tab, crop the image is displayed not in real size.
	 * Boxing default size for it
	 * @property{string} imageeditor.cropDefaultHeight=70%
	 */
	cropDefaultWidth: '70%',
	cropDefaultHeight: '70%'
};

const jie = 'jodit_image_editor';
const gi = ToolbarIcon.getIcon.bind(ToolbarIcon);

/**
 * The module allows you toWYSIWYG edit the image: resize or cut any part of it
 *
 */
export class ImageEditor extends Component {
	private resizeUseRatio: boolean = true;
	private cropUseRatio: boolean = true;

	private dialog: Dialog;
	private image!: HTMLImageElement;
	private cropImage!: HTMLImageElement;
	private clicked = false;
	private target!: HTMLElement;

	private start_x: number = 0;
	private start_y: number = 0;
	private top_x: number = 0;
	private top_y: number = 0;

	private width: number = 0;
	private height: number = 0;

	private activeTab: ImageAction = 'resize';

	private naturalWidth: number = 0;
	private naturalHeight: number = 0;

	private ratio: number = 0;
	private new_h: number = 0;
	private new_w: number = 0;
	private diff_x: number = 0;
	private diff_y: number = 0;

	private buttons: HTMLElement[];

	private editor: HTMLElement;

	private widthInput: HTMLInputElement;
	private heightInput: HTMLInputElement;

	private resize_box: HTMLElement;
	private crop_box: HTMLElement;
	private sizes: HTMLElement;

	private resizeHandler: HTMLElement;
	private cropHandler: HTMLElement;

	private cropBox = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	private resizeBox = {
		w: 0,
		h: 0
	};

	private calcValueByPercent = (
		value: number | string,
		percent: string | number
	): number => {
		const percentStr: string = percent.toString();
		const valueNbr: number = parseFloat(value.toString());
		let match: string[] | null;

		match = /^[\-+]?[0-9]+(px)?$/.exec(percentStr);
		if (match) {
			return parseInt(percentStr, 10);
		}

		match = /^([\-+]?[0-9.]+)%$/.exec(percentStr);

		if (match) {
			return Math.round(valueNbr * (parseFloat(match[1]) / 100));
		}

		return valueNbr || 0;
	};

	private calcCropBox = () => {
		const w = (this.crop_box.parentNode as HTMLElement).offsetWidth * 0.8,
			h = (this.crop_box.parentNode as HTMLElement).offsetHeight * 0.8;
		let wn: number = w,
			hn: number = h;

		if (w > this.naturalWidth && h > this.naturalHeight) {
			wn = this.naturalWidth;
			hn = this.naturalHeight;
		} else if (this.ratio > w / h) {
			wn = w;
			hn = this.naturalHeight * (w / this.naturalWidth);
		} else {
			wn = this.naturalWidth * (h / this.naturalHeight);
			hn = h;
		}

		css(this.crop_box, {
			width: wn,
			height: hn
		});
	};
	private showCrop = () => {
		if (!this.cropImage) {
			return;
		}

		this.calcCropBox();

		const w =
			this.cropImage.offsetWidth ||
			this.image.offsetWidth ||
			this.image.naturalWidth;

		this.new_w = this.calcValueByPercent(w, this.options.cropDefaultWidth);

		const h =
			this.cropImage.offsetHeight ||
			this.image.offsetHeight ||
			this.image.naturalHeight;

		if (this.cropUseRatio) {
			this.new_h = this.new_w / this.ratio;
		} else {
			this.new_h = this.calcValueByPercent(
				h,
				this.options.cropDefaultHeight
			);
		}

		css(this.cropHandler, {
			backgroundImage: 'url(' + this.cropImage.getAttribute('src') + ')',
			width: this.new_w,
			height: this.new_h,
			left: w / 2 - this.new_w / 2,
			top: h / 2 - this.new_h / 2
		});

		this.jodit.events.fire(this.cropHandler, 'updatesize');
	};

	private updateCropBox = () => {
		if (!this.cropImage) {
			return;
		}

		const ratioX = this.cropImage.offsetWidth / this.naturalWidth,
			ratioY = this.cropImage.offsetHeight / this.naturalHeight;

		this.cropBox.x = (css(this.cropHandler, 'left') as number) / ratioX;
		this.cropBox.y = (css(this.cropHandler, 'top') as number) / ratioY;
		this.cropBox.w = this.cropHandler.offsetWidth / ratioX;
		this.cropBox.h = this.cropHandler.offsetHeight / ratioY;

		this.sizes.textContent =
			this.cropBox.w.toFixed(0) + 'x' + this.cropBox.h.toFixed(0);
	};

	private updateResizeBox = () => {
		this.resizeBox.w = this.image.offsetWidth || this.naturalWidth;
		this.resizeBox.h = this.image.offsetHeight || this.naturalHeight;
	};

	private setHandlers = () => {
		const self: ImageEditor = this;
		self.jodit.events
			.on(
				[
					self.editor.querySelector('.jodit_bottomright'),
					self.cropHandler
				] as HTMLElement[],
				`mousedown.${jie}`,
				(e: MouseEvent) => {
					self.target = e.target as HTMLElement;

					e.preventDefault();
					e.stopImmediatePropagation();

					self.clicked = true;

					self.start_x = e.clientX;
					self.start_y = e.clientY;

					if (self.activeTab === 'crop') {
						self.top_x = css(self.cropHandler, 'left') as number;
						self.top_y = css(self.cropHandler, 'top') as number;
						self.width = self.cropHandler.offsetWidth;
						self.height = self.cropHandler.offsetHeight;
					} else {
						self.width = self.image.offsetWidth;
						self.height = self.image.offsetHeight;
					}
				}
			)
			.off(this.jodit.ownerWindow, `.${jie}` + self.jodit.id)
			.on(
				this.jodit.ownerWindow,
				`mousemove.${jie}` + self.jodit.id,
				this.jodit.async.throttle((e: MouseEvent) => {
					if (self.clicked) {
						self.diff_x = e.clientX - self.start_x;
						self.diff_y = e.clientY - self.start_y;

						if (
							(self.activeTab === 'resize' &&
								self.resizeUseRatio) ||
							(self.activeTab === 'crop' && self.cropUseRatio)
						) {
							if (self.diff_x) {
								self.new_w = self.width + self.diff_x;
								self.new_h = Math.round(
									self.new_w / self.ratio
								);
							} else {
								self.new_h = self.height + self.diff_y;
								self.new_w = Math.round(
									self.new_h * self.ratio
								);
							}
						} else {
							self.new_w = self.width + self.diff_x;
							self.new_h = self.height + self.diff_y;
						}

						if (self.activeTab === 'resize') {
							if (self.new_w > self.options.resizeMinWidth) {
								css(self.image, 'width', self.new_w + 'px');
								self.widthInput.value = self.new_w.toString();
							}

							if (self.new_h > self.options.resizeMinHeight) {
								css(self.image, 'height', self.new_h + 'px');
								self.heightInput.value = self.new_h.toString();
							}

							this.jodit.events.fire(
								self.resizeHandler,
								'updatesize'
							);
						} else {
							if (self.target !== self.cropHandler) {
								if (
									self.top_x + self.new_w >
									self.cropImage.offsetWidth
								) {
									self.new_w =
										self.cropImage.offsetWidth - self.top_x;
								}
								if (
									self.top_y + self.new_h >
									self.cropImage.offsetHeight
								) {
									self.new_h =
										self.cropImage.offsetHeight -
										self.top_y;
								}
								css(self.cropHandler, {
									width: self.new_w,
									height: self.new_h
								});
							} else {
								if (
									self.top_x +
										self.diff_x +
										self.cropHandler.offsetWidth >
									self.cropImage.offsetWidth
								) {
									self.diff_x =
										self.cropImage.offsetWidth -
										self.top_x -
										self.cropHandler.offsetWidth;
								}
								css(
									self.cropHandler,
									'left',
									self.top_x + self.diff_x
								);
								if (
									self.top_y +
										self.diff_y +
										self.cropHandler.offsetHeight >
									self.cropImage.offsetHeight
								) {
									self.diff_y =
										self.cropImage.offsetHeight -
										self.top_y -
										self.cropHandler.offsetHeight;
								}
								css(
									self.cropHandler,
									'top',
									self.top_y + self.diff_y
								);
							}
							this.jodit.events.fire(
								self.cropHandler,
								'updatesize'
							);
						}

						e.stopImmediatePropagation();
					}
				}, 5)
			)

			.on(this.jodit.ownerWindow, `resize.${jie}` + self.jodit.id, () => {
				this.jodit.events.fire(self.resizeHandler, 'updatesize');
				self.showCrop();
				this.jodit.events.fire(self.cropHandler, 'updatesize');
			})

			.on(
				this.jodit.ownerWindow,
				`mouseup.${jie} ${self.jodit.id} keydown.${jie}` +
					self.jodit.id,
				(e: MouseEvent) => {
					if (self.clicked) {
						self.clicked = false;
						e.stopImmediatePropagation();
					}
				}
			);

		// btn group

		$$('.jodit_button_group', self.editor).forEach(group => {
			const input = group.querySelector('input') as HTMLInputElement;
			self.jodit.events.on(
				group,
				'click change',
				function(this: HTMLButtonElement) {
					input.checked = !input.checked;
					self.jodit.events.fire(input, 'change');
				},
				'button'
			);
		});

		self.jodit.events
			.on(
				this.editor,
				'click.' + jie,
				function(this: HTMLElement) {
					$$(
						`.${jie}_slider,.${jie}_area`,
						self.editor
					).forEach(elm => elm.classList.remove('active'));

					const slide = this.parentNode as HTMLElement;

					slide.classList.add('active');
					self.activeTab =
						<ImageAction>slide.getAttribute('data-area') ||
						'resize';

					const tab: HTMLDivElement | null = self.editor.querySelector(
						`.${jie}_area.${jie}_area_` + self.activeTab
					);
					if (tab) {
						tab.classList.add('active');
					}

					if (self.activeTab === 'crop') {
						self.showCrop();
					}
				},
				`.${jie}_slider-title`
			)
			.on(
				self.widthInput,
				`change.${jie} mousedown.${jie} keydown.${jie}`,
				self.jodit.async.debounce(() => {
					const value: number = parseInt(self.widthInput.value, 10);
					let another: number;
					if (value > self.options.min_width) {
						css(self.image, 'width', value + 'px');

						if (self.resizeUseRatio) {
							another = Math.round(value / self.ratio);
							if (another > self.options.min_height) {
								css(self.image, 'height', another + 'px');
								self.heightInput.value = another.toString();
							}
						}
					}
					this.jodit.events.fire(self.resizeHandler, 'updatesize');
				}, 200)
			)
			.on(
				self.heightInput,
				`change.${jie} mousedown.${jie} keydown.${jie}`,
				self.jodit.async.debounce(() => {
					if (this.isDestructed) {
						return;
					}

					const value: number = parseInt(self.heightInput.value, 10);
					let another: number;
					if (value > self.options.min_height) {
						css(self.image, 'height', value + 'px');

						if (self.resizeUseRatio) {
							another = Math.round(value * self.ratio);

							if (another > self.options.min_width) {
								css(self.image, 'width', another + 'px');
								self.widthInput.value = another.toString();
							}
						}
					}
					this.jodit.events.fire(self.resizeHandler, 'updatesize');
				}, 200)
			);

		const rationResizeButton: HTMLInputElement | null = self.editor.querySelector(
			`.${jie}_keep_spect_ratio`
		);
		if (rationResizeButton) {
			rationResizeButton.addEventListener('change', () => {
				this.resizeUseRatio = rationResizeButton.checked;
			});
		}

		// use ratio
		const rationCropButton: HTMLInputElement | null = self.editor.querySelector(
			`.${jie}_keep_spect_ratio_crop`
		);

		if (rationCropButton) {
			rationCropButton.addEventListener('change', () => {
				this.cropUseRatio = rationCropButton.checked;
			});
		}

		self.jodit.events
			.on(self.resizeHandler, 'updatesize', () => {
				css(self.resizeHandler, {
					top: 0,
					left: 0,
					width: (self.image.offsetWidth || self.naturalWidth) + 'px',
					height:
						(self.image.offsetHeight || self.naturalHeight) + 'px'
				});

				this.updateResizeBox();
			})
			.on(self.cropHandler, 'updatesize', () => {
				if (!self.cropImage) {
					return;
				}

				let new_x = css(self.cropHandler, 'left') as number,
					new_y = css(self.cropHandler, 'top') as number,
					new_width = self.cropHandler.offsetWidth,
					new_height = self.cropHandler.offsetHeight;

				if (new_x < 0) {
					new_x = 0;
				}

				if (new_y < 0) {
					new_y = 0;
				}

				if (new_x + new_width > self.cropImage.offsetWidth) {
					new_width = self.cropImage.offsetWidth - new_x;

					if (self.cropUseRatio) {
						new_height = new_width / self.ratio;
					}
				}

				if (new_y + new_height > self.cropImage.offsetHeight) {
					new_height = self.cropImage.offsetHeight - new_y;

					if (self.cropUseRatio) {
						new_width = new_height * self.ratio;
					}
				}

				css(self.cropHandler, {
					width: new_width,
					height: new_height,
					left: new_x,
					top: new_y,
					backgroundPosition:
						-new_x - 1 + 'px ' + (-new_y - 1) + 'px',
					backgroundSize:
						self.cropImage.offsetWidth +
						'px ' +
						self.cropImage.offsetHeight +
						'px'
				});

				self.updateCropBox();
			});

		self.buttons.forEach(button => {
			button.addEventListener('mousedown', e => {
				e.stopImmediatePropagation();
			});
			button.addEventListener('click', () => {
				const data = {
					action: self.activeTab,
					box:
						self.activeTab === 'resize'
							? self.resizeBox
							: self.cropBox
				} as ImageEditorActionBox;

				switch (button.getAttribute('data-action')) {
					case 'saveas':
						Prompt(
							self.jodit.i18n('Enter new name'),
							self.jodit.i18n('Save in new file'),
							(name: string): false | void => {
								if (!trim(name)) {
									Alert(
										self.jodit.i18n(
											'The name should not be empty'
										)
									);
									return false;
								}
								self.onSave(
									name,
									data,
									self.hide,
									(e: Error) => {
										Alert(e.message);
									}
								);
							}
						);
						break;
					case 'save':
						self.onSave(undefined, data, self.hide, (e: Error) => {
							Alert(e.message);
						});
						break;
					case 'reset':
						if (self.activeTab === 'resize') {
							css(self.image, {
								width: null,
								height: null
							});
							self.widthInput.value = self.naturalWidth.toString();
							self.heightInput.value = self.naturalHeight.toString();
							self.jodit.events.fire(
								self.resizeHandler,
								'updatesize'
							);
						} else {
							self.showCrop();
						}
						break;
				}
			});
		});
	};

	options: ImageEditorOptions;

	onSave!: (
		name: void | string,
		data: ImageEditorActionBox,
		hide: () => void,
		failed: (e: Error) => void
	) => void;

	/**
	 * Hide image editor
	 *
	 * @method hide
	 */
	hide = () => {
		this.dialog.close();
	};

	/**
	 * Open image editor
	 *
	 * @method open
	 * @param {string} url
	 * @param {function} save
	 * @param {string} [save.name] new filename
	 * @param {object} save.data Bound box for resize and crop operation
	 * @param {string} save.data.action resize or crop
	 * @param {object} save.data.box Bound box
	 * @param {function} save.success called after success operation
	 * @param {function} save.failed called after failed operation
	 * @example
	 * ```javascript
	 * var jodit = new Jodit('.editor', {
	 *		 imageeditor: {
	 *				 crop: false,
	 *				 closeAfterSave: true,
	 *				 width: 500
	 *		 }
	 * });
	 * jodit.imageeditor.open('http://xdsoft.net/jodit/images/test.png', function (name, data, success, failed) {
	 *		 var img = jodit.node.create('img');
	 *		 img.setAttribute('src', 'http://xdsoft.net/jodit/images/test.png');
	 *		 if (box.action !== 'resize') {
	 *					return failed('Sorry it is work only in resize mode. For croping use FileBrowser');
	 *		 }
	 *		 img.style.width = data.w;
	 *		 img.style.height = data.h;
	 *		 jodit.selection.insertNode(img);
	 *		 success();
	 * });
	 * ```
	 */
	open = (
		url: string,
		save: (
			newname: string | void,
			box: ImageEditorActionBox,
			success: () => void,
			failed: (error: Error) => void
		) => void
	): Promise<Dialog> => {
		return this.jodit.async.promise<Dialog>(resolve => {
			const timestamp = new Date().getTime();

			this.image = this.jodit.create.element('img');

			$$('img,.jodit_icon-loader', this.resize_box).forEach(
				Dom.safeRemove
			);

			$$('img,.jodit_icon-loader', this.crop_box).forEach(Dom.safeRemove);

			css(this.cropHandler, 'background', 'transparent');

			this.onSave = save;

			this.resize_box.appendChild(
				this.jodit.create.element('i', { class: 'jodit_icon-loader' })
			);

			this.crop_box.appendChild(
				this.jodit.create.element('i', { class: 'jodit_icon-loader' })
			);

			if (/\?/.test(url)) {
				url += '&_tst=' + timestamp;
			} else {
				url += '?_tst=' + timestamp;
			}

			this.image.setAttribute('src', url);

			this.dialog.open();

			const onload = () => {
				if (this.isDestructed) {
					return;
				}

				this.image.removeEventListener('load', onload);
				this.naturalWidth = this.image.naturalWidth;
				this.naturalHeight = this.image.naturalHeight;

				this.widthInput.value = this.naturalWidth.toString();
				this.heightInput.value = this.naturalHeight.toString();

				this.ratio = this.naturalWidth / this.naturalHeight;

				this.resize_box.appendChild(this.image);

				this.cropImage = this.image.cloneNode(true) as HTMLImageElement;

				this.crop_box.appendChild(this.cropImage);

				$$('.jodit_icon-loader', this.editor).forEach(Dom.safeRemove);

				if (this.activeTab === 'crop') {
					this.showCrop();
				}

				this.jodit.events.fire(this.resizeHandler, 'updatesize');
				this.jodit.events.fire(this.cropHandler, 'updatesize');

				this.dialog.setPosition();
				this.jodit.events.fire('afterImageEditor');

				resolve(this.dialog);
			};

			this.image.addEventListener('load', onload);

			if (this.image.complete) {
				onload();
			}
		});
	};

	constructor(editor: IViewBased) {
		super(editor);

		this.options =
			editor && (editor as IJodit).options
				? (editor as IJodit).options.imageeditor
				: Config.defaultOptions.imageeditor;

		const o = this.options;
		const i = editor.i18n;

		this.resizeUseRatio = o.resizeUseRatio;
		this.cropUseRatio = o.cropUseRatio;

		const r = this.resizeUseRatio;
		const c = this.cropUseRatio;

		this.buttons = [
			this.jodit.create.fromHTML(
				'<button data-action="reset" type="button" class="jodit_button">' +
					gi('update') +
					'&nbsp;' +
					i('Reset') +
					'</button>'
			),

			this.jodit.create.fromHTML(
				'<button data-action="save" type="button" class="jodit_button jodit_button_success">' +
					gi('save') +
					'&nbsp;' +
					i('Save') +
					'</button>'
			),

			this.jodit.create.fromHTML(
				'<button data-action="saveas" type="button" class="jodit_button jodit_button_success">' +
					gi('save') +
					'&nbsp;' +
					i('Save as ...') +
					'</button>'
			)
		];

		this.activeTab = o.resize ? 'resize' : 'crop';

		const act = (el: boolean, className = 'active') =>
			el ? className : '';

		const switcher = (
			label: string,
			className: string,
			active: boolean = true
		) => `<div class="jodit_form_group">
			<label>${i(label)}</label>
			<div class="jodit_button_group jodit_button_radio_group">
				<input ${act(
					active,
					'checked'
				)} type="checkbox" class="${jie}_${className} jodit_input"/>

				<button type="button" data-yes="1" class="jodit_button jodit_status_success">${i(
					'Yes'
				)}</button>

				<button type="button" class="jodit_button jodit_status_danger">${i(
					'No'
				)}</button>
			</div>
		</div>`;

		this.editor = this.jodit.create.fromHTML(
			`<form class="${jie} jodit_properties">
							<div class="jodit_grid">
								<div class="jodit_col-lg-3-4">
								${
									o.resize
										? `<div class="${jie}_area ${jie}_area_resize active">
												<div class="${jie}_box"></div>
												<div class="${jie}_resizer">
													<i class="jodit_bottomright"></i>
												</div>
											</div>`
										: ''
								}
								${
									o.crop
										? `<div class="${jie}_area ${jie}_area_crop ${act(
												!o.resize
										  )}">
												<div class="${jie}_box">
													<div class="${jie}_croper">
														<i class="jodit_bottomright"></i>
														<i class="jodit_sizes"></i>
													</div>
												</div>
											</div>`
										: ''
								}
								</div>
								<div class="jodit_col-lg-1-4">
								${
									o.resize
										? `<div data-area="resize" class="${jie}_slider active">
												<div class="${jie}_slider-title">
													${gi('resize')}
													${i('Resize')}
												</div>
												<div class="${jie}_slider-content">
													<div class="jodit_form_group">
														<label for="${jie}_width">
															${i('Width')}
														</label>
														<input type="number" class="${jie}_width jodit_input"/>
													</div>
													<div class="jodit_form_group">
														<label for="${jie}_height">
															${i('Height')}
														</label>
														<input type="number" class="${jie}_height jodit_input"/>
													</div>
													${switcher('Keep Aspect Ratio', 'keep_spect_ratio', r)}
												</div>
											</div>`
										: ''
								}
								${
									o.crop
										? `<div data-area="crop" class="${jie}_slider ${act(
												!o.resize
										  )}'">
												<div class="${jie}_slider-title">
													${gi('crop')}
													${i('Crop')}
												</div>
												<div class="${jie}_slider-content">
													${switcher('Keep Aspect Ratio', 'keep_spect_ratio_crop', c)}
												</div>
											</div>`
										: ''
								}
								</div>
							</div>
						</form>`
		);

		this.widthInput = this.editor.querySelector(
			`.${jie}_width`
		) as HTMLInputElement;

		this.heightInput = this.editor.querySelector(
			`.${jie}_height`
		) as HTMLInputElement;

		this.resize_box = this.editor.querySelector(
			`.${jie}_area.${jie}_area_resize .${jie}_box`
		) as HTMLElement;

		this.crop_box = this.editor.querySelector(
			`.${jie}_area.${jie}_area_crop .${jie}_box`
		) as HTMLElement;

		this.sizes = this.editor.querySelector(
			`.${jie}_area.${jie}_area_crop .jodit_sizes`
		) as HTMLElement;

		this.resizeHandler = this.editor.querySelector(
			`.${jie}_resizer`
		) as HTMLElement;

		this.cropHandler = this.editor.querySelector(
			`.${jie}_croper`
		) as HTMLElement;

		this.dialog = new Dialog(editor);
		this.dialog.setContent(this.editor);

		this.dialog.setSize(this.options.width, this.options.height);
		this.dialog.setTitle(this.buttons);

		this.setHandlers();
	}

	destruct(): any {
		if (this.isDestructed) {
			return;
		}

		if (this.dialog) {
			this.dialog.destruct();
			delete this.dialog;
		}

		Dom.safeRemove(this.editor);

		delete this.widthInput;
		delete this.heightInput;
		delete this.resize_box;
		delete this.crop_box;
		delete this.sizes;
		delete this.resizeHandler;
		delete this.cropHandler;
		delete this.editor;

		if (this.jodit.events) {
			this.jodit.events.off(`.${jie}`);
		}

		super.destruct();
	}
}
