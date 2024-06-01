/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit } from 'jodit/types';
import { INSEPARABLE_TAGS } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

const TABLE_CONTAINER_TAGS = new Set([
	'table',
	'tbody',
	'thead',
	'tfoot',
	'tr'
] as const);

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
		Dom.isEmpty(nodeElm, INSEPARABLE_TAGS) &&
		!Dom.isTag(nodeElm, TABLE_CONTAINER_TAGS)
	) {
		const br = jodit.createInside.element('br');
		nodeElm.appendChild(br);
		return true;
	}

	return hadEffect;
}
