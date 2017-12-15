/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import {normalizeSize} from '../modules/Helpers';
import {Config} from "../Config";
import {ControlType} from "../modules/Toolbar";

Config.prototype.controls.fontsize = {
    command: 'fontSize',
    list : ["8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"],
    template : (editor: Jodit, key: string, value: string) => value,
    tooltip: "Font size"
};
Config.prototype.controls.font = <ControlType>{
    command: 'fontname',
    exec: (editor: Jodit, event, control: ControlType) => {
        editor.execCommand(control.command, false, control.args[0]);
    },
    list :  {
        "Helvetica,sans-serif": "Helvetica",
        "Arial,Helvetica,sans-serif": "Arial",
        "Georgia,serif": "Georgia",
        "Impact,Charcoal,sans-serif": "Impact",
        "Tahoma,Geneva,sans-serif": "Tahoma",
        "'Times New Roman',Times,serif": "Times New Roman",
        "Verdana,Geneva,sans-serif": "Verdana"
    },
    template : (editor: Jodit, key: string, value: string) => {
        return `<span style="font-family: ${key}">${value}</span>`;
    },
    tooltip: "Font family"
};


export function font(editor: Jodit) {
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