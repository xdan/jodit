/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/hr/README.md]]
 * @packageDocumentation
 * @module plugins/hr
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { Icon } from 'jodit/core/ui/icon';

Icon.set('hr', require('./hr.svg'));

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

		if (block && Dom.isEmpty(block) && block !== editor.editor) {
			Dom.after(block, elm);
			Dom.safeRemove(block);
		}

		let p = Dom.next(elm, Dom.isBlock, editor.editor, false);

		if (!p) {
			p = editor.createInside.element(editor.o.enter);
			Dom.after(elm, p);
		}

		editor.s.setCursorIn(p);

		return false;
	});
}

pluginSystem.add('hr', hr);
