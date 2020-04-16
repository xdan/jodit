/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../modules/';
import { css, normalizeColor } from '../core/helpers/';
import { IDictionary, IJodit, IControlType } from '../types';
import { ColorPickerWidget, TabsWidget } from '../modules/widget';

Config.prototype.controls.brush = {
	update(button): void {
		const editor = button.j as IJodit;

		const current: Node | false = editor.selection.current();

		if (current && !button.state.disabled) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					elm => {
						return (
							Dom.isBlock(elm, editor.editorWindow) ||
							(elm && Dom.isElement(elm))
						);
					},
					editor.editor
				) as HTMLElement) || editor.editor;

			const colorHEX = css(currentBpx, 'color').toString(),
				bgHEX = css(currentBpx, 'background-color').toString();

			if (colorHEX !== css(editor.editor, 'color').toString()) {
				button.state.icon.fill = colorHEX;
				button.state.activated = true;
				return;
			}

			if (bgHEX !== css(editor.editor, 'background-color').toString()) {
				button.state.icon.fill = bgHEX;
				button.state.activated = true;
				return;
			}
		}

		button.state.icon.fill = '';
		button.state.activated = false;
	},

	popup: (
		editor: IJodit,
		current: Node | false,
		self: IControlType,
		close: () => void
	) => {
		let colorHEX: string = '',
			bg_color: string = '',
			tabs: IDictionary<HTMLElement>,
			currentElement: HTMLElement | null = null;

		if (
			current &&
			current !== editor.editor &&
			Dom.isNode(current, editor.editorWindow) &&
			Dom.isElement(current)
		) {
			colorHEX = css(current as HTMLElement, 'color').toString();
			bg_color = css(
				current as HTMLElement,
				'background-color'
			).toString();
			currentElement = current as HTMLElement;
		}

		const backgroundTag: HTMLElement = ColorPickerWidget(
			editor,
			(value: string) => {
				if (!currentElement) {
					editor.execCommand('background', false, value);
				} else {
					currentElement.style.backgroundColor = value;
				}
				close();
			},
			bg_color
		);

		const colorTab: HTMLElement = ColorPickerWidget(
			editor,
			(value: string) => {
				if (!currentElement) {
					editor.execCommand('forecolor', false, value);
				} else {
					currentElement.style.color = value;
				}
				close();
			},
			colorHEX
		);

		if (editor.o.colorPickerDefaultTab === 'background') {
			tabs = {
				Background: backgroundTag,
				Text: colorTab
			};
		} else {
			tabs = {
				Text: colorTab,
				Background: backgroundTag
			};
		}

		return TabsWidget(editor, tabs, currentElement as any);
	},
	tooltip: 'Fill color or set the text color'
} as IControlType;

/**
 * Process commands `background` and `forecolor`
 * @param {Jodit} editor
 */
export function color(editor: IJodit) {
	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		const colorHEX: string | false = normalizeColor(third);

		switch (command) {
			case 'background':
				editor.selection.applyCSS({
					backgroundColor: !colorHEX ? '' : (colorHEX as string)
				});
				break;
			case 'forecolor':
				editor.selection.applyCSS({
					color: !colorHEX ? '' : (colorHEX as string)
				});
				break;
		}

		editor.setEditorValue();
		return false;
	};

	editor
		.registerCommand('forecolor', callback)
		.registerCommand('background', callback);
}
