/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

import type { IDictionary } from 'jodit/types';
import { trim } from 'jodit/core/helpers/string';
import { KEY_ALIASES } from 'jodit/core/constants';

/**
 * Normalize keys to some standard name
 */
export function normalizeKeyAliases(keys: string): string {
	const memory: IDictionary<boolean> = {};

	return keys
		.replace(/\+\+/g, '+add')
		.split(/[\s]*\+[\s]*/)
		.map(key => trim(key.toLowerCase()))
		.map(key => KEY_ALIASES[key] || key)
		.sort()
		.filter(key => !memory[key] && key !== '' && (memory[key] = true))
		.join('+');
}
