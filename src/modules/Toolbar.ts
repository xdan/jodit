import Jodit from "../jodit"
import Component from "./Component"
import {dom, each, $$} from "./Helpers"
type ControlType = {
    name?: string;
    list?: any[],
    command?: string;
    iconURL?: string;
    tooltip?: string;
    exec?: Function;
    args?: any[];
    template?: Function;
    popap?: Function;
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

    static getIcon(name) {
        return Toolbar.icons[name] !== undefined ? Toolbar.icons[name] : '<span></span>';
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

        btn.control =  control;

        const clearName = name.replace(/[^a-zA-Z0-9]/g, '_');

        btn.classList.add('jodit_toolbar_btn'); // fix for ie You can not simply add and add a second parameter
        btn.classList.add('jodit_toolbar_btn-' + clearName);

        let icon = dom(Toolbar.getIcon(name));
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
                        let elm = this.addButton(key, {
                                    exec: control.exec,
                                    command: control.command,
                                    args: [
                                        (control.args && control.args[0]) || key,
                                        (control.args && control.args[1]) || value
                                    ]
                                },
                                control.template && control.template.call(this.parent, key, value)
                            );
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

        container.appendChild(this.container);
    }
}