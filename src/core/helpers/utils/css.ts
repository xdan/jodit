/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IStyle, StyleValue } from 'jodit/types';
import { isPlainObject } from '../checker/is-plain-object';
import { isBoolean } from '../checker/is-boolean';
import {
	normalizeCssValue,
	normalizeCssNumericValue,
	NUMBER_FIELDS_REG
} from '../normalize/normalize-css-value';
import { camelCase } from '../string/camel-case';
import { kebabCase } from '../string/kebab-case';

export function css(
	element: HTMLElement,
	key: keyof CSSStyleDeclaration
): string | number;

export function css(
	element: HTMLElement,
	key: string | IStyle
): string | number;

export function css(
	element: HTMLElement,
	key: string | IStyle,
	value: StyleValue
): string | number;

export function css(
	element: HTMLElement,
	key: string | IStyle,
	onlyStyleMode: boolean
): string | number;

/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or
 * more CSS properties for every matched element
 *
 * @param key - An object of property-value pairs to set. A CSS property name.
 * @param value - A value to set for the property.
 * @param onlyStyleMode - Get value from style attribute, without calculating
 */
export function css(
	element: HTMLElement,
	key: keyof CSSStyleDeclaration | string | IStyle,
	value?: StyleValue | boolean,
	onlyStyleMode: boolean = false
): string | number {
	if (isBoolean(value)) {
		onlyStyleMode = value;
		value = undefined;
	}

	if (isPlainObject(key) || value !== undefined) {
		const setValue = (
			elm: HTMLElement,
			_key: string,
			_value: StyleValue
		): void => {
			_value = normalizeCssNumericValue(_key, _value);

			if (
				_value !== undefined &&
				(_value == null ||
					css(elm, _key, true) !== normalizeCssValue(_key, _value))
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
		NUMBER_FIELDS_REG.test(key as string) &&
		/^[-+]?[0-9.]+px$/.test(result.toString())
	) {
		result = parseInt(result.toString(), 10);
	}

	return normalizeCssValue(key as string, result);
}

/**
 * Clear center align
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
