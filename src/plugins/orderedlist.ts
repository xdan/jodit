/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { IJodit, markerInfo } from '../types';

Config.prototype.controls.ul = {
	command: 'insertUnorderedList',
	controlName: 'ul',
	tags: ['ul'],
	tooltip: 'Insert Unordered List'
};
Config.prototype.controls.ol = {
	command: 'insertOrderedList',
	controlName: 'ol',
	tags: ['ol'],
	tooltip: 'Insert Ordered List'
};

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function orderedlist(editor: IJodit) {
	editor.events.on('afterCommand', (command: string): false | void => {
		if (/insert(un)?orderedlist/i.test(command)) {
			const ul: Node | false = Dom.up(
				editor.selection.current() as Node,
				(tag: Node | null) => tag && /^UL|OL$/i.test(tag.nodeName),
				editor.editor
			);

			if (ul && Dom.isTag(ul.parentNode, 'p')) {
				const selection: markerInfo[] = editor.selection.save();

				Dom.unwrap(ul.parentNode);

				Array.from(ul.childNodes).forEach((li: Node) => {
					if (Dom.isTag(li.lastChild, 'br')) {
						Dom.safeRemove(li.lastChild);
					}
				});

				editor.selection.restore(selection);
			}
			editor.setEditorValue();
		}
	});
}
