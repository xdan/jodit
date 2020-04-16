/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check value is Function
 *
 * @param value
 */
export const isFunction = (value: unknown): value is Function => {
	return  typeof value === 'function';
};
