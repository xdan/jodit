/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit"
import {Component} from "./Component"
import {dom, each, $$, extend, camelCase, offset, css, asArray} from "./Helpers"
import * as consts from "../constants";
import {Dom} from "./Dom";

export type ControlType = {
    controlName?: string;
    name?: string;
    mode?: number;
    hotkeys?: string | string[];
    data?: {[key: string]: any};

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
    isActive?: (editor: Jodit, btn: ControlType, button?: ButtonType) => boolean,

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
    isDisable?: (editor: Jodit, btn: ControlType, button?: ButtonType) => boolean,

    getLabel?: (editor: Jodit, btn: ControlType, button?: ButtonType) => boolean | void,

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
    list?: {[key: string]: string} | string[];

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
    css?: {[key: string]: string|string[]}|{[key: string]: (editor: Jodit, value: string) => boolean};
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
    exec?: (editor: Jodit, current: Node|false, control: ControlType, originalEvent: Event,  btn: HTMLLIElement) => void;

    args?: any[];

    cols?: number;

    /**
     * The method which will be called for each element of button.list
     */
    template?: (editor: Jodit, key: string, value: string) => string;

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
    popup?:(editor: Jodit, current: Node|false, control: ControlType, close: Function) => string|HTMLElement|false;

    defaultValue?: string|string[];
}

export type ButtonType = {
    btn: HTMLLIElement,
    container: HTMLSpanElement,
    control: ControlType,
    name: string,
    canActionCallback?: Function
    hotKeyCallback?: Function
}


export class Toolbar extends Component{
    static icons: {[key: string]: string} = {};
    container: HTMLDivElement;
    private popup: HTMLDivElement;
    private list: HTMLDivElement;


    private __popapOpened: boolean = false;
    private __listOpened: boolean = false;

    /**
     *
     * @param {Jodit} editor
     *
     */
    constructor(editor: Jodit) {
        super(editor);
        this.container = <HTMLDivElement>dom('<div class="jodit_toolbar"/>', editor.ownerDocument);
        this.popup = <HTMLDivElement>dom('<div class="jodit_toolbar_popup"/>', editor.ownerDocument);
        this.list = <HTMLDivElement>dom('<ul class="jodit_dropdownlist"/>', editor.ownerDocument);

        this.initEvents();
    }

    /**
     * Return SVG icon
     *
     * @param {string} name icon
     * @param {string} [defaultValue='<span></span>']
     * @return {string}
     */
    static getIcon(name: string, defaultValue:string = '<span></span>'): string {
        return Toolbar.icons[name] !== undefined ? Toolbar.icons[name] : defaultValue;
    }

    /**
     *
     * @param {HTMLLIElement|HTMLAnchorElement} btn
     * @param {HTMLElement} content
     * @param {boolean} [rightAlign=false] Open popup on right side
     */
    openPopup(btn: HTMLLIElement|HTMLAnchorElement, content: string|HTMLElement|false, rightAlign?: boolean) {
        this.closeAll();

        if (!content) {
            return;
        }

        btn.classList.add('jodit_popup_open');
        btn.appendChild(this.popup);

        this.__popapOpened = true;

        this.popup.innerHTML = '<span class="jodit_popup_triangle"></span>';
        this.popup.appendChild(dom(content, this.jodit.ownerDocument));
        this.popup.style.display = 'block';
        this.popup.style.marginLeft = null;

        if (rightAlign !== undefined) {
            this.popup.classList.toggle('jodit_right', rightAlign);
        }


        this.jodit.events.fire('afterOpenPopup', this.popup, this.container);
    }

    /**
     *
     */
    openList(btn: HTMLLIElement, control: ControlType, target?: HTMLElement) {
        btn.classList.add('jodit_dropdown_open');
        this.closeAll();
        this.__listOpened = true;

        each(control.list, (key: string, value: string) => {
            let elm: HTMLElement;

            if (this.jodit.options.controls[value] !== undefined) {
                elm = this.addButton(value, this.jodit.options.controls[value], '', target); // list like array {"align": {list: ["left", "right"]}}
            } else if (this.jodit.options.controls[key] !== undefined) {
                elm = this.addButton(key, extend({}, this.jodit.options.controls[key], value),'', target); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}
            } else {
                elm = this.addButton(key, {
                        exec: control.exec,
                        command: control.command,
                        args: [
                            (control.args && control.args[0]) || key,
                            (control.args && control.args[1]) || value
                        ]
                    },
                    control.template && control.template(
                        this.jodit,
                        key,
                        value
                    ),
                    target
                );
            }

            this.list.appendChild(elm);
        });

        this.list.style.display = 'block';
        this.list.style.marginLeft = null;
        btn.appendChild(this.list);

        this.jodit.events.fire('afterOpenList', this.list, this.container);
    }

    /**
     *
     */
    closeAll = () => {
        this.list.innerHTML = '';
        this.popup.innerHTML = '';
        this.popup.style.display = 'none';
        this.list.style.display = 'none';

        // this.jodit.events.fire('hidePopup');

        $$('.jodit_dropdown_open, .jodit_popap_open', this.container).forEach((btn) => {
            btn.classList.remove('jodit_dropdown_open', 'jodit_popap_open');
        });

        if (this.__popapOpened && this.jodit.selection) {
            this.jodit.selection.removeMarkers();
        }

        this.__popapOpened = false;
        this.__listOpened = false;
    };

    private static __toggleButton(btn: HTMLElement, enable: boolean) {
        btn.classList.toggle('jodit_disabled', !enable);

        if (enable) {
            if (btn.hasAttribute('disabled')) {
                btn.removeAttribute('disabled');
            }
        } else {
            if (!btn.hasAttribute('disabled')) {
                btn.setAttribute('disabled', 'disabled');
            }
        }
    }

    private checkActiveButtons(element: Node|false) {
        const active_class: string = 'jodit_active',
            getCSS = (elm: HTMLElement, key: string): string => {
                return this.jodit.editorWindow.getComputedStyle(elm).getPropertyValue(key).toString()
            },

            checkActiveStatus = (
                btn: ButtonType,
                cssObject: {[key: string]: string|string[]}|{[key: string]: (editor: Jodit, value: string) => boolean},
                node: HTMLElement
            ) => {
                let matches: number = 0,
                    total: number = 0;

                Object.keys(cssObject).forEach((cssProperty) => {
                    const cssValue = cssObject[cssProperty];
                    if (typeof cssValue === 'function') {
                        if (cssValue(
                                this.jodit,
                                getCSS(node, cssProperty).toLowerCase()
                            )) {
                            matches += 1;
                        }
                    } else {
                        if (cssValue.indexOf(getCSS(node, cssProperty).toLowerCase()) !== -1) {
                            matches += 1;
                        }
                    }
                    total += 1;
                });
                if (total === matches) {
                    btn.btn.classList.add(active_class);
                }
            };

        this.buttonList.forEach((button: ButtonType) => {
            button.btn.classList.remove(active_class);

            const mode =  (button.control === undefined || button.control.mode === undefined) ? consts.MODE_WYSIWYG : button.control.mode;

            let isEnable: boolean = mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode();

            if (typeof button.control.isDisable === 'function') {
                isEnable = isEnable && !button.control.isDisable(this.jodit, button.control, button);
            }

            if (this.jodit.options.readonly && this.jodit.options.activeButtonsInReadOnly.indexOf(button.name) === -1) {
                isEnable = false;
            }

            Toolbar.__toggleButton(button.btn, isEnable);

            if (typeof button.control.getLabel === 'function') {
                button.control.getLabel(this.jodit, button.control, button);
            }

            if (typeof button.control.isActive === 'function') {
                button.btn.classList.toggle(active_class,  button.control.isActive(this.jodit, button.control, button));
            } else {
                if (!element) {
                    return;
                }

                let tags: string[],
                    elm: Node|false,
                    css: {[key: string]: string};



                if (button.control.tags || (button.control.options && button.control.options.tags)) {
                    tags = button.control.tags || (button.control.options && button.control.options.tags);

                    elm = element;
                    Dom.up(elm, (node: Node | null): boolean | void => {
                        if (node && tags.indexOf(node.nodeName.toLowerCase()) !== -1) {
                            button.btn.classList.add(active_class);
                            return true;
                        }
                    }, this.jodit.editor);
                }

                //activate by supposed css
                if (button.control.css || (button.control.options && button.control.options.css)) {
                    css = button.control.css || (button.control.options && button.control.options.css);

                    elm = element;
                    Dom.up(elm, (node: HTMLElement) => {
                        if (node && node.nodeType !== Node.TEXT_NODE/* && !node.classList.contains(active_class)*/) {
                            checkActiveStatus(button, css, node);
                        }
                    }, this.jodit.editor);
                }

            }
        });

        this.jodit.events
            .fire('updateToolbar');
    }

    private defaultControl:ControlType  = {
        template: (editor: Jodit, key: string, value: string) => (this.jodit.i18n(value))
    };

    private buttonList: ButtonType[] = [];

    private setLabel(item: string|ControlType, container: HTMLSpanElement, clearName: string, icon: string, control: ControlType, content?: string) {
        let iconSVG: string|false,
            name: string = typeof item === 'string' ? item : (item.name || 'empty');

        if (!this.jodit.options.textIcons) {
            iconSVG = Toolbar.getIcon(icon, '');

            if (iconSVG === '' && typeof control.icon === 'string') {
                iconSVG = Toolbar.getIcon(control.icon, '');
            }

            if (iconSVG === '') {
                iconSVG = Toolbar.getIcon( typeof control.name === 'string' ? control.name : 'empty', '');
            }
        } else {
            iconSVG = `<span>${name}</span>`;
        }

        const iconElement: HTMLElement =  dom(<string>iconSVG, this.jodit.ownerDocument);

        if (iconElement && iconElement.nodeType !== Node.TEXT_NODE) {
            iconElement.classList.add('jodit_icon', 'jodit_icon_' + clearName);
        }

        if (container) {
            container.appendChild(iconElement);
        }

        if (content !== undefined && content !== '' && container) {
            container.innerHTML = content;
        }

        if (control.iconURL && container) {
            container.style.backgroundImage =  'url(' + control.iconURL + ')'
        }
    }
    /**
     *
     */
    addButton(item: string|ControlType, controlOption?: ControlType, content?: string, target?: HTMLElement): HTMLElement {
        let control: ControlType = <ControlType>extend(true, {}, this.defaultControl, controlOption);

        const btn: HTMLLIElement = <HTMLLIElement>dom('<li class="jodit_toolbar_btn">' +
                    '<a href="javascript:void(0)"><span></span></a>' +
                    '<div class="jodit_tooltip"></div>' +
                '</li>', this.jodit.ownerDocument),
            name: string = typeof item === 'string' ? item : (item.name || 'empty'),
            icon: string = typeof item === 'string' ? item : (item.icon || item.name || 'empty'),
            a: HTMLAnchorElement = <HTMLAnchorElement>btn.querySelector('a');


        const clearName: string = name.replace(/[^a-zA-Z0-9]/g, '_');

        this.setLabel(item, <HTMLSpanElement>a.firstChild, clearName, icon, control, content);

        btn.classList.add('jodit_toolbar_btn-' + clearName);

        const canActionCallback: Function = (enable?: boolean) => {
            if (this.jodit.options.readonly && this.jodit.options.activeButtonsInReadOnly.indexOf(name) === -1) {
                enable = false;
            }

            if (enable !== undefined) {
                Toolbar.__toggleButton(btn, enable);
            }
        };

        canActionCallback();


        this.jodit.events.on(camelCase('can-' + clearName), canActionCallback);

        let hotKeyCallback: Function | null = null;

        if (control.hotkeys) {
            const hotkeys: string[] = Array.isArray(control.hotkeys) ? control.hotkeys : control.hotkeys.split(/[\s,]/);
            hotKeyCallback = (hotkey: string) => {
                this.jodit.events.fire(btn, 'mousedown');
                return false;
            };
            this.jodit.events.on(hotkeys.join(' '), hotKeyCallback);
        }

        if (control === undefined || typeof(control) !== 'object') {
            control = {command: name};
        }

        if (control.list && a) {
            btn.classList.add('jodit_with_dropdownlist');
            a.appendChild(dom('<span class="jodit_with_dropdownlist-trigger"></span>', this.jodit.ownerDocument))
        }

        if (btn) {
            const tooltip: HTMLElement|null = btn.querySelector('.jodit_tooltip');
            if (tooltip) {
                if (control.tooltip) {
                    tooltip.innerHTML = this.jodit.i18n(control.tooltip) + (control.hotkeys ? '<br>' + asArray(control.hotkeys).join(' ') : '');
                } else {
                    btn.removeChild(tooltip);
                }
            }
        }

        this.jodit.events.on(btn, 'mousedown touchend', (originalEvent: MouseEvent): false | void => {
            originalEvent.stopImmediatePropagation();
            originalEvent.preventDefault();

            if (btn.classList.contains('jodit_disabled')) {
                return false;
            }


            if (control.list) {
                this.openList(btn, control, target);
            } else if (control.exec !== undefined && typeof control.exec === 'function') {
                control.exec(
                    this.jodit,
                    target || this.jodit.selection.current(),
                    control,
                    originalEvent,
                    btn
                );
                this.checkActiveButtons(false);
                this.jodit.setEditorValue();
                this.jodit.events.fire('hidePopup');
            } else if (control.popup !== undefined && typeof control.popup === 'function') {
                this.openPopup(btn, control.popup(
                    this.jodit,
                    target || this.jodit.selection.current(),
                    control,
                    () => {
                        this.closeAll();
                        this.jodit.selection.removeMarkers(); // remove all markers
                    }
                ));
            } else {
                if (control.command || name) {
                    this.jodit.execCommand(control.command || name, (control.args && control.args[0]) || false, (control.args && control.args[1]) || null);
                    this.closeAll();
                }
            }
        });

        this.buttonList.push({
            control,
            btn,
            container:  <HTMLSpanElement>a.firstChild,
            name,
            canActionCallback,
            hotKeyCallback: hotKeyCallback || void(0)
        });

        return btn;
    }


    /**
     *
     * @param {Array|Object} buttons
     * @param {HTMLDivElement} container
     * @param {HTMLElement} target Work element
     */
    build(buttons: Array<ControlType|string> | string, container: HTMLElement, target?: HTMLElement) {
        let lastBtnSeparator: boolean = false;

        this.clear();

        if (typeof buttons === 'string') {
            buttons = buttons.split(/[\s,]+/);
        }

        (<Array<ControlType|string>>buttons).forEach((button: ControlType|string) => {
            const name: string = typeof button === 'string' ? <string>button : button.name || '';

            if (this.jodit.options.removeButtons.indexOf(name) !== -1) {
                return;
            }

            switch (name) {
                case "\n":
                    this.container.appendChild(dom('<li class="jodit_toolbar_btn jodit_toolbar_btn-break"></li>', this.jodit.ownerDocument));
                    break;
                case '|':
                    if (!lastBtnSeparator) {
                        lastBtnSeparator = true;
                        this.container.appendChild(dom('<li class="jodit_toolbar_btn jodit_toolbar_btn-separator"></li>', this.jodit.ownerDocument));
                    }
                    break;
                default:
                    let control: string | ControlType = button;

                    lastBtnSeparator = false;

                    if (typeof control !== 'object' && this.jodit.options.controls[control] !== undefined) {
                        control = this.jodit.options.controls[control];
                    }

                    if (typeof control === 'object' && control.name && this.jodit.options.controls[control.name] !== undefined) {
                        control = {...this.jodit.options.controls[control.name], ...control};
                    }

                    if (typeof control !== 'object') {
                        control = {
                            name: control,
                            command: control,
                            tooltip: control,
                        };
                    }

                    this.container.appendChild(this.addButton(button, <ControlType>control, '', target));
            }
        });

        if (this.container.parentNode !== container) {
            container.appendChild(this.container);
        }

        this.checkActiveButtons(false);
    }

    clear() {
        this.buttonList.forEach((button: ButtonType) => {
            if (button.btn.parentNode) {
                button.btn.parentNode.removeChild(button.btn);
            }
            this.jodit.events.off(button.btn);
            delete button.btn;

            const clearName: string = button.name.replace(/[^a-zA-Z0-9]/g, '_');

            this.jodit.events.off(camelCase('can-' + clearName), button.canActionCallback);

            if (button.control.hotkeys && button.hotKeyCallback) {
                const hotkeys: string[] = Array.isArray(button.control.hotkeys) ? button.control.hotkeys : button.control.hotkeys.split(/[\s,]/);
                this.jodit.events.off(hotkeys.join(' '), button.hotKeyCallback);
            }
        });
        this.buttonList.length = 0;
        this.container.innerHTML = '';
    }

    private initEvents = () => {
        let timeout: number;
        this.jodit.events
            .on(this.popup, 'mousedown touchstart', (e: MouseEvent) => {e.stopPropagation()})
            .on(this.list,'mousedown touchstart', (e: MouseEvent) => {e.stopPropagation()})
            .on(this.jodit.ownerWindow, 'mousedown touchstart', () => {
                if (this.__popapOpened || this.__listOpened) {
                    this.closeAll();
                }
            })
            .on('afterOpenPopup afterOpenList', (popup: HTMLElement) => {

                const offsetConainer: Bound = offset(<HTMLDivElement>this.jodit.container, this.jodit, true);
                let offsetPopup: Bound = offset(popup, this.jodit, true);
                let marginLeft: number = <number>css(popup, 'marginLeft');
                let diffLeft: number = 0;

                if (offsetPopup.left + offsetPopup.width > offsetConainer.left + offsetConainer.width) {
                    diffLeft =  -((offsetPopup.left + offsetPopup.width) - (offsetConainer.left + offsetConainer.width));
                    css(popup, {
                        marginLeft: diffLeft + marginLeft
                    });
                    offsetPopup = offset(popup, this.jodit, true);
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
            })
            .on('hidePopup', () => {
                this.closeAll();
            })
            .on('mousedown mouseup keydown change afterSetMode focus afterInit readonly', () => {
                const callback = () => {
                    if (this.jodit.selection) {
                        this.checkActiveButtons(this.jodit.selection.current())
                    }
                };
                if (this.jodit.options.observer.timeout) {
                    clearTimeout(timeout);
                    timeout = window.setTimeout(callback, this.jodit.options.observer.timeout)
                } else {
                    callback();
                }
            });
    };
}