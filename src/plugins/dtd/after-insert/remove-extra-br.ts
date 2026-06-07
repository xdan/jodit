/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/dtd
 * @internal
 */

import type { HTMLTagNames, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

const brBoxes = new Set([
	'table',
	'pre',
	'blockquote',
	'code'
] as HTMLTagNames[]);

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

	if (parent && !Dom.isTag(parent, brBoxes)) {
		const br = Dom.isTag(node, 'br')
			? node
			: Dom.findNotEmptySibling(node, false);

		if (!Dom.isTag(br, 'br')) {
			return;
		}

		// Only a trailing `<br>` is "extra". If meaningful content follows it,
		// the `<br>` is a real line break and removing it would merge two lines
		// (e.g. toggling a style on an empty line), so keep it (#1302).
		if (Dom.findNotEmptySibling(br, false)) {
			return;
		}

		jodit.s.setCursorBefore(br);
		Dom.safeRemove(br);
	}
}
