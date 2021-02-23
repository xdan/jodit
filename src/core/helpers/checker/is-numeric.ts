/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isString } from './is-string';

/**
 * Check value has numeric format
 *
 * @param value
 */
export function isNumeric(value: number | string): boolean {
	if (isString(value)) {
		if (!value.match(/^([+-])?[0-9]+(\.?)([0-9]+)?(e[0-9]+)?$/)) {
			return false;
		}

		value = parseFloat(value);
	}

	return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
