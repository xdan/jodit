/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { stringify } from 'jodit/core/helpers/string/stringify';

/**
 * Check two element are equal
 */
export function isEqual(a: unknown, b: unknown): boolean {
	return a === b || stringify(a) === stringify(b);
}

export function isFastEqual(a: unknown, b: unknown): boolean {
	return a === b;
}
