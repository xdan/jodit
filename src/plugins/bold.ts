/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from "../Config";
import { Jodit } from "../Jodit";
import { Dictionary } from "../types";
import { ControlType } from "../types/toolbar";

Config.prototype.controls.subscript = {
    tags: ["sub"],
    tooltip: "subscript",
} as ControlType;

Config.prototype.controls.superscript = {
    tags: ["sup"],
    tooltip: "superscript",
} as ControlType;

Config.prototype.controls.bold = {
    tagRegExp: /^(strong|b)$/i,
    tags: ["strong", "b"],
    css: {
        "font-weight": ["bold", "700"],
    },
    tooltip: "Bold",
} as ControlType;

Config.prototype.controls.italic = {
    tagRegExp: /^(em|i)$/i,
    tags: ["em", "i"],
    css: {
        "font-style": "italic",
    },
    tooltip: "Italic",
} as ControlType;

Config.prototype.controls.underline = {
    tagRegExp: /^(u)$/i,
    tags: ["u"],
    css: {
        "text-decoration": "underline",
    },
    tooltip: "Underline",
} as ControlType;
Config.prototype.controls.strikethrough = {
    tagRegExp: /^(s)$/i,
    tags: ["s"],
    css: {
        "text-decoration": "line-through",
    },
    tooltip: "Strike through",
} as ControlType;

/**
 * Bold plugin - change B to Strong, i to Em
 */
export function bold(editor: Jodit) {
    const callBack: Function = (command: string): false | void => {
        const control: ControlType = Jodit.defaultOptions.controls[command] as ControlType;
        const cssOptions: Dictionary<string | string[]> | Dictionary<(editor: Jodit, value: string) => boolean> = {...control.css},
            cssRules: Dictionary<string> = {};

        Object.keys(cssOptions).forEach((key: string) => {
            cssRules[key] = Array.isArray(cssOptions[key]) ?  (cssOptions[key] as any)[0] : cssOptions[key];
        });

        editor.selection.applyCSS(
            cssRules,
            control.tags ? control.tags[0] : undefined,
            control.css as any,
        );

        editor.setEditorValue();
        return false;
    };

    editor.registerCommand("bold", {
        exec: callBack,
        hotkeys: ["ctrl+b", "cmd+b"],
    });

    editor.registerCommand("italic", {
        exec: callBack,
        hotkeys: ["ctrl+i", "cmd+i"],
    });

    editor.registerCommand("underline", {
        exec: callBack,
        hotkeys: ["ctrl+u", "cmd+u"],
    });

    editor.registerCommand("strikethrough", {
        exec: callBack,
    });
}
