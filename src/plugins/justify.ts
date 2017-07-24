import Jodit from '../Jodit';
import {$$} from '../modules/Helpers';
import Dom from "../modules/Dom";

// import * as consts from '../constants';

Jodit.plugins.justify = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command) => {
        if (/justify/.test(command)) {
            const justify = (box) => {
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
            };


            editor.selection.focus();
            editor.selection.eachSelection((current: Element) => {
                if (!current) {
                    if (editor.editor.querySelector('.jodit_selected_cell')) {
                        $$('.jodit_selected_cell', editor.editor).forEach(justify);
                        return false;
                    }
                }

                if (!(current instanceof Node)) {
                    return;
                }

                let currentBox = current ? Dom.up(current, Dom.isBlock, editor.editor) : false;


                if (!currentBox && current) {
                    currentBox = Dom.wrap(current, editor.options.enter, editor);
                }

                justify(currentBox);
            });
            return false;
        }
    });
};