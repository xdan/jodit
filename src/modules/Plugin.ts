/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Component, IViewBased} from "./Component";

export abstract class Plugin extends Component{
    constructor(jodit: IViewBased) {
        super(jodit);
        jodit.events
            .on('afterInit', this.afterInit.bind(this))
            .on('beforeDestruct', this.beforeDestruct.bind(this));
    }

    abstract afterInit(): void;

    beforeDestruct() {};
}