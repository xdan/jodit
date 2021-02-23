/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from '../../../types';
import { isWindow } from './is-window';
import { hasOwn } from '../type';

/**
 * Check if element is simple plaint object
 * @param obj
 */
export function isPlainObject<T>(
	obj: any | IDictionary<T>
): obj is IDictionary<T> {
	if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
		return false;
	}

	return !(
		obj.constructor &&
		!hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
	);
}
