/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Observer} from '../modules/Observer';
import * as consts from '../constants';
import {Config} from "../Config";
import {Component} from "../modules/Component";

Config.prototype.controls.redo ={
    mode: consts.MODE_SPLIT,
    tooltip: 'Redo'
};
Config.prototype.controls.undo = {
    mode: consts.MODE_SPLIT,
    tooltip: 'Undo'
};


export class redoundo extends Component  {
    private observer:Observer = new Observer(this.jodit);
    constructor(editor: Jodit) {
        super(editor);
        const updateButton = () => {
            editor.events.fire('canRedo', this.observer.stack.canRedo());
            editor.events.fire('canUndo', this.observer.stack.canUndo());
        };


        editor.events
            .on('afterSetMode', () => {
                if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                    updateButton();
                }
            });

        const callback = (command: 'undo' | 'redo'): void | false => {
            if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                if ((<any>this.observer.stack)['can' + command.substr(0,1).toUpperCase() + command.substr(1)]()) {
                    this.observer.stack[command]();
                }
                updateButton();
            }
            return false;
        };

        editor.registerCommand('redo', {
            exec: callback,
            hotkeys: 'ctrl+y,ctrl+shift+z'
        });
        editor.registerCommand('undo', {
            exec: callback,
            hotkeys: 'ctrl+z'
        });

    }
    destruct() {
        this.observer.destruct();
    }
}