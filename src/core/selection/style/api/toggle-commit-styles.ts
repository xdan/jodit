/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import { Dom } from 'jodit/core/dom';

/**
 * Add or remove styles to element
 * @param elm - The element to switch styles
 * @private
 */
export function toggleCommitStyles(
	commitStyle: CommitStyle,
	elm: HTMLElement
): boolean {
	if (
		commitStyle.elementIsBlock ||
		(Dom.isTag(elm, commitStyle.element) && !commitStyle.elementIsDefault)
	) {
		Dom.unwrap(elm);
		return true;
	}

	return false;
}
