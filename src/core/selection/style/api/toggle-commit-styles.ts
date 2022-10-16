/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'jodit/core/dom';

/**
 * Add or remove styles to element
 * @param elm - The element to switch styles
 * @private
 */
export function toggleCommitStyles(
	commitStyle: CommitStyle,
	elm: HTMLElement,
	jodit: IJodit
): boolean {
	if (
		commitStyle.elementIsBlock ||
		(Dom.isTag(elm, commitStyle.element) && !commitStyle.elementIsDefault)
	) {
		if (elm.getAttribute('style')) {
			Dom.replace(elm, commitStyle.defaultTag, jodit.createInside, true);
		} else {
			Dom.unwrap(elm);
		}

		return true;
	}

	return false;
}
