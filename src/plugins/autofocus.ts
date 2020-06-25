/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../core/dom';
import { IJodit } from '../types';

declare module '../config' {
	interface Config {
		autofocus: boolean;
	}
}

/**
 * @property{boolean} autofocus=false true After loading the page into the editor once the focus is set
 */
Config.prototype.autofocus = false;

/**
 * Autofocus plugin - set focus inside the editor after reload
 *
 * @param {Jodit} editor
 */
export function autofocus(editor: IJodit): void {
	editor.e.on('afterInit', () => {
		if (editor.o.autofocus) {
			if (editor.defaultTimeout) {
				editor.async.setTimeout(editor.s.focus, 300);
			} else {
				editor.s.focus();
			}
		}
	});

	editor.e.on('afterInit afterAddPlace', () => {
		editor.e
			.off(editor.editor, 'mousedown.autofocus')
			.on(editor.editor, 'mousedown.autofocus', (e: MouseEvent) => {
				if (
					editor.isEditorMode() &&
					e.target &&
					Dom.isBlock(e.target as Node, editor.ew) &&
					!(e.target as HTMLElement).childNodes.length
				) {
					if (editor.editor === e.target) {
						editor.s.focus();
					} else {
						editor.s.setCursorIn(e.target as HTMLElement);
					}
				}
			});
	});
}
