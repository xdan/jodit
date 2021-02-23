/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from '../../../types';
import { trim } from '../string';
import { KEY_ALIASES } from '../../constants';

/**
 * Normalize keys to some standard name
 *
 * @param keys
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
