/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/focus/README.md]]
 * @packageDocumentation
 * @module plugins/focus
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { pluginSystem } from 'jodit/core/global';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
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

export function focus(editor: IJodit): void {
	if (editor.o.saveSelectionOnBlur) {
		editor.e
			.on('blur', () => {
				if (editor.isEditorMode()) {
					editor.s.save(true);
				}
			})
			.on('focus', () => {
				if (editor.isEditorMode()) {
					editor.s.restore();
				}
			});
	}

	const focus = (): void => {
		editor.s.focus();

		let textNode: Nullable<Node> = null;

		switch (editor.o.cursorAfterAutofocus) {
			case 'start':
				textNode = Dom.first(editor.editor, node => Dom.isText(node));
				break;
			case 'end':
				textNode = Dom.last(editor.editor, node => Dom.isText(node));
				break;
		}

		if (textNode) {
			editor.s.setCursorIn(
				textNode,
				editor.o.cursorAfterAutofocus === 'start'
			);
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
					Dom.isBlock(e.target) &&
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

pluginSystem.add('focus', focus);
