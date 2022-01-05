/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

/**
 * Check if element is array
 */
export function isArray<T = any>(elm: unknown): elm is T[] {
	return Array.isArray(elm);
}
