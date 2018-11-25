/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewBased } from "../types/view";
import { Component } from "./Component";

export abstract class Plugin extends Component {
    constructor(jodit: IViewBased) {
        super(jodit);
        jodit.events
            .on("afterInit", this.afterInit.bind(this, jodit))
            .on("beforeDestruct", this.beforeDestruct.bind(this, jodit));
    }

    public abstract afterInit(jodit?: IViewBased): void;

    public beforeDestruct(jodit?: IViewBased) {}
}
