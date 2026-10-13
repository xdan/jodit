/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/font
 */

import type { IControlType, IJodit, IToolbarButton } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { trimChars } from 'jodit/core/helpers/string/trim';
import { css } from 'jodit/core/helpers/utils/css';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import fontIcon from './icons/font.svg';
import fontsizeIcon from './icons/fontsize.svg';
import { UIFontPicker } from './font-picker';

declare module 'jodit/config' {
	interface Config {
		defaultFontSizePoints: 'px' | 'pt';

		font: {
			googleFonts: {
				/**
				 * Adds the Google Fonts library to the font family dropdown, which then
				 * also lists the theme's fonts and the fonts the content uses. The
				 * address answers with the JSON of the Google Fonts Developer API:
				 * the API itself (`https://www.googleapis.com/webfonts/v1/webfonts?key=…`)
				 * or a proxy of it. Empty leaves the dropdown as it is
				 */
				url: string;
			};
		};
	}
}

/**
 * Default font-size points
 */
Config.prototype.defaultFontSizePoints = 'px';

Config.prototype.font = {
	googleFonts: {
		url: ''
	}
};

Icon.set('font', fontIcon).set('fontsize', fontsizeIcon);

Config.prototype.controls.fontsize = {
	command: 'fontsize',

	data: {
		cssRule: 'font-size',
		normalize: (v: string): string => {
			return v.toString().replace(/(px|pt)$/i, '');
		}
	},

	list: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 32, 34, 36, 48, 60, 72, 96],

	textTemplate: (editor, value: string): string => {
		return value + editor.o.defaultFontSizePoints;
	},

	childTemplate: (editor, key: string, value: string) => {
		return `${value}${editor.o.defaultFontSizePoints}`;
	},

	tooltip: 'Font size',

	value: (editor, button): string | undefined => {
		const current = editor.s.current();
		if (!current) {
			return;
		}
		const box = Dom.closest(current, Dom.isElement, editor.editor);
		if (!box) {
			return;
		}

		const control = button.control;
		const cssKey = control.data?.cssRule || 'font-size';
		const value = css(box, cssKey);

		if (cssKey === 'font-size') {
			const numValue = parseFloat(value.toString());

			if (editor.o.defaultFontSizePoints === 'pt') {
				return Math.round(numValue * 0.75).toString();
			}

			return Math.round(numValue).toString();
		}

		return value.toString();
	},

	isChildActive: (editor, button): boolean => {
		const value = button.state.value;
		const normalize = button.control.data?.normalize ?? (<T>(v: T): T => v);
		return Boolean(
			value &&
			button.control.args &&
			normalize(button.control.args[0].toString()) ===
				normalize(value.toString())
		);
	},

	isActive: (editor: IJodit, button): boolean => {
		const value = button.state.value;
		if (!value) {
			return false;
		}

		const normalize: (v: string) => string =
			button.control.data?.normalize ?? ((v: string): string => v);

		let keySet: Set<string> = button.control.data!.cacheListSet;
		if (!keySet) {
			const keys: string[] = Object.keys(button.control.list!).map(
				normalize
			);
			keySet = new Set(keys);
			button.control.data!.cacheListSet = keySet;
		}

		return keySet.has(normalize(value.toString()));
	}
} as IControlType<IJodit> as IControlType;

const hadSelection = new WeakSet<IToolbarButton>();

Config.prototype.controls.font = {
	...Config.prototype.controls.fontsize,
	command: 'fontname',

	textTemplate: (j: IJodit, value: string) => {
		const [first] = value.split(',');
		return trimChars(first, '"\'');
	},

	list: {
		'': 'Default',
		'Arial, Helvetica, sans-serif': 'Arial',
		"'Courier New', Courier, monospace": 'Courier New',
		'Georgia, Palatino, serif': 'Georgia',
		"'Lucida Sans Unicode', 'Lucida Grande', sans-serif":
			'Lucida Sans Unicode',
		'Tahoma, Geneva, sans-serif': 'Tahoma',
		"'Times New Roman', Times, serif": 'Times New Roman',
		"'Trebuchet MS', Helvetica, sans-serif": 'Trebuchet MS',
		'Helvetica, sans-serif': 'Helvetica',
		'Impact, Charcoal, sans-serif': 'Impact',
		'Verdana, Geneva, sans-serif': 'Verdana'
	},

	childTemplate: (editor, key: string, value: string) => {
		let isAvailable = false;

		try {
			isAvailable =
				key.indexOf('dings') === -1 &&
				document.fonts.check(`16px ${key}`, value);
		} catch {}

		return `<span data-style="${key}" style="${
			isAvailable ? `font-family: ${key}!important;` : ''
		}">${value}</span>`;
	},

	popup: (editor: IJodit, current, close, button) =>
		editor.o.font.googleFonts.url
			? new UIFontPicker(editor, button, close)
			: false,

	data: {
		cssRule: 'font-family',
		normalize: (v: string): string => {
			return v
				.toLowerCase()
				.replace(/['"]+/g, '')
				.replace(/[^a-z0-9-]+/g, ',');
		}
	},

	// When no font is explicitly set, the computed font-family equals the
	// editor's own default (e.g. `-apple-system, …`). Return '' so the
	// button shows the list's `Default` entry, when it has one, instead of
	// that raw stack. See #1370
	value: (editor: IJodit, button): string | undefined => {
		const current = editor.s.current(),
			box = current && Dom.closest(current, Dom.isElement, editor.editor);

		// Until there is a selection the button shows the editor's own font,
		// and afterwards the font of the last one
		if (box) {
			hadSelection.add(button);
		} else if (hadSelection.has(button)) {
			return;
		}

		const value = css(box || editor.editor, 'font-family').toString(),
			{ list } = button.control;

		if (
			value === css(editor.editor, 'font-family').toString() &&
			(isArray(list)
				? (list as Array<string | number>).includes('')
				: '' in (list ?? {}))
		) {
			return '';
		}

		return value;
	},

	tooltip: 'Font family'
} as IControlType<IJodit> as IControlType;
