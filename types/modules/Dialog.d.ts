/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { EventsNative } from "./EventsNative";
import { View } from "./view/view";
import { IViewBased, IViewOptions } from "./view/type";
/**
 * @property{object} dialog module settings {@link Dialog|Dialog}
 * @property{int} dialog.zIndex=1000 Default Z-index for dialog window. {@link Dialog|Dialog}'s settings
 * @property{boolean} dialog.resizable=true This dialog can resize by trigger
 * @property{boolean} dialog.draggable=true This dialog can move by header
 * @property{boolean} dialog.fullsize=false A dialog window will open in full screen by default
 * @property{Buttons} dialog.buttons=['close.dialog', 'fullsize.dialog']
 */
export interface DialogOptions extends IViewOptions {
    resizable?: boolean;
    draggable?: boolean;
}
declare module "../Config" {
    interface Config {
        dialog: DialogOptions;
    }
}
/**
 * Module to generate dialog windows
 *
 * @param {Object} parent Jodit main object
 * @param {Object} [opt] Extend Options
 */
export declare class Dialog extends View implements IViewBased {
    events: EventsNative;
    private lockSelect;
    private unlockSelect;
    options: DialogOptions;
    /**
     * @property {HTMLDivElement} dialog
     */
    dialog: HTMLDivElement;
    /**
     * @property {HTMLDivElement} resizer
     */
    private resizer;
    dialogbox_header: HTMLHeadingElement;
    dialogbox_content: HTMLDivElement;
    dialogbox_footer: HTMLDivElement;
    dialogbox_toolbar: HTMLDivElement;
    constructor(jodit?: IViewBased, options?: any);
    private offsetX;
    private offsetY;
    private destinition;
    document: Document;
    window: Window;
    private destroyAfterClose;
    private moved;
    /**
     * Get dom element (div.jodit_dialog_box > .div.jodit_dialog)
     *
     * @return {HTMLDivElement}
     */
    /**
     * Get dom element (div.jodit_dialog_box)
     *
     * @return {HTMLDivElement}
     */
    /**
     * Specifies the size of the window
     *
     * @param {number} [w] - The width of the window
     * @param {number} [h] - The height of the window
     */
    setSize(w?: number | string, h?: number | string): void;
    /**
     * Specifies the position of the upper left corner of the window . If x and y are specified, the window is centered on the center of the screen
     *
     * @param {Number} [x] - Position px Horizontal
     * @param {Number} [y] - Position px Vertical
     */
    setPosition(x?: number, y?: number): void;
    private setElements;
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
    setTitle(content: string | Element | Array<string | Element>): void;
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
    setContent(content: string | Element | Array<string | Element>): void;
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
    setFooter(content: string | Element | Array<string | Element>): void;
    /**
     * Return current Z-index
     * @return {number}
     */
    getZIndex(): number;
    /**
     * Get dialog instance with maximum z-index displaying it on top of all the dialog boxes
     *
     * @return {Dialog}
     */
    getMaxZIndexDialog(): Dialog;
    /**
     * Sets the maximum z-index dialog box, displaying it on top of all the dialog boxes
     */
    setMaxZIndex(): void;
    private iSetMaximization;
    /**
     * Expands the dialog on full browser window
     *
     * @param {boolean} condition true - fullsize
     * @return {boolean} true - fullsize
     */
    maximization(condition?: boolean): boolean;
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
    open(content?: string | Element | Array<string | Element>, title?: string | Element | Array<string | Element>, destroyAfter?: boolean, modal?: boolean): void;
    /**
     * Open if the current window
     *
     * @return {boolean} - true window open
     */
    isOpened(): boolean;
    private resizeble;
    private draggable;
    private startX;
    private startY;
    private startPoint;
    private onMouseUp;
    /**
     *
     * @param {MouseEvent} e
     */
    private onHeaderMouseDown;
    private onMouseMove;
    /**
     *
     * @param {MouseEvent} e
     */
    private onKeyDown;
    private onResize;
    private __isDestructed;
    /**
     * It destroys all objects created for the windows and also includes all the handlers for the window object
     */
    destruct(): void;
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
    close: (e?: MouseEvent | undefined) => void;
    private onResizerMouseDown;
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
export declare const Alert: (msg: string | HTMLElement, title?: string | Function | undefined, callback?: Function | undefined, className?: string) => Dialog;
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
export declare const Promt: (msg: string, title: string | Function | undefined, callback: Function, placeholder?: string | undefined) => Dialog;
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
export declare const Confirm: (msg: string, title: string | ((yes: boolean) => void) | undefined, callback?: ((yes: boolean) => void) | undefined) => Dialog;
