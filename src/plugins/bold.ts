/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import {Config} from "../Config";

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
    editor.events.on('beforeCommand', (command: string) => {

        const commands = ['bold', 'italic', 'underline', 'strikethrough'];


        if (commands.indexOf(command) !== -1) {
            // Dom.apply(Jodit.defaultOptions.controls[command], (commandOptions) => {
            //     return wrapAndSelect(editor, Dom.create(commandOptions.tags[0], '', editor.editorDocument),  commandOptions.tagRegExp);
            // }, editor);

            // editor.editorDocument.execCommand('fontsize', false, 7)
            const cssOptions = {...Jodit.defaultOptions.controls[command].css},
                cssRules = {};

            Object.keys(cssOptions).forEach((key: string) => {
                cssRules[key] = Array.isArray(cssOptions[key]) ?  cssOptions[key][0] : cssOptions[key];
            });

            editor.selection.applyCSS(
                cssRules,
                Jodit.defaultOptions.controls[command].tags[0],
                Jodit.defaultOptions.controls[command].css
            );

            editor.setEditorValue();
            return false;
        }
    });
}