/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { IJodit, Nullable } from 'jodit/types';

/**
 * Whether the selection, `before` as it was when a key went down, has since
 * moved to somewhere else in the editor
 * @private
 */
export function isMoved(jodit: IJodit, before: Nullable<Range>): boolean {
	const { s } = jodit;

	// Selecting table cells, for one, removes the selection altogether
	if (!before || !s.isInsideArea) {
		return false;
	}

	const { range } = s;

	return (
		range.startContainer !== before.startContainer ||
		range.startOffset !== before.startOffset ||
		range.endContainer !== before.endContainer ||
		range.endOffset !== before.endOffset
	);
}
