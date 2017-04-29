import Jodit from '../jodit';
import {wrapAndSelect} from './bold';
import {normalizeColor} from '../modules/Helpers';
// import * as consts from '../constants';

Jodit.plugins.color = function (editor) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/forecolor|background/.test(command)) {
            let span = wrapAndSelect(editor, editor.node.create('span'), 'span|strong|i|em');

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