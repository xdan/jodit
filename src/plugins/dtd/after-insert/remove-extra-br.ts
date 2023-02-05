/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/dtd
 * @internal
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Checks if there is a tag in the block element after the inserted br node,
 * if so, removes it
 * @internal
 */
export function removeExtraBr(jodit: IJodit, node: Node): void {
	if (!jodit.o.dtd.removeExtraBr || Dom.isTag(node, 'br')) {
		return;
	}

	const parent = Dom.furthest(node, Dom.isBlock, jodit.editor);

	if (parent && !Dom.isTag(parent, ['table', 'pre', 'blockquote', 'code'])) {
		const br = Dom.isTag(node, 'br')
			? node
			: Dom.findNotEmptySibling(node, false);

		if (!Dom.isTag(br, 'br')) {
			return;
		}

		jodit.s.setCursorBefore(br);
		Dom.safeRemove(br);
	}
}
