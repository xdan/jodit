/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/font
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { trimChars } from 'jodit/core/helpers/string/trim';
import { css } from 'jodit/core/helpers/utils/css';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import fontIcon from './icons/font.svg';
import fontsizeIcon from './icons/fontsize.svg';

declare module 'jodit/config' {
	interface Config {
		defaultFontSizePoints: 'px' | 'pt';
	}
}

/**
 * Default font-size points
 */
Config.prototype.defaultFontSizePoints = 'px';

Icon.set('font', fontIcon).set('fontsize', fontsizeIcon);

Config.prototype.controls.fontsize = {
	command: 'fontsize',

	data: {
		cssRule: 'font-size',
		normalise: (v: string, editor: IJodit): string => {
			if (/pt$/i.test(v) && editor.o.defaultFontSizePoints === 'pt') {
				return v.replace(/pt$/i, '');
			}

			return v;
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

	data: {
		cssRule: 'font-family',
		normalize: (v: string): string => {
			return v
				.toLowerCase()
				.replace(/['"]+/g, '')
				.replace(/[^a-z0-9-]+/g, ',');
		}
	},

	tooltip: 'Font family'
} as IControlType<IJodit> as IControlType;
