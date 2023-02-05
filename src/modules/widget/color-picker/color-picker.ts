/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/widget/color-picker/README.md]]
 * @packageDocumentation
 * @module modules/widget/color-picker
 */

import './color-picker.less';

import type { IDictionary, IJodit } from 'jodit/types';
import {
	normalizeColor,
	hasBrowserColorPicker,
	isPlainObject,
	attr,
	isFunction,
	isArray,
	refs
} from 'jodit/core/helpers/';
import { Icon } from 'jodit/core/ui';
import { Dom } from 'jodit/core/dom';

Icon.set('palette', require('./palette.svg'));

/**
 * Build color picker
 *
 * @param callback - Callback 'function (color) \{\}'
 * @param coldColor - Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
 * @example
 * ```javascript
 * $tabs = TabsWidget(editor, {
 *    'Text' : ColorPickerWidget(editor, function (color) {
 *         box.style.color = color;
 *     }, box.style.color),
 *     'Background' : ColorPickerWidget(editor, function (color) {
 *         box.style.backgroundColor = color;
 *     }, box.style.backgroundColor),
 * });
 * ```
 */
export const ColorPickerWidget = (
	editor: IJodit,
	callback: (newColor: string) => void,
	coldColor: string
): HTMLDivElement => {
	const cn = 'jodit-color-picker',
		valueHex = normalizeColor(coldColor),
		form = editor.c.div(cn),
		iconPalette: string = editor.o.textIcons
			? `<span>${editor.i18n('palette')}</span>`
			: Icon.get('palette'),
		eachColor = (colors: string[] | IDictionary<string[]>): string => {
			const stack: string[] = [];

			if (isPlainObject(colors)) {
				Object.keys(colors).forEach(key => {
					stack.push(
						`<div class="${cn}__group ${cn}__group-${key}">`
					);
					stack.push(eachColor((colors as any)[key]));
					stack.push('</div>');
				});
			} else if (isArray(colors)) {
				colors.forEach(color => {
					stack.push(
						`<span class='${cn}__color-item ${
							valueHex === color
								? cn + '__color-item_active_true'
								: ''
						}' title="${color}" style="background-color:${color}" data-color="${color}"></span>`
					);
				});
			}

			return stack.join('');
		};

	form.appendChild(
		editor.c.fromHTML(
			`<div class="${cn}__groups">${eachColor(editor.o.colors)}</div>`
		)
	);

	form.appendChild(
		editor.c.fromHTML(`<div data-ref="extra" class="${cn}__extra"></div>`)
	);

	const { extra } = refs(form);

	if (editor.o.showBrowserColorPicker && hasBrowserColorPicker()) {
		extra.appendChild(
			editor.c.fromHTML(
				`<div class="${cn}__native">${iconPalette}<input type="color" value="#ffffff"/></div>`
			)
		);

		editor.e.on(form, 'change', (e: MouseEvent) => {
			e.stopPropagation();

			const target = e.target as HTMLInputElement;

			if (!target || !target.tagName || !Dom.isTag(target, 'input')) {
				return;
			}

			const color: string = target.value || '';

			if (isFunction(callback)) {
				callback(color);
			}

			e.preventDefault();
		});
	}

	editor.e.on(form, 'mousedown touchend', (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		let target = e.target as HTMLElement;

		if (
			(!target ||
				!target.tagName ||
				Dom.isTag(target, 'svg') ||
				Dom.isTag(target, 'path')) &&
			target.parentNode
		) {
			target = Dom.closest(
				target.parentNode,
				'span',
				editor.editor
			) as HTMLElement;
		}

		if (
			!Dom.isTag(target, 'span') ||
			!target.classList.contains(cn + '__color-item')
		) {
			return;
		}

		const color: string = attr(target, '-color') || '';

		if (callback && isFunction(callback)) {
			callback(color);
		}
	});

	editor.e.fire('afterGenerateColorPicker', form, extra, callback, valueHex);

	return form;
};
