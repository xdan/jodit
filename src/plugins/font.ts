import Jodit from '../Jodit';
import {wrapAndSelect} from './bold';
import {normalizeSize} from '../modules/Helpers';
import Dom from "../modules/Dom";
// import * as consts from '../constants';

Jodit.plugins.font = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (/font/.test(command)) {
            let span: HTMLElement = wrapAndSelect(editor, Dom.create('span', '', editor.doc), 'span|strong|i|em');

            switch (command) {
                case 'fontsize':
                    span.style.fontSize = normalizeSize(third);
                    break;
                case 'fontname':
                    span.style.fontFamily = third;
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
};