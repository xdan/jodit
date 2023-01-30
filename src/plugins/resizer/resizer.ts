/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/resizer/README.md]]
 * @packageDocumentation
 * @module plugins/resizer
 */

import './resizer.less';

import type { HTMLTagNames, IBound, Nullable } from 'jodit/types';
import type { IJodit } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { IS_IE, KEY_ALT } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import {
	$$,
	attr,
	css,
	offset,
	innerWidth,
	markOwner,
	dataBind
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin/plugin';
import { eventEmitter } from 'jodit/core/global';
import { autobind, debounce, watch } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';

import './config';

const keyBInd = '__jodit-resizer_binded';

/**
 * The module creates a supporting frame for resizing of the elements img and table
 */
export class resizer extends Plugin {
	private __lockKey = 'resizer';
	private __handle!: HTMLElement;
	private __element: null | HTMLElement = null;

	private __isResizeMode: boolean = false;
	private __isShown: boolean = false;

	private __startX: number = 0;
	private __startY: number = 0;
	private __width: number = 0;
	private __height: number = 0;
	private __ratio: number = 0;

	private __rect = this.j.c.fromHTML(
		`<div title="${this.j.i18n(
			'Press Alt for custom resizing'
		)}" class="jodit-resizer">
				<div class="jodit-resizer__top-left"></div>
				<div class="jodit-resizer__top-right"></div>
				<div class="jodit-resizer__bottom-right"></div>
				<div class="jodit-resizer__bottom-left"></div>
				<span>100x100</span>
			</div>`
	);

	private __sizeViewer: HTMLSpanElement =
		this.__rect.getElementsByTagName('span')[0];

	/** @override */
	protected afterInit(editor: IJodit): void {
		$$('div', this.__rect).forEach((resizeHandle: HTMLElement) => {
			editor.e.on(
				resizeHandle,
				'mousedown.resizer touchstart.resizer',
				this.__onStartResizing.bind(this, resizeHandle)
			);
		});

		eventEmitter.on('hideHelpers', this.__hide);

		editor.e
			.on('readonly', (isReadOnly: boolean) => {
				if (isReadOnly) {
					this.__hide();
				}
			})
			.on('afterInit changePlace', this.__addEventListeners.bind(this))
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
			.on('hideResizer', this.__hide)
			.on('change afterInit afterSetMode', this.__onChangeEditor);

		this.__addEventListeners();
		this.__onChangeEditor();
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
				this.__bind(node);
				this.__onClickElement(node);
				return;
			}

			node = node.parentNode;
		}
	}

	private __addEventListeners(): void {
		const editor = this.j;

		editor.e
			.off(editor.editor, '.resizer')
			.off(editor.ow, '.resizer')
			.on(editor.editor, 'keydown.resizer', (e: KeyboardEvent) => {
				if (
					this.__isShown &&
					e.key === consts.KEY_DELETE &&
					this.__element &&
					!Dom.isTag(this.__element, 'table')
				) {
					this.__onDelete(e);
				}
			})
			.on(editor.ow, 'resize.resizer', this.__updateSize)
			.on('resize.resizer', this.__updateSize)
			.on([editor.ow, editor.editor], 'scroll.resizer', () => {
				if (this.__isShown && !this.__isResizeMode) {
					this.__hide();
				}
			})
			.on(editor.ow, 'keydown.resizer', this.__onKeyDown)
			.on(editor.ow, 'keyup.resizer', this.__onKeyUp)
			.on(
				editor.ow,
				'mouseup.resizer touchend.resizer',
				this.__onClickOutside
			);
	}

	@autobind
	private __onStartResizing(
		resizeHandle: HTMLElement,
		e: MouseEvent
	): false | void {
		if (!this.__element || !this.__element.parentNode) {
			this.__hide();
			return false;
		}

		this.__handle = resizeHandle;

		if (e.cancelable) {
			e.preventDefault();
		}

		e.stopImmediatePropagation();

		this.__width = this.__element.offsetWidth;
		this.__height = this.__element.offsetHeight;
		this.__ratio = this.__width / this.__height;

		this.__isResizeMode = true;

		this.__startX = e.clientX;
		this.__startY = e.clientY;
		this.__pointerX = e.clientX;
		this.__pointerY = e.clientY;

		const { j } = this;

		j.e.fire('hidePopup');

		j.lock(this.__lockKey);

		j.e.on(j.ow, 'mousemove.resizer touchmove.resizer', this.__onResize);
	}

	@autobind
	private __onEndResizing(): void {
		const { j } = this;

		j.unlock();
		this.__isResizeMode = false;
		this.__isAltMode = false;
		j.synchronizeValues();

		j.e.off(j.ow, 'mousemove.resizer touchmove.resizer', this.__onResize);
	}

	private __pointerX: number = 0;
	private __pointerY: number = 0;

	@autobind
	private __onResize(e: MouseEvent): void {
		if (this.__isResizeMode) {
			if (!this.__element) {
				return;
			}

			this.__pointerX = e.clientX;
			this.__pointerY = e.clientY;

			let diff_x, diff_y;

			if (this.j.options.iframe) {
				const workplacePosition = this.__getWorkplacePosition();
				diff_x = e.clientX + workplacePosition.left - this.__startX;
				diff_y = e.clientY + workplacePosition.top - this.__startY;
			} else {
				diff_x = this.__pointerX - this.__startX;
				diff_y = this.__pointerY - this.__startY;
			}

			const className = this.__handle.className;

			let new_w = 0,
				new_h = 0;

			const uar = this.j.o.resizer.useAspectRatio;

			if (
				!this.__isAltMode &&
				(uar === true ||
					(Array.isArray(uar) && Dom.isTag(this.__element, uar)))
			) {
				if (diff_x) {
					new_w =
						this.__width +
						(className.match(/left/) ? -1 : 1) * diff_x;
					new_h = Math.round(new_w / this.__ratio);
				} else {
					new_h =
						this.__height +
						(className.match(/top/) ? -1 : 1) * diff_y;
					new_w = Math.round(new_h * this.__ratio);
				}

				if (new_w > innerWidth(this.j.editor, this.j.ow)) {
					new_w = innerWidth(this.j.editor, this.j.ow);
					new_h = Math.round(new_w / this.__ratio);
				}
			} else {
				new_w =
					this.__width + (className.match(/left/) ? -1 : 1) * diff_x;
				new_h =
					this.__height + (className.match(/top/) ? -1 : 1) * diff_y;
			}

			if (new_w > this.j.o.resizer.min_width) {
				if (
					new_w < (this.__rect.parentNode as HTMLElement).offsetWidth
				) {
					this.__applySize(this.__element, 'width', new_w);
				} else {
					this.__applySize(this.__element, 'width', '100%');
				}
			}

			if (new_h > this.j.o.resizer.min_height) {
				this.__applySize(this.__element, 'height', new_h);
			}

			this.__updateSize();

			this.__showSizeViewer(
				this.__element.offsetWidth,
				this.__element.offsetHeight
			);

			e.stopImmediatePropagation();
		}
	}

	private __isAltMode: boolean = false;

	@autobind
	private __onKeyDown(e: KeyboardEvent): void {
		this.__isAltMode = e.key === KEY_ALT;

		if (!this.__isAltMode && this.__isResizeMode) {
			this.__onEndResizing();
		}
	}

	@autobind
	private __onKeyUp(): void {
		if (this.__isAltMode && this.__isResizeMode && this.__element) {
			this.__width = this.__element.offsetWidth;
			this.__height = this.__element.offsetHeight;
			this.__ratio = this.__width / this.__height;
			this.__startX = this.__pointerX;
			this.__startY = this.__pointerY;
		}

		this.__isAltMode = false;
	}

	@autobind
	private __onClickOutside(e: MouseEvent): void {
		if (!this.__isShown) {
			return;
		}

		if (!this.__isResizeMode) {
			return this.__hide();
		}

		e.stopImmediatePropagation();
		this.__onEndResizing();
	}

	private __getWorkplacePosition(): IBound {
		return offset(
			(this.__rect.parentNode ||
				this.j.od.documentElement) as HTMLElement,
			this.j,
			this.j.od,
			true
		);
	}

	private __applySize(
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

	private __onDelete(e: KeyboardEvent): void {
		if (!this.__element) {
			return;
		}

		if (this.__element.tagName !== 'JODIT') {
			this.j.s.select(this.__element);
		} else {
			Dom.safeRemove(this.__element);
			this.__hide();
			e.preventDefault();
		}
	}

	@debounce()
	private __onChangeEditor(): void {
		if (this.__isShown) {
			if (!this.__element || !this.__element.parentNode) {
				this.__hide();
			} else {
				this.__updateSize();
			}
		}

		$$('iframe', this.j.editor).forEach(this.__bind);
	}

	/**
	 * Bind an edit element to element
	 * @param element - The element that you want to add a function to resize
	 */
	@autobind
	private __bind(element: HTMLElement): void {
		if (
			!Dom.isHTMLElement(element) ||
			!this.j.o.allowResizeTags.includes(
				element.tagName.toLowerCase() as HTMLTagNames
			) ||
			dataBind(element, keyBInd)
		) {
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
				wrapper = this.j.createInside.element('jodit', {
					'data-jodit-temp': 1,
					contenteditable: false,
					draggable: true,
					'data-jodit_iframe_wrapper': 1
				});

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
				this.j.e.on(wrapper, 'click', () => {
					attr(wrapper, 'data-jodit-wrapper_active', true);
				});

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

		this.j.e.on(element, 'dragstart', this.__hide);

		if (!isESNext && IS_IE) {
			// for IE don't show native resizer
			this.j.e.on(element, 'mousedown', (event: MouseEvent) => {
				if (Dom.isTag(element, 'img')) {
					event.preventDefault();
				}
			});
		}
	}

	@autobind
	private __onClickElement(element: HTMLElement): void {
		if (this.__isResizeMode) {
			return;
		}

		if (this.__element !== element || !this.__isShown) {
			this.__element = element;

			this.__show();

			if (Dom.isTag(this.__element, 'img') && !this.__element.complete) {
				this.j.e.one(this.__element, 'load', this.__updateSize);
			}
		}
	}

	@autobind
	private __updateSize(): void {
		if (this.isInDestruct || !this.__isShown) {
			return;
		}

		if (this.__element && this.__rect) {
			const workplacePosition = this.__getWorkplacePosition();

			const pos = offset(this.__element, this.j, this.j.ed),
				left = parseInt(this.__rect.style.left || '0', 10),
				top = parseInt(this.__rect.style.top || '0', 10),
				w = this.__rect.offsetWidth,
				h = this.__rect.offsetHeight;

			const newTop = pos.top - workplacePosition.top,
				newLeft = pos.left - workplacePosition.left;

			if (
				top !== newTop ||
				left !== newLeft ||
				w !== this.__element.offsetWidth ||
				h !== this.__element.offsetHeight
			) {
				css(this.__rect, {
					top: newTop,
					left: newLeft,
					width: this.__element.offsetWidth,
					height: this.__element.offsetHeight
				});

				if (this.j.events) {
					this.j.e.fire(this.__element, 'changesize');

					// check for first init. Ex. inlinePopup hides when it was fired
					if (!isNaN(left)) {
						this.j.e.fire('resize');
					}
				}
			}
		}
	}

	private __showSizeViewer(w: number, h: number): void {
		if (!this.j.o.resizer.showSize) {
			return;
		}

		if (
			w < this.__sizeViewer.offsetWidth ||
			h < this.__sizeViewer.offsetHeight
		) {
			this.__hideSizeViewer();
			return;
		}

		this.__sizeViewer.style.opacity = '1';
		this.__sizeViewer.textContent = `${w} x ${h}`;

		this.j.async.setTimeout(this.__hideSizeViewer, {
			timeout: this.j.o.resizer.hideSizeTimeout,
			label: 'hideSizeViewer'
		});
	}

	/**
	 * Show resizer
	 */
	private __show(): void {
		if (this.j.o.readonly || this.__isShown) {
			return;
		}

		this.__isShown = true;

		if (!this.__rect.parentNode) {
			markOwner(this.j, this.__rect);
			this.j.workplace.appendChild(this.__rect);
		}

		if (this.j.isFullSize) {
			this.__rect.style.zIndex = css(
				this.j.container,
				'zIndex'
			).toString();
		}

		this.__updateSize();
	}

	/**
	 * Hide resizer
	 */
	@autobind
	private __hide(): void {
		if (!this.__isResizeMode) {
			this.__isResizeMode = false;
			this.__isShown = false;
			this.__element = null;
			Dom.safeRemove(this.__rect);
			$$("[data-jodit-wrapper_active='true']", this.j.editor).forEach(
				elm => attr(elm, 'data-jodit-wrapper_active', false)
			);
		}
	}

	@autobind
	private __hideSizeViewer(): void {
		this.__sizeViewer.style.opacity = '0';
	}

	protected beforeDestruct(jodit: IJodit): void {
		this.__hide();

		eventEmitter.off('hideHelpers', this.__hide);

		jodit.e.off(this.j.ow, '.resizer').off('.resizer');
	}
}

pluginSystem.add('resizer', resizer);
