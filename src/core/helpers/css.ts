/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IStyle, StyleValue } from '../../types';
import { isPlainObject, isNumeric, isVoid } from './checker/';
import { normalizeCssValue } from './normalize/';
import { camelCase, kebabCase } from './string/';

/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or
 * more CSS properties for every matched element
 *
 * @param element
 * @param key An object of property-value pairs to set. A CSS property name.
 * @param value A value to set for the property.
 * @param [onlyStyleMode] Get value from style attribute, without calculating
 */
export const css = (
	element: HTMLElement,
	key: string | IStyle,
	value?: StyleValue,
	onlyStyleMode: boolean = false
): string | number => {
	const numberFieldsReg =
		/^left|top|bottom|right|width|min|max|height|margin|padding|fontsize|font-size/i;

	if (isPlainObject(key) || value !== undefined) {
		const setValue = (
			elm: HTMLElement,
			_key: string,
			_value: StyleValue
		) => {
			if (
				!isVoid(_value) &&
				numberFieldsReg.test(_key) &&
				isNumeric(_value.toString())
			) {
				_value = parseInt(_value.toString(), 10) + 'px';
			}

			if (
				_value !== undefined &&
				(_value == null ||
					css(elm, _key, undefined, true) !==
						normalizeCssValue(_key, _value))
			) {
				(elm.style as any)[_key] = _value;
			}
		};

		if (isPlainObject(key)) {
			const keys: string[] = Object.keys(key);

			for (let j = 0; j < keys.length; j += 1) {
				setValue(element, camelCase(keys[j]), (key as any)[keys[j]]);
			}
		} else {
			setValue(element, camelCase(key as string), value);
		}

		return '';
	}

	const key2: string = kebabCase(key as string) as string,
		doc: Document = element.ownerDocument || document,
		win = doc ? doc.defaultView || (doc as any).parentWindow : false;

	const currentValue: string | undefined = (element.style as any)[
		key as string
	];

	let result: string | number = '';

	if (currentValue !== undefined && currentValue !== '') {
		result = currentValue;
	} else if (win && !onlyStyleMode) {
		result = win.getComputedStyle(element).getPropertyValue(key2);
	}

	if (
		numberFieldsReg.test(key as string) &&
		/^[-+]?[0-9.]+px$/.test(result.toString())
	) {
		result = parseInt(result.toString(), 10);
	}

	return normalizeCssValue(key as string, result);
};

/**
 * Clear center align
 * @param image
 */
export const clearCenterAlign = (image: HTMLElement): void => {
	if (css(image, 'display') === 'block') {
		css(image, 'display', '');
	}

	const { style } = image;

	if (style.marginLeft === 'auto' && style.marginRight === 'auto') {
		style.marginLeft = '';
		style.marginRight = '';
	}
};
