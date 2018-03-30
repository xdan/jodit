/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Component, IViewBased} from "./Component";
import {asArray, camelCase, css, debounce, dom, each, offset} from "./Helpers";
import * as consts from "../constants";
import {Dom} from "./Dom";
import {Jodit} from "../Jodit";


export type ControlType = {
    controlName?: string;
    name?: string;
    mode?: number;
    hotkeys?: string | string[];
    data?: {[key: string]: any};
    isInput?: boolean;
    /**
     * You can use it function for control - active/not active button
     * @param {Jodit} editor
     * @param {ControlType} btn
     * @return {boolean}
     * @see copyformat plugin
     * @example
     * ```javascript
     * var editor = new Jodit('.selectorclass', {
     *     buttons: {
     *          checkbox: {
     *              data: {
     *                  active: false,
     *              },
     *              iconURL: 'checkbox.png',
     *              exec: function (a, b, btn) {
     *                  btn.data.active = !btn.data.active;
     *              },
     *              isActive: function (editor, btn) {
     *                  return !!btn.data.active;
     *              }
     *          }
     *     }
     * })
     * ```
     */
    isActive?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => boolean,
    isActiveChild?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => boolean, // for list

    getContent?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => string | HTMLElement,


    /**
     * You can use it function for control - disable/enable button
     *
     * @param {Jodit} editor
     * @param {ControlType} btn
     * @return {boolean}
     * @see copyformat plugin
     * @example
     * ```javascript
     * var editor = new Jodit('.selectorclass', {
     *     buttons: {
     *          checkbox: {
     *              data: {
     *                  enable: false,
     *              },
     *              iconURL: 'checkbox.png',
     *              exec: function (a, b, btn) {
     *                  btn.data.active = !btn.data.active;
     *              },
     *              isDisable: function (editor, btn) {
     *                  return !!btn.data.enable;
     *              }
     *          }
     *     }
     * })
     * ```
     */
    isDisable?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => boolean,
    isDisableChild?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => boolean,

    getLabel?: (editor: IViewBased | Jodit, control: ControlType, button?: ToolbarButton) => boolean | void,

    /**
     * Drop-down list. A hash or array. You must specify the command which will be submitted for the hash key (or array value) (see .[[Jodit.execCommand]] or define 'exec' function. See example
     * @example
     * ```javascript
     * new Jodit('#editor2', {
     *     buttons: Jodit.defaultOptions.buttons.concat([{
     *        name: 'listsss',
     *        iconURL: 'stuf/dummy.png',
     *        list: {
     *            h1: 'insert Header 1',
     *            h2: 'insert Header 2',
     *            clear: 'Empty editor',
     *        },
     *        exec: (editor, current, control) => {
     *             var key = control.args[0],
     *                value = control.args[1];
     *
     *             if (key === 'clear') {
     *                 this.setEditorValue('');
     *                 return;
     *             }
     *             this.selection.insertNode(Jodit.modules.Dom.create(key, ''));
     *             this.events.fire('errorMessage', 'Was inserted ' + value);
     *        },
     *        template: function (key, value) {
     *            return '<div>' + value + '</div>';
     *        }
     *  });
     *  ```
     */
    list?: {[key: string]: string} | string[] | string;

    /**
     * The command executes when the button is pressed. Allowed all {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands} and several specific [[Jodit.execCommand]]
     */
    command?: string;
    tagRegExp?: RegExp;

    /**
     * Tag list:  when cursor inward tag from this list, button will be highlighted
     */
    tags?: string[];
    options?: any;
    css?: {[key: string]: string|string[]}|{[key: string]: (editor: IViewBased | Jodit, value: string) => boolean};
    /**
     * String name for existing icons.
     * @example
     * ```javascript
     * var editor = new Jodit('.editor', {
     *  buttons: [
     *      {
     *          icon: 'source',
     *          exec: function (editor) {
     *              editor.toggleMode();
     *          }
     *      }
     *  ]
     * })
     * ```
     */
    icon?: string;
    /**
     * Use this property if you want set background image for the button. This icon can be 16 * 16 px in SVG or another image formats
     */
    iconURL?: string;

    /**
     * Buttons hint
     */
    tooltip?: string;

    /**
     * This function will be executed when the button is pressed.
     */
    exec?: (editor: IViewBased | Jodit, current: Node|false, control: ControlType, originalEvent: Event,  btn: HTMLLIElement) => void;

    args?: any[];

    /**
     * The method which will be called for each element of button.list
     */
    template?: (editor: IViewBased | Jodit, key: string, value: string) => string;

    /**
     * After click on the button it will show popup element which consist value that this function returned
     * @example
     * ```javascript
     * var editor = new Jodit('.editor', {
     *    buttons: [
     *      {
     *          icon: "insertCode",
     *          popup: function (editor) {
     *              var div = dccument.createElement('div'), button = dccument.createElement('button');
     *              div.innerHTML = 'Hi! Click button and enter your code';
     *              button.innerHTML = 'Click me';
     *
     *              div.appendChild(button);
     *
     *              button.addEventListener('click', function (e) {
     *                  editor.selection.insertHTML(prompt("Enter your code"));
     *                  return false;
     *              });
     *              return div;
     *          }
     *      }
     *    ]
     * });
     * ```
     */
    popup?:(editor: IViewBased | Jodit, current: Node|false, control: ControlType, close: Function, button?: ToolbarButton) => string | HTMLElement | false;

    defaultValue?: string|string[];
}

export interface ControlTypeStrong extends ControlType{
    name: string;
}

abstract class ToolbarElement extends Component {
    container: HTMLElement;

    public parentToolbar: ToolbarCollection | null = null;

    public createIcon(clearName: string, control ?: ControlTypeStrong) : HTMLElement {
        const icon: string = control ? control.icon || control.name : clearName;

        if (!this.jodit.options.textIcons) {
            let iconSVG: string | undefined | HTMLElement = this.jodit.events.fire('getIcon', icon, control, clearName);
            let iconElement: HTMLElement;

            if (control && control.iconURL && iconSVG === undefined) {
                iconElement = dom('<i></i>', this.jodit.ownerDocument);
                iconElement.style.backgroundImage =  'url(' + control.iconURL + ')';
            } else {
                if (iconSVG === undefined) {
                    if (ToolbarIcon.exists(icon)) {
                        iconSVG =  ToolbarIcon.getIcon(icon);
                    } else {
                        iconSVG =  ToolbarIcon.getIcon('empty');
                    }
                }

                iconElement = dom(iconSVG, this.jodit.ownerDocument);

            }

            iconElement.classList.add('jodit_icon', 'jodit_icon_' + clearName);

            return iconElement;
        }

        return dom(`<span class="jodit_icon">${this.jodit.i18n(control ? control.name : clearName)}</span>`, this.jodit.ownerDocument);
    }

    constructor(jodit: IViewBased, containerTag: string = 'li', containerClass: string = 'jodit_toolbar_btn') {
        super(jodit);
        this.container = this.jodit.ownerDocument.createElement(containerTag);
        this.container.classList.add(containerClass);
    }
}

export  class ToolbarPopup extends ToolbarElement {
    constructor(jodit: IViewBased, readonly target: HTMLElement, readonly current?: HTMLElement,  readonly className: string = 'jodit_toolbar_popup') {
        super(jodit, 'div', className);
        this.container.setAttribute('data-editor_id', jodit.id);

        this.jodit.events
            .on(this.container, 'mousedown touchstart', (e: MouseEvent) => {
                e.stopPropagation();
            });
    }

    isOpened: boolean = false;

    protected doOpen(content: any) {
        if (!content) {
            return;
        }

        Dom.detach(this.container);

        this.container.innerHTML = '<span class="jodit_popup_triangle"></span>';

        this.container.appendChild(dom(content, this.jodit.ownerDocument));

        this.container.style.display = 'block';
        this.container.style.marginLeft = null;
    }

    /**
     * @param {HTMLElement} content
     * @param {boolean} [rightAlign=false] Open popup on right side
     * @param {boolean} [noStandartActions=false] No call standarts action
     */
    public open(content: any, rightAlign?: boolean, noStandartActions: boolean = false) {
        this.jodit.events.fire('beforeOpenPopup closeAllPopups', this, content);
        noStandartActions || this.jodit.events.on('closeAllPopups', this.close);

        this.container.classList.add(this.className + '-open');
        this.doOpen(content);

        this.target.appendChild(this.container);

        if (rightAlign !== undefined) {
            this.container.classList.toggle('jodit_right', rightAlign);
        }


        if (!noStandartActions && this.parentToolbar) {
            this.jodit.events.fire(this.parentToolbar, 'afterOpenPopup', this.container);
        }

        this.isOpened = true;
    }

    protected doClose() {}

    public close = (current?: HTMLElement | ToolbarPopup) => {
        if (!this.isOpened) {
            return;
        }
        if (!current || !Dom.isOrContains(this.container, current instanceof ToolbarPopup ? current.target : current)) {
            this.isOpened = false;
            this.jodit.events.off('closeAllPopups', this.close);

            this.doClose();

            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            if (this.jodit.selection) {
                this.jodit.selection.removeMarkers();
            }
        }
    }
}

export  class ToolbarList extends ToolbarPopup {
    private defaultControl  = {
        template: (editor: Jodit, key: string, value: string) => (this.jodit.i18n(value))
    };

    constructor(jodit: IViewBased, readonly target: HTMLElement, readonly current?: HTMLElement, readonly className: string = 'jodit_toolbar_list') {
        super(jodit, target, current, className);
    }

    protected doClose() {
        if (this.toolbar) {
            this.toolbar.destruct();
        }
    }

    public toolbar: ToolbarCollection;

    protected doOpen(control: ControlTypeStrong) {
        this.toolbar = new ToolbarCollection(this.jodit);

        const list: any = typeof control.list === 'string' ? control.list.split(/[\s,]/) : control.list;

        each(list, (key: string, value: string) => {
            let button: ToolbarButton;

            if (this.jodit.options.controls[value] !== undefined) {
                button = new ToolbarButton(this.jodit, {
                    name: value.toString(),
                    ...this.jodit.options.controls[value]
                }, this.current); // list like array {"align": {list: ["left", "right"]}}
            } else if (this.jodit.options.controls[key] !== undefined && typeof value === 'object') {
                button = new ToolbarButton(this.jodit, {
                    name: key.toString(),
                    ...this.jodit.options.controls[key],
                    ...(<ControlType>value)
                }, this.current);// list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}
            } else {
                button = new ToolbarButton(this.jodit, {
                    name: key.toString(),
                    exec: control.exec,
                    command: control.command,
                    isActive: control.isActiveChild,
                    isDisable: control.isDisableChild,
                    args: [
                        (control.args && control.args[0]) || key,
                        (control.args && control.args[1]) || value
                    ]
                }, this.current);// list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}

                const template: Function = control.template || this.defaultControl.template;

                button.textBox.innerHTML =  template(
                    this.jodit,
                    key,
                    value
                );
            }

            this.toolbar.appendChild(button);
        });

        this.container.appendChild(this.toolbar.container);
        this.container.style.marginLeft = null;

        this.toolbar.checkActiveButtons();
    }
}

export  class ToolbarButton extends ToolbarElement {
    readonly control: ControlTypeStrong;
    readonly target: HTMLElement | undefined;

    private __disabled: boolean = false;

    set disable(disable: boolean) {
        this.__disabled = disable;
        this.container.classList.toggle('jodit_disabled', disable);

        if (!disable) {
            if (this.container.hasAttribute('disabled')) {
                this.container.removeAttribute('disabled');
            }
        } else {
            if (!this.container.hasAttribute('disabled')) {
                this.container.setAttribute('disabled', 'disabled');
            }
        }
    }

    get disable() {
        return this.__disabled;
    }

    private __actived: boolean = false;

    set active(enable: boolean) {
        this.__actived = enable;
        this.container.classList.toggle('jodit_active', enable);
    }
    get active() {
        return this.__actived;
    }

    private checkActiveStatus = (
        cssObject: {[key: string]: string|string[]}|{[key: string]: (editor: IViewBased, value: string) => boolean},
        node: HTMLElement
    ): boolean => {
        let matches: number = 0,
            total: number = 0;

        Object.keys(cssObject).forEach((cssProperty) => {
            const cssValue = cssObject[cssProperty];
            if (typeof cssValue === 'function') {
                if (cssValue(this.jodit, css(node, cssProperty).toString())) {
                    matches += 1;
                }
            } else {
                if (cssValue.indexOf(css(node, cssProperty).toString()) !== -1) {
                    matches += 1;
                }
            }
            total += 1;
        });

        return total === matches
    };

    isDisable(): boolean {
        const mode =  (this.control === undefined || this.control.mode === undefined) ? consts.MODE_WYSIWYG : this.control.mode;

        let isEnable: boolean = mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode();

        if (typeof this.control.isDisable === 'function') {
            isEnable = isEnable && !this.control.isDisable(this.jodit, this.control, this);
        }

        if (this.jodit.options.readonly && this.jodit.options.activeButtonsInReadOnly.indexOf(this.control.name) === -1) {
            isEnable = false;
        }

        return !isEnable;
    }
    isActive(): boolean {
        if (typeof this.control.isActive === 'function') {
            return this.control.isActive(this.jodit, this.control, this);
        }

        const element: false | Node = this.jodit.selection ? this.jodit.selection.current() : false;

        if (!element) {
            return false;
        }

        let tags: string[],
            elm: Node|false,
            css: {[key: string]: string};



        if (this.control.tags || (this.control.options && this.control.options.tags)) {
            tags = this.control.tags || (this.control.options && this.control.options.tags);

            elm = element;

            if (Dom.up(elm, (node: Node | null): boolean | void => {
                if (node && tags.indexOf(node.nodeName.toLowerCase()) !== -1) {
                    return true;
                }
            }, this.jodit.editor)) {
                return true;
            }
        }

        //activate by supposed css
        if (this.control.css || (this.control.options && this.control.options.css)) {
            css = this.control.css || (this.control.options && this.control.options.css);

            elm = element;
            if (Dom.up(elm, (node: HTMLElement): boolean | void => {
                if (node && node.nodeType !== Node.TEXT_NODE) {
                   return this.checkActiveStatus(css, node);
                }
            }, this.jodit.editor)) {
                return true;
            }
        }

        return false;
    }

    destruct() {
        this.jodit.events.off(this.container);
    }


    public textBox: HTMLSpanElement;
    public anchor: HTMLAnchorElement;


    private tooltip: Tooltip;

    onMouseDown = (originalEvent: MouseEvent): false | void => {
        originalEvent.stopImmediatePropagation();
        originalEvent.preventDefault();

        if (this.disable) {
            return false;
        }

        const control: ControlTypeStrong = this.control;

        if (control.list) {
            const list: ToolbarList = new ToolbarList(this.jodit, this.container, this.target);

            list.parentToolbar = this.parentToolbar;

            list.open(control);
            this.jodit.events.fire('closeAllPopups', list.container);
        } else if (control.exec !== undefined && typeof control.exec === 'function') {
            control.exec(
                this.jodit,
                this.target || (this.jodit.selection ? this.jodit.selection.current() : false),
                control,
                originalEvent,
                <HTMLLIElement>this.container
            );

            this.jodit.events.fire('synchro');

            if (this.parentToolbar) {
                this.parentToolbar.immedateCheckActiveButtons();
            }

            /**
             * Fired after calling `button.exec` function
             * @event afterExec
             */
            this.jodit.events.fire('closeAllPopups afterExec');
        } else if (control.popup !== undefined && typeof control.popup === 'function') {
            const popup: ToolbarPopup = new ToolbarPopup(this.jodit, this.container, this.target);

            popup.parentToolbar = this.parentToolbar;

            if (this.jodit.events.fire(camelCase('before-' + control.name + '-OpenPopup'), this.target || (this.jodit.selection ? this.jodit.selection.current() : false), control, popup) !== false) {
                popup.open(control.popup(
                    this.jodit,
                    this.target || (this.jodit.selection ? this.jodit.selection.current() : false),
                    control,
                    popup.close,
                    this
                ));
            }
            /**
             * Fired after popup was opened for some control button
             * @event after{CONTROLNAME}OpenPopup
             */
            /**
             * Close all opened popups
             *
             * @event closeAllPopups
             */
            this.jodit.events.fire(camelCase('after-' + control.name + '-OpenPopup')+' closeAllPopups', popup.container);
        } else {
            if (control.command || control.name) {
                this.jodit.execCommand(control.command || control.name, (control.args && control.args[0]) || false, (control.args && control.args[1]) || null);
                this.jodit.events.fire('closeAllPopups');
            }
        }

    };
    constructor(jodit: IViewBased, control: ControlTypeStrong, target?: HTMLElement) {
        super(jodit);

        this.control = control;
        this.target = target;

        this.anchor = this.jodit.ownerDocument.createElement('a');
        this.container.appendChild(this.anchor);

        if (jodit.options.showTooltip && control.tooltip) {
            if (!jodit.options.useNativeTooltip) {
                this.tooltip = new Tooltip(this);
            } else {
                this.anchor.setAttribute('title', this.jodit.i18n(control.tooltip) + (control.hotkeys ? '<br>' + asArray(control.hotkeys).join(' ') : ''));
            }
        }

        this.textBox = this.jodit.ownerDocument.createElement('span');
        this.anchor.appendChild(this.textBox);

        const clearName: string = control.name.replace(/[^a-zA-Z0-9]/g, '_');

        if (control.getContent && typeof control.getContent === 'function') {
            Dom.detach(this.container);
            this.container.appendChild(dom(control.getContent(this.jodit, control, this), this.jodit.ownerDocument));
        } else {
            if (control.list && this.anchor) {
                const trigger: HTMLSpanElement = this.jodit.ownerDocument.createElement('span');
                trigger.classList.add('jodit_with_dropdownlist-trigger');
                this.container.classList.add('jodit_with_dropdownlist');
                this.anchor.appendChild(trigger);
            }

            this.textBox.appendChild(this.createIcon(clearName, control));
        }

        this.container.classList.add('jodit_toolbar_btn-' + clearName);

        if (control.isInput) {
            this.container.classList.add('jodit_toolbar-input');
        } else {
            this.jodit.events.on(this.container, 'mousedown touchend', this.onMouseDown);
        }

    }
}

/**
 * Class create tooltip for buttons in toolbar
 */
export class Tooltip {
    public container: HTMLElement;
    private timeout: number = 0;

    private show = () => {
        const showElement = () => {
                this.button.container.appendChild(this.container);
                const diff: number = this.container.offsetWidth - this.button.container.offsetWidth;
                this.container.style.marginLeft = (-diff / 2) + 'px';
             },
            delay: number = this.button.jodit.options.showTooltipDelay;

        this.button.jodit.events.fire('hideTooltip');

        if (delay) {
            this.timeout = window.setTimeout(showElement, delay);
        } else {
            showElement();
        }
    };

    private hide = () => {
        window.clearTimeout(this.timeout);
        this.container.parentNode && this.container.parentNode.removeChild(this.container);
    };

    constructor(readonly button: ToolbarButton) {
        if (button.control.tooltip) {
            this.container = button.jodit.ownerDocument.createElement('div');
            this.container.classList.add('jodit_tooltip');
            this.container.innerHTML = button.jodit.i18n(button.control.tooltip) + (button.control.hotkeys ? '<br>' + asArray(button.control.hotkeys).join(' ') : '');

            button.jodit.events
                .on(button.anchor, 'mouseenter', this.show)
                .on(button.anchor, 'mouseleave', this.hide)
                .on('change updateToolbar scroll hidePopup closeAllPopups hideTooltip', this.hide)
        }
    }
}

export class ToolbarBreak extends ToolbarElement{
    constructor(jodit: IViewBased) {
        super(jodit);
        this.container.classList.add('jodit_toolbar_btn-break');
    }
}

export class ToolbarSeparator extends ToolbarElement {
    constructor(jodit: IViewBased) {
        super(jodit);
        this.container.classList.add('jodit_toolbar_btn-separator');
    }
}


export class ToolbarIcon {
    static icons: {[key: string]: string} = {};

    static exists(name: string): boolean {
        return ToolbarIcon.icons[name] !== undefined;
    }

    /**
     * Return SVG icon
     *
     * @param {string} name icon
     * @param {string} [defaultValue='<span></span>']
     * @return {string}
     */
    static getIcon(name: string, defaultValue:string = '<span></span>'): string {
        return ToolbarIcon.icons[name] !== undefined ? ToolbarIcon.icons[name] : defaultValue;
    }
}

export class ToolbarCollection extends ToolbarElement {
    constructor(jodit: IViewBased) {
        super(jodit, 'ul', 'jodit_toolbar');
        this.initEvents();
    }

    private __buttons: ToolbarElement[] = [];
    getButtonsList(): string[] {
        return this.__buttons
            .map((a: ToolbarElement) => a instanceof ToolbarButton ? a.control.name : '')
            .filter(a => a !== '');
    }

    appendChild(button: ToolbarElement) {
        this.__buttons.push(button);
        button.parentToolbar = this;
        this.container.appendChild(button.container);
    }

    removeChild(button: ToolbarElement) {
        const index: number = this.__buttons.indexOf(button);

        if (index !== -1) {
            this.__buttons.splice(index, 1);
            if (button.container.parentNode === this.container) {
                this.container
                    .removeChild(button.container);
            }
        }

        button.parentToolbar = null;
    }

    private __getControlType = (button: ControlType | string) : ControlTypeStrong => {
        let buttonControl: ControlTypeStrong;

        if (typeof button !== 'string') {
            buttonControl = {name: 'empty', ...button};
            if (this.jodit.options.controls[buttonControl.name] !== undefined) {
                buttonControl = {...this.jodit.options.controls[buttonControl.name], ...buttonControl};
            }
        } else {
            const list: string[] = button.split(/\./);

            let store: {[key: string]: ControlType} = this.jodit.options.controls;

            if (list.length > 1) {
                if (this.jodit.options.controls[list[0]] !== undefined) {
                    store = <{[key: string]: ControlType}>this.jodit.options.controls[list[0]];
                    button = list[1];
                }
            }

            if (store[button] !== undefined) {
                buttonControl = {name: button, ...store[button]};
            } else {
                buttonControl = {
                    name: button,
                    command: button,
                    tooltip: button,
                };
            }
        }

        return buttonControl;
    };


    build(buttons: Array<ControlType|string> | string, container: HTMLElement, target?: HTMLElement) {
        let lastBtnSeparator: boolean = false;
        this.clear();
        const buttonsList: Array<ControlType | string> = typeof buttons === 'string' ? buttons.split(/[,\s]+/) : buttons;

        buttonsList
            .map(this.__getControlType)
            .forEach((buttonControl: ControlTypeStrong) => {
                let button: ToolbarElement | null = null;

                if (this.jodit.options.removeButtons.indexOf(buttonControl.name) !== -1) {
                    return;
                }

                switch (buttonControl.name) {
                    case "\n":
                        button = new ToolbarBreak(this.jodit);
                        break;
                    case '|':
                        if (!lastBtnSeparator) {
                            lastBtnSeparator = true;
                            button = new ToolbarSeparator(this.jodit);
                        }
                        break;
                    default:
                        lastBtnSeparator = false;
                        button = new ToolbarButton(this.jodit, buttonControl, target);
                }

                if (button) {
                    this.appendChild(button);
                }
            });

        if (this.container.parentNode !== container) {
            container.appendChild(this.container);
        }

        this.immedateCheckActiveButtons();
    }

    clear() {
        // in removeChild __buttons is changed
        [...this.__buttons].forEach((button: ToolbarElement) => {
            this.removeChild(button);
            button.destruct();
        });

        this.__buttons.length = 0;
        // this.container.parentNode && this.container.parentNode.removeChild(this.container);
    }

    immedateCheckActiveButtons = () => {
        if (this.jodit.isLocked()) {
            return;
        }
        (<ToolbarButton[]>this.__buttons.filter((button: ToolbarElement) => button instanceof ToolbarButton))
            .forEach((button: ToolbarButton) => {
                button.disable = button.isDisable();

                if (!button.disable) {
                    button.active = button.isActive();
                }

                if (typeof button.control.getLabel === 'function') {
                    button.control.getLabel(this.jodit, button.control, button);
                }

            });

        this.jodit.events && this.jodit.events
            .fire('updateToolbar');
    };

    checkActiveButtons = debounce(this.immedateCheckActiveButtons, this.jodit.defaultTimeout);

    private closeAll = () => {
        this.jodit.events.fire('closeAllPopups');
    };

    private afterOpen = (popup: HTMLElement) => {
        const offsetConainer: Bound = offset(<HTMLDivElement>this.jodit.container, this.jodit, this.jodit.ownerDocument, true);
        let offsetPopup: Bound = offset(popup, this.jodit, this.jodit.ownerDocument, true);
        let marginLeft: number = <number>css(popup, 'marginLeft');
        let diffLeft: number = 0;

        if (offsetPopup.left + offsetPopup.width > offsetConainer.left + offsetConainer.width) {
            diffLeft =  -((offsetPopup.left + offsetPopup.width) - (offsetConainer.left + offsetConainer.width));
            css(popup, {
                marginLeft: diffLeft + marginLeft
            });
            offsetPopup = offset(popup, this.jodit, this.jodit.ownerDocument, true);
        }

        if (offsetPopup.left  < offsetConainer.left) {
            if (offsetPopup.left + offsetPopup.width > offsetConainer.left + offsetConainer.width) {
                css(popup, {
                    width: offsetConainer.width
                });
            } else {
                diffLeft = offsetConainer.left  - offsetPopup.left;
                css(popup, {
                    marginLeft: diffLeft  + marginLeft
                });
            }
        }

        if (diffLeft) {
            let triangle: HTMLSpanElement | null = popup.querySelector('.jodit_popup_triangle');
            if (triangle) {
                triangle.style.marginLeft = -diffLeft + 'px';
            }
        }
    };


    private listenEvents: string = 'changeStack mousedown mouseup keydown change afterInit readonly afterResize selectionchange changeSelection focus afterSetMode touchstart';

    private initEvents = () => {
        this.jodit.events
            .on(this.jodit.ownerWindow, 'mousedown touchend', this.closeAll)
            .on( this, 'afterOpenPopup', this.afterOpen)
            .on(this.listenEvents, this.checkActiveButtons)
            .on('afterSetMode focus', this.immedateCheckActiveButtons);
    };

    destruct() {
        super.destruct();

        this.jodit.events
            .off(this.jodit.ownerWindow, 'mousedown touchstart', this.closeAll)
            .off( this, 'afterOpenPopup', this.afterOpen)
            .off(this.listenEvents, this.checkActiveButtons)
            .off('afterSetMode focus', this.immedateCheckActiveButtons);

        this.clear();
    }
}