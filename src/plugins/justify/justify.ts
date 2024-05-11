/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/justify/README.md]]
 * @packageDocumentation
 * @module plugins/justify
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { isPlainObject } from 'jodit/core/helpers';
import { alignElement } from 'jodit/core/helpers/utils/align';
import { css } from 'jodit/core/helpers/utils/css';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import justifyIcon from './justify.svg';

Icon.set('justify', justifyIcon);

Config.prototype.controls.align = {
	name: 'left',
	tooltip: 'Align',

	update(editor: IJodit, button): void {
		const control = button.control,
			current = editor.s.current();

		if (current) {
			const currentBox =
				Dom.closest(current, Dom.isBlock, editor.editor) ||
				editor.editor;

			let currentValue = css(currentBox, 'text-align').toString();

			if (
				control.defaultValue &&
				control.defaultValue.indexOf(currentValue) !== -1
			) {
				currentValue = 'left';
			}

			const { list, data } = control;

			if (
				data &&
				data.currentValue !== currentValue &&
				list &&
				(isPlainObject(list)
					? list[currentValue]
					: (list as string[]).includes(currentValue))
			) {
				if (editor.o.textIcons || control.component === 'select') {
					button.state.text = currentValue;
				} else {
					button.state.icon.name = currentValue;
				}

				data.currentValue = currentValue;
			}
		}
	},

	isActive: (editor: IJodit, btn): boolean => {
		const current = editor.s.current();

		if (!current || !btn.control.defaultValue) {
			return false;
		}

		const currentBox: HTMLElement =
			(Dom.closest(current, Dom.isBlock, editor.editor) as HTMLElement) ||
			editor.editor;

		return (
			btn.control.defaultValue.indexOf(
				css(currentBox, 'text-align').toString()
			) === -1
		);
	},

	defaultValue: ['left', 'start', 'inherit'],
	data: {
		currentValue: 'left'
	},

	list: ['center', 'left', 'right', 'justify']
} as IControlType;

Config.prototype.controls.center = {
	command: 'justifyCenter',
	css: {
		'text-align': 'center'
	},
	tooltip: 'Align Center'
};

Config.prototype.controls.justify = {
	command: 'justifyFull',
	css: {
		'text-align': 'justify'
	},
	tooltip: 'Align Justify'
};

Config.prototype.controls.left = {
	command: 'justifyLeft',
	css: {
		'text-align': 'left'
	},
	tooltip: 'Align Left'
};

Config.prototype.controls.right = {
	command: 'justifyRight',
	css: {
		'text-align': 'right'
	},
	tooltip: 'Align Right'
};

/**
 * Process commands: `justifyfull`, `justifyleft`, `justifyright`, `justifycenter`
 */
export function justify(editor: IJodit): void {
	editor.registerButton({
		name: 'align',
		group: 'indent'
	});

	const callback = (command: string): false | void => {
		editor.s.focus();

		editor.s.eachSelection((current: Node): false | void => {
			if (!current) {
				return;
			}

			let currentBox = Dom.up(
				current,
				Dom.isBlock,
				editor.editor
			) as HTMLElement;

			if (!currentBox) {
				currentBox = Dom.wrapInline(
					current,
					editor.o.enterBlock,
					editor
				) as HTMLElement;
			}

			alignElement(command, currentBox);
		});

		return false;
	};

	editor.registerCommand('justifyfull', callback);
	editor.registerCommand('justifyright', callback);
	editor.registerCommand('justifyleft', callback);
	editor.registerCommand('justifycenter', callback);
}

pluginSystem.add('justify', justify);
