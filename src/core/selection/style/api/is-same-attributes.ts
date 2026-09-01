/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IStyle } from 'jodit/types';
import { size } from 'jodit/core/helpers/size/object-size';
import { attr } from 'jodit/core/helpers/utils';
import { assert } from 'jodit/core/helpers/utils/assert';
import { attrRaw } from 'jodit/core/helpers/utils/attr';

import { hasSameStyle } from './has-same-style';

/**
 * Checks that every attribute from `attrs` is present on the element with
 * the same value (one-directional match: extra own attributes of the element
 * are ignored, empty `attrs` matches any element)
 * @private
 */
export function isSameAttributes(
	elm: HTMLElement,
	attrs?: IDictionary
): boolean {
	if (!size(attrs)) {
		return true;
	}

	assert(attrs, 'Attrs must be a non-empty object');

	return Object.keys(attrs).every(key => {
		if (key === 'class' || key === 'className') {
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
			// `attrRaw` on purpose: the comparison must use the exact
			// attribute name from the live list, without `attr()` name mangling
			attr => attrRaw(elm2, attr.name) === attr.value
		)
	);
}
