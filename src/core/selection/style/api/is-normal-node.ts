/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { Select } from 'jodit/core/selection';

/**
 * Is normal usual element
 * @private
 */
export function isNormalNode(elm: Nullable<Node>): boolean {
	return Boolean(
		elm &&
			!Dom.isEmptyTextNode(elm) &&
			!Dom.isTemporary(elm) &&
			!Select.isMarker(elm)
	);
}
