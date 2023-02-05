/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/array
 */

import { isArray } from '../checker/is-array';

/**
 * Always return Array
 */
export const asArray = <T>(a: T[] | T): T[] => (isArray(a) ? a : [a]);
