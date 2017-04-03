import Jodit from '../jodit';
import {wrapAndSelect} from './bold';
import {normalizeColor} from '../modules/Helpers';
// import * as consts from '../constants';

Jodit.plugines.color = function (editor) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/forecolor/.test(command)) {
            let span = wrapAndSelect(editor, editor.node.create('span'), /^(span|strong|i|em)$/i);

            switch (command) {
                case 'background':
                    span.style.backgroundColor = normalizeColor(third);
                    break;
                case 'forecolor':
                    span.style.color = normalizeColor(third);
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
}