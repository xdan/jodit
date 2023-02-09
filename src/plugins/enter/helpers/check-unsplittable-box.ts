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

/**
 * Inside quote/tables cell, etc. you can't split so just add br
 * @private
 */
export function checkUnsplittableBox(
	fake: Text,
	jodit: IJodit,
	currentBox: HTMLElement
): boolean {
	if (!Dom.canSplitBlock(currentBox)) {
		Dom.before(fake, jodit.createInside.element('br'));
		return false;
	}

	return true;
}
