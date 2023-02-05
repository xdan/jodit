/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { isArray } from 'jodit/core/helpers/checker/is-array';

/**
 * Check value is String
 */
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/**
 * Check value is Array of String
 */
export function isStringArray(value: unknown): value is string[] {
	return isArray(value) && isString(value[0]);
}
