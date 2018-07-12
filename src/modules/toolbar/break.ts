/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {IViewBased} from "../Component";
import {ToolbarElement} from "./element";

export class ToolbarBreak extends ToolbarElement {
    constructor(jodit: IViewBased) {
        super(jodit);
        this.container.classList.add('jodit_toolbar_btn-break');
    }
}