/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/resizer
 */

import './resizer.less';

import type { HTMLTagNames, IBound, Nullable } from 'jodit/types';
import type { IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import * as consts from 'jodit/core/constants';
import { IS_IE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import {
	$$,
	attr,
	css,
	offset,
	innerWidth,
	markOwner,
	dataBind
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { eventEmitter } from 'jodit/core/global';
import { autobind, debounce, watch } from 'jodit/core/decorators';

/**
 * The module creates a supporting frame for resizing of the elements img and table
 */

declare module 'jodit/config' {
	interface Config {
		/**
		 * Use true frame for editing iframe size
		 */
		allowResizeTags: HTMLTagNames[];

		resizer: {
			/**
			 * Show size
			 */
			showSize: boolean;
			hideSizeTimeout: number;

			/**
			 * When resizing images, change not the styles but the width and height attributes
			 */
			forImageChangeAttributes: boolean;

			/**
			 * The minimum width for the editable element
			 */
			min_width: number;

			/**
			 * The minimum height for the item being edited
			 */
			min_height: number;
		};
	}
}

Config.prototype.allowResizeTags = ['img', 'iframe', 'table', 'jodit'];

Config.prototype.resizer = {
	showSize: true,
	hideSizeTimeout: 1000,
	forImageChangeAttributes: true,
	min_width: 10,
	min_height: 10
};

const keyBInd = '__jodit-resizer_binded';

/**
 * Resize table and img
 */
export class resizer extends Plugin {
	private LOCK_KEY = 'resizer';
	private handle!: HTMLElement;
	private element: null | HTMLElement = null;

	private isResized: boolean = false;
	private isShown: boolean = false;

	private start_x: number = 0;
	private start_y: number = 0;
	private width: number = 0;
	private height: number = 0;
	private ratio: number = 0;

	private rect = this.j.c.fromHTML(
		`<div class="jodit-resizer">
				<div class="jodit-resizer__top-left"></div>
				<div class="jodit-resizer__top-right"></div>
				<div class="jodit-resizer__bottom-right"></div>
				<div class="jodit-resizer__bottom-left"></div>
				<span>100x100</span>
			</div>`
	);

	private sizeViewer: HTMLSpanElement =
		this.rect.getElementsByTagName('span')[0];

	/** @override */
	protected afterInit(editor: IJodit): void {
		$$('div', this.rect).forEach((resizeHandle: HTMLElement) => {
			editor.e.on(
				resizeHandle,
				'mousedown.resizer touchstart.resizer',
				this.onClickHandle.bind(this, resizeHandle)
			);
		});

		eventEmitter.on('hideHelpers', this.hide);

		editor.e
			.on('readonly', (isReadOnly: boolean) => {
				if (isReadOnly) {
					this.hide();
				}
			})
			.on('afterInit changePlace', this.addEventListeners.bind(this))
			.on(
				'afterGetValueFromEditor.resizer',
				(data: { value: string }) => {
					const rgx =
						/<jodit[^>]+data-jodit_iframe_wrapper[^>]+>(.*?<iframe[^>]*>.*?<\/iframe>.*?)<\/jodit>/gi;

					if (rgx.test(data.value)) {
						data.value = data.value.replace(rgx, '$1');
					}
				}
			)
			.on('hideResizer', this.hide)
			.on('change afterInit afterSetMode', this.onChangeEditor);

		this.addEventListeners();
		this.onChangeEditor();
	}

	/**
	 * Click in the editor area
	 */
	@watch(':click')
	protected onEditorClick(e: MouseEvent): void {
		let node = e.target as Nullable<Node>;

		const {
			editor,
			options: { allowResizeTags }
		} = this.j;

		while (node && node !== editor) {
			if (Dom.isTag(node, allowResizeTags)) {
				this.bind(node);
				this.onClickElement(node);
				return;
			}

			node = node.parentNode;
		}
	}

	private addEventListeners() {
		const editor = this.j;

		editor.e
			.off(editor.editor, '.resizer')
			.off(editor.ow, '.resizer')
			.on(editor.editor, 'keydown.resizer', (e: KeyboardEvent) => {
				if (
					this.isShown &&
					e.key === consts.KEY_DELETE &&
					this.element &&
					!Dom.isTag(this.element, 'table')
				) {
					this.onDelete(e);
				}
			})
			.on(editor.ow, 'resize.resizer', this.updateSize)
			.on('resize.resizer', this.updateSize)
			.on(
				editor.ow,
				'mouseup.resizer keydown.resizer touchend.resizer',
				this.onClickOutside
			)
			.on([editor.ow, editor.editor], 'scroll.resizer', () => {
				if (this.isShown && !this.isResized) {
					this.hide();
				}
			});
	}

	private onClickHandle(
		resizeHandle: HTMLElement,
		e: MouseEvent
	): false | void {
		if (!this.element || !this.element.parentNode) {
			this.hide();
			return false;
		}

		this.handle = resizeHandle;

		e.preventDefault();
		e.stopImmediatePropagation();

		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;
		this.ratio = this.width / this.height;

		this.isResized = true;

		this.start_x = e.clientX;
		this.start_y = e.clientY;

		this.j.e.fire('hidePopup');

		this.j.lock(this.LOCK_KEY);

		this.j.e.on(
			this.j.ow,
			'mousemove.resizer touchmove.resizer',
			this.onResize
		);
	}

	private getWorkplacePosition(): IBound {
		return offset(
			(this.rect.parentNode || this.j.od.documentElement) as HTMLElement,
			this.j,
			this.j.od,
			true
		);
	}

	private onResize = (e: MouseEvent) => {
		if (this.isResized) {
			if (!this.element) {
				return;
			}

			let diff_x, diff_y;

			if (this.j.options.iframe) {
				const workplacePosition = this.getWorkplacePosition();
				diff_x = e.clientX + workplacePosition.left - this.start_x;
				diff_y = e.clientY + workplacePosition.top - this.start_y;
			} else {
				diff_x = e.clientX - this.start_x;
				diff_y = e.clientY - this.start_y;
			}

			const className = this.handle.className;

			let new_w = 0,
				new_h = 0;

			if (Dom.isTag(this.element, 'img')) {
				if (diff_x) {
					new_w =
						this.width +
						(className.match(/left/) ? -1 : 1) * diff_x;
					new_h = Math.round(new_w / this.ratio);
				} else {
					new_h =
						this.height +
						(className.match(/top/) ? -1 : 1) * diff_y;
					new_w = Math.round(new_h * this.ratio);
				}

				if (new_w > innerWidth(this.j.editor, this.j.ow)) {
					new_w = innerWidth(this.j.editor, this.j.ow);
					new_h = Math.round(new_w / this.ratio);
				}
			} else {
				new_w =
					this.width + (className.match(/left/) ? -1 : 1) * diff_x;
				new_h =
					this.height + (className.match(/top/) ? -1 : 1) * diff_y;
			}

			if (new_w > this.j.o.resizer.min_width) {
				if (new_w < (this.rect.parentNode as HTMLElement).offsetWidth) {
					this.applySize(this.element, 'width', new_w);
				} else {
					this.applySize(this.element, 'width', '100%');
				}
			}

			if (new_h > this.j.o.resizer.min_height) {
				this.applySize(this.element, 'height', new_h);
			}

			this.updateSize();

			this.showSizeViewer(
				this.element.offsetWidth,
				this.element.offsetHeight
			);

			e.stopImmediatePropagation();
		}
	};

	private applySize(
		element: HTMLElement,
		key: 'width' | 'height',
		value: number | string
	): void {
		const changeAttrs =
			Dom.isImage(element) && this.j.o.resizer.forImageChangeAttributes;

		if (changeAttrs) {
			attr(element, key, value);
		}

		if (!changeAttrs || element.style[key]) {
			css(element, key, value);
		}
	}

	private onClickOutside = (e: MouseEvent) => {
		if (this.isShown) {
			if (this.isResized) {
				this.j.unlock();
				this.isResized = false;
				this.j.setEditorValue();
				e.stopImmediatePropagation();

				this.j.e.off(
					this.j.ow,
					'mousemove.resizer touchmove.resizer',
					this.onResize
				);
			} else {
				this.hide();
			}
		}
	};

	private onDelete(e: KeyboardEvent) {
		if (!this.element) {
			return;
		}

		if (this.element.tagName !== 'JODIT') {
			this.j.s.select(this.element);
		} else {
			Dom.safeRemove(this.element);
			this.hide();
			e.preventDefault();
		}
	}

	@debounce()
	private onChangeEditor() {
		if (this.isShown) {
			if (!this.element || !this.element.parentNode) {
				this.hide();
			} else {
				this.updateSize();
			}
		}

		$$('iframe', this.j.editor).forEach(this.bind);
	}

	/**
	 * Bind an edit element to element
	 * @param element - The element that you want to add a function to resize
	 */
	@autobind
	private bind(element: HTMLElement): void {
		if (!Dom.isHTMLElement(element) || dataBind(element, keyBInd)) {
			return;
		}

		dataBind(element, keyBInd, true);
		let wrapper: HTMLElement;

		if (Dom.isTag(element, 'iframe')) {
			const iframe = element;

			if (
				Dom.isHTMLElement(element.parentNode) &&
				attr(element.parentNode, '-jodit_iframe_wrapper')
			) {
				element = element.parentNode;
			} else {
				wrapper = this.j.createInside.fromHTML(
					'<jodit ' +
						'data-jodit-temp="1" ' +
						'contenteditable="false" ' +
						'draggable="true" ' +
						'data-jodit_iframe_wrapper="1"' +
						'></jodit>'
				);

				attr(wrapper, 'style', attr(element, 'style'));

				css(wrapper, {
					display:
						element.style.display === 'inline-block'
							? 'inline-block'
							: 'block',
					width: element.offsetWidth,
					height: element.offsetHeight
				});

				if (element.parentNode) {
					element.parentNode.insertBefore(wrapper, element);
				}

				wrapper.appendChild(element);

				element = wrapper;
			}

			this.j.e
				.off(element, 'mousedown.select touchstart.select')
				.on(element, 'mousedown.select touchstart.select', () => {
					this.j.s.select(element);
				})
				.off(element, 'changesize')
				.on(element, 'changesize', () => {
					iframe.setAttribute('width', element.offsetWidth + 'px');
					iframe.setAttribute('height', element.offsetHeight + 'px');
				});
		}

		this.j.e.on(element, 'dragstart', this.hide);

		if (!isESNext && IS_IE) {
			// for IE don't show native resizer
			this.j.e.on(element, 'mousedown', (event: MouseEvent) => {
				if (Dom.isTag(element, 'img')) {
					event.preventDefault();
				}
			});
		}
	}

	private onClickElement = (element: HTMLElement) => {
		if (this.isResized) {
			return;
		}

		if (this.element !== element || !this.isShown) {
			this.element = element;

			this.show();

			if (Dom.isTag(this.element, 'img') && !this.element.complete) {
				this.j.e.on(this.element, 'load', this.updateSize);
			}
		}
	};

	private updateSize = () => {
		if (this.isInDestruct || !this.isShown) {
			return;
		}

		if (this.element && this.rect) {
			const workplacePosition = this.getWorkplacePosition();

			const pos = offset(this.element, this.j, this.j.ed),
				left = parseInt(this.rect.style.left || '0', 10),
				top = parseInt(this.rect.style.top || '0', 10),
				w = this.rect.offsetWidth,
				h = this.rect.offsetHeight;

			const newTop = pos.top - workplacePosition.top,
				newLeft = pos.left - workplacePosition.left;

			if (
				top !== newTop ||
				left !== newLeft ||
				w !== this.element.offsetWidth ||
				h !== this.element.offsetHeight
			) {
				css(this.rect, {
					top: newTop,
					left: newLeft,
					width: this.element.offsetWidth,
					height: this.element.offsetHeight
				});

				if (this.j.events) {
					this.j.e.fire(this.element, 'changesize');

					// check for first init. Ex. inlinePopup hides when it was fired
					if (!isNaN(left)) {
						this.j.e.fire('resize');
					}
				}
			}
		}
	};

	private showSizeViewer(w: number, h: number) {
		if (!this.j.o.resizer.showSize) {
			return;
		}

		if (
			w < this.sizeViewer.offsetWidth ||
			h < this.sizeViewer.offsetHeight
		) {
			this.hideSizeViewer();
			return;
		}

		this.sizeViewer.style.opacity = '1';
		this.sizeViewer.textContent = `${w} x ${h}`;

		this.j.async.setTimeout(this.hideSizeViewer, {
			timeout: this.j.o.resizer.hideSizeTimeout,
			label: 'hideSizeViewer'
		});
	}

	/**
	 * Show resizer
	 */
	private show() {
		if (this.j.o.readonly || this.isShown) {
			return;
		}

		this.isShown = true;

		if (!this.rect.parentNode) {
			markOwner(this.j, this.rect);
			this.j.workplace.appendChild(this.rect);
		}

		if (this.j.isFullSize) {
			this.rect.style.zIndex = css(this.j.container, 'zIndex').toString();
		}

		this.updateSize();
	}

	/**
	 * Hide resizer
	 */
	@autobind
	private hide(): void {
		if (!this.isResized) {
			this.isResized = false;
			this.isShown = false;
			this.element = null;
			Dom.safeRemove(this.rect);
		}
	}

	private hideSizeViewer = () => {
		this.sizeViewer.style.opacity = '0';
	};

	protected beforeDestruct(jodit: IJodit): void {
		this.hide();

		eventEmitter.off('hideHelpers', this.hide);

		jodit.e.off(this.j.ow, '.resizer').off('.resizer');
	}
}
