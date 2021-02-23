/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../../types';
import { Config } from '../../config';
import { Dom } from '../../core/dom';

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
			node => Dom.isBlock(node, editor.ew),
			editor.editor
		);

		if (block && Dom.isEmpty(block) && block !== editor.editor) {
			Dom.after(block, elm);
			Dom.safeRemove(block);
		}

		let p = Dom.next(
			elm,
			node => Dom.isBlock(node, editor.ew),
			editor.editor,
			false
		);

		if (!p) {
			p = editor.createInside.element(editor.o.enter);
			Dom.after(elm, p);
		}

		editor.s.setCursorIn(p);

		return false;
	});
}
