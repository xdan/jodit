/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { IDictionary } from 'jodit/types';
import { isWindow } from './is-window';

/**
 * Check if element is simple plaint object
 */
export function isPlainObject<T>(
	obj: any | IDictionary<T>
): obj is IDictionary<T> {
	if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
		return false;
	}

	return !(
		obj.constructor &&
		!{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
	);
}
