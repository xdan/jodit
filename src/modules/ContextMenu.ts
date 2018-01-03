/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Component} from './Component';
import {css, dom} from "./Helpers";
import {Toolbar} from "./Toolbar";

type Action = {
    icon ?: string;
    title ?: string;
    exec ?: (this: ContextMenu, e: MouseEvent) => false|void;
};

/**
 * Module to generate context menu
 *
 * @module ContextMenu
 * @param {Object} parent Jodit main object
 */
export class ContextMenu extends Component {
    private context: HTMLElement;
    constructor(editor: Jodit) {
        super(editor);
        this.context = dom('<div class="jodit_context_menu"></div>', editor.ownerDocument);
        this.jodit.ownerDocument.body.appendChild(this.context);
    }

    /**
     * Hide context menu
     *
     * @method hide
     */
    hide = () => {
        this.context.classList.remove('jodit_context_menu-show');
        this.jodit.ownerWindow
            .removeEventListener('mouseup', this.hide);
    };

    /**
     * Generate and show context menu
     *
     * @method show
     * @param {number} x Global coordinate by X
     * @param {number} y Global coordinate by Y
     * @param {Action[]} actions Array with plainobjects {icon: 'bin', title: 'Delete', exec: function () { do smth}}
     * @example
     * ```javascript
     * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
     * ```
     */
    show(x: number, y: number, actions: Array<false|Action>) {
        const self = this;
        if (!Array.isArray(actions)) {
            return;
        }

        this.context.innerHTML = '';

        actions.forEach((item) => {
            if (!item) {
                return;
            }

            const action: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)">' + (item.icon ? Toolbar.getIcon(item.icon) : '') + '<span></span></a>', this.jodit.ownerDocument);
            const span: HTMLSpanElement = <HTMLSpanElement>action.querySelector('span');

            action.addEventListener('click', (e: MouseEvent) => {
                item.exec && item.exec.call(self, e);
                self.hide();
                return false;
            });

            span.innerText = self.jodit.i18n(item.title || '');
            self.context.appendChild(action);
        });


        css(self.context, {
            left: x,
            top: y
        });

        this.jodit.ownerWindow
            .addEventListener('mouseup', self.hide);

        this.context.classList.add('jodit_context_menu-show');
    }
}
