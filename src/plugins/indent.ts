/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { BR, PARAGRAPH } from '../constants';
import { Dom } from '../modules/Dom';
import { IControlType } from '../types/toolbar';
import { HTMLTagNames, IJodit } from '../types';

Config.prototype.controls.indent = {
	tooltip: 'Increase Indent'
} as IControlType;

/**
 * Get style rule key for current direction
 * @param direction
 */
const getKey = (direction: string) =>
	direction === 'rtl' ? 'marginRight' : 'marginLeft';

Config.prototype.controls.outdent = {
	isDisable: (editor: IJodit): boolean => {
		const current: Node | false = editor.selection.current();

		if (current) {
			const currentBox: HTMLElement | false = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			) as HTMLElement | false;

			const key = getKey(editor.options.direction);

			if (currentBox && currentBox.style && currentBox.style[key]) {
				return parseInt(currentBox.style[key], 10) <= 0;
			}
		}

		return true;
	},
	tooltip: 'Decrease Indent'
} as IControlType;

declare module '../Config' {
	interface Config {
		indentMargin: number;
	}
}

/**
 * The number of pixels to use for indenting the current line.
 * @type {number}
 */
Config.prototype.indentMargin = 10;

/**
 * Indents the line containing the selection or insertion point.
 * @param {Jodit} editor
 */
export function indent(editor: IJodit) {
	const key = getKey(editor.options.direction);

	const callback = (command: string): void | false => {
		const indentedBoxes: HTMLElement[] = [];

		editor.selection.eachSelection((current: Node): false | void => {
			const selectionInfo = editor.selection.save();

			let currentBox = current
				? (Dom.up(
						current,
						node => Dom.isBlock(node, editor.editorWindow),
						editor.editor
				  ) as HTMLElement)
				: false;

			const enter = editor.options.enter;

			if (!currentBox && current) {
				currentBox = Dom.wrapInline(
					current,
					enter !== BR ? <HTMLTagNames>enter : PARAGRAPH,
					editor
				);
			}

			if (!currentBox) {
				editor.selection.restore(selectionInfo);
				return false;
			}

			const alreadyIndented = indentedBoxes.indexOf(currentBox) !== -1;

			if (currentBox && currentBox.style && !alreadyIndented) {
				indentedBoxes.push(currentBox);

				let value = currentBox.style[key]
					? parseInt(currentBox.style[key], 10)
					: 0;

				value +=
					editor.options.indentMargin *
					(command === 'outdent' ? -1 : 1);

				currentBox.style[key] = value > 0 ? value + 'px' : '';

				if (!currentBox.getAttribute('style')) {
					currentBox.removeAttribute('style');
				}
			}

			editor.selection.restore(selectionInfo);
		});

		editor.setEditorValue();

		return false;
	};

	editor.registerCommand('indent', {
		exec: callback,
		hotkeys: ['ctrl+]', 'cmd+]']
	});

	editor.registerCommand('outdent', {
		exec: callback,
		hotkeys: ['ctrl+[', 'cmd+[']
	});
}
