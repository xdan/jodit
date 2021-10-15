/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from '../../../../types';
import { Dom } from '../../../dom';

/**
 * Is normal usual element
 */
export function isNormalNode(elm: Nullable<Node>): boolean {
	return Boolean(elm && !Dom.isEmptyTextNode(elm) && !Dom.isTemporary(elm));
}
