/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

/**
 * Check value is undefined or null
 */
export function isVoid(value: unknown): value is undefined | null {
	// eslint-disable-next-line eqeqeq
	return value === undefined || value === null;
}
