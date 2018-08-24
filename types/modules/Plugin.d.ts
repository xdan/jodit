/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from "./Component";
import { IViewBased } from "./view/type";
export declare abstract class Plugin extends Component {
    constructor(jodit: IViewBased);
    abstract afterInit(jodit?: IViewBased): void;
    beforeDestruct(jodit?: IViewBased): void;
}
