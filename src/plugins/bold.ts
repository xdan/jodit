/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from "../Config";
import {ControlType} from "../modules/ToolbarCollection";

Config.prototype.controls.bold = <ControlType>{
    tagRegExp: /^(strong|b)$/i,
    tags: ["strong", "b"],
    css: {
        "font-weight": ["bold", "700"]
    },
    tooltip: "Bold",
};

Config.prototype.controls.italic = <ControlType>{
    tagRegExp: /^(em|i)$/i,
    tags: ["em", "i"],
    css: {
        "font-style": "italic"
    },
    tooltip: "Italic",
};

Config.prototype.controls.underline = <ControlType>{
    tagRegExp: /^(u)$/i,
    tags: ['u'],
    css: {
        "text-decoration": "underline"
    },
    tooltip: "Underline",
};
Config.prototype.controls.strikethrough = <ControlType>{
    tagRegExp: /^(s)$/i,
    tags: ['s'],
    css: {
        "text-decoration": "line-through"
    },
    tooltip: "Strike through",
};

/**
 * Bold plugin - change B to Strong, i to Em
 */
export function bold(editor: Jodit) {
    const callBack: Function = (command: string): false | void => {
        const control: ControlType = <ControlType>Jodit.defaultOptions.controls[command];
        const cssOptions: {[key: string]: string|string[]}|{[key: string]: (editor: Jodit, value: string) => boolean} = {...control.css},
            cssRules: {[key: string]: string} = {};

        Object.keys(cssOptions).forEach((key: string) => {
            cssRules[key] = Array.isArray(cssOptions[key]) ?  (<any>cssOptions[key])[0] : cssOptions[key];
        });

        editor.selection.applyCSS(
            cssRules,
            control.tags ? control.tags[0] : undefined,
            <any>control.css
        );

        editor.setEditorValue();
        return false;
    };

    editor.registerCommand('bold', {
        exec: callBack,
        hotkeys: 'ctrl+b'
    });
    editor.registerCommand('italic', {
        exec: callBack,
        hotkeys: 'ctrl+i'
    });
    editor.registerCommand('underline', {
        exec: callBack,
        hotkeys: 'ctrl+u'
    });
    editor.registerCommand('strikethrough', {
        exec: callBack
    });
}