/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../types/';
import { Config } from '../config';
import { Dom } from '../core/dom';
import { css, memorizeExec, normalizeSize } from '../core/helpers/';

declare module '../config' {
	interface Config {
		defaultFontSizePoints: 'px' | 'pt';
	}
}

/**
 * Default font-size points
 */
Config.prototype.defaultFontSizePoints = 'px';

Config.prototype.controls.fontsize = {
	command: 'fontSize',

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
					elm => {
						return (
							Dom.isBlock(elm, editor.ew) ||
							(elm && Dom.isElement(elm))
						);
					},
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
		'Helvetica,sans-serif': 'Helvetica',
		'Arial,Helvetica,sans-serif': 'Arial',
		'Georgia,serif': 'Georgia',
		'Impact,Charcoal,sans-serif': 'Impact',
		'Tahoma,Geneva,sans-serif': 'Tahoma',
		"'Times New Roman',Times,serif": 'Times New Roman',
		'Verdana,Geneva,sans-serif': 'Verdana'
	},

	childTemplate: (editor, key: string, value: string) => {
		return `<span style="font-family: ${key}!important;">${value}</span>`;
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

/**
 * Process commands `fontsize` and `fontname`
 * @param {Jodit} editor
 */
export function font(editor: IJodit): void {
	editor
		.registerButton({
			name: 'font',
			group: 'font'
		})
		.registerButton({
			name: 'fontsize',
			group: 'font'
		});

	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		switch (command) {
			case 'fontsize':
				editor.s.applyStyle({
					fontSize: normalizeSize(third)
				});
				break;

			case 'fontname':
				editor.s.applyStyle({
					fontFamily: third
				});
				break;
		}

		editor.e.fire('synchro');

		return false;
	};

	editor
		.registerCommand('fontsize', callback)
		.registerCommand('fontname', callback);
}
