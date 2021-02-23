/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IJodit, IControlType } from '../../types';
import { Config } from '../../config';
import { Dom } from '../../core/dom';
import { css } from '../../core/helpers/';

const pluginKey = 'copyformat';

/**
 * Plug-in copy and paste formatting from one element to another
 */

const copyStyles: string[] = [
	'fontWeight',
	'fontStyle',
	'fontSize',
	'color',
	'margin',
	'padding',
	'borderWidth',
	'borderStyle',
	'borderColor',
	'borderRadius',
	'backgroundColor',
	'textDecorationLine',
	'fontFamily'
];

const getStyle = (
	editor: IJodit,
	key: string,
	box: HTMLElement,
	defaultStyles: IDictionary<string | number>
): string | number | undefined => {
	let result: string | number | undefined = css(box, key);

	if (result === defaultStyles[key]) {
		if (
			box.parentNode &&
			box !== editor.editor &&
			box.parentNode !== editor.editor
		) {
			result = getStyle(
				editor,
				key,
				box.parentNode as HTMLElement,
				defaultStyles
			);
		} else {
			result = undefined;
		}
	}

	return result;
};

const getStyles = (
	editor: IJodit,
	box: HTMLElement,
	defaultStyles: IDictionary<string | number>
): IDictionary<string | number | undefined> => {
	const result: IDictionary<string | number | undefined> = {};

	if (box) {
		copyStyles.forEach((key: string) => {
			result[key] = getStyle(editor, key, box, defaultStyles);
			if (key.match(/border(Style|Color)/) && !result.borderWidth) {
				result[key] = undefined;
			}
		});
	}

	return result;
};

Config.prototype.controls.copyformat = {
	exec: (editor: IJodit, current, { button }) => {
		if (!current) {
			return;
		}

		if (editor.buffer.exists(pluginKey)) {
			editor.buffer.delete(pluginKey);
			editor.e.off(editor.editor, 'mouseup.' + pluginKey);
		} else {
			const defaultStyles: IDictionary<string | number> = {},
				box =
					Dom.up(
						current,
						(elm: Node | null) => elm && !Dom.isText(elm),
						editor.editor
					) || editor.editor;

			const ideal = editor.createInside.span();

			editor.editor.appendChild(ideal);

			copyStyles.forEach((key: string) => {
				defaultStyles[key] = css(ideal, key);
			});

			if (ideal !== editor.editor) {
				Dom.safeRemove(ideal);
			}

			const format = getStyles(editor, box, defaultStyles);

			const onMouseUp = () => {
				editor.buffer.delete(pluginKey);

				const currentNode = editor.s.current();

				if (currentNode) {
					if (Dom.isTag(currentNode, 'img')) {
						css(currentNode as HTMLElement, format);
					} else {
						editor.s.applyStyle(format);
					}
				}

				editor.e.off(editor.editor, 'mouseup.' + pluginKey);
			};

			editor.e.on(editor.editor, 'mouseup.' + pluginKey, onMouseUp);

			editor.buffer.set(pluginKey, true);
		}

		button.update();
	},

	isActive: (editor: IJodit) => editor.buffer.exists(pluginKey),

	tooltip: 'Paint format'
} as IControlType;

export function copyFormat(editor: IJodit): void {
	editor.registerButton({
		name: 'copyformat',
		group: 'clipboard'
	});
}
