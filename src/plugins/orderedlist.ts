/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { IJodit, markerInfo } from '../types';

Config.prototype.controls.ul = {
    command: 'insertUnorderedList',
    controlName: 'ul',
    tags: ['ul'],
    tooltip: 'Insert Unordered List',
};
Config.prototype.controls.ol = {
    command: 'insertOrderedList',
    controlName: 'ol',
    tags: ['ol'],
    tooltip: 'Insert Ordered List',
};

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function orderedlist(editor: IJodit) {
    editor.events.on(
        'afterCommand',
        (command: string): false | void => {
            if (/insert(un)?orderedlist/i.test(command)) {
                const ul: Node | false = Dom.up(
                    editor.selection.current() as Node,
                    (tag: Node | null) => tag && /^UL|OL$/i.test(tag.nodeName),
                    editor.editor
                );

                if (ul && ul.parentNode && ul.parentNode.nodeName === 'P') {
                    const selection: markerInfo[] = editor.selection.save();
                    Dom.unwrap(ul.parentNode);
                    Array.from(ul.childNodes).forEach((li: Node) => {
                        if (
                            li.lastChild &&
                            li.lastChild.nodeType === Node.ELEMENT_NODE &&
                            li.lastChild.nodeName === 'BR'
                        ) {
                            Dom.safeRemove(li.lastChild);
                        }
                    });
                    editor.selection.restore(selection);
                }
                editor.setEditorValue();
            }
        }
    );
}
