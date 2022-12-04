/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'jodit/core/dom';
import { isSameAttributes } from 'jodit/core/selection/style/api/is-same-attributes';

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
	const { elementIsBlock, elementIsDefault, options } = commitStyle;

	if (
		!elementIsBlock &&
		(elementIsDefault ||
			!Dom.isTag(elm, commitStyle.element) ||
			!isSameAttributes(elm, commitStyle.options.attributes))
	) {
		return false;
	}

	if (
		elm.attributes.length &&
		(!options.attributes || !isSameAttributes(elm, options.attributes))
	) {
		Dom.replace(elm, commitStyle.defaultTag, jodit.createInside, true);
	} else {
		Dom.unwrap(elm);
	}

	return true;
}
