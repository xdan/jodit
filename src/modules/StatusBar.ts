/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Component} from "./Component";
import {Jodit} from "../Jodit";

export class StatusBar extends Component {
    public container: HTMLElement;

    hide() {
        this.container && (this.container.style.display = 'none');
    }
    show() {
        this.container && (this.container.style.display = 'block');
    }

    constructor(jodit: Jodit, readonly target: HTMLElement) {
        super(jodit);
        this.container = jodit.ownerDocument.createElement('div');
        this.container.classList.add('jodit_statusbar');
        target.appendChild(this.container);
        this.hide();
    }

    append(child: HTMLElement, inTheRight: boolean = false) {
        const wrapper: HTMLElement = this.jodit.ownerDocument.createElement('div');
        wrapper.classList.add('jodit_statusbar_item');

        if (inTheRight) {
            wrapper.classList.add('jodit_statusbar_item-right')
        }

        wrapper.appendChild(child);

        this.container.appendChild(wrapper);
        this.show();
        this.jodit.events.fire('resize');
    }

    destruct() {
        super.destruct();
        this.container.parentNode && this.container.parentNode.removeChild(this.container);
    }
}