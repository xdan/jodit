/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

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
