/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from '../Jodit';
import { Component } from './Component';

export class StatusBar extends Component {
    public container: HTMLElement;

    public hide() {
        this.container && (this.container.style.display = 'none');
    }
    public show() {
        this.container && (this.container.style.display = 'block');
    }

    public append(child: HTMLElement, inTheRight: boolean = false) {
        const wrapper: HTMLElement = this.jodit.ownerDocument.createElement(
            'div'
        );
        wrapper.classList.add('jodit_statusbar_item');

        if (inTheRight) {
            wrapper.classList.add('jodit_statusbar_item-right');
        }

        wrapper.appendChild(child);

        this.container.appendChild(wrapper);
        this.show();
        this.jodit.events.fire('resize');
    }

    public destruct() {
        super.destruct();
        this.container.parentNode &&
            this.container.parentNode.removeChild(this.container);
    }

    constructor(jodit: Jodit, readonly target: HTMLElement) {
        super(jodit);
        this.container = jodit.ownerDocument.createElement('div');
        this.container.classList.add('jodit_statusbar');
        target.appendChild(this.container);
        this.hide();
    }
}
