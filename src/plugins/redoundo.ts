import Jodit from '../Jodit';
import Observer from '../modules/Observer';
import * as consts from '../constants';
import {ctrlKey} from '../modules/Helpers'

Jodit.plugins.redoundo = function (editor) {
    const updateButton = () => {
        editor.events.fire('canRedo', [observer.stack.canRedo()]);
        editor.events.fire('canUndo', [observer.stack.canUndo()]);
    };
    editor.events
        .on('keydown', (e: KeyboardEvent) => {
            if (ctrlKey(e)) {
                if (e.which === consts.KEY_Z || e.which === consts.KEY_Y) {
                    editor.execCommand(e.which === consts.KEY_Z ? 'Undo' : 'Redo');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        }, null, true);

    const observer = new Observer(editor);

    editor.events.on('afterSetMode', () => {
        if (editor.getMode() === consts.MODE_WYSIWYG) {
            updateButton();
        }
    });

    editor.events.on('beforeCommand', (command: string) => {
        if (command === 'redo' || command === 'undo') {
            if (editor.getMode() === consts.MODE_WYSIWYG) {
                if (observer.stack['can' + command.substr(0,1).toUpperCase() + command.substr(1)]()) {
                    observer.stack[command]();
                }
                updateButton();
            }
            return false;
        }
    });

    this.destruct = () => {
        observer.destruct();
    };
};