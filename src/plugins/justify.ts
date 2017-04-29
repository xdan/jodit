import Jodit from '../jodit';
import {$$} from '../modules/Helpers';
import {wrap} from './enter';
// import * as consts from '../constants';

Jodit.plugins.justify = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command) => {
        if (/justify/.test(command)) {
            let justify = (box) => {
                if (box instanceof HTMLElement) {
                    switch (command) {
                        case 'justifyfull':
                            box.style.textAlign = 'justify';
                            break;
                        case 'justifyright':
                            box.style.textAlign = 'right';
                            break;
                        case 'justifyleft':
                            box.style.textAlign = 'left';
                            break;
                        case 'justifycenter':
                            box.style.textAlign = 'center';
                            break;
                    }

                }
            }


            editor.selection.focus();
            let current = editor.selection.current();
            if (!current) {
                if (editor.editor.querySelector('.jodit_selected_cell')) {
                    $$('.jodit_selected_cell', editor.editor).forEach(justify);
                    return false;
                }
            }

            if (!(current instanceof  Node)) {
                return;
            }

            let currentBox = current ? editor.node.up(current, (node) => (editor.node.isBlock(node))) : false;


            if (!currentBox && current) {
                let sel = editor.win.getSelection(),
                    range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();

                currentBox = wrap(current, range, editor);
            }

            justify(currentBox);
            return false;
        }
    });
}