import Jodit from '../Jodit';
import Dom from "../modules/Dom";

Jodit.plugins.formatblock = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (command === 'formatblock') {
             editor.selection.focus();

             editor.selection.eachSelection((current: Element) => {
                 const selectionInfo = editor.selection.save();
                 let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

                 if (!currentBox && current) {
                     currentBox = Dom.wrap(current, editor.options.enter, editor);
                 }

                 if (!currentBox) {
                     return false;
                 }

                 if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
                    Dom.replace(currentBox, third, true, false, editor.doc);
                 } else {
                     if (!editor.selection.isCollapsed()) {
                        editor.selection.applyCSS({}, third)
                     } else {
                         Dom.wrap(current, third, editor);
                     }
                 }

                 editor.selection.restore(selectionInfo);
             });


             editor.setEditorValue();

            return false;

        }
    });
};