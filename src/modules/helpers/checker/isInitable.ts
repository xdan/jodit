/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
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
