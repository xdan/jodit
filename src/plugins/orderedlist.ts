/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import Dom from "../modules/Dom";
import {Config} from "../Config";


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
    editor.events.on('afterCommand', (command) => {
        if (/insert(un)?orderedlist/i.test(command)) {
            const ul = Dom.up(<Node>editor.selection.current(), (tag) => (/^UL|OL$/i.test(tag.tagName)), editor.editor);
            if (ul && ul.parentNode && ul.parentNode['tagName'] === 'P') {
                const selection = editor.selection.save();
                Dom.unwrap(ul.parentNode);
                [].slice.call(ul.childNodes).forEach((li) => {
                    if (li.lastChild && li.lastChild.nodeType === Node.ELEMENT_NODE && li.lastChild.tagName === 'BR') {
                        li.removeChild(li.lastChild)
                    }
                });
                editor.selection.restore(selection);
            }
            editor.setEditorValue();
        }
    });
};