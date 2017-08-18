import Jodit from '../Jodit';
import Dom from "../modules/Dom";
import * as consts from '../constants';

Jodit.plugins.formatblock = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (command === 'formatblock') {
             editor.selection.focus();
             let work: boolean = false;
             editor.selection.eachSelection((current: Element) => {
                 const selectionInfo = editor.selection.save();
                 let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

                 if (!currentBox && current) {
                     currentBox = Dom.wrap(current, editor.options.enter, editor);
                 }

                 if (!currentBox) {
                     editor.selection.restore(selectionInfo);
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
                 work = true;
                 editor.selection.restore(selectionInfo);
             });

             if (!work) {
                 let currentBox: HTMLElement = <HTMLElement>Dom.create(third, consts.INVISIBLE_SPACE, editor.doc);
                 editor.selection.insertNode(currentBox, false);
                 editor.selection.setCursorIn(currentBox);
             }

             editor.setEditorValue();

            return false;

        }
    });
};