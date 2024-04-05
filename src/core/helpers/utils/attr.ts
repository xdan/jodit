/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IDictionary } from 'jodit/types';
import {
	isFunction,
	isPlainObject,
	isString
} from 'jodit/core/helpers/checker';
import { CamelCaseToKebabCase } from 'jodit/core/helpers/string/kebab-case';

import { css } from './css';

/**
 * Get attribute
 */
export function attr(elm: Element, key: string): null | string;

/**
 * Remove attribute
 */
export function attr(elm: Element, key: string, value: null): void;

/**
 * Set attribute
 */
export function attr(
	elm: Element,
	key: string,
	value: string | number | boolean | undefined | null
): null;

/**
 * Set or remove several attributes
 */
export function attr(
	elm: Element,
	attributes: IDictionary<string | number | boolean | null>
): null;

/**
 * Alias for `elm.getAttribute` but if set second argument `-{key}`
 * it will also check `data-{key}` attribute
 * if set `value` it is alias for setAttribute with the same logic
 */
export function attr(
	elm: Element,
	keyOrAttributes: string | IDictionary<string | number | boolean | null>,
	value?: string | number | boolean | null
): null | string {
	if (!elm || !isFunction(elm.getAttribute)) {
		return null;
	}

	if (!isString(keyOrAttributes)) {
		Object.keys(keyOrAttributes).forEach(key => {
			const value = keyOrAttributes[key];

			if (isPlainObject(value) && key === 'style') {
				css(<HTMLElement>elm, value as IDictionary<string>);
			} else {
				if (key === 'className') {
					key = 'class';
				}

				attr(elm, key, value);
			}
		});

		return null;
	}

	let key = CamelCaseToKebabCase(keyOrAttributes);

	if (/^-/.test(key)) {
		const res = attr(elm, `data${key}`);

		if (res) {
			return res;
		}

		key = key.substr(1);
	}

	if (value !== undefined) {
		if (value == null) {
			elm.hasAttribute(key) && elm.removeAttribute(key);
		} else {
			let replaceValue = value.toString();
			if (
				elm.nodeName === 'IMG' &&
				(key === 'width' || key === 'height')
			) {
				replaceValue = replaceValue.replace('px', '');
			}
			elm.setAttribute(key, replaceValue);
			return replaceValue;
		}
	}

	return elm.getAttribute(key);
}
