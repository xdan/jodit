/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IJodit, IPlugin } from '../types';
import { Component } from './Component';

export abstract class Plugin extends Component<IJodit> implements IPlugin {
    public abstract afterInit(jodit: IJodit): void;

    public abstract beforeDestruct(jodit: IJodit): void;

    constructor(jodit: IJodit) {
        super(jodit);

        jodit.events
            .on('afterInit', this.afterInit.bind(this, jodit))
            .on('beforeDestruct', this.destruct);
    }

    destruct = () => {
        if (!this.isDestructed) {
            this.jodit.events &&
            this.jodit.events.off('beforeDestruct', this.destruct);

            this.beforeDestruct(this.jodit);

            super.destruct();
        }
    }
}
