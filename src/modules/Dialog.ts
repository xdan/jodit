import Jodit from '../jodit'
import Component from './Component'
import config from '../config'
import {dom, $$, asArray} from './Helpers'
import Toolbar from "./Toolbar";


/**
 * @prop {object} dialog module settings {@link module:Dialog|Dialog}
 * @prop {int} dialog.zIndex=1000 Default Z-index for dialog window. {@link module:Dialog|Dialog}'s settings
 * @prop {boolean} dialog.resizable=true This dialog can resize by trigger
 * @prop {boolean} dialog.draggable=true This dialog can move by header
 * @prop {boolean} dialog.fullsize=false A dialog window will open in full screen by default
 * @prop {boolean} dialog.fullsizeButton=false In header will shown expand button
 * @memberof Jodit.defaultOptions
 */
config.dialog = {
    zIndex: 100002,
    resizable: true,
    draggable: true,
    fullsize: false,
    fullsizeButton: false,
}

/**
 * Module to generate dialog windows
 * @module Dialog
 * @param {Object} parent Jodit main object
 * @param {Object} [opt] Extend Options
 */
export default class Dialog extends Component{
    /**
     * @property {Object} options
     */
    options;
    /**
     * @property {HTMLDivElement} dialogbox
     */
    dialogbox;

    /**
     * @property {HTMLDivElement} dialog
     */
    dialog;

    /**
     * @property {HTMLDivElement} resizer
     */
    resizer;
    constructor(parent ?: Jodit, options: any = {}) {
        super(parent);
        this.options = (parent && parent.options) ? parent.options.dialog : {};
        this.options = {...this.options, ...options}

        this.dialogbox = dom('<div style="z-index:' + this.options.zIndex + '" class="jodit jodit_dialog_box">' +
             '<div class="jodit_dialog_overlay"></div>' +
             '<div class="jodit_dialog">' +
                '<div class="jodit_dialog_header non-selected">' +
                    '<h4></h4>' +
                    '<a href="javascript:void(0)" title="Close" class="jodit_close">' + (Jodit.modules.Toolbar ? Jodit.modules.Toolbar.getIcon('cancel') : '&times;') + '</a>' +
                 '</div>' +
             '<div class="jodit_dialog_content"></div>' +
             '<div class="jodit_dialog_footer"></div>' +
             (this.options.resizable ?
                 '<div class="jodit_dialog_resizer"></div>' :
              '') +
             '</div>' +
        '</div>');

        this.dialogbox.__jodit_dialog = this;

        this.dialog = this.dialogbox.querySelector('.jodit_dialog')
        this.resizer = this.dialogbox.querySelector('.jodit_dialog_resizer')

        if (this.parent && this.parent.options && this.parent.options.textIcons) {
            this.dialogbox.classList.add('jodit_text_icons');
        }

        this.dialogbox.header = this.dialogbox.querySelector('.jodit_dialog_header>h4');
        this.dialogbox.content = this.dialogbox.querySelector('.jodit_dialog_content');
        this.dialogbox.footer = this.dialogbox.querySelector('.jodit_dialog_footer');
        this.dialogbox.close = this.dialogbox.querySelector('.jodit_dialog_header>a.jodit_close');
        this.dialogbox.fullsize = dom('<a href="javascript:void(0)" class="jodit_dialog_header_fullsize">' + ((Jodit.modules.Toolbar.getIcon) ? Jodit.modules.Toolbar.getIcon(options.fullsize ? 'fullsize' : 'shrink') : '') + '</a>');

        this.destinition.appendChild(this.dialogbox);

        this.dialogbox.addEventListener('close_dialog', this.close.bind(this));

        this.dialogbox.close.addEventListener('mousedown', this.close.bind(this));

        this.dialogbox.fullsize.addEventListener('click', () => {
            let fullSize = this.maximization();
            if (Jodit.modules.Toolbar) {
                this.dialogbox.fullsize.innerHTML = Jodit.modules.Toolbar.getIcon(!fullSize ? 'fullsize' : 'shrink');
            }
        });

        this.__on(window, 'mousemove', this.onMouseMove.bind(this))
        this.__on(window, 'mouseup', this.onMouseUp.bind(this))
        this.__on(window, 'keydown', this.onKeyDown.bind(this))
        this.__on(window, 'resize', this.onResize.bind(this))


        this.dialogbox.querySelector('.jodit_dialog_header')
            .addEventListener('mousedown', this.onHeaderMouseDown.bind(this));

        if (this.options.resizable) {
            this.resizer
                .addEventListener('mousedown', this.onResizerMouseDown.bind(this));
        }
    }



    offsetX;
    offsetY;

    destinition = document.body;
    destroyAfterClose = false;

    moved = false;

    /**
     * Get dom element (div.jodit_dialog_box > .div.jodit_dialog)
     *
     * @return {HTMLDivElement}
     */
    getDialog() {
        return this.dialog;
    }

    /**
     * Get dom element (div.jodit_dialog_box)
     *
     * @return {HTMLDivElement}
     */
    getBox() {
        return this.dialogbox;
    }
    /**
     * Specifies the size of the window
     *
     * @param {integer} [w] - The width of the window
     * @param {integer} [h] - The height of the window
     */
    setSize(w?: number, h?: number) {
        if (w) {
            this.dialog.style.width = w + 'px';
        }
        if (h) {
            this.dialog.style.height = h + 'px';
        }
    }

    /**
     * Specifies the position of the upper left corner of the window . If x and y are specified, the window is centered on the center of the screen
     *
     * @param {Number} [x] - Position px Horizontal
     * @param {Number} [y] - Position px Vertical
     */
    setPosition(x ?: number, y ?: number) {
        let w: number = window.innerWidth,
            h: number = window.innerHeight,
            left: number = w / 2 - this.dialog.offsetWidth / 2,
            top: number = h / 2 - this.dialog.offsetHeight / 2;

        if (x !== undefined && y !== undefined) {
            this.offsetX = x;
            this.offsetY = y;
            this.moved = (Math.abs(x - left) > 100 || Math.abs(y - top) > 100);
        }

        this.dialog.style.left = (x || left) + 'px'
        this.dialog.style.top = (y || top) + 'px'
    }

    /**
     * Specifies the dialog box title . It can take a string and an array of objects
     *
     * @param {mixed} title - A string or an HTML element , or an array of strings and elements
     * @example
     * var dialog = new Jodi.modules.Dialog(parent);
     * dialog.setTitle('Hello world');
     * dialog.setTitle(['Hello world', '<button>OK</button>', $('<div>some</div>')]);
     * dialog.open();
     */
    setTitle(title:  string|string[]|Element|Element[]) {
        this.dialogbox.header.innerHTML = ''
        asArray(title).forEach((elm) => {
            this.dialogbox.header.appendChild(dom(elm));
        })
    }

    /**
     * It specifies the contents of the dialog box. It can take a string and an array of objects
     *
     * @param {mixed} content A string or an HTML element , or an array of strings and elements
     * @example
     * var dialog = new Jodi.modules.Dialog(parent);
     * dialog.setTitle('Hello world');
     * dialog.setContent('<form onsubmit="alert(1);"><input type="text" /></form>');
     * dialog.open();
     */
    setContent(content: string|string[]|Element|Element[]) {
        this.dialogbox.content.innerHTML = ''
        asArray(content).forEach((elm) => {
            this.dialogbox.content.appendChild(dom(elm));
        })
    }

    /**
     * Sets the bottom of the dialog. It can take a string and an array of objects
     *
     * @param {mixed} content - A string or an HTML element , or an array of strings and elements
     * @example
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
     */
    setFooter(content: string|string[]|Element|Element[]) {
        this.dialogbox.footer.innerHTML = ''
        asArray(content).forEach((elm) => {
            this.dialogbox.footer.appendChild(dom(elm));
        })
        this.dialog.classList.toggle('with_footer', !!content);
    }

    /**
     * Get dialog instance with maximum z-index displaying it on top of all the dialog boxes
     *
     * @return {Dialog}
     */
    getMaxZIndexDialog() {
        let maxzi = 0, dlg, zi, res = this;
        $$('.jodit_dialog_box', document.body).forEach((dialog) => {
            dlg = dialog.__jodit_dialog;
            zi = parseInt(dialog.style.zIndex || 0, 10);
            if (dlg.isOpened() &&  zi > maxzi) {
                res = dlg;
                maxzi = zi;
            }
        });
        return res;
    }

    /**
     * Sets the maximum z-index dialog box, displaying it on top of all the dialog boxes
     */
    setMaxZIndex() {
        let maxzi = 0;
        $$('.jodit_dialog_box', document.body).forEach((dialog) => {
            maxzi = Math.max(parseInt(dialog.style.zIndex, 10), maxzi);
        });

        this.dialogbox
            .style.zIndex = maxzi + 1;
    }

    iSetMaximization: boolean = false;

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

        [document.body, document.body.parentNode].forEach((box: HTMLElement) => {
            box.classList.toggle('jodit_fullsize_box', condition);
        })

        this.iSetMaximization = condition;

        return condition;
    }

    /**
     * It opens a dialog box to center it, and causes the two event.
     *
     * @param {mixed} [content]  specifies the contents of the dialog box. Can be false или undefined. see {@link module:Dialog~setContent|setContent}
     * @param {mixed} [title]  specifies the title of the dialog box, @see setTitle
     * @param {boolean} [destroyAfter] true - After closing the window , the destructor will be called. see {@link module:Dialog~destroy|destroy}
     * @param {boolean} [modal] - true window will be opened in modal mode
     * @fires {@link event:beforeOpen|beforeOpen} id returns 'false' then the window will not open
     * @fires {@link event:afterOpen|afterOpen}
     */
    open(content?: string|Element, title?: string|string[]|any[], destroyAfter?: boolean, modal?: boolean) {
        /**
         * Called before the opening of the dialog box
         *
         * @event beforeOpen
         * @this {module:Dialog} current dialog
         */
        if (this.parent && this.parent.events) {
            if (this.parent.events.fire(this, 'beforeOpen') === false) {
                return;
            }
        }

        this.destroyAfterClose = (destroyAfter === true);

        if (this.options.fullsizeButton) {
            this.dialogbox.close.parentNode.insertBefore(this.dialogbox.fullsize, this.dialogbox.close)
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
         * @this {module:Dialog} current dialog
         */
        if (this.parent && this.parent.events) {
            this.parent.events.fire(this, 'afterOpen');
        }
    }

    /**
     * Open if the current window
     * @method isOpened
     * @return {boolean} - true window open
     */
    isOpened() {
        return this.dialogbox.classList.contains('active');
    }

    resizeble = false;
    draggable = false;
    startX;
    startY;
    startPoint = {x: 0, y: 0, w: 0, h: 0};

    onMouseUp() {
        if (this.draggable || this.resizeble) {
            this.draggable = false;
            this.resizeble = false;
            if (this.parent && this.parent.events) {
                /**
                 * Fired when dialog box is finished to resizing
                 * @event endResize
                 */
                this.parent.events.fire(this, 'endResize endMove');
            }
        }
    }

    /**
     *
     * @param {MouseEvent} e
     */
    onHeaderMouseDown(e) {
        if (!this.options.draggable) {
            return;
        }
        this.draggable = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.x = parseInt(this.dialog.style.left || 0, 10);
        this.startPoint.y = parseInt(this.dialog.style.top || 0, 10);
        this.setMaxZIndex();
        e.preventDefault();
        if (this.parent && this.parent.events) {
            /**
             * Fired when dialog box is started moving
             * @event startMove
             */
            this.parent.events.fire(this, 'startMove');
        }
    }
    onMouseMove(e) {
        if (this.draggable && this.options.draggable) {
            this.setPosition(this.startPoint.x + e.clientX - this.startX, this.startPoint.y + e.clientY - this.startY);
            if (this.parent && this.parent.events) {
                /**
                 * Fired when dialog box is moved
                 * @event move
                 * @param {int} dx Delta X
                 * @param {int} dy Delta Y
                 */
                this.parent.events.fire(this, 'move', [e.clientX - this.startX, e.clientY - this.startY]);
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (this.resizeble && this.options.resizable) {
            this.setSize(this.startPoint.w + e.clientX - this.startX, this.startPoint.h + e.clientY - this.startY);
            if (this.parent && this.parent.events) {
                /**
                 * Fired when dialog box is resized
                 * @event resizeDialog
                 * @param {int} dx Delta X
                 * @param {int} dy Delta Y
                 */
                this.parent.events.fire(this, 'resizeDialog', [e.clientX - this.startX, e.clientY - this.startY]);
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }
    /**
     *
     * @param {MouseEvent} e
     */
    onKeyDown(e) {
        if (this.isOpened() && e.which === 27) {
            let me = this.getMaxZIndexDialog();

            if (me) {
                me.close();
            } else {
                this.close();
            }
            e.stopImmediatePropagation();
        }
    }

    onResize() {
        if (this.options.resizable && !this.moved && this.isOpened() && !this.offsetX && !this.offsetY) {
            this.setPosition();
        }
    }
    /**
     * It destroys all objects created for the windows and also includes all the handlers for the window object
     */
    destruct () {
        this.dialogbox.parentNode.removeChild(this.dialogbox);
        delete this.dialogbox;
        super.destruct();
    }

    /**
     * Closes the dialog box , if you want to call the method {@link module:Dialog~destroy|destroy}
     *
     * @see destroy
     * @method close
     * @fires beforeClose
     * @fires afterClose
     * @example
     * //You can close dialog two ways
     * var dialog = new Jodit.modules.Dialog();
     * dialog.open('Hello world!', 'Title');
     * var $close = $('<a href="javascript:void(0)" style="float:left;" class="jodit_button"><i class="icon icon-check"></i>&nbsp;' + Jodit.prototype.i18n('Ok') + '</a>');
     * $close.on('click', function () {
     *     dialog.close();
     * });
     * dialog.setFooter($close);
     * // and second way, you can close dialog from content
     * dialog.open('<a onclick="$(this).closest('.jodit_dialog_box').trigger('close_dialog')">Close</a>', 'Title');
     */
    close() {
        /**
         * Called up to close the window
         *
         * @event beforeClose
         * @this {module:Dialog} current dialog
         */
        if (this.parent && this.parent.events) {
            this.parent.events.fire(this, 'beforeClose');
        }
        this.dialogbox.classList.remove('active');

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
         * @this {module:Dialog} current dialog
         */
        if (this.parent) {
            this.parent.events.fire(this, 'afterClose');
        }
    }
    onResizerMouseDown(e) {
        this.resizeble = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.w = this.dialog.offsetWidth;
        this.startPoint.h = this.dialog.offsetHeight;
        if (this.parent.events) {
            /**
             * Fired when dialog box is started resizing
             * @event startResize
             */
            this.parent.events.fire(this, 'startResize');
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
 * @memberof Jodit
 * @static
 * @example
 * Jodit.Alert("File was uploaded");
 * Jodit.Alert("File was uploaded", "Message");
 * Jodit.Alert("File was uploaded", function() {
 *    $('form').hide();
 * });
 * Jodit.Alert("File wasn't uploaded", "Error", function() {
 *    $('form').hide();
 * });
 */
export const Alert = (msg: string, title: string|Function, callback: Function) => {
    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    let dialog = new Dialog(),
        $div = dom('<div class="jodit_alert"></div>'),
        $ok = dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + Jodit.prototype.i18n('Ok') + '</a>');

    $div.innerHTML = msg;

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
}

Jodit['Alert'] = Alert;


/**
 * Show `promt` dialog. Work without Jodit object
 *
 * @method Promt
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @memberof Jodit
 * @static
 * @example
 * Jodit.Promt("Enter your name", "Promt Dialog", function (name) {
 *     if (name.length < 3) {
 *         Jodit.Alert("The name must be at least 3 letters");
 *         return false;
 *     }
 *     // do something
 * });
 */
export const Promt = (msg: string, title: string|Function, callback: Function, placeholder: string) => {
    let dialog = new Dialog(),
        $cancel,
        $ok,
        $div = dom('<form class="jodit_promt"></form>'),
        $input = dom('<input autofocus="true" type="text"/>'),
        $label = dom('<label></label>');

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    if (placeholder) {
        $input.setAttribute('placeholder', placeholder);
    }

    $label.innerHTML = msg;
    $div.appendChild($label);
    $div.appendChild($input);
    $cancel = dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + Toolbar.getIcon('cancel') + '<span>' + Jodit.prototype.i18n('Cancel') + '</span></a>').on('click', dialog.close);

    $ok = dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + Toolbar.getIcon('check') + '<span>' + Jodit.prototype.i18n('Ok') + '</span></a>');

    const onclick = () => {
        if (!callback || typeof callback !== 'function' || callback($input.value) !== false) {
            dialog.close();
        }
    };

    $ok.addEventListener('click', onclick);

    $div.on('submit', () => {
        onclick();
        return false;
    });

    dialog.setFooter([
        $ok,
        $cancel
    ]);

    dialog.open($div, <string>title || '&nbsp;', true, true);
    $input.focus();
}
Jodit['Promt'] = Promt;

/**
 * Show `confirm` dialog. Work without Jodit object
 *
 * @method Confirm
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @memberof Jodit
 * @static
 * @example
 * Jodit.Confirm("Are you shure?", "Confirm Dialog", function (yes) {
 *     if (yes) {
 *         // do something
 *     }
 * });
 */
export const Confirm = (msg: string, title: string|Function, callback: Function) => {
    let dialog = new Dialog(),
        $cancel,
        $ok,
        $div = dom('<form class="jodit_promt"></form>'),
        $label = dom('<label></label>');

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    $label.innerHTML = msg;
    $div.appendChild($label);

    $cancel = dom('<a href="javascript:void(0)" style="float:right;" class="jodit_button">' + Toolbar.getIcon('cancel') + '<span>' + Jodit.prototype.i18n('Cancel') + '</span></a>')

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

    $ok = dom('<a href="javascript:void(0)" style="float:left;" class="jodit_button">' + Toolbar.getIcon('check') + '<span>' + Jodit.prototype.i18n('Yes') + '</span></a>')

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
}
Jodit['Confirm'] = Confirm;
