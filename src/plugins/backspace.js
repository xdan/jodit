import Jodit from '../jodit';
import * as consts from '../constants';
import {trim} from '../modules/Helpers';

Jodit.plugines.backspace = function (editor) {
    editor.events.on('afterCommand', (command) => {
        if (command === 'delete') {
            let current = editor.selection.current();
            if (current && current.firstChild && current.firstChild.tagName ==='BR') {
                current.removeChild(current.firstChild);
            }
            if (!trim(editor.editor.innerText) && !editor.editor.querySelector('img')) {
                editor.editor.innerHTML = '';
                editor.selection.setCursorIn(editor.editor);
            }
        }
    })
    editor.events.on('keydown', (event) => {
        if (event.which === consts.KEY_BACKSPACE || event.which === consts.KEY_DELETE) {
            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
                return false;
            }
        }
    });
}