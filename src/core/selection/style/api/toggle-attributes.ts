/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitMode, IJodit, IStyle, ICommitStyle } from 'jodit/types';
import { assert, attr } from 'jodit/core/helpers/utils';
import { css } from 'jodit/core/helpers/utils/css';
import { dataBind } from 'jodit/core/helpers/utils/data-bind';
import { kebabCase } from 'jodit/core/helpers/string/kebab-case';
import { normalizeCssValue } from 'jodit/core/helpers/normalize/normalize-css-value';
import { size } from 'jodit/core/helpers/size/object-size';
import { Dom } from 'jodit/core/dom/dom';
import {
	_PREFIX,
	CHANGE,
	UNSET,
	UNWRAP
} from 'jodit/core/selection/style/commit-style';
import { getContainer } from 'jodit/core/global';
import {
	isBoolean,
	isNumber,
	isPlainObject,
	isString
} from 'jodit/core/helpers/checker';

const tak = 'toggleAttributes';

/**
 * Toggles attributes
 * @private
 */
export function toggleAttributes(
	commitStyle: ICommitStyle,
	elm: HTMLElement,
	jodit: IJodit,
	mode: CommitMode,
	dry: boolean = false
): CommitMode {
	if (!dry && commitStyle.isApplied(elm, tak)) {
		return mode;
	}

	!dry && commitStyle.setApplied(elm, tak);

	const { attributes } = commitStyle.options;

	if (attributes && size(attributes) > 0) {
		Object.keys(attributes).forEach((key: string) => {
			const value = attributes![key as keyof typeof attributes];

			switch (key) {
				case 'style': {
					mode = toggleStyle(
						commitStyle,
						jodit,
						value,
						elm,
						dry,
						mode
					);

					break;
				}

				case 'class':
					mode = toggleClass(jodit, value, elm, mode, dry);
					break;

				default:
					mode = toggleAttribute(jodit, value, elm, key, dry, mode);
			}
		});
	}

	return mode;
}

function toggleStyle(
	commitStyle: ICommitStyle,
	jodit: IJodit,
	style: IStyle | string | number | boolean | null,
	elm: HTMLElement,
	dry: boolean,
	mode: CommitMode
): CommitMode {
	assert(isPlainObject(style) && size(style), 'Style must be an object');

	Object.keys(style).forEach((rule: string) => {
		const inlineValue = elm.style.getPropertyValue(kebabCase(rule));
		const newValue = style[rule];

		if (inlineValue === '' && newValue == null) {
			return;
		}

		if (
			getNativeCSSValue(jodit, elm, rule) ===
			normalizeCssValue(rule, newValue as string)
		) {
			if (!inlineValue) {
				return;
			}

			!dry && css(elm, rule, null);
			mode = UNSET;
			mode = removeExtraStyleAttribute(commitStyle, elm, mode);
			return;
		}

		mode = CHANGE;

		if (!dry) {
			css(elm, rule, newValue);
			mode = removeExtraStyleAttribute(commitStyle, elm, mode);
		}
	});

	return mode;
}

function toggleClass(
	jodit: IJodit,
	value: string | unknown,
	elm: HTMLElement,
	mode: CommitMode,
	dry: boolean
): CommitMode {
	assert(isString(value), 'Class name must be a string');

	const hook = jodit.e.fire.bind(jodit.e, `${_PREFIX}AfterToggleAttribute`);

	if (elm.classList.contains(value.toString())) {
		mode = UNSET;
		if (!dry) {
			elm.classList.remove(value);
			if (elm.classList.length === 0) {
				attr(elm, 'class', null);
				hook(mode, elm, 'class', null);
			}
		}
	} else {
		mode = CHANGE;
		if (!dry) {
			elm.classList.add(value);
			hook(mode, elm, 'class', value);
		}
	}

	return mode;
}

function toggleAttribute(
	jodit: IJodit,
	value: string | number | null | boolean | unknown,
	elm: HTMLElement,
	key: string,
	dry: boolean,
	mode: CommitMode
): CommitMode {
	assert(
		isString(value) || isNumber(value) || isBoolean(value) || value == null,
		'Attribute value must be a string or number or boolean or null'
	);

	const hook = jodit.e.fire.bind(jodit.e, `${_PREFIX}AfterToggleAttribute`);

	if (attr(elm, key) === value) {
		!dry && attr(elm, key, null);
		mode = UNSET;
		!dry && hook(mode, elm, key, value);
		return mode;
	}

	mode = CHANGE;
	if (!dry) {
		attr(elm, key, value);
		hook(mode, elm, key, value);
	}

	return mode;
}

/**
 * If the element has an empty style attribute, it removes the attribute,
 * and if it is default, it removes the element itself
 */
function removeExtraStyleAttribute(
	commitStyle: ICommitStyle,
	elm: HTMLElement,
	mode: CommitMode
): CommitMode {
	if (!attr(elm, 'style')) {
		attr(elm, 'style', null);

		if (elm.tagName.toLowerCase() === commitStyle.defaultTag) {
			Dom.unwrap(elm);
			mode = UNWRAP;
		}
	}

	return mode;
}

/**
 * Creates an iframe into which elements will be inserted to test their default styles in the browser
 */
function getShadowRoot(jodit: IJodit): HTMLElement {
	if (dataBind(jodit, 'shadowRoot') !== undefined) {
		return dataBind(jodit, 'shadowRoot');
	}

	const container = getContainer(jodit);

	const iframe = document.createElement('iframe');
	css(iframe, {
		width: 0,
		height: 0,
		position: 'absolute',
		border: 0
	});

	iframe.src = 'about:blank';
	container.appendChild(iframe);

	const doc = iframe.contentWindow?.document;

	const shadowRoot = !doc ? jodit.od.body : doc.body;
	dataBind(jodit, 'shadowRoot', shadowRoot);

	return shadowRoot;
}

/**
 * `strong -> fontWeight 700`
 */
function getNativeCSSValue(
	jodit: IJodit,
	elm: HTMLElement,
	key: string
): ReturnType<typeof css> {
	const newElm = jodit.create.element(elm.tagName.toLowerCase());
	newElm.style.cssText = elm.style.cssText;
	const root = getShadowRoot(jodit);
	root.appendChild(newElm);
	const result = css(newElm, key);
	Dom.safeRemove(newElm);
	return result;
}
