/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './color-picker.less';

import type { IDictionary, IJodit } from '../../../types';
import {
	normalizeColor,
	hasBrowserColorPicker,
	isPlainObject,
	attr,
	isFunction,
	isArray,
	refs
} from '../../../core/helpers/';
import { Icon } from '../../../core/ui';
import { Dom } from '../../../core/dom';

/**
 * Build color picker
 *
 * @param {Jodit} editor
 * @param {function} callback Callback 'function (color) {}'
 * @param {string} [coldColor] Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
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
	const valueHex = normalizeColor(coldColor),
		form = editor.c.div('jodit-color-picker'),
		iconPalette: string = editor.o.textIcons
			? `<span>${editor.i18n('palette')}</span>`
			: Icon.get('palette'),
		eachColor = (colors: string[] | IDictionary<string[]>) => {
			const stack: string[] = [];

			if (isPlainObject(colors)) {
				Object.keys(colors).forEach(key => {
					stack.push(
						'<div class="jodit-color-picker__group jodit-color-picker__group-' +
							key +
							'">'
					);
					stack.push(eachColor((colors as any)[key]));
					stack.push('</div>');
				});
			} else if (isArray(colors)) {
				colors.forEach(color => {
					stack.push(
						'<a ' +
							(valueHex === color
								? ' class="jodit_active" '
								: '') +
							' title="' +
							color +
							'" style="background-color:' +
							color +
							'" data-color="' +
							color +
							'" href="javascript:void(0)"></a>'
					);
				});
			}
			return stack.join('');
		};

	form.appendChild(
		editor.c.fromHTML(
			'<div class="jodit-color-picker__groups">' +
				eachColor(editor.o.colors) +
				'</div>'
		)
	);

	form.appendChild(
		editor.c.fromHTML(
			'<div data-ref="extra" class="jodit-color-picker__extra"></div>'
		)
	);

	const { extra } = refs(form);

	if (editor.o.showBrowserColorPicker && hasBrowserColorPicker()) {
		extra.appendChild(
			editor.c.fromHTML(
				'<div class="jodit-color-picker__native">' +
					iconPalette +
					'<input type="color" value="#ffffff"/>' +
					'</div>'
			)
		);

		editor.e.on(form, 'change', (e: MouseEvent) => {
			e.stopPropagation();

			const target: HTMLInputElement = e.target as HTMLInputElement;

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
				'a',
				editor.editor
			) as HTMLElement;
		}

		if (!Dom.isTag(target, 'a')) {
			return;
		}

		const color: string = attr(target, '-color') || '';

		if (callback && typeof callback === 'function') {
			callback(color);
		}

		e.preventDefault();
	});

	editor.e.fire('afterGenerateColorPicker', form, extra, callback, valueHex);

	return form;
};
