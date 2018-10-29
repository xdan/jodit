/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {ToolbarElement} from "./element";
import {IViewBased} from "../view/type";

export class ToolbarBreak extends ToolbarElement {
    constructor(jodit: IViewBased) {
        super(jodit);
        this.container.classList.add('jodit_toolbar_btn-break');
    }
}