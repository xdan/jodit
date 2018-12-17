/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Jodit } from '../Jodit';
import { Plugin } from '../modules/Plugin';
import { IControlType } from '../types/toolbar';

Config.prototype.controls.redo = {
    mode: consts.MODE_SPLIT,
    isDisable: (editor: Jodit): boolean => !editor.observer.stack.canRedo(),
    tooltip: 'Redo',
} as IControlType;

Config.prototype.controls.undo = {
    mode: consts.MODE_SPLIT,
    isDisable: (editor: Jodit): boolean => !editor.observer.stack.canUndo(),
    tooltip: 'Undo',
} as IControlType;

/**
 * Custom process Redo and Undo functionality
 */
export class redoundo extends Plugin {
    beforeDestruct() {
        // do nothing
    }
    afterInit(editor: Jodit) {
        const callback = (command: string): void | false => {
            if (editor.getRealMode() === consts.MODE_WYSIWYG) {
                editor.observer[command as 'redo' | 'undo']();
            }

            return false;
        };

        editor.registerCommand('redo', {
            exec: callback,
            hotkeys: ['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z'],
        });

        editor.registerCommand('undo', {
            exec: callback,
            hotkeys: ['ctrl+z', 'cmd+z'],
        });
    }
}
