/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check if element is array
 * @param elm
 */
import { JoditArray } from '../jodit-array';

export function isArray<T = any>(elm: unknown): elm is T[] {
	return Array.isArray(elm) || elm instanceof JoditArray;
}
