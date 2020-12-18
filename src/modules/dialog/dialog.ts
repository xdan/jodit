/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './dialog.less';

import type {
	IControlType,
	IDictionary,
	IToolbarCollection,
	IContainer,
	IDialog,
	ContentItem,
	Content,
	IDialogOptions
} from '../../types/';
import { Config, OptionsDefault } from '../../config';
import { KEY_ESC } from '../../core/constants';
import {
	$$,
	asArray,
	attr,
	css,
	extend,
	hasContainer,
	isArray,
	isBoolean,
	isFunction,
	isString,
	splitArray,
	toArray
} from '../../core/helpers/';
import { ViewWithToolbar } from '../../core/view/view-with-toolbar';
import { Dom } from '../../core/dom';
import { STATUSES } from '../../core/component';
import { eventEmitter, pluginSystem } from '../../core/global';
import { component, autobind } from '../../core/decorators';

/**
 * @property {object} dialog module settings {@link Dialog|Dialog}
 * @property {int} dialog.zIndex=1000 Default Z-index for dialog window. {@link Dialog|Dialog}'s settings
 * @property {boolean} dialog.resizable=true This dialog can resize by trigger
 * @property {boolean} dialog.draggable=true This dialog can move by header
 * @property {boolean} dialog.fullsize=false A dialog window will open in full screen by default
 * @property {Buttons} dialog.buttons=['close.dialog', 'fullsize.dialog']
 */

declare module '../../config' {
	interface Config {
		dialog: IDialogOptions;
	}
}

Config.prototype.dialog = {
	extraButtons: [],
	resizable: true,
	draggable: true,
	buttons: ['dialog.close'],
	removeButtons: []
};

Config.prototype.controls.dialog = {
	close: {
		icon: 'cancel',
		exec: dialog => {
			(dialog as Dialog).close();
			(dialog as Dialog).toggleFullSizeBox(false);
		}
	}
} as IDictionary<IControlType>;

/**
 * Module to generate dialog windows
 *
 * @param {Object} parent Jodit main object
 * @param {Object} [opt] Extend Options
 */
@component
export class Dialog extends ViewWithToolbar implements IDialog {
	/** @override */
	className(): string {
		return 'Dialog';
	}

	/**
	 * @property {HTMLDivElement} resizer
	 */
	private resizer!: HTMLDivElement;
	toolbar!: IToolbarCollection;

	private offsetX?: number;
	private offsetY?: number;

	private destination: HTMLElement = document.body;
	private destroyAfterClose: boolean = false;

	private moved: boolean = false;

	private iSetMaximization: boolean = false;

	private resizable: boolean = false;
	private draggable: boolean = false;
	private startX: number = 0;
	private startY: number = 0;
	private startPoint = { x: 0, y: 0, w: 0, h: 0 };

	private lockSelect = () => {
		this.container.classList.add('jodit-dialog__box-moved');
	};

	private unlockSelect = () => {
		this.container.classList.remove('jodit-dialog__box-moved');
	};

	private setElements(
		root: HTMLDivElement | HTMLHeadingElement,
		elements: Content
	) {
		const elements_list: HTMLElement[] = [];

		asArray<ContentItem | ContentItem[] | IContainer>(elements).forEach(
			(elm: ContentItem | ContentItem[] | IContainer): any => {
				if (isArray(elm)) {
					const div = this.c.div('jodit-dialog__column');

					elements_list.push(div);
					root.appendChild(div);

					return this.setElements(div, elm);
				}

				let element: HTMLElement;

				if (isString(elm)) {
					element = this.c.fromHTML(elm);
				} else {
					element = hasContainer(elm) ? elm.container : elm;
				}

				elements_list.push(element);

				if (element.parentNode !== root) {
					root.appendChild(element);
				}
			}
		);

		toArray(root.childNodes).forEach((elm: ChildNode) => {
			if (elements_list.indexOf(elm as HTMLElement) === -1) {
				root.removeChild(elm);
			}
		});
	}

	@autobind
	private onMouseUp(): void {
		if (this.draggable || this.resizable) {
			this.e.off(this.ow, 'mousemove', this.onMouseMove);

			this.draggable = false;
			this.resizable = false;
			this.unlockSelect();

			if (this.e) {
				this.removeGlobalResizeListeners();

				/**
				 * Fired when dialog box is finished to resizing
				 * @event endResize
				 */
				this.e.fire(this, 'endResize endMove');
			}
		}
	}

	/**
	 *
	 * @param {MouseEvent} e
	 */
	@autobind
	private onHeaderMouseDown(e: MouseEvent): void {
		const target: HTMLElement = e.target as HTMLElement;

		if (
			!this.o.draggable ||
			(target && target.nodeName.match(/^(INPUT|SELECT)$/))
		) {
			return;
		}

		this.draggable = true;
		this.startX = e.clientX;
		this.startY = e.clientY;
		this.startPoint.x = css(this.dialog, 'left') as number;
		this.startPoint.y = css(this.dialog, 'top') as number;

		this.setMaxZIndex();
		e.preventDefault();

		this.lockSelect();

		this.addGlobalResizeListeners();

		if (this.e) {
			/**
			 * Fired when dialog box is started moving
			 * @event startMove
			 */
			this.e.fire(this, 'startMove');
		}
	}

	@autobind
	private onMouseMove(e: MouseEvent) {
		if (this.draggable && this.o.draggable) {
			this.setPosition(
				this.startPoint.x + e.clientX - this.startX,
				this.startPoint.y + e.clientY - this.startY
			);

			if (this.e) {
				/**
				 * Fired when dialog box is moved
				 * @event move
				 * @param {int} dx Delta X
				 * @param {int} dy Delta Y
				 */
				this.e.fire(
					this,
					'move',
					e.clientX - this.startX,
					e.clientY - this.startY
				);
			}

			e.stopImmediatePropagation();
			e.preventDefault();
		}

		if (this.resizable && this.o.resizable) {
			this.setSize(
				this.startPoint.w + e.clientX - this.startX,
				this.startPoint.h + e.clientY - this.startY
			);

			if (this.e) {
				/**
				 * Fired when dialog box is resized
				 * @event resizeDialog
				 * @param {int} dx Delta X
				 * @param {int} dy Delta Y
				 */
				this.e.fire(
					this,
					'resizeDialog',
					e.clientX - this.startX,
					e.clientY - this.startY
				);
			}
		}
	}

	@autobind
	private onEsc(e: KeyboardEvent): void {
		if (this.isOpened && e.key === KEY_ESC) {
			const me = this.getMaxZIndexDialog();

			if (me) {
				me.close();
			} else {
				this.close();
			}

			e.stopImmediatePropagation();
		}
	}

	private onResize = () => {
		if (
			this.options &&
			this.o.resizable &&
			!this.moved &&
			this.isOpened &&
			!this.offsetX &&
			!this.offsetY
		) {
			this.setPosition();
		}
	};

	@autobind
	private onResizerMouseDown(e: MouseEvent) {
		this.resizable = true;
		this.startX = e.clientX;
		this.startY = e.clientY;

		this.startPoint.w = this.dialog.offsetWidth;
		this.startPoint.h = this.dialog.offsetHeight;

		this.lockSelect();

		this.addGlobalResizeListeners();

		if (this.e) {
			/**
			 * Fired when dialog box is started resizing
			 * @event startResize
			 */
			this.e.fire(this, 'startResize');
		}
	}

	private addGlobalResizeListeners(): void {
		const self = this;

		self.e
			.on(self.ow, 'mousemove', self.onMouseMove)
			.on(self.ow, 'mouseup', self.onMouseUp);
	}

	private removeGlobalResizeListeners(): void {
		const self = this;

		self.e
			.off(self.ow, 'mousemove', self.onMouseMove)
			.off(self.ow, 'mouseup', self.onMouseUp);
	}

	OPTIONS!: IDialogOptions;

	/**
	 * @property {HTMLDivElement} dialog
	 */
	dialog!: HTMLDivElement;

	workplace!: HTMLDivElement;

	private dialogbox_header!: HTMLHeadingElement;
	private dialogbox_content!: HTMLDivElement;
	private dialogbox_footer!: HTMLDivElement;
	private dialogbox_toolbar!: HTMLDivElement;

	/**
	 * Specifies the size of the window
	 *
	 * @param {number} [w] - The width of the window
	 * @param {number} [h] - The height of the window
	 */
	setSize(w?: number | string, h?: number | string): this {
		if (w == null) {
			w = this.dialog.offsetWidth;
		}

		if (h == null) {
			h = this.dialog.offsetHeight;
		}

		css(this.dialog, {
			width: w,
			height: h
		});

		return this;
	}

	/**
	 * Recalculate auto sizes
	 */
	calcAutoSize(): this {
		this.setSize('auto', 'auto');
		this.setSize();

		return this;
	}

	/**
	 * Specifies the position of the upper left corner of the window . If x and y are specified,
	 * the window is centered on the center of the screen
	 *
	 * @param {Number} [x] - Position px Horizontal
	 * @param {Number} [y] - Position px Vertical
	 */
	setPosition(x?: number, y?: number): this {
		const w = this.ow.innerWidth,
			h = this.ow.innerHeight;

		let left = w / 2 - this.dialog.offsetWidth / 2,
			top = h / 2 - this.dialog.offsetHeight / 2;

		if (left < 0) {
			left = 0;
		}

		if (top < 0) {
			top = 0;
		}

		if (x !== undefined && y !== undefined) {
			this.offsetX = x;
			this.offsetY = y;
			this.moved = Math.abs(x - left) > 100 || Math.abs(y - top) > 100;
		}

		this.dialog.style.left = (x || left) + 'px';
		this.dialog.style.top = (y || top) + 'px';

		return this;
	}

	/**
	 * Specifies the dialog box title . It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content - A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setHeader('Hello world');
	 * dialog.setHeader(['Hello world', '<button>OK</button>', $('<div>some</div>')]);
	 * dialog.open();
	 * ```
	 */
	setHeader(content: Content): this {
		this.setElements(this.dialogbox_header, content);
		return this;
	}

	/**
	 * It specifies the contents of the dialog box. It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setHeader('Hello world');
	 * dialog.setContent('<form onsubmit="alert(1);"><input type="text" /></form>');
	 * dialog.open();
	 * ```
	 */
	setContent(content: Content): this {
		this.setElements(this.dialogbox_content, content);
		return this;
	}

	/**
	 * Sets the bottom of the dialog. It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content - A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setHeader('Hello world');
	 * dialog.setContent('<form><input id="someText" type="text" /></form>');
	 * dialog.setFooter([
	 *  $('<a class="jodit-button">OK</a>').click(function () {
	 *      alert($('someText').val())
	 *      dialog.close();
	 *  })
	 * ]);
	 * dialog.open();
	 * ```
	 */
	setFooter(content: Content): this {
		this.setElements(this.dialogbox_footer, content);
		this.dialog.classList.toggle('jodit-dialog_footer_true', Boolean(content));
		return this;
	}

	/**
	 * Get zIndex from dialog
	 */
	getZIndex(): number {
		return parseInt(css(this.container, 'zIndex') as string, 10) || 0;
	}

	/**
	 * Get dialog instance with maximum z-index displaying it on top of all the dialog boxes
	 *
	 * @return {Dialog}
	 */
	getMaxZIndexDialog(): IDialog {
		let maxZi: number = 0,
			dlg: IDialog,
			zIndex: number,
			res: IDialog = this;

		$$('.jodit-dialog__box', this.destination).forEach(
			(dialog: HTMLElement) => {
				dlg = (dialog as any).component as Dialog;
				zIndex = parseInt(css(dialog, 'zIndex') as string, 10);

				if (dlg.isOpened && !isNaN(zIndex) && zIndex > maxZi) {
					res = dlg;
					maxZi = zIndex;
				}
			}
		);

		return res;
	}

	/**
	 * Sets the maximum z-index dialog box, displaying it on top of all the dialog boxes
	 */
	setMaxZIndex(): void {
		let maxZIndex: number = 20000004,
			zIndex: number = 0;

		$$('.jodit-dialog__box', this.destination).forEach(dialog => {
			zIndex = parseInt(css(dialog, 'zIndex') as string, 10);
			maxZIndex = Math.max(isNaN(zIndex) ? 0 : zIndex, maxZIndex);
		});

		this.container.style.zIndex = (maxZIndex + 1).toString();
	}

	/**
	 * Expands the dialog on full browser window
	 *
	 * @param {boolean} condition true - fullsize
	 * @return {boolean} true - fullsize
	 */
	maximization(condition?: boolean): boolean {
		if (typeof condition !== 'boolean') {
			condition = !this.container.classList.contains(
				'jodit-dialog__box_fullsize'
			);
		}

		this.container.classList.toggle(
			'jodit-dialog__box_fullsize',
			condition
		);

		this.toggleFullSizeBox(condition);

		this.iSetMaximization = condition;

		return condition;
	}

	toggleFullSizeBox(condition: boolean): void {
		[this.destination, this.destination.parentNode].forEach(
			(box: Node | null) => {
				box &&
					(box as HTMLElement).classList &&
					(box as HTMLElement).classList.toggle(
						'jodit_fullsize-box_true',
						condition
					);
			}
		);
	}

	open(destroyAfterClose: boolean): this;

	open(destroyAfterClose: boolean, modal: boolean): this;

	open(
		content?: Content,
		title?: Content,
		destroyAfterClose?: boolean,
		modal?: boolean
	): this;

	/**
	 * It opens a dialog box to center it, and causes the two event.
	 *
	 * @param {string|string[]|Element|Element[]} [content]  specifies the contents of the dialog box.
	 * Can be false или undefined. see {@link Dialog~setContent|setContent}
	 * @param {string|string[]|Element|Element[]} [title]  specifies the title of the dialog box, @see setHeader
	 * @param {boolean} [destroyAfterClose] true - After closing the window , the destructor will be called.
	 * see {@link Dialog~destruct|destruct}
	 * @param {boolean} [modal] - true window will be opened in modal mode
	 * @fires {@link event:beforeOpen} id returns 'false' then the window will not open
	 * @fires {@link event:afterOpen}
	 */
	open(
		contentOrClose?: Content | boolean,
		titleOrModal?: Content | boolean,
		destroyAfterClose?: boolean,
		modal?: boolean
	): this {
		eventEmitter.fire('closeAllPopups hideHelpers');

		/**
		 * Called before the opening of the dialog box
		 *
		 * @event beforeOpen
		 */
		if (this.e.fire(this, 'beforeOpen') === false) {
			return this;
		}

		if (isBoolean(contentOrClose)) {
			destroyAfterClose = contentOrClose;
		}

		if (isBoolean(titleOrModal)) {
			modal = titleOrModal;
		}

		this.destroyAfterClose = destroyAfterClose === true;

		const content = isBoolean(contentOrClose) ? undefined : contentOrClose;
		const title = isBoolean(titleOrModal) ? undefined : titleOrModal;

		if (title !== undefined) {
			this.setHeader(title);
		}

		if (content) {
			this.setContent(content);
		}

		this.container.classList.add('jodit-dialog_active');
		this.isOpened = true;

		this.setModal(modal);

		this.destination.appendChild(this.container);

		this.setPosition(this.offsetX, this.offsetY);

		this.setMaxZIndex();

		if (this.o.fullsize) {
			this.maximization(true);
		}

		/**
		 * Called after the opening of the dialog box
		 * @event afterOpen
		 */
		this.e.fire('afterOpen', this);

		return this;
	}

	private isModal: boolean = false;

	/**
	 * Set modal mode
	 * @param modal
	 */
	setModal(modal: undefined | boolean): this {
		this.isModal = Boolean(modal);
		this.container.classList.toggle('jodit-modal', this.isModal);

		return this;
	}

	/**
	 * True, if dialog was opened
	 */
	isOpened: boolean = false;

	/**
	 * Closes the dialog box , if you want to call the method {@link Dialog~destruct|destruct}
	 *
	 * @see destroy
	 * @method close
	 * @fires beforeClose
	 * @fires afterClose
	 * @example
	 * ```javascript
	 * //You can close dialog two ways
	 * var dialog = new Jodit.modules.Dialog();
	 * dialog.open('Hello world!', 'Title');
	 * var $close = Jodit.modules.helper.dom('<a href="javascript:void(0)" style="float:left;" class="jodit-button">
	 *     <i class="icon icon-check"></i>&nbsp;' + Jodit.prototype.i18n('Ok') + '</a>');
	 * $close.addEventListener('click', function () {
	 *     dialog.close();
	 * });
	 * dialog.setFooter($close);
	 * // and second way, you can close dialog from content
	 * dialog.open('<a onclick="var event = doc.createEvent('HTMLEvents'); event.initEvent('close_dialog', true, true);
	 * this.dispatchEvent(event)">Close</a>', 'Title');
	 * ```
	 */
	@autobind
	close(e?: MouseEvent): this {
		if (this.isDestructed || !this.isOpened) {
			return this;
		}

		if (e) {
			e.stopImmediatePropagation();
			e.preventDefault();
		}

		/**
		 * Called up to close the window
		 *
		 * @event beforeClose
		 * @this {Dialog} current dialog
		 */
		if (this.e) {
			this.e.fire('beforeClose', this);
		}

		Dom.safeRemove(this.container);
		this?.container?.classList.remove('jodit-dialog_active');

		this.isOpened = false;

		if (this.iSetMaximization) {
			this.maximization(false);
		}

		this.removeGlobalResizeListeners();

		if (this.destroyAfterClose) {
			this.destruct();
		}

		/**
		 * It called after the window is closed
		 *
		 * @event afterClose
		 * @this {Dialog} current dialog
		 */
		this.e?.fire(this, 'afterClose');
		this.e?.fire(this.ow, 'joditCloseDialog');

		return this;
	}

	constructor(options?: IDialogOptions) {
		super(options);

		const self: Dialog = this;

		self.options = new OptionsDefault(
			extend(
				true,
				{
					toolbarButtonSize: 'middle'
				},
				Config.prototype.dialog,
				options
			)
		) as IDialogOptions;

		Dom.safeRemove(self.container);

		self.container = this.c.fromHTML(
			'<div style="z-index:' +
				self.o.zIndex +
				'" class="jodit jodit-dialog__box">' +
				'<div class="jodit-dialog__overlay"></div>' +
				'<div class="jodit-dialog">' +
				'<div class="jodit-dialog__header non-selected">' +
				'<div class="jodit-dialog__header-title"></div>' +
				'<div class="jodit-dialog__header-toolbar"></div>' +
				'</div>' +
				'<div class="jodit-dialog__content"></div>' +
				'<div class="jodit-dialog__footer"></div>' +
				(self.o.resizable
					? '<div class="jodit-dialog__resizer"></div>'
					: '') +
				'</div>' +
				'</div>'
		) as HTMLDivElement;

		attr(self.container, 'role', 'dialog');

		Object.defineProperty(self.container, 'component', {
			value: this
		});

		self.container.classList.add(
			`jodit_theme_${this.o.theme || 'default'}`
		);

		self.dialog = self.container.querySelector(
			'.jodit-dialog'
		) as HTMLDivElement;

		css(self.dialog, {
			maxWidth: self.options.maxWidth,
			minHeight: self.options.minHeight,
			minWidth: self.options.minWidth
		});

		self.resizer = self.container.querySelector(
			'.jodit-dialog__resizer'
		) as HTMLDivElement;

		self.dialogbox_header = self.container.querySelector(
			'.jodit-dialog__header>.jodit-dialog__header-title'
		) as HTMLHeadingElement;

		self.dialogbox_content = self.container.querySelector(
			'.jodit-dialog__content'
		) as HTMLDivElement;

		self.dialogbox_footer = self.container.querySelector(
			'.jodit-dialog__footer'
		) as HTMLDivElement;

		self.dialogbox_toolbar = self.container.querySelector(
			'.jodit-dialog__header>.jodit-dialog__header-toolbar'
		) as HTMLDivElement;

		self.o.buttons &&
			self.toolbar
				.build(splitArray(self.o.buttons))
				.appendTo(self.dialogbox_toolbar);

		const headerBox: HTMLDivElement | null = self.container.querySelector(
			'.jodit-dialog__header'
		);

		headerBox && self.e.on(headerBox, 'mousedown', self.onHeaderMouseDown);

		if (self.o.resizable) {
			self.e.on(self.resizer, 'mousedown', self.onResizerMouseDown);
		}

		const fullSize = pluginSystem.get('fullsize') as Function;
		isFunction(fullSize) && fullSize(self);

		this.e
			.on(self.container, 'close_dialog', self.close)
			.on(this.ow, 'keydown', this.onEsc)
			.on(this.ow, 'resize', this.onResize);
	}

	/**
	 * It destroys all objects created for the windows and also includes all the handlers for the window object
	 */
	destruct(): void {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		if (this.isOpened) {
			this.close();
		}

		if (this.events) {
			this.removeGlobalResizeListeners();

			this.events
				.off(this.container, 'close_dialog', self.close)
				.off(this.ow, 'keydown', this.onEsc)
				.off(this.ow, 'resize', this.onResize);
		}

		super.destruct();
	}
}
