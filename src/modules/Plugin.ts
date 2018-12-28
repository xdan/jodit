/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IPlugin } from '../types';
import { Component } from './Component';
import { Jodit } from '../Jodit';

export abstract class Plugin extends Component<Jodit> implements IPlugin {
    public abstract afterInit(jodit: Jodit): void;

    public abstract beforeDestruct(jodit: Jodit): void;

    public destruct = () => {
        if (!this.isDestructed) {
            this.jodit.events &&
                this.jodit.events.off('beforeDestruct', this.destruct);

            this.beforeDestruct(this.jodit);
            this.isDestructed = true;
        }
    };

    constructor(jodit: Jodit) {
        super(jodit);

        jodit.events
            .on('afterInit', this.afterInit.bind(this, jodit))
            .on('beforeDestruct', this.destruct);
    }
}
