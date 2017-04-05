import Jodit from '../jodit';
import Observer from '../modules/Observer';
import * as consts from '../constants';
import {ctrlKey} from '../modules/Helpers'

Jodit.plugines.redoundo = function (editor) {
    editor.events
        .on('keydown', (e) => {
            if (ctrlKey(e)) {
                if (e.which === consts.KEY_Z || e.which === consts.KEY_Y) {
                    editor.execCommand(e.which === consts.KEY_Z ? 'Undo' : 'Redo');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        });

    let observer = new Observer(editor);

    editor.events.on('beforeCommand', (command) => {
        if (command === 'redo' || command === 'undo' && observer.stack['can' + command.substr(0,1).toUpperCase() + command.substr(1)]()) {
            observer.stack[command]();
            return false;
        }
    })

    this.destruct = () => {
        observer.destruct();
    };
}