import Jodit from '../jodit';
import {wrapAndSelect} from './bold';
import {normalizeSize} from '../modules/Helpers';
// import * as consts from '../constants';

Jodit.plugines.font = function (editor) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/font/.test(command)) {
            let span = wrapAndSelect(editor, editor.node.create('span'), /^(span|strong|i|em)$/i);

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
}