import Jodit from '../Jodit';

Jodit.plugins.formatblock = function (editor) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (command === 'formatblock') {
            editor.selection.focus();

            let selectionInfo = editor.selection.save();

            editor.selection.eachSelection((current) => {
                let currentBox = current ? editor.node.up(current, (node) => (editor.node.isBlock(node))) : false;

                if (!currentBox && current) {
                    currentBox = editor.node.wrap(current);
                }

                if (!currentBox) {
                    return false;
                }

                editor.node.replace(currentBox, third, true);
            })

            editor.selection.restore(selectionInfo);
            editor.setEditorValue();

            return false;

        }
    });
}