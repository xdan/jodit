import Jodit from "../jodit"
import Component from "./Component"
import {dom, each, $$, extend, inArray} from "./Helpers"
import {isFunction} from "util";

type ControlType = {
    name?: string;
    list?: any[];
    command?: string;
    tags?: string;
    options?: any;
    css?: any;
    iconURL?: string;
    tooltip?: string;
    exec?: Function;
    args?: any[];
    template?: Function;
    popap?: Function;
}
type ButtonType = {
    btn: HTMLLIElement,
    control: ControlType,
    name: string,
}

export default class Toolbar extends Component{
    static icons = {};
    container: HTMLDivElement;
    popup: HTMLDivElement;

    list: HTMLDivElement;


    __popapOpened = false;

    /**
     *
     * @param {Jodit} parent
     *
     */
    constructor(parent:Jodit) {
        super(parent);
        this.container = dom('<div class="jodit_toolbar"/>')
        this.popup = dom('<div class="jodit_toolbar_popup"/>')
        this.list = dom('<ul class="jodit_dropdownlist"/>')

        this.popup.addEventListener('mousedown', (e) => {e.stopPropagation()})
        this.list.addEventListener('mousedown', (e) => {e.stopPropagation()})
    }

    /**
     * Return SVG icon
     *
     * @param {string} name icon
     * @param {string|false} [defaultValue='<span></span>']
     * @return {string}
     */
    static getIcon(name, defaultValue:string|false = '<span></span>') {
        return Toolbar.icons[name] !== undefined ? Toolbar.icons[name] : defaultValue;
    }

    /**
     *
     * @param {HTMLElement} content
     */
    openPopup(btn: HTMLLIElement, content: HTMLElement) {
        // todo replace na position
        this.closeAll()
        btn.classList.add('jodit_popup_open');
        btn.appendChild(this.popup); // move
        this.__popapOpened = true;
        this.popup.innerHTML = '';
        this.popup.appendChild(content);
        this.popup.style.display = 'block';
    }

    /**
     *
     */
    openList(btn: HTMLLIElement) {
        btn.classList.add('jodit_dropdown_open');
        this.closeAll();
        this.__popapOpened = true;
        this.list.style.display = 'block';
    }

    /**
     *
     */
    closeAll() {
        this.list.innerHTML = '';
        this.popup.innerHTML = '';
        this.popup.style.display = 'none';
        this.list.style.display = 'none';
        this.__popapOpened = false;
        $$('.jodit_dropdown_open, .jodit_popap_open', this.container).forEach((btn) => {
            btn.classList.remove('jodit_dropdown_open', 'jodit_popap_open');
        })
    }

    checkActiveButtons(element: Node|false) {
        this.buttonList.forEach(({name, control, btn}) => {
            let className = name || "empty",
                tags,
                elm,
                css,
                el,
                checkActiveStatus = (cssObject) => {
                    let matches = 0,
                        total = 0;

                    each(cssObject, (cssProperty, cssValue) => {
                        if (isFunction(cssValue)) {
                            if (cssValue.apply(self, [el.css(cssProperty).toString().toLowerCase(), self])) {
                                matches += 1;
                            }
                        } else {
                            if (el.css(cssProperty).toString().toLowerCase() === cssValue) {
                                matches += 1;
                            }
                        }
                        total += 1;
                    });
                    if (total === matches && this.container.querySelector(".toolbar-" + className)) {
                        btn.classList.add("active");
                    }
                };

            if (control.tags || (control.options && control.options.tags)) {
                tags = control.tags || (control.options && control.options.tags);

                elm = element;
                this.parent.node.up(elm, (node) => {
                    if (tags.indexOf(node.nodeName.toLowerCase()) !== -1) {
                        btn.classList.add("active");
                        return true;
                    }
                }, this.parent.editor);
            }

            //activate by supposed css
            if (control.css || (control.options && control.options.css)) {
                css = control.css || (control.options && control.options.css);
                el = element;

                while (el && el.nodeType === Node.ELEMENT_NODE && !elm.classList.contains('jodit_editor')) {
                    checkActiveStatus(css);
                    el = elm.parentNode;
                }
            }
        });
    }

    private buttonList:ButtonType[] = [];
    /**
     *
     */
    addButton(item: string|ControlType, control?: ControlType, content?: string){
        let btn = dom('<li>' +
                    '<a href="javascript:void(0)"></a>' +
                    '<div class="jodit_tooltip"></div>' +
                '</li>'),
            name = typeof item === 'string' ? item : (item.name || 'empty'),
            a = btn.querySelector('a');

        let iconSVG = Toolbar.getIcon(name, false);

        if (iconSVG === false) {
            iconSVG = Toolbar.getIcon(typeof control.name === 'string' ? control.name : 'empty');
        }

        btn.control =  control;

        const clearName = name.replace(/[^a-zA-Z0-9]/g, '_');

        btn.classList.add('jodit_toolbar_btn'); // fix for ie You can not simply add class and add second parameter
        btn.classList.add('jodit_toolbar_btn-' + clearName);




        let icon =  dom(iconSVG);
        icon.classList.add('jodit_icon', 'jodit_icon_' + clearName);
        a.appendChild(icon);

        if (control === undefined || typeof(control) !== 'object') {
            control = {command: name};
        }

        if (content !== undefined) {
            a.innerHTML = content;
        }

        if (control.list) {
            btn.classList.add('jodit_with_dropdownlist');
            a.appendChild(dom('<span class="jodit_with_dropdownlist-trigger"></span>'))
        }

        if (control.iconURL) {
            a.style.backgroundImage =  'url(' + control.iconURL + ')'
        }

        if (control.tooltip) {
            btn.querySelector('.jodit_tooltip').innerHTML = this.parent.i18n(control.tooltip);
        } else {
            btn.removeChild(btn.querySelector('.jodit_tooltip'));
        }

        btn
            .addEventListener('mousedown',  (originalEvent) => {
                if (btn.classList.contains('disabled')) {
                    return false;
                }

                originalEvent.stopImmediatePropagation();
                originalEvent.preventDefault();

                if (control.list) {
                    this.openList(btn);
                    each(control.list, (key, value) => {
                        let elm;
                        if (this.parent.options.controls[value] !== undefined) {
                            elm = this.addButton(value, this.parent.options.controls[value]); // list like array {"align": {list: ["left", "right"]}}
                        } else if (this.parent.options.controls[key] !== undefined) {
                            elm = this.addButton(key, extend({}, this.parent.options.controls[key], value)); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}
                        } else {
                            elm = this.addButton(key, {
                                    exec: control.exec,
                                    command: control.command,
                                    args: [
                                        (control.args && control.args[0]) || key,
                                        (control.args && control.args[1]) || value
                                    ]
                                },
                                control.template && control.template({
                                    editor: this.parent,
                                    key,
                                    value
                                })
                            );
                        }

                        this.list.appendChild(elm);
                    });
                    btn.appendChild(this.list);
                } else if (control.exec !== undefined && typeof control.exec === 'function') {
                    control.exec({editor: this.parent, originalEvent, control, btn});
                    this.closeAll();
                } else if (control.popap !== undefined && typeof control.popap === 'function') {
                    this.openPopup(btn, control.popap({
                         editor: this.parent,
                         current: this.parent.selection.current(),
                         control,
                         close: () => {
                             this.closeAll();
                         }
                    }));
                } else {
                    if (control.command || name) {
                        this.parent.execCommand(control.command || name, (control.args && control.args[0]) || false, (control.args && control.args[1]) || null);
                        this.closeAll();
                    }
                }
            });

        this.buttonList.push({
            control,
            btn,
            name,
        });

        return btn;
    }

    /**
     *
     * @param {Array|Object} buttons
     * @param {HTMLDivElement} container
     */
    build(buttons: ControlType[]|string[], container: HTMLElement) {
        let lastBtnSeparator = false;

        each(buttons, (i, button) => {
            if (this.parent.options.removeButtons.indexOf(button) !== -1) {
                return;
            }

            if (button !== '|') {
                let control = button;

                lastBtnSeparator = false;

                if (typeof control !== 'object' && this.parent.options.controls[control] !== undefined) {
                    control = this.parent.options.controls[control];
                }

                this.container.appendChild(this.addButton(button, control));
            } else {
                if (!lastBtnSeparator) {
                    lastBtnSeparator = true;
                    this.container.appendChild(dom('<li class="jodit_toolbar_btn jodit_toolbar_btn-separator"></li>'));
                }
            }
        });

        this.__on(window, 'mousedown', () => {
            if (this.__popapOpened) {
                this.closeAll();
            }
        });

        this.parent.events.on('mousedown keydown', () => {
            let callback = () => {
                if (this.parent.selection) {
                    this.checkActiveButtons(this.parent.selection.current())
                }
            };
            if (this.parent.options.observer.timeout) {
                setTimeout(callback, this.parent.options.observer.timeout)
            } else {
                callback();
            }
        });

        container.appendChild(this.container);
    }
}