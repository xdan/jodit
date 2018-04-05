/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit'
import {Component, IViewBased} from './Component'
import {Config} from '../Config'
import {dom, $$, asArray, css} from './Helpers'
import {ToolbarIcon} from "./ToolbarCollection";
import {KEY_ESC} from "../constants";
import {EventsNative} from "./EventsNative";


/**
 * @property{object} dialog module settings {@link Dialog|Dialog}
 * @property{int} dialog.zIndex=1000 Default Z-index for dialog window. {@link Dialog|Dialog}'s settings
 * @property{boolean} dialog.resizable=true This dialog can resize by trigger
 * @property{boolean} dialog.draggable=true This dialog can move by header
 * @property{boolean} dialog.fullsize=false A dialog window will open in full screen by default
 * @property{boolean} dialog.fullsizeButton=false In header will shown expand button
 */

type DialogOptions = {
    zIndex?: number;
    resizable?: boolean;
    draggable?: boolean;
    fullsize?: boolean;
    fullsizeButton?: boolean;
}

declare module "../Config" {
    interface Config {
        dialog: DialogOptions;
    }
}

Config.prototype.dialog = {
    zIndex: 100002,
    resizable: true,
    draggable: true,
    fullsize: false,
    fullsizeButton: false,
};

/**
 * Module to generate dialog windows
 *
 * @param {Object} parent Jodit main object
 * @param {Object} [opt] Extend Options
 */
export class Dialog extends Component {
    events: EventsNative;

    private lockSelect = () => {
        this.dialogbox.classList.add('jodit_dialog_box-moved');
    };
    private unlockSelect = () => {
        this.dialogbox.classList.remove('jodit_dialog_box-moved');
    };

    private options: DialogOptions;

    /**
     * @property {HTMLDivElement} dialogbox
     */
    dialogbox: HTMLDivElement;

    /**
     * @property {HTMLDivElement} dialog
     */
    dialog: HTMLDivElement;
    
    /**
     * @property {HTMLDivElement} resizer
     */
    private resizer: HTMLDivElement;

    public dialogbox_header: HTMLHeadingElement;
    public dialogbox_content: HTMLDivElement;
    public dialogbox_footer: HTMLDivElement;
    public dialogbox_close: HTMLAnchorElement;
    public dialogbox_fullsize: HTMLAnchorElement;

    constructor(jodit ?: IViewBased, options: DialogOptions = {}) {
        super(jodit);
        
        if (jodit && jodit instanceof Jodit) {
            this.window = jodit.ownerWindow;
            this.document = jodit.ownerDocument;
            jodit.events.on('beforeDestruct', () => {
                this.destruct();
            });
        }

        this.events = (jodit && jodit.events) ? jodit.events : new EventsNative();

        const self: Dialog = this;

        self.options = (jodit && (<Jodit>jodit).options) ? (<Jodit>jodit).options.dialog : Config.prototype.dialog;
        self.options = {...self.options, ...options};

        self.dialogbox = <HTMLDivElement>dom('<div style="z-index:' + self.options.zIndex + '" class="jodit jodit_dialog_box">' +
             '<div class="jodit_dialog_overlay"></div>' +
             '<div class="jodit_dialog">' +
                '<div class="jodit_dialog_header non-selected">' +
                    '<div class="jodit_dialog_header-title"></div>' +
                    '<a href="javascript:void(0)" title="Close" class="jodit_dialog_header-button jodit_close">' + (Jodit.modules.Toolbar ? Jodit.modules.ToolbarIcon.getIcon('cancel') : '&times;') + '</a>' +
                 '</div>' +
             '<div class="jodit_dialog_content"></div>' +
             '<div class="jodit_dialog_footer"></div>' +
             (self.options.resizable ?
                 '<div class="jodit_dialog_resizer"></div>' :
              '') +
             '</div>' +
        '</div>', this.document);

        if (jodit && jodit.id) {
            self.dialogbox.setAttribute('data-editor_id', jodit.id);
        }

        Object.defineProperty(self.dialogbox, '__jodit_dialog',{
            value: self
        });

        self.dialog = <HTMLDivElement>self.dialogbox.querySelector('.jodit_dialog');
        self.resizer = <HTMLDivElement>self.dialogbox.querySelector('.jodit_dialog_resizer');

        if (self.jodit && self.jodit.options && self.jodit.options.textIcons) {
            self.dialogbox.classList.add('jodit_text_icons');
        }

        self.dialogbox_header = <HTMLHeadingElement>self.dialogbox.querySelector('.jodit_dialog_header>.jodit_dialog_header-title');
        self.dialogbox_content = <HTMLDivElement>self.dialogbox.querySelector('.jodit_dialog_content');
        self.dialogbox_footer = <HTMLDivElement>self.dialogbox.querySelector('.jodit_dialog_footer');
        self.dialogbox_close = <HTMLAnchorElement>self.dialogbox.querySelector('.jodit_dialog_header>a.jodit_close');
        self.dialogbox_fullsize = <HTMLAnchorElement>dom('<a href="javascript:void(0)" class="jodit_dialog_header-button jodit_dialog_header_fullsize">' + ToolbarIcon.getIcon(!options.fullsize ? 'fullsize' : 'shrink') + '</a>', this.document);

        self.destinition.appendChild(self.dialogbox);

        self.dialogbox.addEventListener('close_dialog', <any>self.close);

        self.dialogbox_close.addEventListener('mousedown', self.close);

        self.dialogbox_fullsize.addEventListener('click', () => {
            const fullSize: boolean = self.maximization();
            self.dialogbox_fullsize.innerHTML = ToolbarIcon.getIcon(!fullSize ? 'fullsize' : 'shrink');
        });

        self.events
            .on(this.window, 'mousemove', self.onMouseMove.bind(self))
            .on(this.window, 'mouseup', self.onMouseUp.bind(self))
            .on(this.window, 'keydown', self.onKeyDown.bind(self))
            .on(this.window, 'resize', self.onResize.bind(self));

        const headerBox: HTMLDivElement|null = self.dialogbox.querySelector('.jodit_dialog_header');

        headerBox && headerBox.addEventListener('mousedown', self.onHeaderMouseDown.bind(self));

        if (self.options.resizable) {
            self.resizer
                .addEventListener('mousedown', self.onResizerMouseDown.bind(self));
        }
    }



    private offsetX: number;
    private offsetY: number;

    private destinition: HTMLElement = document.body;
    public document: Document = document;
    public window: Window = window;
    private destroyAfterClose:boolean = false;

    private moved: boolean = false;

    /**
     * Get dom element (div.jodit_dialog_box > .div.jodit_dialog)
     *
     * @return {HTMLDivElement}
     */
    // getDialog() {
    //     return this.dialog;
    // }

    /**
     * Get dom element (div.jodit_dialog_box)
     *
     * @return {HTMLDivElement}
     */
    // getBox() {
    //     return this.dialogbox;
    // }
    /**
     * Specifies the size of the window
     *
     * @param {number} [w] - The width of the window
     * @param {number} [h] - The height of the window
     */
    setSize(w?: number|string, h?: number|string) {
        if (w) {
            css(this.dialog, 'width', w)
        }
        if (h) {
            css(this.dialog, 'height', h)
        }
    }

    /**
     * Specifies the position of the upper left corner of the window . If x and y are specified, the window is centered on the center of the screen
     *
     * @param {Number} [x] - Position px Horizontal
     * @param {Number} [y] - Position px Vertical
     */
    setPosition(x ?: number, y ?: number) {
        let w: number = this.window.innerWidth,
            h: number = this.window.innerHeight,
            left: number = w / 2 - this.dialog.offsetWidth / 2,
            top: number = h / 2 - this.dialog.offsetHeight / 2;

        if (x !== undefined && y !== undefined) {
            this.offsetX = x;
            this.offsetY = y;
            this.moved = (Math.abs(x - left) > 100 || Math.abs(y - top) > 100);
        }

        this.dialog.style.left = (x || left) + 'px';
        this.dialog.style.top = (y || top) + 'px';
    }

    private setElements(root: HTMLDivElement|HTMLHeadingElement, elements: string|Element|Array<string|Element>) {
        let elements_list: HTMLElement[] = [];
        asArray(elements).forEach((elm) => {
            let element: HTMLElement = dom(elm, this.document);
            elements_list.push(element);
            if (element.parentNode !== root) {
                root.appendChild(element);
            }
        });
        [].slice.call(root.childNodes).forEach((elm: HTMLElement) => {
            if (elements_list.indexOf(elm) === -1) {
                root.removeChild(elm);
            }
        });
    }
    /**
     * Specifies the dialog box title . It can take a string and an array of objects
     *
     * @param {string|string[]|Element|Element[]} content - A string or an HTML element , or an array of strings and elements
     * @example
     * ```javascript
     * var dialog = new Jodi.modules.Dialog(parent);
     * dialog.setTitle('Hello world');
     * dialog.setTitle(['Hello world', '<button>OK</button>', $('<div>some</div>')]);
     * dialog.open();
     * ```
     */
    setTitle(content:  string | Element | Array<string | Element>) {
        this.setElements(this.dialogbox_header, content);
    }

    /**
     * It specifies the contents of the dialog box. It can take a string and an array of objects
     *
     * @param {string|string[]|Element|Element[]} content A string or an HTML element , or an array of strings and elements
     * @example
     * ```javascript
     * var dialog = new Jodi.modules.Dialog(parent);
     * dialog.setTitle('Hello world');
     * dialog.setContent('<form onsubmit="alert(1);"><input type="text" /></form>');
     * dialog.open();
     * ```
     */
    setContent(content: string|Element|Array<string|Element>) {
        this.setElements(this.dialogbox_content, content);
    }

    /**
     * Sets the bottom of the dialog. It can take a string and an array of objects
     *
     * @param {string|string[]|Element|Element[]} content - A string or an HTML element , or an array of strings and elements
     * @example
     * ```javascript
     * var dialog = new Jodi.modules.Dialog(parent);
     * dialog.setTitle('Hello world');
     * dialog.setContent('<form><input id="someText" type="text" /></form>');
     * dialog.setFooter([
     *  $('<a class="jodit_button">OK</a>').click(function () {
     *      alert($('someText').val())
     *      dialog.close();
     *  })
     * ]);
     * dialog.open();
     * ```
     */
    setFooter(content: string|Element|Array<string|Element>) {
        this.setElements(this.dialogbox_footer, content);
        this.dialog.classList.toggle('with_footer', !!content);
    }

    /**
     * Return current Z-index
     * @return {number}
     */
    getZIndex(): number {
        return parseInt(this.dialogbox.style.zIndex || '0', 10);
    }
    /**
     * Get dialog instance with maximum z-index displaying it on top of all the dialog boxes
     *
     * @return {Dialog}
     */
    getMaxZIndexDialog() {
        let maxzi: number = 0,
            dlg: Dialog,
            zIndex: number,
            res: Dialog = this;

        $$('.jodit_dialog_box', this.destinition).forEach((dialog: HTMLElement) => {
            dlg = <Dialog>(<any>dialog)['__jodit_dialog'];
            zIndex = parseInt(<string>css(dialog, 'zIndex'), 10);
            if (dlg.isOpened() && !isNaN(zIndex) && zIndex > maxzi) {
                res = dlg;
                maxzi = zIndex;
            }
        });

        return res;
    }

    /**
     * Sets the maximum z-index dialog box, displaying it on top of all the dialog boxes
     */
    setMaxZIndex() {
        let maxzi: number = 0,
            zIndex: number = 0;

        $$('.jodit_dialog_box', this.destinition).forEach((dialog) => {
            zIndex = parseInt(<string>css(dialog, 'zIndex'), 10);
            maxzi = Math.max(isNaN(zIndex) ? 0 : zIndex, maxzi);
        });

        this.dialogbox
            .style.zIndex = (maxzi + 1).toString();
    }

    private iSetMaximization: boolean = false;

    /**
     * Expands the dialog on full browser window
     *
     * @param {boolean} condition true - fullsize
     * @return {boolean} true - fullsize
     */
    maximization(condition?: boolean): boolean {
        if (typeof condition !== 'boolean') {
            condition = !this.dialogbox.classList.contains('jodit_dialog_box-fullsize');
        }

        this.dialogbox.classList
            .toggle('jodit_dialog_box-fullsize', condition);

        [this.destinition, this.destinition.parentNode].forEach((box: Node | null) => {
            box && (<HTMLElement>box).classList && (<HTMLElement>box).classList.toggle('jodit_fullsize_box', condition);
        });

        this.iSetMaximization = condition;

        return condition;
    }

    /**
     * It opens a dialog box to center it, and causes the two event.
     *
     * @param {string|string[]|Element|Element[]} [content]  specifies the contents of the dialog box. Can be false или undefined. see {@link Dialog~setContent|setContent}
     * @param {string|string[]|Element|Element[]} [title]  specifies the title of the dialog box, @see setTitle
     * @param {boolean} [destroyAfter] true - After closing the window , the destructor will be called. see {@link Dialog~destruct|destruct}
     * @param {boolean} [modal] - true window will be opened in modal mode
     * @fires {@link event:beforeOpen} id returns 'false' then the window will not open
     * @fires {@link event:afterOpen}
     */
    open(content?: string|Element|Array<string|Element>, title?: string|Element|Array<string|Element>, destroyAfter?: boolean, modal?: boolean) {
        /**
         * Called before the opening of the dialog box
         *
         * @event beforeOpen
         */
        if (this.jodit && this.jodit.events) {
            if (this.jodit.events.fire(this, 'beforeOpen') === false) {
                return;
            }
        }

        this.destroyAfterClose = (destroyAfter === true);

        if (this.options.fullsizeButton && this.dialogbox_close.parentNode) {
            this.dialogbox_close.parentNode.appendChild(this.dialogbox_fullsize)
        }

        if (title !== undefined) {
            this.setTitle(title);
        }

        if (content) {
            this.setContent(content);
        }

        this.dialogbox.classList.add('active');
        if (modal) {
            this.dialogbox.classList.add('jodit_modal');
        }

        this.setPosition(this.offsetX, this.offsetY);
        this.setMaxZIndex();

        if (this.options.fullsize) {
            this.maximization(true);
        }
        /**
         * Called after the opening of the dialog box
         *
         * @event afterOpen
         */
        if (this.jodit && this.jodit.events) {
            this.jodit.events.fire(this, 'afterOpen');
        }
    }

    /**
     * Open if the current window
     *
     * @return {boolean} - true window open
     */
    isOpened(): boolean {
        return !this.__isDestructed && this.dialogbox.classList.contains('active');
    }

    private resizeble: boolean = false;
    private draggable: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private startPoint = {x: 0, y: 0, w: 0, h: 0};

    private onMouseUp() {
        if (this.draggable || this.resizeble) {
            this.draggable = false;
            this.resizeble = false;
            this.unlockSelect();
            if (this.jodit && this.jodit.events) {
                /**
                 * Fired when dialog box is finished to resizing
                 * @event endResize
                 */
                this.jodit.events.fire(this, 'endResize endMove');
            }
        }
    }

    /**
     *
     * @param {MouseEvent} e
     */
    private onHeaderMouseDown(e: MouseEvent) {
        const target: HTMLElement = <HTMLElement>e.target;
        if (!this.options.draggable || (target && target.nodeName.match(/^(INPUT|SELECT)$/))) {
            return;
        }
        this.draggable = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.x = <number>css(this.dialog, 'left');
        this.startPoint.y = <number>css(this.dialog, 'top');

        this.setMaxZIndex();
        e.preventDefault();

        this.lockSelect();

        if (this.jodit && this.jodit.events) {
            /**
             * Fired when dialog box is started moving
             * @event startMove
             */
            this.jodit.events.fire(this, 'startMove');
        }
    }
    private onMouseMove(e: MouseEvent) {
        if (this.draggable && this.options.draggable) {
            this.setPosition(this.startPoint.x + e.clientX - this.startX, this.startPoint.y + e.clientY - this.startY);
            if (this.jodit && this.jodit.events) {
                /**
                 * Fired when dialog box is moved
                 * @event move
                 * @param {int} dx Delta X
                 * @param {int} dy Delta Y
                 */
                this.jodit.events.fire(this, 'move', e.clientX - this.startX, e.clientY - this.startY);
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (this.resizeble && this.options.resizable) {
            this.setSize(this.startPoint.w + e.clientX - this.startX, this.startPoint.h + e.clientY - this.startY);
            if (this.jodit && this.jodit.events) {
                /**
                 * Fired when dialog box is resized
                 * @event resizeDialog
                 * @param {int} dx Delta X
                 * @param {int} dy Delta Y
                 */
                this.jodit.events.fire(this, 'resizeDialog', e.clientX - this.startX, e.clientY - this.startY);
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }
    /**
     *
     * @param {MouseEvent} e
     */
    private onKeyDown(e: KeyboardEvent) {
        if (this.isOpened() && e.which === KEY_ESC) {
            let me = this.getMaxZIndexDialog();

            if (me) {
                me.close();
            } else {
                this.close();
            }
            e.stopImmediatePropagation();
        }
    }

    private onResize() {
        if (this.options.resizable && !this.moved && this.isOpened() && !this.offsetX && !this.offsetY) {
            this.setPosition();
        }
    }

    private __isDestructed: boolean = false;
    /**
     * It destroys all objects created for the windows and also includes all the handlers for the window object
     */
    destruct () {
        if (this.__isDestructed) {
            return;
        }

        if (this.dialogbox && this.dialogbox.parentNode) {
            this.dialogbox.parentNode.removeChild(this.dialogbox);
        }

        delete this.dialogbox;

        if (!this.jodit || !this.jodit.events) {
            this.events.destruct();
        }

        this.__isDestructed = true;
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
     * var $close = Jodit.modules.helper.dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button"><i class="icon icon-check"></i>&nbsp;' + Jodit.prototype.i18n('Ok') + '</a>');
     * $close.addEventListener('click', function () {
     *     dialog.close();
     * });
     * dialog.setFooter($close);
     * // and second way, you can close dialog from content
     * dialog.open('<a onclick="var event = doc.createEvent('HTMLEvents'); event.initEvent('close_dialog', true, true); this.dispatchEvent(event)">Close</a>', 'Title');
     * ```
     */
    close = (e?: MouseEvent) => {
        if (this.__isDestructed) {
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
        if (this.jodit && this.jodit.events) {
            this.jodit.events.fire(this, 'beforeClose');
        }


        this.dialogbox.classList && this.dialogbox.classList.remove('active');

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
        if (this.jodit && this.jodit.events) {
            this.jodit.events.fire(this, 'afterClose');
        }
    };
    private onResizerMouseDown(e: MouseEvent) {
        this.resizeble = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.w = this.dialog.offsetWidth;
        this.startPoint.h = this.dialog.offsetHeight;

        this.lockSelect();

        if (this.jodit.events) {
            /**
             * Fired when dialog box is started resizing
             * @event startResize
             */
            this.jodit.events.fire(this, 'startResize');
        }
    }
}

/**
 * Show `alert` dialog. Work without Jodit object
 *
 * @method Alert
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback
 * @param {string} [className]
 * @example
 * ```javascript
 * Jodit.Alert("File was uploaded");
 * Jodit.Alert("File was uploaded", "Message");
 * Jodit.Alert("File was uploaded", function() {
 *    $('form').hide();
 * });
 * Jodit.Alert("File wasn't uploaded", "Error", function() {
 *    $('form').hide();
 * });
 * ```
 */
export const Alert = (msg: string | HTMLElement, title?: string|Function, callback?: Function, className: string = 'jodit_alert'): Dialog => {
    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    const dialog: Dialog = new Dialog(),
        $div: HTMLDivElement = <HTMLDivElement>dom('<div class="' + className + '"></div>', dialog.document),
        $ok: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + ToolbarIcon.getIcon('cancel') + '<span>' + Jodit.prototype.i18n('Ok') + '</span></a>', dialog.document);

    $div.appendChild(dom(msg, dialog.document));

    $ok.addEventListener('click', function () {
        if (!callback || typeof callback !== 'function' || callback(dialog) !== false) {
            dialog.close();
        }
    });

    dialog.setFooter([
        $ok
    ]);

    dialog.open($div, <string>title || '&nbsp;', true, true);
    $ok.focus();

    return dialog;
};

(<any>Jodit)['Alert'] = Alert;


/**
 * Show `promt` dialog. Work without Jodit object
 *
 * @method Promt
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @param {string} [placeholder] Placeholder for input
 * @example
 * ```javascript
 * Jodit.Promt("Enter your name", "Promt Dialog", function (name) {
 *     if (name.length < 3) {
 *         Jodit.Alert("The name must be at least 3 letters");
 *         return false;
 *     }
 *     // do something
 * });
 * ```
 */
export const Promt = (msg: string, title: string|Function|undefined, callback: Function, placeholder?: string): Dialog => {
    const dialog: Dialog = new Dialog(),
        $cancel: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + ToolbarIcon.getIcon('cancel') + '<span>' + Jodit.prototype.i18n('Cancel') + '</span></a>', dialog.document),
        $ok: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + ToolbarIcon.getIcon('check') + '<span>' + Jodit.prototype.i18n('Ok') + '</span></a>', dialog.document),
        $div: HTMLDivElement = <HTMLDivElement>dom('<form class="jodit_promt"></form>', dialog.document),
        $input: HTMLInputElement = <HTMLInputElement>dom('<input autofocus/>', dialog.document),
        $label: HTMLLabelElement = <HTMLLabelElement>dom('<label></label>', dialog.document);

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    if (placeholder) {
        $input.setAttribute('placeholder', placeholder);
    }


    $label.appendChild(dom(msg, dialog.document));
    $div.appendChild($label);
    $div.appendChild($input);

    $cancel.addEventListener('click', dialog.close, false);


    const onclick = () => {
        if (!callback || typeof callback !== 'function' || callback($input.value) !== false) {
            dialog.close();
        }
    };

    $ok.addEventListener('click', onclick);

    $div.addEventListener('submit', () => {
        onclick();
        return false;
    });

    dialog.setFooter([
        $ok,
        $cancel
    ]);

    dialog.open($div, <string>title || '&nbsp;', true, true);
    $input.focus();

    return dialog;
};

(<any>Jodit)['Promt'] = Promt;

/**
 * Show `confirm` dialog. Work without Jodit object
 *
 * @method Confirm
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @example
 * ```javascript
 * Jodit.Confirm("Are you shure?", "Confirm Dialog", function (yes) {
 *     if (yes) {
 *         // do something
 *     }
 * });
 * ```
 */
export const Confirm = (msg: string, title: string|((yes: boolean) => void)|undefined, callback?: (yes: boolean) => void): Dialog => {
    const dialog = new Dialog(),
        $div: HTMLDivElement = <HTMLDivElement>dom('<form class="jodit_promt"></form>', dialog.document),
        $label: HTMLLabelElement = <HTMLLabelElement>dom('<label></label>', dialog.document);

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    $label.appendChild(dom(msg, dialog.document));
    $div.appendChild($label);

    const $cancel: HTMLAnchorElement  = <HTMLAnchorElement>dom(
        '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
            ToolbarIcon.getIcon('cancel') +
            '<span>' + Jodit.prototype.i18n('Cancel') + '</span>' +
        '</a>',
        dialog.document
    );

    $cancel.addEventListener('click', () => {
        if (callback) {
            callback(false);
        }
        dialog.close();
    });

    const onok = () => {
        if (callback) {
            callback(true);
        }
        dialog.close();
    };

    const $ok: HTMLAnchorElement  = <HTMLAnchorElement>dom(
        '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            ToolbarIcon.getIcon('check') + '<span>' + Jodit.prototype.i18n('Yes') + '</span>' +
        '</a>',
        dialog.document
    );

    $ok.addEventListener('click', onok);

    $div.addEventListener('submit', () => {
        onok();
        return false;
    });

    dialog.setFooter([
        $ok,
        $cancel
    ]);

    dialog.open($div, <string>title || '&nbsp;', true, true);
    $ok.focus();

    return dialog;
};
(<any>Jodit)['Confirm'] = Confirm;
