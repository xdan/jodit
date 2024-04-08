/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import { checkJoinNeighbors } from './check-join-neighbors';
import { checkJoinTwoLists } from './check-join-two-lists';
import { checkRemoveChar } from './check-remove-char';
import { checkRemoveContentNotEditable } from './check-remove-content-not-editable';
import { checkRemoveEmptyNeighbor } from './check-remove-empty-neighbor';
import { checkRemoveEmptyParent } from './check-remove-empty-parent';
import { checkRemoveUnbreakableElement } from './check-remove-unbreakable-element';
import { checkTableCell } from './check-table-cell';
import { checkUnwrapFirstListItem } from './check-unwrap-first-list-item';

/**
 * @private
 */
export const cases = [
	checkRemoveUnbreakableElement,
	checkRemoveContentNotEditable,
	checkRemoveChar,
	checkTableCell,
	checkRemoveEmptyParent,
	checkRemoveEmptyNeighbor,
	checkJoinTwoLists,
	checkJoinNeighbors,
	checkUnwrapFirstListItem
];
