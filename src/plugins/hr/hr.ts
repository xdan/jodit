/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/hr/README.md]]
 * @packageDocumentation
 * @module plugins/hr
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import hrIcon from './hr.svg';

Icon.set('hr', hrIcon);

Config.prototype.controls.hr = {
	command: 'insertHorizontalRule',
	tags: ['hr'],
	tooltip: 'Insert Horizontal Line'
} as IControlType;

export function hr(editor: IJodit): void {
	editor.registerButton({
		name: 'hr',
		group: 'insert'
	});

	editor.registerCommand('insertHorizontalRule', () => {
		const elm = editor.createInside.element('hr');
		editor.s.insertNode(elm, false, false);

		const block = Dom.closest(
			elm.parentElement,
			Dom.isBlock,
			editor.editor
		);

		// A block that holds other blocks, such as a list item or a table
		// cell, keeps the line
		if (
			block &&
			Dom.isEmpty(block) &&
			block !== editor.editor &&
			!editor.o.dtd?.blockLimits[block.nodeName.toLowerCase()]
		) {
			Dom.after(block, elm);
			Dom.safeRemove(block);
		}

		const next = Dom.findNotEmptySibling(elm, false);

		if (Dom.isBlock(next)) {
			editor.s.setCursorIn(next, true);
			return false;
		}

		// In a list item or a table cell the text goes on after the line, as
		// it does with the browsers' own command
		if (
			next ||
			(elm.parentNode !== editor.editor &&
				!Dom.isBlock(Dom.findNotEmptySibling(elm, true)))
		) {
			editor.s.setCursorAfter(elm);
			return false;
		}

		const p = editor.createInside.element(editor.o.enter);
		Dom.after(elm, p);
		editor.s.setCursorIn(p);

		return false;
	});
}

pluginSystem.add('hr', hr);
