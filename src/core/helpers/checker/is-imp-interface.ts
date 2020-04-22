/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IContainer, IDestructible, IInitable } from '../../../types';
import { isFunction } from './is-function';
import { Dom } from '../../dom';

/**
 * Check value has method init
 *
 * @param value
 */
export function isInitable(value: unknown): value is IInitable {
	return value && isFunction((value as IInitable).init);
}

/**
 * Check value has method destruct
 *
 * @param value
 */
export function isDestructable(value: unknown): value is IDestructible {
	return value && isFunction((value as IDestructible).destruct);
}

/**
 * Check value is instant that implements IContainer
 * @param value
 */
export function hasContainer(value: unknown): value is IContainer {
	return value && Dom.isElement((value as IContainer).container);
}
