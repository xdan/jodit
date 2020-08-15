/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../modules/';
import { css, dataBind, normalizeColor } from '../core/helpers/';
import { IJodit, IControlType } from '../types';
import { ColorPickerWidget, TabOption, TabsWidget } from '../modules/widget';

Config.prototype.controls.brush = {
	update(button): void {
		const color = dataBind(button, 'color');
		const editor = button.j as IJodit;

		const update = (key: string, value: string) => {
			if (value && value !== css(editor.editor, key).toString()) {
				button.state.icon.fill = value;
				return;
			}
		};

		if (color) {
			const mode = dataBind(button, 'color');
			update(mode === 'color' ? mode : 'background-color', color);
			return;
		}

		const current = editor.s.current();

		if (current && !button.state.disabled) {
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

			update('color', css(currentBpx, 'color').toString());
			update(
				'background-color',
				css(currentBpx, 'background-color').toString()
			);
		}

		button.state.icon.fill = '';
		button.state.activated = false;
	},

	popup: (
		editor: IJodit,
		current: Node | false,
		self: IControlType,
		close: () => void,
		button
	) => {
		let colorHEX: string = '',
			bg_color: string = '',
			tabs: TabOption[] = [],
			currentElement: HTMLElement | null = null;

		if (
			current &&
			current !== editor.editor &&
			Dom.isNode(current, editor.ew)
		) {
			if (Dom.isElement(current)) {
				currentElement = current as HTMLElement;
			}

			Dom.up(
				current,
				(node): true | void => {
					if (Dom.isHTMLElement(node, editor.ew)) {
						const color = css(node, 'color', undefined, true),
							background = css(
								node,
								'background-color',
								undefined,
								true
							);

						if (color) {
							colorHEX = color.toString();
							return true;
						}

						if (background) {
							bg_color = background.toString();
							return true;
						}
					}
				},
				editor.editor
			);
		}

		const backgroundTag: HTMLElement = ColorPickerWidget(
			editor,
			(value: string) => {
				if (!currentElement || currentElement===editor.s.current()) {
					editor.execCommand('background', false, value);
				} else {
					currentElement.style.backgroundColor = value;
				}

				dataBind(button, 'color', value);
				dataBind(button, 'color-mode', 'background');

				close();
			},
			bg_color
		);

		const colorTab: HTMLElement = ColorPickerWidget(
			editor,
			(value: string) => {
				if (!currentElement || currentElement===editor.s.current()) {
					editor.execCommand('forecolor', false, value);
				} else {
					currentElement.style.color = value;
				}

				dataBind(button, 'color', value);
				dataBind(button, 'color-mode', 'color');

				close();
			},
			colorHEX
		);

		tabs = [
			{
				name: 'Background',
				content: backgroundTag
			},
			{
				name: 'Text',
				content: colorTab
			}
		];

		if (editor.o.colorPickerDefaultTab !== 'background') {
			tabs = tabs.reverse();
		}

		return TabsWidget(editor, tabs, currentElement as any);
	},
	exec(jodit: IJodit, current, { button }): void | false {
		const mode = dataBind(button, 'color-mode'),
			color = dataBind(button, 'color');

		if (!mode) {
			return false;
		}

		if (
			current &&
			current !== jodit.editor &&
			Dom.isNode(current, jodit.ew) &&
			Dom.isElement(current)
		) {
			switch (mode) {
				case 'color':
					(current as HTMLElement).style.color = color;
					break;
				case 'background':
					(current as HTMLElement).style.backgroundColor = color;
					break;
			}
		} else {
			jodit.execCommand(
				mode === 'background' ? mode : 'forecolor',
				false,
				color
			);
		}
	},
	tooltip: 'Fill color or set the text color'
} as IControlType;

/**
 * Process commands `background` and `forecolor`
 * @param {Jodit} editor
 */
export function color(editor: IJodit): void {
	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		const colorHEX: string | false = normalizeColor(third);

		switch (command) {
			case 'background':
				editor.s.applyStyle({
					backgroundColor: !colorHEX ? '' : (colorHEX as string)
				});
				break;
			case 'forecolor':
				editor.s.applyStyle({
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
