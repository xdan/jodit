/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IStyle } from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';
import { isVoid } from 'jodit/core/helpers/checker/is-void';
import { normalizeCssValue } from 'jodit/core/helpers/normalize/normalize-css-value';
import { Dom } from 'jodit/core/dom/dom';
import { assert } from 'jodit/core/helpers/utils/assert';

/**
 * Element has the same styles as in the commit
 * @private
 */
export function hasSameStyle(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(property => {
				const value = css(elm, property, true);

				if (
					value === '' &&
					(rules[property] === '' || rules[property] == null)
				) {
					return true;
				}

				return (
					!isVoid(value) &&
					value !== '' &&
					!isVoid(rules[property]) &&
					normalizeCssValue(property, rules[property] as string)
						.toString()
						.toLowerCase() === value.toString().toLowerCase()
				);
			})
	);
}

const elm = document.createElement('div');
elm.style.color = 'red';
assert(hasSameStyle(elm, { color: 'red' }), 'Style test');
assert(hasSameStyle(elm, { fontSize: null }), 'Style test');
assert(hasSameStyle(elm, { fontSize: '' }), 'Style test');

/**
 * Element has the similar styles
 */
export function hasSameStyleKeys(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(property => {
				const value = css(elm, property, true);

				return !isVoid(value);
			})
	);
}

assert(hasSameStyleKeys(elm, { color: 'red' }), 'Style test');
assert(hasSameStyleKeys(elm, { font: 'Arial', color: 'red' }), 'Style test');
