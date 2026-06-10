/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/indent
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import indentIcon from './icons/indent.svg';
import outdentIcon from './icons/outdent.svg';
import { getKey } from './helpers';

Icon.set('indent', indentIcon).set('outdent', outdentIcon);

Config.prototype.controls.indent = {
	tooltip: 'Increase Indent'
} as IControlType;

Config.prototype.controls.outdent = {
	isDisabled: (editor: IJodit): boolean => {
		const current = editor.s.current();

		if (!current) {
			return true;
		}

		// A list item whose list is nested inside another list item can be
		// outdented (un-nested) by the `tab` plugin, even without an inline
		// indent margin. Keep the button enabled in that case. See #1247
		if (editor.o.tab?.tabInsideLiInsertNewList) {
			const li = Dom.closest(current, 'li', editor.editor);

			if (li) {
				const list = Dom.closest(li, ['ul', 'ol'], editor.editor);

				if (list && Dom.closest(list, 'li', editor.editor)) {
					return false;
				}
			}
		}

		const currentBox = Dom.closest(current, Dom.isBlock, editor.editor);

		if (currentBox) {
			const arrow = getKey(editor.o.direction, currentBox);
			return (
				!currentBox.style[arrow] ||
				parseInt(currentBox.style[arrow], 10) <= 0
			);
		}

		return true;
	},
	tooltip: 'Decrease Indent'
} as IControlType;

declare module 'jodit/config' {
	interface Config {
		/**
		 * The number of pixels to use for indenting the current line.
		 */
		indentMargin: number;
	}
}

Config.prototype.indentMargin = 10;
