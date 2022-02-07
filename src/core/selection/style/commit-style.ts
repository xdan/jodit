/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { HTMLTagNames, IJodit, IStyleOptions } from 'jodit/types';
import { IS_BLOCK } from 'jodit/core/constants';
import { ApplyStyle } from './apply-style';

export const WRAP = 'wrap';
export const UNWRAP = 'unwrap';
export const CHANGE = 'change';
export const UNSET = 'unset';
export const INITIAL = 'initial';
export const REPLACE = 'replace';

export class CommitStyle {
	get elementIsList(): boolean {
		return Boolean(
			this.options.element && ['ul', 'ol'].includes(this.options.element)
		);
	}

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

	/**
	 * The commit applies the tag change
	 */
	get isElementCommit(): boolean {
		return Boolean(
			this.options.element &&
				this.options.element !== this.options.defaultTag
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
		ApplyStyle(jodit, this);
	}
}
