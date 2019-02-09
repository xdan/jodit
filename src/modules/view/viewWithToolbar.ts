/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewWithToolbar } from '../../types/view';
import { IToolbarCollection } from '../../types/toolbar';
import { View } from './view';

export class ViewWithToolbar extends View implements IViewWithToolbar {
    toolbar: IToolbarCollection = JoditToolbarCollection.makeCollection(this);

    destruct() {
        this.toolbar.destruct();
        delete this.toolbar;
        super.destruct();
    }
}
import { JoditToolbarCollection } from '../toolbar/joditToolbarCollection';
