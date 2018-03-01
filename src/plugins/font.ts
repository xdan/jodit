/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {css, normalizeSize} from '../modules/Helpers';
import {Config} from "../Config";
import {ControlType} from "../modules/ToolbarCollection";
import {Dom} from "../modules/Dom";

Config.prototype.controls.fontsize = <ControlType>{
    command: 'fontSize',
    list : ["8", "9", "10", "11", "12", "14", "16", "18", "24", "30", "36", "48", "60", "72", "96"],
    template : (editor: Jodit, key: string, value: string) => value,
    tooltip: "Font size",
    isActiveChild: (editor: Jodit, control: ControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) || editor.editor;

            let fontSize: number = <number>css(currentBpx, 'font-size');
            return !!(fontSize && control.args && control.args[1].toString() === fontSize.toString());
        }

        return false;
    },
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

    isActiveChild: (editor: Jodit, control: ControlType): boolean => {
        const current: Node|false = editor.selection.current();
        const normFonts = (font: string): string => {
            return font.toLowerCase()
                .replace(/['"]+/g, '')
                .replace(/[^a-z0-9]+/g, ',')
        };
        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) || editor.editor;

            const font: string = css(currentBpx, 'font-family').toString();
            return !!(font && control.args && normFonts(control.args[0].toString()) === normFonts(font));
        }

        return false;
    },

    isActive: (editor: Jodit): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) || editor.editor;

            return css(currentBpx, 'font-family').toString() !== css(editor.editor, 'font-family').toString();
        }

        return false;
    },

    tooltip: "Font family"
};

/**
 * Process commands `fontsize` and `fontname`
 * @param {Jodit} editor
 */
export function font(editor: Jodit) {
    const callback: Function = (command: string, second: string, third: string): false | void => {
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
    };
    editor.registerCommand('fontsize', callback);
    editor.registerCommand('fontname', callback);
}