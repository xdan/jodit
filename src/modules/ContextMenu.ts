import Jodit from '../Jodit';
import Component from './Component';
import {css, dom} from "./Helpers";
import Toolbar from "./Toolbar";
/**
 * Module to generate context menu
 *
 * @module ContextMenu
 * @param {Object} parent Jodit main object
 */
export default class ContextMenu extends Component {
    context: HTMLElement;
    constructor(editor: Jodit) {
        super(editor);
        this.context = dom('<div class="jodit_context_menu"></div>');
        document.body.appendChild(this.context);
    }

    /**
     * Hide context menu
     *
     * @method hide
     */
    hide = () => {
        this.context.classList.remove('jodit_context_menu-show');
        window
            .removeEventListener('mouseup', this.hide);
    };

    /**
     * Generate and show context menu
     *
     * @method show
     * @param {int} x Global coordinate by X
     * @param {int} y Global coordinate by Y
     * @param {array} actions Array with plainobjects {icon: 'bin', title: 'Delete', exec: function () { do smth}}
     * @example
     * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
     */
    show(x, y, actions) {
        if (!Array.isArray(actions)) {
            return;
        }

        this.context.innerHTML = '';
        actions.forEach((item) => {
            if (!item) {
                return;
            }
            let action = dom('<a href="javascript:void(0)">' + (item.icon ? Toolbar.getIcon(item.icon) : '') + '<span></span></a>');

            action.addEventListener('click', (e) => {
                item.exec.call(self, e);
                this.hide();
                return false;
            });

            action.querySelector('span').innerText = this.parent.i18n(item.title);
            this.context.appendChild(action);
        });


        css(this.context, {
            left: x,
            top: y
        });

        window
            .addEventListener('mouseup', this.hide);

        this.context.classList.add('jodit_context_menu-show');
    }
}
