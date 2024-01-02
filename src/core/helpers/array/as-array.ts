/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/array
 */

import { isArray } from 'jodit/core/helpers/checker/is-array';

/**
 * Always return Array
 * ```javascript
 * Jodit.modules.Helpers.asArray('test') // ['test']
 * Jodit.modules.Helpers.asArray(['test']) // ['test']
 * Jodit.modules.Helpers.asArray(1) // [1]
 * ```
 */
export const asArray = <T>(a: T[] | T): T[] => (isArray(a) ? a : [a]);
