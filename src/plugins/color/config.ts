/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/color
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { css, dataBind } from 'jodit/core/helpers/';
import { ColorPickerWidget, TabOption, TabsWidget } from 'jodit/modules/widget';
import { Icon } from 'jodit/core/ui/icon';
import { Dom } from 'jodit/core/dom/dom';

Icon.set('brush', require('./brush.svg'));

Config.prototype.controls.brush = {
	update(button, editor: IJodit): void {
		const color = dataBind(button, 'color');

		const update = (key: string, value: string): void => {
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
					Dom.isElement,
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

		if (current && current !== editor.editor && Dom.isNode(current)) {
			if (
				Dom.isElement(current) &&
				editor.s.isCollapsed() &&
				!Dom.isTag(current, ['br', 'hr'])
			) {
				currentElement = current as HTMLElement;
			}

			Dom.up(
				current,
				(node): true | void => {
					if (Dom.isHTMLElement(node)) {
						const color = css(node, 'color', true),
							background = css(node, 'background-color', true);

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
				if (!currentElement) {
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
				if (!currentElement) {
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
			Dom.isNode(current) &&
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
