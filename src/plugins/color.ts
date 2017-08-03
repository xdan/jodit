import Jodit from '../Jodit';
import {normalizeColor} from '../modules/Helpers';

Jodit.plugins.color = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command, second, third) => {
        if (/forecolor|background/.test(command)) {
            const color: string|false = normalizeColor(third);

            switch (command) {
                case 'background':
                    editor.selection.applyCSS({
                        backgroundColor: !color ? '' : <string>color
                    });
                    break;
                case 'forecolor':
                    editor.selection.applyCSS({
                        color: !color ? '' : <string>color
                    });
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
};