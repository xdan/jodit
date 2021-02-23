/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef } from '../../../types';

/**
 * Safe stringify circular object
 *
 * @param value
 * @param options
 */
export function stringify(
	value: any,
	options: {
		excludeKeys?: string[];
		prettify?: string;
	} = {}
): string {
	if (typeof value !== 'object') {
		return value.toString ? value.toString() : value;
	}

	const excludeKeys = new Set(options.excludeKeys);

	const map = new WeakMap();

	const r = (k: string, v: any): CanUndef<string> => {
		if (excludeKeys.has(k)) {
			return;
		}

		if (typeof v === 'object' && v != null) {
			if (map.get(v)) {
				return '[refObject]';
			}

			map.set(v, true);
		}

		return v;
	};

	return JSON.stringify(value, r, options.prettify);
}
