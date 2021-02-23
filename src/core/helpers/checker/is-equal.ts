/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { stringify } from '../string/stringify';

/**
 * Check two element are equal
 *
 * @param a
 * @param b
 */
export function isEqual(a: unknown, b: unknown): boolean {
	return a === b || stringify(a) === stringify(b);
}

export function isFastEqual(a: unknown, b: unknown): boolean {
	return a === b;
}
