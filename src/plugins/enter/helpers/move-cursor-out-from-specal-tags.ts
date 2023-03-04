/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, HTMLTagNames } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Checks if the cursor is on the edge of a special tag and exits if so
 * @private
 */
export function moveCursorOutFromSpecialTags(
	jodit: IJodit,
	fake: Text,
	tags: HTMLTagNames[]
): void {
	const { s } = jodit;

	const link = Dom.closest(fake, tags, jodit.editor);

	if (link) {
		if (s.cursorOnTheRight(link, fake)) {
			Dom.after(link, fake);
		} else if (s.cursorOnTheLeft(link, fake)) {
			Dom.before(link, fake);
		}
	}
}
