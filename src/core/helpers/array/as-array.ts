/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Always return Array
 *
 * @param a
 * @return {Array}
 */
import { isArray } from '../checker/is-array';

export const asArray = <T>(a: T[] | T): T[] => (isArray(a) ? a : [a]);
