/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import * as consts from '../constants';
import {Config} from "../Config";
import {Component} from "../modules/Component";
import {ControlType} from "../modules/ToolbarCollection";

Config.prototype.controls.redo = <ControlType> {
    mode: consts.MODE_SPLIT,
    isDisable: (editor: Jodit): boolean => !editor.observer.stack.canRedo(),
    tooltip: 'Redo'
};
Config.prototype.controls.undo = <ControlType>{
    mode: consts.MODE_SPLIT,
    isDisable: (editor: Jodit): boolean => !editor.observer.stack.canUndo(),
    tooltip: 'Undo'
};

/**
 * Custom process Redo and Undo functionality
 */
export class redoundo extends Component  {
    constructor(editor: Jodit) {
        super(editor);

        const callback = (command: 'undo' | 'redo'): void | false => {
            if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                this.jodit.observer[command]();
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
}