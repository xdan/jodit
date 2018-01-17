/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Dom} from "../modules/Dom";
import {Config} from "../Config";
import {markerInfo} from "../modules/Selection";


Config.prototype.controls.ul = {
    command: 'insertUnorderedList',
    controlName : 'ul',
    tags: ["ul"],
    tooltip: "Insert Unordered List"
};
Config.prototype.controls.ol = {
    command: 'insertOrderedList',
    controlName : 'ol',
    tags: ["ol"],
    tooltip: "Insert Ordered List"
};

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function orderedlist(editor: Jodit) {
    editor.events.on('afterCommand', (command: string): false | void => {
        if (/insert(un)?orderedlist/i.test(command)) {
            const ul: Node | false = Dom.up(<Node>editor.selection.current(), (tag: Node | null) => (tag && /^UL|OL$/i.test(tag.nodeName)), editor.editor);
            if (ul && ul.parentNode && ul.parentNode.nodeName === 'P') {
                const selection: markerInfo[] = editor.selection.save();
                Dom.unwrap(ul.parentNode);
                [].slice.call(ul.childNodes).forEach((li: Node) => {
                    if (li.lastChild && li.lastChild.nodeType === Node.ELEMENT_NODE && li.lastChild.nodeName === 'BR') {
                        li.removeChild(li.lastChild)
                    }
                });
                editor.selection.restore(selection);
            }
            editor.setEditorValue();
        }
    });
}