/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/widget/color-picker/README.md]]
 * @packageDocumentation
 * @module modules/widget/color-picker
 */

import type { IDictionary, IJodit } from 'jodit/types';
import { KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import {
	attr,
	hasBrowserColorPicker,
	isArray,
	isFunction,
	isPlainObject,
	normalizeColor,
	refs,
	toArray
} from 'jodit/core/helpers/';
import { Icon } from 'jodit/core/ui';

import paletteIcon from './palette.svg';

import './color-picker.less';

Icon.set('palette', paletteIcon);

/**
 * Build color picker
 *
 * @param callback - Callback 'function (color) \{\}'. The remove button calls it with an empty string
 * @param coldColor - Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
 * @example
 * ```javascript
 * const tabs = TabsWidget(editor, {
 *    'Text': ColorPickerWidget(editor, function (color) {
 *         box.style.color = color;
 *     }, box.style.color),
 *     'Background': ColorPickerWidget(editor, function (color) {
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
					const active = valueHex === color;

					stack.push(
						`<button type="button" class='${cn}__color-item ${
							active ? cn + '__color-item_active_true' : ''
						}' title="${color}" aria-pressed="${active}" tabindex="-1" style="background-color:${color}" data-color="${color}"></button>`
					);
				});
			}

			return stack.join('');
		};

	// The group wrapper lays the colors out in rows, so a flat list needs one
	// too. See #1487
	const groups = isArray(editor.o.colors)
		? `<div class="${cn}__group">${eachColor(editor.o.colors)}</div>`
		: eachColor(editor.o.colors);

	Dom.append(
		form,
		editor.c.fromHTML(`<div class="${cn}__groups">${groups}</div>`)
	);

	const items = toArray(
		form.querySelectorAll<HTMLElement>(`.${cn}__color-item`)
	);

	// Tab stops at one color, the current one or the first, and the arrow
	// keys move from it
	const tabStop =
		items.find(item => attr(item, 'aria-pressed') === 'true') ?? items[0];

	if (tabStop) {
		attr(tabStop, 'tabindex', 0);
	}

	// Along a row, or to the nearest color in the row above or below, as the
	// palette is laid out
	const nextItem = (
		item: HTMLElement,
		key: string
	): HTMLElement | undefined => {
		const index = items.indexOf(item);

		if (key === KEY_LEFT || key === KEY_RIGHT) {
			return items[key === KEY_LEFT ? index - 1 : index + 1];
		}

		const down = key === KEY_DOWN,
			rows = items.filter(other =>
				down
					? other.offsetTop > item.offsetTop
					: other.offsetTop < item.offsetTop
			);

		if (!rows.length) {
			return;
		}

		const top = (down ? Math.min : Math.max)(
				...rows.map(other => other.offsetTop)
			),
			distance = (other: HTMLElement): number =>
				Math.abs(other.offsetLeft - item.offsetLeft);

		return rows
			.filter(other => other.offsetTop === top)
			.reduce((nearest, other) =>
				distance(other) < distance(nearest) ? other : nearest
			);
	};

	Dom.append(
		form,
		editor.c.fromHTML(`<div data-ref="extra" class="${cn}__extra"></div>`)
	);

	const { extra } = refs(form);

	Dom.append(
		extra,
		editor.c.fromHTML(
			`<div class="${cn}__hex"><input data-ref="hexInput" type="text" spellcheck="false" aria-label="HEX" placeholder="#FF0000" value="${
				valueHex || ''
			}"/></div>`
		)
	);

	const { hexInput } = refs<HTMLInputElement>(form);

	// Enter applies the value and closes the popup; removing the focused
	// input then makes Chrome fire `change` on it, which would apply the
	// same color a second time and toggle it off again. See #1459
	let appliedHexValue: string | null = null;

	const applyHexInput = (): void => {
		const raw = hexInput.value.trim();

		if (raw === appliedHexValue) {
			return;
		}

		const isHex = /^#?[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(raw);
		const isRgb = /^rgba?\([\d\s.,%]+\)$/i.test(raw);

		if (!isHex && !isRgb) {
			return;
		}

		const color = normalizeColor(
			isHex && !raw.startsWith('#') ? '#' + raw : raw
		);

		if (color && isFunction(callback)) {
			appliedHexValue = raw;
			callback(color);
		}
	};

	editor.e
		.on(hexInput, 'keydown', (e: KeyboardEvent) => {
			e.stopPropagation();

			if (e.key === 'Enter') {
				e.preventDefault();
				applyHexInput();
			}
		})
		.on(hexInput, 'change', (e: Event) => {
			e.stopPropagation();
			applyHexInput();
		});

	Dom.append(
		extra,
		editor.c.fromHTML(
			`<button type="button" class="${cn}__remove" data-color="" title="${editor.i18n('Remove')}">${
				editor.o.textIcons ? editor.i18n('Remove') : Icon.get('eraser')
			}</button>`
		)
	);

	if (editor.o.showBrowserColorPicker && hasBrowserColorPicker()) {
		Dom.append(
			extra,
			editor.c.fromHTML(
				`<div class="${cn}__native">${iconPalette}<input type="color" value="#ffffff"/></div>`
			)
		);

		editor.e.on(form, 'change', (e: MouseEvent) => {
			e.stopPropagation();

			const target = e.target as HTMLInputElement;

			if (
				!target ||
				!target.tagName ||
				!Dom.isTag(target, 'input') ||
				target.type !== 'color'
			) {
				return;
			}

			const color: string = target.value || '';

			if (isFunction(callback)) {
				callback(color);
			}

			e.preventDefault();
		});
	}

	// The color of a swatch, or '' for Remove, from an event on it or its icon
	const colorOf = (node: Node): string | undefined => {
		const button = Dom.closest(
			node,
			elm =>
				Dom.isHTMLElement(elm) &&
				(elm.classList.contains(cn + '__color-item') ||
					elm.classList.contains(cn + '__remove')),
			form
		);

		return button ? attr(button, '-color') || '' : undefined;
	};

	const apply = (color: string): void => {
		if (callback && isFunction(callback)) {
			callback(color);
		}
	};

	// A pointer applies the color on `mousedown`, which keeps the selection.
	// The keyboard and screen readers press the button, which sends only
	// `click`, so a click after the pointer's `mousedown` is skipped
	let pointerPressed = false;

	editor.e.on(form, 'mousedown touchend', (e: MouseEvent) => {
		// let the hex/native inputs receive focus and clicks
		if (Dom.isTag(e.target as Node, 'input')) {
			e.stopPropagation();
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		const color = colorOf(e.target as Node);

		if (color !== undefined) {
			pointerPressed = e.type === 'mousedown';
			apply(color);
		}
	});

	editor.e
		.on(form, 'click', (e: MouseEvent) => {
			const color = colorOf(e.target as Node);

			if (color !== undefined && !pointerPressed) {
				apply(color);
			}

			pointerPressed = false;
		})
		.on(form, 'keydown', (e: KeyboardEvent) => {
			pointerPressed = false;

			const item = e.target as HTMLElement;

			if (
				!items.includes(item) ||
				![KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN].includes(e.key)
			) {
				return;
			}

			// The toolbar's dropdown would walk every color one by one
			e.preventDefault();
			e.stopPropagation();

			nextItem(item, e.key)?.focus();
		})
		.on(form, 'focusin', (e: FocusEvent) => {
			if (items.includes(e.target as HTMLElement)) {
				items.forEach(item =>
					attr(item, 'tabindex', item === e.target ? 0 : -1)
				);
			}
		});

	editor.e.fire('afterGenerateColorPicker', form, extra, callback, valueHex);

	return form;
};
