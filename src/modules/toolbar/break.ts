/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased } from '../../types/view';
import { ToolbarElement } from './element';
import { IToolbarCollection } from '../../types';

export class ToolbarBreak extends ToolbarElement {
	constructor(jodit: IToolbarCollection | IViewBased) {
		super(jodit);
		this.container.classList.add('jodit_toolbar_btn-break');
	}
}
