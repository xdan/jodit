/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { MARKER_CLASS } from 'jodit/core/constants';

/**
 * Define element is selection helper
 */
export function isMarker(elm: Nullable<Node>): elm is HTMLElement {
	return (
		Dom.isNode(elm) &&
		Dom.isTag(elm, 'span') &&
		elm.hasAttribute('data-' + MARKER_CLASS)
	);
}
