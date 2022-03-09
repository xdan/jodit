/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import { trim } from 'jodit/core/helpers/string/trim';
import * as consts from 'jodit/core/constants';

export function findSomePartOfString(
	needle: string,
	haystack: string,
	start: boolean = true,
	getIndex: boolean = false
): boolean | string | number {
	needle = trim(needle.toLowerCase().replace(consts.SPACE_REG_EXP(), ' '));
	haystack = haystack.toLowerCase();

	let i: number = start ? 0 : haystack.length - 1,
		needleStart: number = start ? 0 : needle.length - 1,
		tmpEqualLength: number = 0,
		startAtIndex: number | null = null;

	const inc = start ? 1 : -1,
		tmp: string[] = [];

	for (; haystack[i] !== undefined; i += inc) {
		const some: boolean = needle[needleStart] === haystack[i];
		if (
			some ||
			(startAtIndex != null && consts.SPACE_REG_EXP().test(haystack[i]))
		) {
			if (startAtIndex == null || !start) {
				startAtIndex = i;
			}

			tmp.push(haystack[i]);

			if (some) {
				tmpEqualLength += 1;
				needleStart += inc;
			}
		} else {
			startAtIndex = null;
			tmp.length = 0;
			tmpEqualLength = 0;
			needleStart = start ? 0 : needle.length - 1;
		}

		if (tmpEqualLength === needle.length) {
			return getIndex ? (startAtIndex as number) : true;
		}
	}

	if (getIndex) {
		return startAtIndex ?? false;
	}

	if (tmp.length) {
		return start ? tmp.join('') : tmp.reverse().join('');
	}

	return false;
}
