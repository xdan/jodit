import Jodit from '../Jodit';

Jodit.plugins.orderedlist = function (editor) {
    editor.events.on('afterCommand', (command) => {
        if (/insert(un)?orderedlist/i.test(command)) {
            let ul = editor.node.up(editor.selection.current(), (tag) => (/^UL|OL$/i.test(tag.tagName)))
            if (ul && ul.parentNode && ul.parentNode.tagName === 'P') {
                let selection = editor.selection.save();
                editor.node.unwrap(ul.parentNode);
                [].slice.call(ul.childNodes).forEach((li) => {
                    if (li.lastChild && li.lastChild.nodeType === Node.ELEMENT_NODE && li.lastChild.tagName === 'BR') {
                        li.removeChild(li.lastChild)
                    }
                })
                editor.selection.restore(selection);
            }
            editor.setEditorValue();
        }
    });
}