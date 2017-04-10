import Component from "./Component"
import {dom, each} from "./Helpers"

export default class Toolbar extends Component{
    static icons = {};
    container;
    popap;

    /**
     *
     * @param {Jodit} parent
     *
     */
    constructor(parent) {
        super(parent);
        this.container = dom('<div class="jodit_toolbar"/>')
        this.popap = dom('<div class="jodit_toolbar_popap"/>')
    }
    static getIcon(name) {
        console.log(name);
        return Toolbar.icons[name] !== undefined ? Toolbar.icons[name] : '<span></span>';
    }

    /**
     *
     * @param {Object|String} item
     * @param {Object} [control]
     * @param {String} [content]
     */
    addButton = function (item, control, content) {
        let btn = dom('<li><a href="javascript:void(0)"></a><div class="jodit_tooltip"></div></li>'),
            list,
            name = typeof item === 'string' ? item : (item.name || 'empty'),
            a = btn.querySelector('a');

        btn.control =  control;

        btn.classList.add('toolbar-' + name.replace(/[^a-zA-Z0-9]/g, '_'));

        a.appendChild(dom(Toolbar.getIcon(name)));

        if (control === undefined || typeof(control) !== 'object') {
            control = {command: name};
        }

        if (content !== undefined) {
            a.innerHTML = content;
        }

        if (control.list) {
            list = dom('<ul class="jodit_dropdownlist"></ul>');
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
                list.appendChild(elm);
            });
            btn.appendChild(list);
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
            .addEventListener('mousedown',  (e) => {
                if (btn.classList.contains('disabled')) {
                    return false;
                }

                e.stopImmediatePropagation();
                e.preventDefault();

                if (list) {
                    btn.classList.toggle('jodit_dropdown_open', 'active');
                } else if (control.exec !== undefined && typeof control.exec === 'function') {
                    control.exec.call(this, e, control, btn);
                } else if (control.popap !== undefined && typeof control.popap === 'function') {
                    btn.classList.toggle('active');
                    this.popap.style.diplay = 'block';
                    // todo replace na position
                    btn.appendChild(this.popap); // move
                    this.popap.innerHTML = control.popap.call(this, this.selection.current(), control);
                } else {
                    if (control.command || name) {
                        this.execCommand(control.command || name, (control.args && control.args[0]) || null, (control.args && control.args[1]) || null);
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
    build(buttons, container) {
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
                    this.container.appendChild(dom('<li class="separator"></li>'));
                }
            }
        });

        container.appendChild(this.container);
    }
}