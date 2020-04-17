/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './dialog.less';

import { Config } from '../../config';
import {
	IControlType,
	IViewBased,
	IDialogOptions,
	IDictionary,
	IJodit,
	IToolbarCollection
} from '../../types/';
import { KEY_ESC } from '../../core/constants';
import {
	$$,
	asArray,
	css,
	isJoditObject,
	splitArray
} from '../../core/helpers/';
import { ViewWithToolbar } from '../../core/view/view-with-toolbar';
import { Dom } from '../../core/dom';
import { STATUSES } from '../../core/component';
import { fullsize } from '../../plugins/fullsize/fullsize';

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
		}
	},

	fullsize: {
		...Config.prototype.controls.fullsize
	}
} as IDictionary<IControlType>;

type ContentItem = string | HTMLElement;
type Content = ContentItem | ContentItem[] | Array<ContentItem | ContentItem[]>;

/**
 * Module to generate dialog windows
 *
 * @param {Object} parent Jodit main object
 * @param {Object} [opt] Extend Options
 */
export class Dialog extends ViewWithToolbar {
	/**
	 * @property {HTMLDivElement} resizer
	 */
	private resizer!: HTMLDivElement;
	toolbar!: IToolbarCollection;

	private offsetX: number = 0;
	private offsetY: number = 0;

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

		asArray<ContentItem | ContentItem[]>(elements).forEach(
			(elm: ContentItem | ContentItem[]): any => {
				if (Array.isArray(elm)) {
					const div = this.c.div('jodit-dialog__column');

					elements_list.push(div);
					root.appendChild(div);

					return this.setElements(div, elm);
				}

				const element: HTMLElement =
					typeof elm === 'string' ? this.c.fromHTML(elm) : elm;

				elements_list.push(element);

				if (element.parentNode !== root) {
					root.appendChild(element);
				}
			}
		);

		Array.from(root.childNodes).forEach((elm: ChildNode) => {
			if (elements_list.indexOf(elm as HTMLElement) === -1) {
				root.removeChild(elm);
			}
		});
	}

	private onMouseUp = () => {
		if (this.draggable || this.resizable) {
			this.e.off(this.window, 'mousemove', this.onMouseMove);

			this.draggable = false;
			this.resizable = false;
			this.unlockSelect();
			if (this.j && this.j.events) {
				/**
				 * Fired when dialog box is finished to resizing
				 * @event endResize
				 */
				this.j.e.fire(this, 'endResize endMove');
			}
		}
	};

	/**
	 *
	 * @param {MouseEvent} e
	 */
	private onHeaderMouseDown = (e: MouseEvent) => {
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

		this.e.on(this.window, 'mousemove', this.onMouseMove);

		if (this.j && this.j.events) {
			/**
			 * Fired when dialog box is started moving
			 * @event startMove
			 */
			this.j.e.fire(this, 'startMove');
		}
	};

	private onMouseMove = (e: MouseEvent) => {
		if (this.draggable && this.o.draggable) {
			this.setPosition(
				this.startPoint.x + e.clientX - this.startX,
				this.startPoint.y + e.clientY - this.startY
			);

			if (this.j && this.j.events) {
				/**
				 * Fired when dialog box is moved
				 * @event move
				 * @param {int} dx Delta X
				 * @param {int} dy Delta Y
				 */
				this.j.e.fire(
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
			if (this.j && this.j.events) {
				/**
				 * Fired when dialog box is resized
				 * @event resizeDialog
				 * @param {int} dx Delta X
				 * @param {int} dy Delta Y
				 */
				this.j.e.fire(
					this,
					'resizeDialog',
					e.clientX - this.startX,
					e.clientY - this.startY
				);
			}
			e.stopImmediatePropagation();
			e.preventDefault();
		}
	};

	/**
	 *
	 * @param {MouseEvent} e
	 */
	private onKeyDown = (e: KeyboardEvent) => {
		if (this.isOpened() && e.which === KEY_ESC) {
			const me = this.getMaxZIndexDialog();

			if (me) {
				me.close();
			} else {
				this.close();
			}

			e.stopImmediatePropagation();
		}
	};

	private onResize = () => {
		if (
			this.options &&
			this.o.resizable &&
			!this.moved &&
			this.isOpened() &&
			!this.offsetX &&
			!this.offsetY
		) {
			this.setPosition();
		}
	};

	private onResizerMouseDown(e: MouseEvent) {
		this.resizable = true;
		this.startX = e.clientX;
		this.startY = e.clientY;
		this.startPoint.w = this.dialog.offsetWidth;
		this.startPoint.h = this.dialog.offsetHeight;

		this.lockSelect();

		if (this.j.events) {
			/**
			 * Fired when dialog box is started resizing
			 * @event startResize
			 */
			this.j.e.fire(this, 'startResize');
		}
	}

	public options!: IDialogOptions;

	/**
	 * @property {HTMLDivElement} dialog
	 */
	dialog!: HTMLDivElement;

	workplace!: HTMLDivElement;

	public dialogbox_header!: HTMLHeadingElement;
	public dialogbox_content!: HTMLDivElement;
	public dialogbox_footer!: HTMLDivElement;
	public dialogbox_toolbar!: HTMLDivElement;

	document: Document = document;
	window: Window = window;

	/**
	 * Specifies the size of the window
	 *
	 * @param {number} [w] - The width of the window
	 * @param {number} [h] - The height of the window
	 */
	setSize(w?: number | string, h?: number | string) {
		if (w) {
			css(this.dialog, 'width', w);
		}
		if (h) {
			css(this.dialog, 'height', h);
		}
	}

	/**
	 * Specifies the position of the upper left corner of the window . If x and y are specified,
	 * the window is centered on the center of the screen
	 *
	 * @param {Number} [x] - Position px Horizontal
	 * @param {Number} [y] - Position px Vertical
	 */
	setPosition(x?: number, y?: number) {
		const w: number = this.window.innerWidth,
			h: number = this.window.innerHeight;

		let left: number = w / 2 - this.dialog.offsetWidth / 2,
			top: number = h / 2 - this.dialog.offsetHeight / 2;

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
	}

	/**
	 * Specifies the dialog box title . It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content - A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setTitle('Hello world');
	 * dialog.setTitle(['Hello world', '<button>OK</button>', $('<div>some</div>')]);
	 * dialog.open();
	 * ```
	 */
	setTitle(content: Content) {
		this.setElements(this.dialogbox_header, content);
	}

	/**
	 * It specifies the contents of the dialog box. It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setTitle('Hello world');
	 * dialog.setContent('<form onsubmit="alert(1);"><input type="text" /></form>');
	 * dialog.open();
	 * ```
	 */
	setContent(content: Content) {
		this.setElements(this.dialogbox_content, content);
	}

	/**
	 * Sets the bottom of the dialog. It can take a string and an array of objects
	 *
	 * @param {string|string[]|Element|Element[]} content - A string or an HTML element ,
	 * or an array of strings and elements
	 * @example
	 * ```javascript
	 * var dialog = new Jodi.modules.Dialog(parent);
	 * dialog.setTitle('Hello world');
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
	setFooter(content: Content) {
		this.setElements(this.dialogbox_footer, content);
		this.dialog.classList.toggle('with_footer', !!content);
	}

	/**
	 * Return current Z-index
	 * @return {number}
	 */
	getZIndex(): number {
		return parseInt(this.container.style.zIndex || '0', 10);
	}

	/**
	 * Get dialog instance with maximum z-index displaying it on top of all the dialog boxes
	 *
	 * @return {Dialog}
	 */
	getMaxZIndexDialog() {
		let maxZi: number = 0,
			dlg: Dialog,
			zIndex: number,
			res: Dialog = this;

		$$('.jodit-dialog__box', this.destination).forEach(
			(dialog: HTMLElement) => {
				dlg = (dialog as any).component as Dialog;
				zIndex = parseInt(css(dialog, 'zIndex') as string, 10);

				if (dlg.isOpened() && !isNaN(zIndex) && zIndex > maxZi) {
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
	setMaxZIndex() {
		let maxzi: number = 0,
			zIndex: number = 0;

		$$('.jodit-dialog__box', this.destination).forEach(dialog => {
			zIndex = parseInt(css(dialog, 'zIndex') as string, 10);
			maxzi = Math.max(isNaN(zIndex) ? 0 : zIndex, maxzi);
		});

		this.container.style.zIndex = (maxzi + 1).toString();
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

		[this.destination, this.destination.parentNode].forEach(
			(box: Node | null) => {
				box &&
					(box as HTMLElement).classList &&
					(box as HTMLElement).classList.toggle(
						'jodit-fullsize_box',
						condition
					);
			}
		);

		this.iSetMaximization = condition;

		return condition;
	}

	/**
	 * It opens a dialog box to center it, and causes the two event.
	 *
	 * @param {string|string[]|Element|Element[]} [content]  specifies the contents of the dialog box.
	 * Can be false или undefined. see {@link Dialog~setContent|setContent}
	 * @param {string|string[]|Element|Element[]} [title]  specifies the title of the dialog box, @see setTitle
	 * @param {boolean} [destroyAfter] true - After closing the window , the destructor will be called.
	 * see {@link Dialog~destruct|destruct}
	 * @param {boolean} [modal] - true window will be opened in modal mode
	 * @fires {@link event:beforeOpen} id returns 'false' then the window will not open
	 * @fires {@link event:afterOpen}
	 */
	open(
		content?: Content,
		title?: Content,
		destroyAfter?: boolean,
		modal?: boolean
	) {
		/**
		 * Called before the opening of the dialog box
		 *
		 * @event beforeOpen
		 */
		if (this.j && this.j.events) {
			if (this.j.e.fire(this, 'beforeOpen') === false) {
				return;
			}
		}

		this.destroyAfterClose = destroyAfter === true;

		if (title !== undefined) {
			this.setTitle(title);
		}

		if (content) {
			this.setContent(content);
		}

		this.container.classList.add('jodit-dialog_active');

		if (modal) {
			this.container.classList.add('jodit-modal');
		}

		this.setPosition(this.offsetX, this.offsetY);
		this.setMaxZIndex();

		if (this.o.fullsize) {
			this.maximization(true);
		}

		/**
		 * Called after the opening of the dialog box
		 *
		 * @event afterOpen
		 */
		if (this.j && this.j.events) {
			this.j.e.fire('afterOpen', this);
		}
	}

	/**
	 * Open if the current window
	 *
	 * @return {boolean} - true window open
	 */
	isOpened(): boolean {
		return (
			!this.isDestructed &&
			this.container &&
			this.container.classList.contains('jodit-dialog_active')
		);
	}

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
	close = (e?: MouseEvent) => {
		if (this.isDestructed) {
			return;
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
		if (this.j && this.j.events) {
			this.j.e.fire('beforeClose', this);
		}

		this.container &&
			this.container.classList &&
			this.container.classList.remove('jodit-dialog_active');

		if (this.iSetMaximization) {
			this.maximization(false);
		}

		if (this.destroyAfterClose) {
			this.destruct();
		}

		/**
		 * It called after the window is closed
		 *
		 * @event afterClose
		 * @this {Dialog} current dialog
		 */
		this.j?.events?.fire(this, 'afterClose');
		this.j?.events?.fire(this.ow, 'joditCloseDialog');
	};

	constructor(jodit?: IViewBased, options: any = Config.prototype.dialog) {
		super(jodit, options);

		if (isJoditObject(jodit)) {
			this.window = jodit.ow;
			this.document = jodit.od;

			jodit.e.on('beforeDestruct', () => {
				this.destruct();
			});
		}

		const self: Dialog = this;

		const opt =
			jodit && jodit.options
				? (jodit as IJodit).o.dialog
				: Config.prototype.dialog;

		self.options = { ...opt, ...self.options } as IDialogOptions;

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

		if (jodit && (<IJodit>jodit).o.theme) {
			self.container.classList.add(
				'jodit_' + (jodit.o.theme || 'default') + '_theme'
			);
		}

		if (jodit && (<IViewBased>jodit).id) {
			(<IViewBased>jodit).markOwner(self.container);
		}

		!self.container.component && Object.defineProperty(self.container, 'component', {
			value: self
		});

		self.dialog = self.container.querySelector(
			'.jodit-dialog'
		) as HTMLDivElement;

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

		self.destination.appendChild(self.container);

		self.container.addEventListener('close_dialog', self.close as any);

		self.toolbar
			.build(splitArray(self.o.buttons))
			.appendTo(self.dialogbox_toolbar);

		self.e
			.on(this.window, 'mouseup', self.onMouseUp)
			.on(this.window, 'keydown', self.onKeyDown)
			.on(this.window, 'resize', self.onResize);

		const headerBox: HTMLDivElement | null = self.container.querySelector(
			'.jodit-dialog__header'
		);

		headerBox &&
			headerBox.addEventListener(
				'mousedown',
				self.onHeaderMouseDown.bind(self)
			);

		if (self.o.resizable) {
			self.resizer.addEventListener(
				'mousedown',
				self.onResizerMouseDown.bind(self)
			);
		}

		fullsize(self);
	}

	/**
	 * It destroys all objects created for the windows and also includes all the handlers for the window object
	 */
	destruct() {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		if (this.events) {
			this.e
				.off(this.window, 'mousemove', this.onMouseMove)
				.off(this.window, 'mouseup', this.onMouseUp)
				.off(this.window, 'keydown', this.onKeyDown)
				.off(this.window, 'resize', this.onResize);
		}

		super.destruct();
	}
}
