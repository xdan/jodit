/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import type { CommitMode, IJodit, Nullable } from '../../../../types';
import { Dom } from '../../../dom';
import { toggleCSS } from './toggle/toggle-css';

/**
 * Add or remove styles to element
 *
 * @param elm - The element to switch styles
 */
export function toggleCommitStyles(
	commitStyle: CommitStyle,
	elm: HTMLElement,
	jodit: IJodit,
	mode: Nullable<CommitMode>
): Nullable<CommitMode> {
	if (
		commitStyle.elementIsBlock ||
		(Dom.isTag(elm, commitStyle.element) && !commitStyle.elementIsDefault)
	) {
		Dom.unwrap(elm);
	}

	toggleCSS(commitStyle, elm, jodit, mode);

	return mode;
}
