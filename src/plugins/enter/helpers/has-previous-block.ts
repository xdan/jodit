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
 * @private
 */
export function hasPreviousBlock(fake: Text, jodit: IJodit): boolean {
	return Boolean(
		Dom.prev(
			fake,
			elm => Dom.isBlock(elm) || Dom.isImage(elm),
			jodit.editor
		)
	);
}
