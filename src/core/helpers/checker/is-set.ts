/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { isFunction } from './is-function';

/**
 * Check if element is set
 */
export function isSet<T = any>(elm: unknown): elm is Set<T> {
	return (
		Boolean(elm) &&
		isFunction((elm as Set<unknown>).has) &&
		isFunction((elm as Set<unknown>).add) &&
		isFunction((elm as Set<unknown>).delete)
	);
}
