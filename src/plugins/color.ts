import Jodit from '../Jodit';
import {wrapAndSelect} from './bold';
import {normalizeColor} from '../modules/Helpers';
import Dom from "../modules/Dom";

Jodit.plugins.color = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/forecolor|background/.test(command)) {
            let span = wrapAndSelect(editor, Dom.create('span', '', editor.doc), 'span|strong|i|em');
            const color: string|false = normalizeColor(third);

            switch (command) {
                case 'background':
                    span.style.backgroundColor = !color ? 'transparent' : <string>color;
                    break;
                case 'forecolor':
                    span.style.color = !color ? 'transparent' : <string>color;
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
};