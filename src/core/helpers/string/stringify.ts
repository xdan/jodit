/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

import type { CanUndef } from 'jodit/types';

/**
 * Safe stringify circular object
 */
export function stringify(
	value: unknown,
	options: {
		excludeKeys?: string[];
		prettify?: string;
	} = {}
): string {
	if (typeof value !== 'object') {
		return String(value);
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
