/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Define element is selection helper
 * @deprecated use Dom.isMarker instead
 */
export function isMarker(elm: Nullable<Node>): elm is HTMLElement {
	return Dom.isMarker(elm);
}
