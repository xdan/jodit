/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {css, normalizeSize} from '../modules/Helpers';
import {Config} from "../Config";
import {ControlType} from "../modules/Toolbar";
import {Dom} from "../modules/Dom";

Config.prototype.controls.fontsize = <ControlType>{
    command: 'fontSize',
    list : ["8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"],
    template : (editor: Jodit, key: string, value: string) => value,
    tooltip: "Font size",
    isActive: (editor: Jodit): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) || editor.editor;

            return css(currentBpx, 'font-size').toString() !== css(editor.editor, 'font-size').toString();
        }

        return false;
    }
};
Config.prototype.controls.font = <ControlType>{
    command: 'fontname',
    exec: (editor: Jodit, event, control: ControlType) => {
        editor.execCommand(<string>control.command, false, control.args ? control.args[0] : undefined);
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
    editor.events.on('beforeCommand', (command: string, second: string, third: string): false | void => {
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
}