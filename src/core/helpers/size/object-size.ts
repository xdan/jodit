/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isArray, isPlainObject, isString } from '../checker';
import type { CanUndef } from '../../../types';

export function size(
	subject: CanUndef<object | string | Array<unknown>>
): number {
	if (isString(subject) || isArray(subject)) {
		return subject.length;
	}

	if (isPlainObject(subject)) {
		return Object.keys(subject).length;
	}

	return 0;
}
