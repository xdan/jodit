/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IJodit, IControlType } from '../types';
import { Config } from '../config';
import { isArray } from '../core/helpers';

Config.prototype.controls.subscript = {
	tags: ['sub'],
	tooltip: 'subscript'
} as IControlType;

Config.prototype.controls.superscript = {
	tags: ['sup'],
	tooltip: 'superscript'
} as IControlType;

Config.prototype.controls.bold = {
	tagRegExp: /^(strong|b)$/i,
	tags: ['strong', 'b'],
	css: {
		'font-weight': ['bold', '700']
	},
	tooltip: 'Bold'
} as IControlType;

Config.prototype.controls.italic = {
	tagRegExp: /^(em|i)$/i,
	tags: ['em', 'i'],
	css: {
		'font-style': 'italic'
	},
	tooltip: 'Italic'
} as IControlType;

Config.prototype.controls.underline = {
	tagRegExp: /^(u)$/i,
	tags: ['u'],
	css: {
		'text-decoration': 'underline'
	},
	tooltip: 'Underline'
} as IControlType;

Config.prototype.controls.strikethrough = {
	tagRegExp: /^(s)$/i,
	tags: ['s'],
	css: {
		'text-decoration': 'line-through'
	},
	tooltip: 'Strike through'
} as IControlType;

/**
 * Bold plugin - change B to Strong, i to Em
 */
export function bold(editor: IJodit): void {
	const callBack = (command: string): false => {
		const control: IControlType = Config.defaultOptions.controls[
				command
			] as IControlType,
			cssOptions:
				| IDictionary<string | string[]>
				| IDictionary<(editor: IJodit, value: string) => boolean> = {
				...control.css
			},
			cssRules: IDictionary<string> = {};

		Object.keys(cssOptions).forEach((key: string) => {
			cssRules[key] = isArray(cssOptions[key])
				? (cssOptions[key] as any)[0]
				: cssOptions[key];
		});

		editor.s.applyStyle(cssRules, {
			element: control.tags ? control.tags[0] : undefined
		});

		editor.e.fire('synchro');

		return false;
	};

	['bold', 'italic', 'underline', 'strikethrough'].forEach(name => {
		editor.registerButton({
			name,
			group: 'font-style'
		});
	});

	['superscript', 'subscript'].forEach(name => {
		editor.registerButton({
			name,
			group: 'script'
		});
	});

	editor
		.registerCommand('bold', {
			exec: callBack,
			hotkeys: ['ctrl+b', 'cmd+b']
		})

		.registerCommand('italic', {
			exec: callBack,
			hotkeys: ['ctrl+i', 'cmd+i']
		})

		.registerCommand('underline', {
			exec: callBack,
			hotkeys: ['ctrl+u', 'cmd+u']
		})

		.registerCommand('strikethrough', {
			exec: callBack
		});
}
