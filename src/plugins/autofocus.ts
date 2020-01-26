/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';

declare module '../Config' {
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
export function autofocus(editor: IJodit) {
	editor.events.on('afterInit', () => {
		if (editor.options.autofocus) {
			if (editor.defaultTimeout) {
				editor.async.setTimeout(editor.selection.focus, 300);
			} else {
				editor.selection.focus();
			}
		}
	});

	editor.events.on('afterInit afterAddPlace', () => {
		editor.events
			.off(editor.editor, 'mousedown.autofocus')
			.on(editor.editor, 'mousedown.autofocus', (e: MouseEvent) => {
			if (
				editor.isEditorMode() &&
				e.target &&
				Dom.isBlock(e.target as Node, editor.editorWindow) &&
				!(e.target as HTMLElement).childNodes.length
			) {
				if (editor.editor === e.target) {
					editor.selection.focus();
				} else {
					editor.selection.setCursorIn(e.target as HTMLElement);
				}
			}
		});
	});
}
