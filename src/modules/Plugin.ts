/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Component } from "./Component";
import { IViewBased } from "./view/type";

export abstract class Plugin extends Component{
    constructor(jodit: IViewBased) {
        super(jodit);
        jodit.events
            .on('afterInit', this.afterInit.bind(this, jodit))
            .on('beforeDestruct', this.beforeDestruct.bind(this, jodit));
    }

    abstract afterInit(jodit?: IViewBased): void;

    beforeDestruct(jodit?: IViewBased) {};
}