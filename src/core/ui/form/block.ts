/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { IUIElement, IViewBased } from '../../../types';
import { UIGroup } from '..';

import './block.less';
import { attr } from '../../helpers/utils';

export class UIBlock extends UIGroup {
	constructor(
		jodit: IViewBased,
		elements?: Array<IUIElement | void | null | false>,
		readonly options: {
			align?: 'center' | 'left' | 'right' | 'full';
			ref?: string;
		} = {
			align: 'left'
		}
	) {
		super(jodit, elements);
		this.setMod('align', this.options.align || 'left');

		attr(this.container, 'data-ref', options.ref);
		attr(this.container, 'ref', options.ref);
	}
}
