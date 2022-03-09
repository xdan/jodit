/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import { findSomePartOfString } from './find-some-part-of-string';

export function getSomePartOfStringIndex(
	needle: string,
	haystack: string,
	start: boolean = true
): number | false {
	return findSomePartOfString(needle, haystack, start, true) as
		| number
		| false;
}
