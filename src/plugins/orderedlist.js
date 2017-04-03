import Jodit from '../jodit';

Jodit.plugines.orderedlist = function (editor) {
    editor.events.on('afterCommand', (command) => {
        if (/insert(un)?orderedlist/i.test(command)) {
            let ul = editor.node.up(editor.selection.current(), (tag) => (/^UL|OL$/i.test(tag.tagName)))
            if (ul && ul.parentNode && ul.parentNode.tagName === 'P') {
                let selection = editor.selection.save();
                editor.node.unwrap(ul.parentNode);
                editor.selection.restore(selection);
            }
            editor.setEditorValue();
        }
    });
}