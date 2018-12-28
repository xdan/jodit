/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { View } from './view';
import { ToolbarCollection } from '..';

export class ViewWithToolbar extends View {
    toolbar: ToolbarCollection = new ToolbarCollection(this.jodit);

    destruct() {
        this.toolbar.destruct();
        super.destruct();
    }
}