/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from 'jodit/types';
import { attr } from 'jodit/core/helpers/utils';
import { size } from 'jodit/core/helpers/size/object-size';
import { assert } from 'jodit/core/helpers/utils/assert';

/**
 * Compares whether the given attributes match the element's own attributes
 * @private
 */
export function isSameAttributes(
	elm: HTMLElement,
	attrs?: IDictionary
): elm is HTMLElement {
	if (!elm.attributes.length && !size(attrs)) {
		return true;
	}

	if (!size(attrs)) {
		return true;
	}

	assert(attrs, 'Attrs must be a non-empty object');

	return Object.keys(attrs).every(key => attr(elm, key) === attrs[key]);
}
