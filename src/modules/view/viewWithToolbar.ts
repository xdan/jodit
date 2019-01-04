/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { View } from './view';
import { ToolbarCollection } from '../toolbar/collection';
import { IViewWithToolbar } from '../../types/view';

export class ViewWithToolbar extends View implements  IViewWithToolbar {
    toolbar: ToolbarCollection = ToolbarCollection.makeCollection(this.jodit);

    destruct() {
        this.toolbar.destruct();
        super.destruct();
    }
}