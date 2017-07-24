import Jodit from '../Jodit';

Jodit.plugins.AutoFocus = function (editor: Jodit) {
    let timeout;
    editor.events
        .on('afterInit', () => {
            if (editor.options.autofocus) {
                timeout = setTimeout(editor.selection.focus, 300)
            }
        }).on('beforeDestruct', () => {
            clearTimeout(timeout);
        })
};