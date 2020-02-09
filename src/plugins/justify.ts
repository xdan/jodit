/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { css } from '../modules/helpers/';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { IControlType } from '../types/toolbar';
import { IJodit } from '../types';

Config.prototype.controls.align = {
	name: 'left',
	tooltip: 'Align',
	getLabel: (editor: IJodit, btn, button): boolean => {
		const current: Node | false = editor.selection.current();

		if (current) {
			const currentBox: HTMLElement =
				(Dom.closest(
					current,
					node => Dom.isBlock(node, editor.editorWindow),
					editor.editor
				) as HTMLElement) || editor.editor;

			let currentValue: string = css(currentBox, 'text-align').toString();

			if (
				btn.defaultValue &&
				btn.defaultValue.indexOf(currentValue) !== -1
			) {
				currentValue = 'left';
			}

			if (
				button &&
				btn.data &&
				btn.data.currentValue !== currentValue &&
				btn.list &&
				(btn.list as string[]).indexOf(currentValue) !== -1
			) {
				button.textBox.innerHTML = !editor.options.textIcons
					? ToolbarIcon.getIcon(currentValue, '')
					: `<span>${currentValue}</span>`;
				(button.textBox.firstChild as HTMLElement).classList.add(
					'jodit_icon'
				);
				btn.data.currentValue = currentValue;
			}
		}

		return false;
	},
	isActive: (editor: IJodit, btn): boolean => {
		const current: Node | false = editor.selection.current();

		if (current && btn.defaultValue) {
			const currentBox: HTMLElement =
				(Dom.closest(
					current,
					node => Dom.isBlock(node, editor.editorWindow),
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
 *
 * @param node
 * @param editor
 */
export const clearAlign = (node: Node, editor: IJodit) => {
	Dom.each(node, (elm) => {
		if (Dom.isHTMLElement(elm, editor.editorWindow)) {
			if (elm.style.textAlign) {
				elm.style.textAlign = '';

				if (!elm.style.cssText.trim().length) {
					elm.removeAttribute('style');
				}
			}
		}
	})
};

/**
 * Apply align for element
 *
 * @param command
 * @param box
 * @param editor
 */
export const alignElement = (
	command: string,
	box: HTMLElement,
	editor: IJodit
) => {
	if (Dom.isNode(box, editor.editorWindow) && Dom.isElement(box)) {
		clearAlign(box, editor);

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
 * @param {Jodit} editor
 */
export function justify(editor: IJodit) {
	const callback = (command: string): false | void => {
		editor.selection.focus();

		editor.selection.eachSelection((current: Node): false | void => {
			if (!current) {
				return;
			}

			let currentBox = Dom.up(
				current,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			) as HTMLElement;

			if (!currentBox) {
				currentBox = Dom.wrapInline(
					current,
					editor.options.enterBlock,
					editor
				) as HTMLElement;
			}

			alignElement(command, currentBox, editor);
		});

		return false;
	};

	editor.registerCommand('justifyfull', callback);
	editor.registerCommand('justifyright', callback);
	editor.registerCommand('justifyleft', callback);
	editor.registerCommand('justifycenter', callback);
}
