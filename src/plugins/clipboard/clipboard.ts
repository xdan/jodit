/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/clipboard/README.md]]
 * @packageDocumentation
 * @module plugins/clipboard
 */

import type { IJodit, IPlugin, IStorage } from 'jodit/types';
import type { Plugin } from 'jodit/core/plugin';
import {
	CLIPBOARD_ID,
	INSERT_AS_HTML,
	TEXT_HTML,
	TEXT_PLAIN
} from 'jodit/core/constants';
import { cached } from 'jodit/core/decorators/cache/cache';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { getDataTransfer, stripTags } from 'jodit/core/helpers';

import './config';

/**
 * Clipboard plugin - cut and copy functionality
 */
export class clipboard implements IPlugin {
	jodit!: IJodit;

	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'cut',
			group: 'clipboard'
		},
		{
			name: 'copy',
			group: 'clipboard'
		},
		{
			name: 'paste',
			group: 'clipboard'
		},
		{
			name: 'selectall',
			group: 'clipboard'
		}
	];

	init(editor: IJodit): void {
		this.buttons?.forEach(btn => editor.registerButton(btn));

		editor.e
			.off(`copy.${CLIPBOARD_ID} cut.${CLIPBOARD_ID}`)
			.on(
				`copy.${CLIPBOARD_ID} cut.${CLIPBOARD_ID}`,
				(event: ClipboardEvent): false | void => {
					const selectedText = wrapWithInlineAncestors(
						editor,
						editor.s.html
					);

					const clipboardData =
						getDataTransfer(event) ||
						getDataTransfer(editor.ew as any) ||
						getDataTransfer((event as any).originalEvent);

					if (clipboardData) {
						clipboardData.setData(
							TEXT_PLAIN,
							stripTags(selectedText)
						);
						clipboardData.setData(TEXT_HTML, selectedText);
					}

					editor.buffer.set(CLIPBOARD_ID, selectedText);
					editor.e.fire('pasteStack', {
						html: selectedText,
						action:
							(editor.o as any).defaultActionOnPaste ||
							INSERT_AS_HTML
					});

					if (event.type === 'cut') {
						editor.s.remove();
						editor.s.focus();
					}

					event.preventDefault();

					editor?.events?.fire('afterCopy', selectedText);
				}
			);
	}

	/** @override */
	destruct(editor: IJodit): void {
		cached<IStorage>(editor, 'buffer')?.set(CLIPBOARD_ID, '');
		editor?.events?.off('.' + CLIPBOARD_ID);
	}
}

/**
 * `Selection.html` clones only the range contents — when the selection sits
 * entirely inside the text of a formatted element (`<strong>te|st|</strong>`),
 * the clone is bare text and the formatting would be lost on paste. Native
 * browser copy keeps that context, so the interception must restore it: wrap
 * the fragment in shallow clones of the inline ancestors of the range. See #1202
 */
function wrapWithInlineAncestors(editor: IJodit, html: string): string {
	if (!html || editor.s.isCollapsed()) {
		return html;
	}

	let node: Node | null = editor.s.range.commonAncestorContainer;

	if (!Dom.isElement(node)) {
		node = node.parentElement;
	}

	let result = html;

	while (
		node &&
		node !== editor.editor &&
		Dom.isElement(node) &&
		!Dom.isBlock(node)
	) {
		const shell = node.cloneNode(false) as Element;
		shell.innerHTML = result;
		result = shell.outerHTML;
		node = node.parentElement;
	}

	return result;
}

pluginSystem.add('clipboard', clipboard);
