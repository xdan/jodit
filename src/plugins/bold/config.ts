/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType } from 'jodit/types';
import { Config } from 'jodit/config';

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
		'text-decoration-line': 'underline'
	},
	tooltip: 'Underline'
} as IControlType;

Config.prototype.controls.strikethrough = {
	tagRegExp: /^(s)$/i,
	tags: ['s'],
	css: {
		'text-decoration-line': 'line-through'
	},
	tooltip: 'Strike through'
} as IControlType;
