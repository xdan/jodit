import Jodit from '../Jodit';
import {wrapAndSelect} from './bold';
import {normalizeSize} from '../modules/Helpers';
import Dom from "../modules/Dom";
// import * as consts from '../constants';

Jodit.plugins.font = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (/font/.test(command)) {
            switch (command) {
                case 'fontsize':
                    editor.selection.applyCSS({
                        fontSize: normalizeSize(third)
                    });
                    break;
                case 'fontname':
                    editor.selection.applyCSS({
                        fontFamily: third
                    });
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
};