/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { Nullable } from 'jodit/types';
import { MARKER_CLASS } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

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
