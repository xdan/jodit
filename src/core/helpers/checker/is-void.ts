/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check value is undefined or null
 * @param value
 */
export function isVoid(value: unknown): value is undefined | null {
	// eslint-disable-next-line eqeqeq
	return value === undefined || value === null;
}
