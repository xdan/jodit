/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/justify
 */

import type { IJodit, IControlType } from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/modules/';
import { css } from 'jodit/core/helpers/';

Config.prototype.controls.align = {
	name: 'left',
	tooltip: 'Align',

	update(button): void {
		const editor = button.j as IJodit,
			control = button.control,
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

			if (
				control.data &&
				control.data.currentValue !== currentValue &&
				control.list &&
				(control.list as string[]).indexOf(currentValue) !== -1
			) {
				if (editor.o.textIcons) {
					button.state.text = currentValue;
				} else {
					button.state.icon.name = currentValue;
				}

				control.data.currentValue = currentValue;
			}
		}
	},

	isActive: (editor: IJodit, btn): boolean => {
		const current = editor.s.current();

		if (current && btn.defaultValue) {
			const currentBox: HTMLElement =
				(Dom.closest(
					current,
					Dom.isBlock,
					editor.editor
				) as HTMLElement) || editor.editor;

			return (
				btn.defaultValue.indexOf(
					css(currentBox, 'text-align').toString()
				) === -1
			);
		}

		return false;
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
 * Remove text-align style for all selected children
 */
export const clearAlign = (node: Node): void => {
	Dom.each(node, elm => {
		if (Dom.isHTMLElement(elm)) {
			if (elm.style.textAlign) {
				elm.style.textAlign = '';

				if (!elm.style.cssText.trim().length) {
					elm.removeAttribute('style');
				}
			}
		}
	});
};

/**
 * Apply align for element
 */
export const alignElement = (command: string, box: HTMLElement): void => {
	if (Dom.isNode(box) && Dom.isElement(box)) {
		clearAlign(box);

		switch (command.toLowerCase()) {
			case 'justifyfull':
				box.style.textAlign = 'justify';
				break;

			case 'justifyright':
				box.style.textAlign = 'right';
				break;

			case 'justifyleft':
				box.style.textAlign = 'left';
				break;

			case 'justifycenter':
				box.style.textAlign = 'center';
				break;
		}
	}
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
