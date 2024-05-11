/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/format-block
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isPlainObject } from 'jodit/core/helpers/checker/is-plain-object';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import paragraphIcon from './paragraph.svg';

Icon.set('paragraph', paragraphIcon);

Config.prototype.controls.paragraph = {
	command: 'formatBlock',

	value(editor: IJodit, button): string | undefined {
		const control = button.control,
			current = editor.s.current();

		const currentBox = Dom.closest(current, Dom.isBlock, editor.editor);

		return currentBox?.nodeName.toLowerCase() ?? control.data?.currentValue;
	},

	update(editor: IJodit, button): boolean {
		const control = button.control,
			current = editor.s.current();

		if (!current) {
			return false;
		}

		const currentValue = button.state.value,
			list = control.list;

		if (isPlainObject(list) && list[currentValue.toString()]) {
			if (editor.o.textIcons) {
				button.state.text = list[currentValue.toString()].toString();
			}
		}

		return false;
	},

	data: {
		currentValue: 'p'
	},

	list: {
		p: 'Paragraph',
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		blockquote: 'Quote',
		pre: 'Code'
	},

	isChildActive: (editor: IJodit, button): boolean => {
		return Boolean(button.state.value === button.control?.args?.[0]);
	},

	isActive: (editor: IJodit, button): boolean => {
		return (
			button.state.value !== editor.o.enter &&
			isPlainObject(button.control.list) &&
			Boolean(button.control.list[button.state.value as string])
		);
	},

	childTemplate: (e: IJodit, key: string, value: string) =>
		`<${key} style="margin:0;padding:0"><span>${e.i18n(
			value
		)}</span></${key}>`,

	tooltip: 'Insert format block'
} as IControlType;
