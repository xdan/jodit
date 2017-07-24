import Jodit from '../Jodit';
import Dom from "../modules/Dom";

Jodit.plugins.orderedlist = function (editor: Jodit) {
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