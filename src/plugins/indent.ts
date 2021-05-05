/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, HTMLTagNames, IJodit } from '../types/';
import { Config } from '../config';
import { BR, PARAGRAPH } from '../core/constants';
import { Dom } from '../core/dom';
import { attr } from '../core/helpers';

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
	isDisabled: (editor: IJodit): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBox = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.ew),
				editor.editor
			);

			const key = getKey(editor.o.direction);

			if (currentBox && currentBox.style && currentBox.style[key]) {
				return parseInt(currentBox.style[key], 10) <= 0;
			}
		}

		return true;
	},
	tooltip: 'Decrease Indent'
} as IControlType;

declare module '../config' {
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
export function indent(editor: IJodit): void {
	const key = getKey(editor.o.direction);

	editor
		.registerButton({
			name: 'indent',
			group: 'indent'
		})
		.registerButton({
			name: 'outdent',
			group: 'indent'
		});

	const callback = (command: string): void | false => {
		const indentedBoxes: HTMLElement[] = [];

		editor.s.eachSelection((current: Node): false | void => {
			editor.s.save();

			let currentBox = current
				? (Dom.up(
						current,
						node => Dom.isBlock(node, editor.ew),
						editor.editor
				  ) as HTMLElement)
				: false;

			const enter = editor.o.enter;

			if (!currentBox && current) {
				currentBox = Dom.wrapInline(
					current,
					enter !== BR ? (enter as HTMLTagNames) : PARAGRAPH,
					editor
				);
			}

			if (!currentBox) {
				editor.s.restore();
				return false;
			}

			const alreadyIndented = indentedBoxes.indexOf(currentBox) !== -1;

			if (currentBox && currentBox.style && !alreadyIndented) {
				indentedBoxes.push(currentBox);

				let value = currentBox.style[key]
					? parseInt(currentBox.style[key], 10)
					: 0;

				value +=
					editor.o.indentMargin * (command === 'outdent' ? -1 : 1);

				currentBox.style[key] = value > 0 ? value + 'px' : '';

				if (!attr(currentBox, 'style')) {
					currentBox.removeAttribute('style');
				}
			}

			editor.s.restore();
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
