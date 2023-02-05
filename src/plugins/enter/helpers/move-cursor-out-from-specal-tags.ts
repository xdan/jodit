/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, Nullable, HTMLTagNames } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Checks if the cursor is on the edge of a special tag and exits if so
 */
export function moveCursorOutFromSpecialTags(
	jodit: IJodit,
	current: Nullable<Node>,
	tags: HTMLTagNames[]
): void {
	const { s } = jodit;

	const link = Dom.closest(current, tags, jodit.editor);
	if (link) {
		if (s.cursorOnTheRight(link)) {
			s.setCursorAfter(link);
		} else if (s.cursorOnTheLeft(link)) {
			s.setCursorBefore(link);
		}
	}
}
