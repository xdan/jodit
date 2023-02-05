/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/font
 */

import { Config } from 'jodit/config';
import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { css, memorizeExec } from 'jodit/core/helpers/utils';
import { Icon } from 'jodit/core/ui/icon';

declare module 'jodit/config' {
	interface Config {
		defaultFontSizePoints: 'px' | 'pt';
	}
}

/**
 * Default font-size points
 */
Config.prototype.defaultFontSizePoints = 'px';

Icon.set('font', require('./icons/font.svg')).set(
	'fontsize',
	require('./icons/fontsize.svg')
);

Config.prototype.controls.fontsize = {
	command: 'fontsize',

	data: {
		cssRule: 'font-size'
	},

	list: [
		'8',
		'9',
		'10',
		'11',
		'12',
		'14',
		'16',
		'18',
		'24',
		'30',
		'36',
		'48',
		'60',
		'72',
		'96'
	],

	exec: (editor, event, { control }): void | false =>
		memorizeExec(editor, event, { control }, (value: string) => {
			if (control.command?.toLowerCase() === 'fontsize') {
				return `${value}${editor.o.defaultFontSizePoints}`;
			}

			return value;
		}),

	childTemplate: (editor, key: string, value: string) => {
		return `${value}${editor.o.defaultFontSizePoints}`;
	},

	tooltip: 'Font size',

	isChildActive: (editor, control: IControlType): boolean => {
		const current = editor.s.current(),
			cssKey = control.data?.cssRule || 'font-size',
			normalize =
				control.data?.normalize ||
				((v: string): string => {
					if (
						/pt$/i.test(v) &&
						editor.o.defaultFontSizePoints === 'pt'
					) {
						return v.replace(/pt$/i, '');
					}

					return v;
				});

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					Dom.isElement,
					editor.editor
				) as HTMLElement) || editor.editor;

			const value = css(currentBpx, cssKey) as number;

			return Boolean(
				value &&
					control.args &&
					normalize(control.args[0].toString()) ===
						normalize(value.toString())
			);
		}

		return false;
	}
} as IControlType<IJodit> as IControlType;

Config.prototype.controls.font = {
	...Config.prototype.controls.fontsize,
	command: 'fontname',

	list: {
		'': 'Default',
		'helvetica,sans-serif': 'Helvetica',
		'arial,helvetica,sans-serif': 'Arial',
		'georgia,palatino,serif': 'Georgia',
		'impact,charcoal,sans-serif': 'Impact',
		'tahoma,geneva,sans-serif': 'Tahoma',
		'times new roman,times,serif': 'Times New Roman',
		'verdana,geneva,sans-serif': 'Verdana'
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
				.replace(/[^a-z0-9]+/g, ',');
		}
	},

	tooltip: 'Font family'
} as IControlType<IJodit> as IControlType;
