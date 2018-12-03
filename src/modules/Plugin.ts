/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IPlugin } from '../types';
import { IViewBased } from '../types/view';
import { Component } from './Component';

export abstract class Plugin extends Component implements IPlugin {
    public abstract afterInit(jodit?: IViewBased): void;

    public abstract beforeDestruct(jodit?: IViewBased): void;

    private __destructed: boolean = false;

    public destruct = () => {
        if (!this.__destructed) {
            this.jodit.events &&
                this.jodit.events.off('beforeDestruct', this.destruct);
            this.beforeDestruct(this.jodit);
            this.__destructed = true;
        }
    };

    constructor(jodit: IViewBased) {
        super(jodit);
        jodit.events
            .on('afterInit', this.afterInit.bind(this, jodit))
            .on('beforeDestruct', this.destruct);
    }
}
