/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../core/dom';
import { css, normalizeSize } from '../core/helpers/';
import { IControlType, IJodit } from '../types/';

Config.prototype.controls.fontsize = ({
	command: 'fontSize',
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

	exec: (editor, event, { control }) => {
		editor.execCommand(
			control.command as string,
			false,
			control.args ? control.args[0] : undefined
		);
	},

	childTemplate: (editor, key: string, value: string) => value,

	tooltip: 'Font size',

	isChildActive: (editor, control: IControlType): boolean => {
		const current = editor.s.current();

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

			const fontSize: number = css(currentBpx, 'font-size') as number;

			return Boolean(
				fontSize &&
					control.args &&
					control.args[0].toString() === fontSize.toString()
			);
		}

		return false;
	},

	isActive: (editor): boolean => {
		const current = editor.s.current();

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

			return (
				css(currentBpx, 'font-size').toString() !==
				css(editor.editor, 'font-size').toString()
			);
		}

		return false;
	}
} as IControlType<IJodit>) as IControlType;

Config.prototype.controls.font = ({
	command: 'fontname',

	exec: (editor, node, { control }) => {
		editor.execCommand(
			control.command as string,
			false,
			control.args ? control.args[0] : undefined
		);
	},

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

	isChildActive: (editor, control: IControlType): boolean => {
		const current = editor.s.current(),
			normFonts = (fontValue: string): string => {
				return fontValue
					.toLowerCase()
					.replace(/['"]+/g, '')
					.replace(/[^a-z0-9]+/g, ',');
			};

		if (current) {
			const currentBpx: HTMLElement =
				Dom.closest(
					current,
					elm =>
						Dom.isBlock(elm, editor.ew) ||
						(elm && Dom.isElement(elm)),

					editor.editor
				) || editor.editor;

			const fontFamily = css(currentBpx, 'font-family').toString();

			return Boolean(
				fontFamily &&
					control.args &&
					normFonts(control.args[0].toString()) ===
						normFonts(fontFamily)
			);
		}

		return false;
	},

	isActive: (editor: IJodit): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx =
				Dom.closest(
					current,
					(elm: Node | null) =>
						Dom.isBlock(elm, editor.ew) || Dom.isElement(elm),

					editor.editor
				) || editor.editor;

			return (
				css(currentBpx, 'font-family').toString() !==
				css(editor.editor, 'font-family').toString()
			);
		}

		return false;
	},

	tooltip: 'Font family'
} as IControlType<IJodit>) as IControlType;

/**
 * Process commands `fontsize` and `fontname`
 * @param {Jodit} editor
 */
export function font(editor: IJodit) {
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
