/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form/block
 */

import './block.less';

import type { IUIElement, IViewBased } from 'jodit/types';
import { UIGroup } from 'jodit/core/ui/group';
import { attr } from 'jodit/core/helpers/utils';
import { component } from 'jodit/core/decorators';

@component
export class UIBlock extends UIGroup {
	/** @override */
	override className(): string {
		return 'UIBlock';
	}

	constructor(
		jodit: IViewBased,
		elements?: Array<IUIElement | void | null | false>,
		override readonly options: {
			className?: string;
			align?: 'center' | 'left' | 'right' | 'full';
			width?: 'full';
			ref?: string;
			mod?: string;
		} = {
			align: 'left'
		}
	) {
		super(jodit, elements);

		this.setMod('align', this.options.align || 'left');
		this.setMod('width', this.options.width || '');
		this.options.mod && this.setMod(this.options.mod, true);
		this.options.className &&
			this.container.classList.add(this.options.className);

		attr(this.container, 'data-ref', options.ref);
		attr(this.container, 'ref', options.ref);
	}
}
