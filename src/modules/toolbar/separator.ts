/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
