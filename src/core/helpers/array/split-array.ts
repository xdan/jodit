/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isString } from '../checker/is-string';

/**
 * Split separated elements
 * @param a
 */
export function splitArray(a: string): string[];

export function splitArray<T extends any[]>(a: T): T;

export function splitArray<T extends any[]>(a: T | string): T | string[];

export function splitArray<T extends any[]>(a: T | string): T | string[] {
	return isString(a) ? a.split(/[,\s]+/) : a;
}
