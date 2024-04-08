/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IDictionary, IJodit, Nullable } from 'jodit/types';
import { IS_PROD } from 'jodit/core/constants';

import * as filters from './filters';

type Filter = keyof typeof filters;
const keys = Object.keys(filters) as Filter[];

/**
 * @private
 */
export function visitNodeWalker(
	jodit: IJodit,
	nodeElm: Node,
	allowTags: IDictionary | false,
	denyTags: IDictionary | false,
	currentSelectionNode: Nullable<Node>
): boolean {
	let hadEffect = false;
	const dcf = jodit.o.cleanHTML.disableCleanFilter;
	for (const key of keys) {
		if (dcf && dcf.has(key)) {
			continue;
		}

		const filter = filters[key];

		const tmp = hadEffect;

		hadEffect = filter(
			jodit,
			nodeElm,
			hadEffect,
			allowTags,
			denyTags,
			currentSelectionNode
		);

		if (!IS_PROD && !tmp && hadEffect) {
			console.warn(`CleanHTML: Effect "${key}"`);
		}

		if (!nodeElm.isConnected) {
			return true;
		}
	}

	return hadEffect;
}
