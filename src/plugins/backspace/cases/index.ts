/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { IJodit } from 'jodit/types';

import type { DeleteMode } from '../interface';

import { checkJoinNeighbors } from './check-join-neighbors';
import { checkJoinTwoLists } from './check-join-two-lists';
import { checkRemoveChar } from './check-remove-char';
import { checkRemoveContentNotEditable } from './check-remove-content-not-editable';
import { checkRemoveEmptyNeighbor } from './check-remove-empty-neighbor';
import { checkRemoveEmptyParent } from './check-remove-empty-parent';
import { checkRemoveUnbreakableElement } from './check-remove-unbreakable-element';
import { checkTableCell } from './check-table-cell';
import { checkUnwrapFirstListItem } from './check-unwrap-first-list-item';

// Individual cases narrow `fakeNode` to different node subtypes (Text,
// Element, …); the dispatcher always passes a Node, so accept `any` here and
// keep the strong typing inside each case implementation.
type CaseFn = (
	jodit: IJodit,

	fakeNode: any,
	backspace: boolean,
	mode: DeleteMode
) => void | boolean;

/**
 * Ordered delete/backspace cases with stable keys. The first one returning
 * `true` wins. The keys are stable across minified builds (function names are
 * mangled by terser) so they can be referenced by `delete.disableCases`.
 * @private
 */
export const casesMap: ReadonlyArray<readonly [string, CaseFn]> = [
	['remove-unbreakable', checkRemoveUnbreakableElement],
	['remove-not-editable', checkRemoveContentNotEditable],
	['remove-char', checkRemoveChar],
	['table-cell', checkTableCell],
	['remove-empty-parent', checkRemoveEmptyParent],
	['remove-empty-neighbor', checkRemoveEmptyNeighbor],
	['join-two-lists', checkJoinTwoLists],
	['join-neighbors', checkJoinNeighbors],
	['unwrap-first-list-item', checkUnwrapFirstListItem]
];

/**
 * @private
 * @deprecated Use `casesMap` to also get the stable case keys.
 */
export const cases: CaseFn[] = casesMap.map(([, fn]) => fn);
