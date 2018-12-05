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

    public destruct = () => {
        if (!this.isDestructed) {
            this.jodit.events &&
                this.jodit.events.off('beforeDestruct', this.destruct);
            this.beforeDestruct(this.jodit);
            this.isDestructed = true;
        }
    };

    constructor(jodit: IViewBased) {
        super(jodit);
        jodit.events
            .on('afterInit', this.afterInit.bind(this, jodit))
            .on('beforeDestruct', this.destruct);
    }
}
