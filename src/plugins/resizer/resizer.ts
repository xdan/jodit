/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/resizer/README.md]]
 * @packageDocumentation
 * @module plugins/resizer
 */

import type { HTMLTagNames, IBound, IJodit, Nullable } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { IS_ES_NEXT, IS_IE, KEY_ALT } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { eventEmitter, pluginSystem } from 'jodit/core/global';
import {
	$$,
	attr,
	css,
	dataBind,
	getWrappedMedia,
	innerWidth,
	markOwner,
	offset
} from 'jodit/core/helpers';
import { cssInline } from 'jodit/core/helpers/utils/css';
import { Plugin } from 'jodit/core/plugin/plugin';
import { UIElement } from 'jodit/core/ui';
import { Popup } from 'jodit/core/ui/popup';

import './config';

import './resizer.less';

const keyBInd = '__jodit-resizer_binded';

/**
 * Reads a plain pixel value out of a `width`/`height` attribute.
 * Relative values such as `100%` are ignored — they cannot be turned into a
 * fixed pixel box for the wrapper.
 */
function attrPixelSize(element: HTMLElement, key: 'width' | 'height'): number {
	const value = attr(element, key)?.trim();

	if (!value || !/^\d+(\.\d+)?(px)?$/i.test(value)) {
		return 0;
	}

	return parseFloat(value);
}

/**
 * A video with no height of its own takes it from its width and its ratio,
 * so resizing it keeps the ratio without setting a height.
 */
function heightFollowsWidth(element: HTMLElement): boolean {
	return (
		Dom.isTag(element, 'video') &&
		!attr(element, 'height') &&
		!cssInline(element, 'height')
	);
}

/**
 * The module creates a supporting frame for resizing of the elements img and table
 */
export class resizer extends Plugin {
	private LOCK_KEY = 'resizer';
	private handle!: HTMLElement;
	private element: null | HTMLElement = null;

	private isResizeMode: boolean = false;
	private isShown: boolean = false;

	private startX: number = 0;
	private startY: number = 0;
	private width: number = 0;
	private height: number = 0;
	private ratio: number = 0;

	private rect = this.j.c.fromHTML(
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

	// Clips the frame to the workplace, without the frame making it scroll
	private layer = this.j.c.div('jodit-resizer-layer');

	private sizeViewer: HTMLSpanElement =
		this.rect.getElementsByTagName('span')[0];

	/** @override */
	protected afterInit(editor: IJodit): void {
		$$('div', this.rect).forEach((resizeHandle: HTMLElement) => {
			editor.e.on(
				resizeHandle,
				'mousedown.resizer touchstart.resizer',
				this.onStartResizing.bind(this, resizeHandle)
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
			);

		this.addEventListeners();
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
			const element = this.__resizable(node);

			if (Dom.isTag(element, allowResizeTags)) {
				this.__bind(element);
				this.onClickElement(element);
				return;
			}

			node = node.parentNode;
		}
	}

	/**
	 * What a click on `node` resizes: the media in it when it's a media
	 * wrapper (`jodit-media`, or one from `mediaWrappers`), or `node` itself
	 */
	private __resizable(node: Node): Node {
		const media =
			getWrappedMedia(this.j, node) ??
			(Dom.isHTMLElement(node) && attr(node, 'data-jodit_fake_wrapper')
				? node.firstElementChild
				: null);

		if (!media) {
			return node;
		}

		// An embed is resized through its own wrapper
		return Dom.isHTMLElement(media.parentNode) &&
			attr(media.parentNode, 'data-jodit_iframe_wrapper')
			? media.parentNode
			: media;
	}

	@watch(':afterInsertImage')
	protected __afterInsertImage(image: HTMLImageElement): void {
		if (this.j.o.resizer.forImageChangeAttributes) {
			return;
		}

		const width = attr(image, 'width');
		if (width && !cssInline(image, 'width')) {
			css(image, 'width', width);
			attr(image, 'width', null);
		}
	}

	private addEventListeners(): void {
		const editor = this.j;

		editor.e
			.off(editor.editor, '.resizer')
			.off(editor.ow, '.resizer')
			.on(editor.editor, 'keydown.resizer', (e: KeyboardEvent) => {
				if (
					this.isShown &&
					(e.key === consts.KEY_DELETE ||
						e.key === consts.KEY_BACKSPACE) &&
					this.element &&
					!Dom.isTag(this.element, 'table')
				) {
					this.onDelete(e);
				}
			})
			.on(editor.ow, 'resize.resizer', this.updateSize)
			.on('resize.resizer', this.updateSize)
			// The frame is outside the content, so it's moved to follow the
			// element as the content scrolls
			.on([editor.ow, editor.editor], 'scroll.resizer', this.updateSize)
			.on(editor.ow, 'keydown.resizer', this.onKeyDown)
			.on(editor.ow, 'keyup.resizer', this.onKeyUp)
			.on(
				editor.ow,
				'mouseup.resizer touchend.resizer',
				this.onClickOutside
			);
	}

	@autobind
	private onStartResizing(
		resizeHandle: HTMLElement,
		e: MouseEvent
	): false | void {
		if (!this.element || !this.isElementInEditor) {
			this.hide();
			return false;
		}

		this.handle = resizeHandle;

		if (e.cancelable) {
			e.preventDefault();
		}

		e.stopImmediatePropagation();

		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;
		this.ratio = this.width / this.height;

		this.isResizeMode = true;

		this.startX = e.clientX;
		this.startY = e.clientY;
		this.pointerX = e.clientX;
		this.pointerY = e.clientY;

		const { j } = this;

		j.e.fire('hidePopup');

		j.lock(this.LOCK_KEY);

		j.e.on(j.ow, 'mousemove.resizer touchmove.resizer', this.onResize);
	}

	@autobind
	private onEndResizing(): void {
		const { j } = this;

		j.unlock();
		this.isResizeMode = false;
		this.isAltMode = false;
		j.synchronizeValues();

		j.e.off(j.ow, 'mousemove.resizer touchmove.resizer', this.onResize);
	}

	private pointerX: number = 0;
	private pointerY: number = 0;

	@autobind
	private onResize(e: MouseEvent): void {
		if (this.isResizeMode) {
			if (!this.element) {
				return;
			}

			this.pointerX = e.clientX;
			this.pointerY = e.clientY;

			let diff_x, diff_y;

			if (this.j.options.iframe && e.view === this.j.ew) {
				// the event was proxied from the editor's iframe — its client
				// coordinates are relative to the iframe viewport, while
				// `startX/startY` were captured on a host-document handle;
				// shift them into the host coordinate space
				const workplacePosition = this.getWorkplacePosition();
				diff_x = e.clientX + workplacePosition.left - this.startX;
				diff_y = e.clientY + workplacePosition.top - this.startY;
			} else {
				diff_x = this.pointerX - this.startX;
				diff_y = this.pointerY - this.startY;
			}

			const className = this.handle.className;

			let new_w: number, new_h: number;

			const uar = this.j.o.resizer.useAspectRatio;
			const keepRatio =
				!this.isAltMode &&
				(uar === true || Boolean(uar && Dom.isTag(this.element, uar)));

			if (keepRatio) {
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

			if (
				new_h > this.j.o.resizer.min_height &&
				!(keepRatio && heightFollowsWidth(this.element))
			) {
				this.applySize(this.element, 'height', new_h);
			}

			this.updateSize();

			this.showSizeViewer(
				this.element.offsetWidth,
				this.element.offsetHeight
			);

			e.stopImmediatePropagation();
		}
	}

	private isAltMode: boolean = false;

	@autobind
	private onKeyDown(e: KeyboardEvent): void {
		this.isAltMode = e.key === KEY_ALT;

		if (!this.isAltMode && this.isResizeMode) {
			this.onEndResizing();
		}
	}

	@autobind
	private onKeyUp(): void {
		if (this.isAltMode && this.isResizeMode && this.element) {
			this.width = this.element.offsetWidth;
			this.height = this.element.offsetHeight;
			this.ratio = this.width / this.height;
			this.startX = this.pointerX;
			this.startY = this.pointerY;
		}

		this.isAltMode = false;
	}

	@autobind
	private onClickOutside(e: MouseEvent): void {
		if (!this.isShown) {
			return;
		}

		if (!this.isResizeMode) {
			// A click in the element's popup, or in a list it opens, works on
			// the element, so it keeps its frame
			if (
				e?.target &&
				UIElement.closestElement(e.target as Node, Popup)
			) {
				return;
			}

			return this.hide();
		}

		e.stopImmediatePropagation();
		this.onEndResizing();
	}

	private getWorkplacePosition(): IBound {
		return offset(
			(this.rect.parentNode || this.j.od.documentElement) as HTMLElement,
			this.j,
			this.j.od,
			true
		);
	}

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

		if (!changeAttrs || cssInline(element, key)) {
			css(element, key, value);
		}
	}

	/**
	 * The framed element can go with a wrapper round it, keeping its parent
	 */
	private get isElementInEditor(): boolean {
		return Boolean(this.element && this.j.editor.contains(this.element));
	}

	private onDelete(e: KeyboardEvent): void {
		if (!this.element) {
			return;
		}

		if (!this.isElementInEditor) {
			this.hide();
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

	@watch(':change')
	private __onChangeEditor(): void {
		if (this.isShown) {
			if (!this.isElementInEditor) {
				this.hide();
			} else {
				this.updateSize();
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
			!this.j.o.allowResizeTags.has(
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

				// Inside a hidden container (`display:none` on any ancestor)
				// offsetWidth/offsetHeight are 0. Writing that into the wrapper
				// collapsed it to 0x0, the following content painted over the
				// iframe, and nothing corrected it once the container was shown.
				// Fall back to the iframe's own size attributes and, when there
				// is nothing measurable at all, let the wrapper size itself.
				const width =
					element.offsetWidth || attrPixelSize(element, 'width');
				const height =
					element.offsetHeight || attrPixelSize(element, 'height');

				css(wrapper, {
					display:
						cssInline(element, 'display') === 'inline-block'
							? 'inline-block'
							: 'block'
				});

				if (width) {
					css(wrapper, 'width', width);
				}

				if (height) {
					css(wrapper, 'height', height);
				}

				if (element.parentNode) {
					Dom.before(element, wrapper);
				}

				Dom.append(wrapper, element);
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
					// Only a resize sets the embed's size, and as the plain numbers
					// the attributes take, so a click leaves `width="100%"` alone
					if (this.isResizeMode) {
						attr(iframe, 'width', element.offsetWidth);
						attr(iframe, 'height', element.offsetHeight);
					}
				});
		}

		this.j.e.on(element, 'dragstart', this.hide);

		if (!IS_ES_NEXT && IS_IE) {
			// for IE don't show native resizer
			this.j.e.on(element, 'mousedown', (event: MouseEvent) => {
				if (Dom.isTag(element, 'img')) {
					event.preventDefault();
				}
			});
		}
	}

	private onClickElement = (element: HTMLElement): void => {
		if (this.isResizeMode) {
			return;
		}

		if (this.element !== element || !this.isShown) {
			this.element = element;

			this.show();

			if (Dom.isTag(this.element, 'img') && !this.element.complete) {
				this.j.e.one(this.element, 'load', this.updateSize);
			}

			if (
				Dom.isTag(this.element, 'video') &&
				this.element.readyState < HTMLMediaElement.HAVE_METADATA
			) {
				this.j.e.one(this.element, 'loadedmetadata', this.updateSize);
			}
		}
	};

	private updateSize = (): void => {
		if (this.isInDestruct || !this.isShown) {
			return;
		}

		if (this.element && this.rect) {
			const workplacePosition = this.getWorkplacePosition();

			const pos = offset(this.element, this.j, this.j.ed),
				left = parseInt(cssInline(this.rect, 'left') || '0', 10),
				top = parseInt(cssInline(this.rect, 'top') || '0', 10),
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

	private showSizeViewer(w: number, h: number): void {
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

		css(this.sizeViewer, 'opacity', '1');
		this.sizeViewer.textContent = `${w} x ${h}`;

		this.j.async.setTimeout(this.hideSizeViewer, {
			timeout: this.j.o.resizer.hideSizeTimeout,
			label: 'hideSizeViewer'
		});
	}

	/**
	 * Show resizer
	 */
	private show(): void {
		if (this.j.o.readonly || this.isShown) {
			return;
		}

		this.isShown = true;

		if (this.layer.parentNode !== this.j.workplace) {
			markOwner(this.j, this.layer);
			Dom.append(this.j.workplace, this.layer);
		}

		if (!this.rect.parentNode) {
			markOwner(this.j, this.rect);
			Dom.append(this.layer, this.rect);
		}

		if (this.j.isFullSize) {
			css(
				this.rect,
				'zIndex',
				css(this.j.container, 'zIndex').toString()
			);
		}

		this.updateSize();
	}

	/**
	 * Hide resizer
	 */
	@autobind
	@watch(':hideResizer')
	private hide(): void {
		if (!this.isResizeMode) {
			this.isResizeMode = false;
			this.isShown = false;
			this.element = null;
			Dom.safeRemove(this.rect);
			$$("[data-jodit-wrapper_active='true']", this.j.editor).forEach(
				elm => attr(elm, 'data-jodit-wrapper_active', false)
			);
		}
	}

	private hideSizeViewer = (): void => {
		css(this.sizeViewer, 'opacity', '0');
	};

	protected beforeDestruct(jodit: IJodit): void {
		this.hide();
		Dom.safeRemove(this.layer);

		eventEmitter.off('hideHelpers', this.hide);

		jodit.e.off(this.j.ow, '.resizer').off('.resizer');
	}
}

pluginSystem.add('resizer', resizer);
