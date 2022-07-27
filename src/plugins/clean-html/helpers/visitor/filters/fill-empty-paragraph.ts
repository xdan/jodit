/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export function fillEmptyParagraph(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	if (
		jodit.o.cleanHTML.fillEmptyParagraph &&
		Dom.isBlock(nodeElm) &&
		Dom.isEmpty(nodeElm, /^(img|svg|canvas|input|textarea|form|br)$/)
	) {
		const br = jodit.createInside.element('br');
		nodeElm.appendChild(br);
		return true;
	}

	return hadEffect;
}
