/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Component } from './Component';
import { Dom } from './Dom';
import { IJodit } from '../types';

export class StatusBar extends Component {
    public container: HTMLElement;

    public hide() {
        this.container && (this.container.style.display = 'none');
    }
    public show() {
        this.container && (this.container.style.display = 'block');
    }

    public append(child: HTMLElement, inTheRight: boolean = false) {
        const wrapper: HTMLElement = this.jodit.create.div(
            'jodit_statusbar_item'
        );

        if (inTheRight) {
            wrapper.classList.add('jodit_statusbar_item-right');
        }

        wrapper.appendChild(child);

        this.container.appendChild(wrapper);
        this.show();
        this.jodit.events.fire('resize');
    }

    constructor(jodit: IJodit, readonly target: HTMLElement) {
        super(jodit);
        this.container = jodit.create.div('jodit_statusbar');
        target.appendChild(this.container);
        this.hide();
    }

    destruct() {
        Dom.safeRemove(this.container);
        delete this.container;
        super.destruct();
    }
}
