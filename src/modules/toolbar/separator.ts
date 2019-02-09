/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */
import { IViewBased } from '../../types/view';
import { ToolbarElement } from './element';
import { IToolbarCollection } from '../../types';

export class ToolbarSeparator extends ToolbarElement {
    constructor(jodit: IToolbarCollection | IViewBased) {
        super(jodit);
        this.container.classList.add('jodit_toolbar_btn-separator');
    }
}
