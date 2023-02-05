/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers/utils/scroll-into-view';
import { BR } from 'jodit/core/constants';

/**
 * Checks the possibility and necessity of inserting a BR instead of a block
 * @private
 */
export function checkBR(
	jodit: IJodit,
	current: Node,
	shiftKeyPressed?: boolean
): boolean {
	const isMultiLineBlock = Dom.closest(
		current,
		['pre', 'blockquote'],
		jodit.editor
	);

	const isBRMode = jodit.o.enter.toLowerCase() === BR.toLowerCase();

	// if use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
	if (
		isBRMode ||
		(shiftKeyPressed && !isMultiLineBlock) ||
		(!shiftKeyPressed && isMultiLineBlock)
	) {
		const br = jodit.createInside.element('br');

		jodit.s.insertNode(br, false, false);

		if (!Dom.findNotEmptySibling(br, false)) {
			Dom.after(br, br.cloneNode());
		}

		const range = jodit.s.range;
		range.setStartAfter(br);
		range.collapse(true);
		jodit.s.selectRange(range);
		scrollIntoViewIfNeeded(br, jodit.editor, jodit.ed);

		return false;
	}

	return true;
}
