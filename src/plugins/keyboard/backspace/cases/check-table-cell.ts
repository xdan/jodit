/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dom } from '../../../../core/dom';
import type { IJodit } from 'jodit/types';

/**
 * Inside the CELL table - nothing to do
 *
 * @example
 * ```html
 * <table><tr><td>|test</td></tr></table>
 * ```
 * result
 * ```html
 * <table><tr><td>|test</td></tr></table>
 * ```
 *
 * @private
 */
export function checkTableCell(jodit: IJodit, fakeNode: Node): boolean {
	const cell = fakeNode.parentElement;

	if (Dom.isCell(cell)) {
		return true;
	}

	return false;
}
