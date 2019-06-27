/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
