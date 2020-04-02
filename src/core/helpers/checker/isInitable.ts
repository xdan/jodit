/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDestructible, IInitable } from '../../../types';
import { isFunction } from './isFunction';

/**
 * Check value has method init
 *
 * @param value
 */
export const isInitable = (value: unknown): value is IInitable => {
	return  value && isFunction((value as IInitable).init);
};


/**
 * Check value has method destruct
 *
 * @param value
 */
export const isDestructable = (value: unknown): value is IDestructible => {
	return  value && isFunction((value as IDestructible).destruct);
};
