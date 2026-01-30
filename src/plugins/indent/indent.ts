/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/indent/README.md]]
 * @packageDocumentation
 * @module plugins/indent
 */

import type { IJodit } from 'jodit/types';
import { BR } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { attr, call } from 'jodit/core/helpers/utils';

import './config';

import { getKey } from './helpers';

const applyIndentToBox = (
	processedElements: Set<HTMLElement>,
	currentBox: HTMLElement,
	editor: IJodit,
	command: string
): void => {
	if (!currentBox) {
		return;
	}

	if (processedElements.has(currentBox)) {
		return;
	}

	const key = getKey(editor.o.direction, currentBox);

	processedElements.add(currentBox);

	let value = currentBox.style[key] ? parseInt(currentBox.style[key], 10) : 0;

	value += editor.o.indentMargin * (command === 'outdent' ? -1 : 1);

	currentBox.style[key] = value > 0 ? value + 'px' : '';

	if (!attr(currentBox, 'style')) {
		attr(currentBox, 'style', null);
	}
};

/**
 * Indents the line containing the selection or insertion point.
 */
export function indent(editor: IJodit): void {
	editor
		.registerButton({
			name: 'indent',
			group: 'indent'
		})
		.registerButton({
			name: 'outdent',
			group: 'indent'
		});

	const indentCommand = (command: string): void | false => {
		const processedElements: Set<HTMLElement> = new Set();
		const { enter, enterBlock } = editor.o;
		const isBrMode = enter.toLowerCase() === BR;
		const current = editor.s.current();

		if (isBrMode && editor.s.isCollapsed()) {
			if (current) {
				const box = Dom.wrapNextInline(current, enterBlock, editor);
				applyIndentToBox(processedElements, box, editor, command);
				return false;
			}
		}

		editor.s.eachSelection((current): false | void => {
			editor.s.save();

			let currentBox = current
				? Dom.up(current, Dom.isBlock, editor.editor)
				: false;

			if (!currentBox && current) {
				currentBox = call(
					!isBrMode ? Dom.wrapInline : Dom.wrapNextInline,
					current,
					!isBrMode ? (enter.toLowerCase() as 'p') : enterBlock,
					editor
				);
			}

			if (!currentBox) {
				editor.s.restore();
				return false;
			}

			applyIndentToBox(processedElements, currentBox, editor, command);

			editor.s.restore();
		});

		editor.synchronizeValues();

		return false;
	};

	editor.registerCommand('indent', {
		exec: indentCommand,
		hotkeys: ['ctrl+]', 'cmd+]']
	});

	editor.registerCommand('outdent', {
		exec: indentCommand,
		hotkeys: ['ctrl+[', 'cmd+[']
	});
}

pluginSystem.add('indent', indent);
