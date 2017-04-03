import Jodit from '../jodit';
import {wrap} from './enter';
// import * as consts from '../constants';

Jodit.plugines.justify = function (editor) {
    editor.events.on('beforeCommand', (command) => {
        if (/justify/.test(command)) {
            editor.selection.focus();
            let current = editor.selection.current();
            let currentBox = current ? editor.node.up(current, (node) => (editor.node.isBlock(node))) : false;

            let sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();

            if (!currentBox && current) {
                currentBox = wrap(current, range, editor);
                //sel = editor.win.getSelection();
                //range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();
            }

            switch (command) {
                case 'justifyfull':
                    currentBox.style.textAlign = 'justify';
                    break;
                case 'justifyright':
                    currentBox.style.textAlign = 'right';
                    break;
                case 'justifyleft':
                    currentBox.style.textAlign = 'left';
                    break;
                case 'justifycenter':
                    currentBox.style.textAlign = 'center';
                    break;
            }

            return false;
        }
    });
}