/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IContainer, IDestructible, IInitable } from '../../../types';
import { isFunction } from './is-function';
import { Dom } from '../../dom';
import { isVoid } from './is-void';

/**
 * Check value has method init
 * @param value
 */
export function isInitable(value: unknown): value is IInitable {
	return !isVoid(value) && isFunction((value as IInitable).init);
}

/**
 * Check value has method destruct
 *
 * @param value
 */
export function isDestructable(value: unknown): value is IDestructible {
	return !isVoid(value) && isFunction((value as IDestructible).destruct);
}

/**
 * Check value is instant that implements IContainer
 * @param value
 */
export function hasContainer(value: unknown): value is IContainer {
	return !isVoid(value) && Dom.isElement((value as IContainer).container);
}
