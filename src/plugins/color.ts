import Jodit from '../jodit';
import {wrapAndSelect} from './bold';
import {normalizeColor} from '../modules/Helpers';
// import * as consts from '../constants';

Jodit.plugins.color = function (editor) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/forecolor|background/.test(command)) {
            let span = wrapAndSelect(editor, editor.node.create('span'), 'span|strong|i|em');
            const color = normalizeColor(third);

            switch (command) {
                case 'background':
                    span.style.backgroundColor = color === NaN ? 'transparent' : <string>color;
                    break;
                case 'forecolor':
                    span.style.color = color === NaN ? 'transparent' : <string>color;
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
}