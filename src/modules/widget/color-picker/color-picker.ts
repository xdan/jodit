import './color-picker.less';

import { IDictionary, IJodit, IRGB } from '../../../types';
import {
	normalizeColor,
	hasBrowserColorPicker,
	isPlainObject,
	hexToRgb,
	attr,
	isFunction
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
		form: HTMLDivElement = editor.c.div('jodit-color-picker'),
		iconEye: string = editor.o.textIcons ? '' : Icon.get('eye'),
		iconPalette: string = editor.o.textIcons
			? `<span>${editor.i18n('palette')}</span>`
			: Icon.get('palette'),
		setColor = (target: HTMLElement, color: string) => {
			target.innerHTML = Icon.get('eye');
			target.classList.add('active');

			const colorRGB: IRGB | null = hexToRgb(color);
			if (colorRGB) {
				(target.firstChild as HTMLElement).style.fill =
					'rgb(' +
					(255 - colorRGB.r) +
					',' +
					(255 - colorRGB.g) +
					',' +
					(255 - colorRGB.b) +
					')';
			}
		},
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
			} else if (Array.isArray(colors)) {
				colors.forEach(color => {
					stack.push(
						'<a ' +
							(valueHex === color ? ' class="active" ' : '') +
							' title="' +
							color +
							'" style="background-color:' +
							color +
							'" data-color="' +
							color +
							'" href="javascript:void(0)">' +
							(valueHex === color ? iconEye : '') +
							'</a>'
					);
				});
			}
			return stack.join('');
		};

	form.appendChild(
		editor.c.fromHTML('<div>' + eachColor(editor.o.colors) + '</div>')
	);

	if (editor.o.showBrowserColorPicker && hasBrowserColorPicker()) {
		form.appendChild(
			editor.c.fromHTML(
				'<span class="jodit-color-picker__native">' +
					iconPalette +
					'<input type="color" value=""/>' +
					'</span>'
			)
		);

		editor.e.on(form, 'change', (e: MouseEvent) => {
			e.stopPropagation();

			let target: HTMLInputElement = e.target as HTMLInputElement;

			if (!target || !target.tagName || !Dom.isTag(target, 'input')) {
				return;
			}

			const color: string = target.value || '';

			if (color) {
				setColor(target, color);
			}

			if (isFunction(callback)) {
				callback(color);
			}

			e.preventDefault();
		});
	}

	editor.e.on(form, 'mousedown touchend', (e: MouseEvent) => {
		e.stopPropagation();

		let target: HTMLElement = e.target as HTMLElement;

		if (
			(!target ||
				!target.tagName ||
				Dom.isTag(target, 'svg') ||
				Dom.isTag(target, 'path')) &&
			target.parentNode
		) {
			target = Dom.closest(
				target.parentNode,
				'A',
				editor.editor
			) as HTMLElement;
		}

		if (!Dom.isTag(target, 'a')) {
			return;
		}

		const active: HTMLElement | null = form.querySelector('a.active');
		if (active) {
			active.classList.remove('active');
			active.innerHTML = '';
		}

		const color: string = attr(target, '-color') || '';

		if (color) {
			setColor(target, color);
		}

		if (callback && typeof callback === 'function') {
			callback(color);
		}

		e.preventDefault();
	});

	return form;
};
