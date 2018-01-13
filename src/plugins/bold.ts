/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from "../Config";
import {ControlType} from "../modules/Toolbar";

Config.prototype.controls.bold = {
    tagRegExp: /^(strong|b)$/i,
        tags: ["strong", "b"],
        css: {
        "font-weight": ["bold", "700"]
    },
    tooltip: "Bold",
};
Config.prototype.controls.italic = {
    tagRegExp: /^(em|i)$/i,
        tags: ["em", "i"],
        css: {
        "font-style": "italic"
    },
    tooltip: "Italic",
};
Config.prototype.controls.underline = {
    tagRegExp: /^(u)$/i,
        tags: ['u'],
        css: {
        "text-decoration": "underline"
    },
    tooltip: "Underline",
};
Config.prototype.controls.strikethrough = {
    tagRegExp: /^(s)$/i,
        tags: ['s'],
        css: {
        "text-decoration": "line-through"
    },
    tooltip: "Strike through",
};

/**
 * Bold plugin
 */
export function bold(editor: Jodit) {
    editor.events.on('beforeCommand', (command: string): false | void => {

        const commands = ['bold', 'italic', 'underline', 'strikethrough'];


        if (commands.indexOf(command) !== -1) {
            const cssOptions: {[key: string]: string|string[]}|{[key: string]: (editor: Jodit, value: string) => boolean} = {...Jodit.defaultOptions.controls[command].css},
                cssRules: {[key: string]: string} = {};

            Object.keys(cssOptions).forEach((key: string) => {
                cssRules[key] = Array.isArray(cssOptions[key]) ?  (<any>cssOptions[key])[0] : cssOptions[key];
            });

            let control: ControlType = Jodit.defaultOptions.controls[command];

            editor.selection.applyCSS(
                cssRules,
                control.tags ? control.tags[0] : undefined,
                <any>control.css
            );

            editor.setEditorValue();
            return false;
        }
    });
}