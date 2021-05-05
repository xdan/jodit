/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../types';
import { Config } from '../config';
import { Dom } from '../core/dom';

declare module '../config' {
	interface Config {
		autofocus: boolean;
		cursorAfterAutofocus: 'start' | 'end';
		saveSelectionOnBlur: boolean;
	}
}

/**
 * After loading the page into the editor once the focus is set
 */
Config.prototype.autofocus = false;

/**
 * Cursor position after autofocus
 */
Config.prototype.cursorAfterAutofocus = 'end';

/**
 * Save current selection on blur event
 */
Config.prototype.saveSelectionOnBlur = true;

/**
 * Autofocus plugin - set focus inside the editor after reload
 *
 * @param {Jodit} editor
 */
export function focus(editor: IJodit): void {
	if (editor.o.saveSelectionOnBlur) {
		editor.e
			.on('blur', () => {
				if (editor.isEditorMode()) {
					editor.s.save(true);
				}
			})
			.on('focus', () => {
				editor.s.restore();
			});
	}

	const focus = () => {
		editor.s.focus();

		if (editor.o.cursorAfterAutofocus === 'end') {
			const lastTextNode = Dom.last(editor.editor, node =>
				Dom.isText(node)
			);

			if (lastTextNode) {
				editor.s.setCursorIn(lastTextNode, false);
			}
		}
	};

	editor.e.on('afterInit', () => {
		if (editor.o.autofocus) {
			if (editor.defaultTimeout) {
				editor.async.setTimeout(focus, 300);
			} else {
				focus();
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
