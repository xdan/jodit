/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IStyle } from 'jodit/types';
import { attr } from 'jodit/core/helpers/utils';
import { size } from 'jodit/core/helpers/size/object-size';
import { assert } from 'jodit/core/helpers/utils/assert';
import { hasSameStyle } from './has-same-style';

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

	return Object.keys(attrs).every(key => {
		if (key === 'class') {
			return elm.classList.contains(attrs[key]);
		}

		if (key === 'style') {
			return hasSameStyle(elm, attrs[key] as IStyle);
		}

		return attr(elm, key) === attrs[key];
	});
}

export function elementsEqualAttributes(
	elm1: HTMLElement,
	elm2: HTMLElement
): boolean {
	return (
		elm1.attributes.length === elm2.attributes.length &&
		Array.from(elm1.attributes).every(
			attr =>
				elm2.hasAttribute(attr.name) &&
				elm2.getAttribute(attr.name) === attr.value
		)
	);
}
