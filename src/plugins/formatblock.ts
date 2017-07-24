import Jodit from '../Jodit';
import Dom from "../modules/Dom";

Jodit.plugins.formatblock = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (command === 'formatblock') {
            editor.selection.focus();

            const selectionInfo = editor.selection.save();

            editor.selection.eachSelection((current: Element) => {
                let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

                if (!currentBox && current) {
                    currentBox = Dom.wrap(current, editor.options.enter, editor);
                }

                if (!currentBox) {
                    return false;
                }

                Dom.replace(currentBox, third, true, false, editor.doc);
            });

            editor.selection.restore(selectionInfo);
            editor.setEditorValue();

            return false;

        }
    });
};