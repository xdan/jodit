/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

import type { IDictionary } from 'jodit/types';
import { trim } from 'jodit/core/helpers/string/trim';
import { KEY_ALIASES } from 'jodit/core/constants';

/**
 * Normalize keys to some standard name
 */
export function normalizeKeyAliases(keys: string): string {
	const memory: IDictionary<boolean> = {};

	const order: IDictionary = {
		meta: 1,
		ctrl: 2,
		control: 2,
		alt: 3,
		shift: 4
	};

	return keys
		.replace(/\+\+/g, '+add')
		.split(/[\s]*\+[\s]*/)
		.map(key => trim(key.toLowerCase()))
		.map(key => KEY_ALIASES[key] || key)
		.sort((a, b) => {
			if (order[a] && !order[b]) {
				return -1;
			}

			if (!order[a] && order[b]) {
				return 1;
			}

			if (order[a] && order[b]) {
				return order[a] - order[b];
			}

			return a > b ? 1 : -1;
		})
		.filter(key => !memory[key] && key !== '' && (memory[key] = true))
		.join('+');
}
