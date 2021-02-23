/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { HTMLTagNames, IJodit, IStyleOptions } from '../../../types';
import { IS_BLOCK } from '../../constants';
import { ApplyStyle } from './apply-style';

export class Style {
	get element(): HTMLTagNames {
		return this.options.element || this.defaultTag;
	}

	/**
	 * New element is block
	 */
	get elementIsBlock(): boolean {
		return Boolean(
			this.options.element && IS_BLOCK.test(this.options.element)
		);
	}

	get defaultTag(): HTMLTagNames {
		if (this.options.defaultTag) {
			return this.options.defaultTag;
		}

		return this.elementIsBlock ? 'p' : 'span';
	}

	get elementIsDefault(): Boolean {
		return this.element === this.defaultTag;
	}

	constructor(readonly options: IStyleOptions) {}

	apply(jodit: IJodit): void {
		const applyStyle = new ApplyStyle(jodit, this);
		applyStyle.apply();
	}
}
