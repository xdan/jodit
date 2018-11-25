/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from "../Config";
import { Jodit } from "../Jodit";
import { Dom } from "../modules/Dom";
import { css } from "../modules/Helpers";
import { Dictionary } from "../types";
import { ControlType } from "../types/toolbar";

const pluginKey: string = "copyformat";

/**
 * Plug-in copy and paste formatting from elements
 *
 * @module copyformat
 */

const copyStyles: string[] = [
    "fontWeight",
    "fontStyle",
    "fontSize",
    "color",
    "margin",
    "padding",
    "borderWidth",
    "borderStyle",
    "borderColor",
    "borderRadius",
    "backgroundColor",
    "textDecorationLine",
    "fontFamily",
];

const getStyle = (editor: Jodit, key: string, box: HTMLElement, defaultStyles: Dictionary<string | number>): string | number | undefined => {
    let result: string | number  | undefined = css(box, key);

    if (result == defaultStyles[key]) {
        if (box.parentNode && box !== editor.editor && box.parentNode !== editor.editor) {
            result = getStyle(editor, key, box.parentNode as HTMLElement, defaultStyles);
        } else {
            result = void(0);
        }
    }

    return result;
};

const getStyles = (editor: Jodit, box: HTMLElement, defaultStyles: Dictionary<string | number>): Dictionary<string | number | undefined> => {
    const result: Dictionary<string | number | undefined> = {};

    if (box) {

        copyStyles.forEach((key: string) => {
            result[key] = getStyle(editor, key, box, defaultStyles);
            if (key.match(/border(Style|Color)/) && !result.borderWidth) {
                result[key] = void(0);
            }
        });
    }

    return result;
};

Config.prototype.controls.copyformat = {
    exec: (editor: Jodit, current: Node | false) => {
        if (current) {
            if (editor.buffer[pluginKey]) {
                editor.buffer[pluginKey] = false;
                editor.events.off(editor.editor, "mouseup." + pluginKey);
            } else {
                const defaultStyles: Dictionary<string | number> = {};
                const box: HTMLElement = Dom.up(current, (elm: Node | null) => (elm && elm.nodeType !== Node.TEXT_NODE), editor.editor) as HTMLElement || editor.editor;

                const ideal: HTMLElement = editor.editorDocument.createElement("span");
                editor.editor.appendChild(ideal);

                copyStyles.forEach((key: string) => {
                    defaultStyles[key] = css(ideal, key);
                });

                if (ideal !== editor.editor) {
                    ideal.parentNode && ideal.parentNode.removeChild(ideal);
                }

                const format: Dictionary<string | number | undefined>  = getStyles(editor, box, defaultStyles);

                const onmousedown: Function = () => {
                    editor.buffer[pluginKey] = false;
                    const current: Node | false = editor.selection.current();

                    if (current) {
                        if (current.nodeName === "IMG") {
                            css(current as HTMLElement, format);
                        } else {
                            editor.selection.applyCSS(format);
                        }
                    }

                    editor.events.off(editor.editor, "mouseup." + pluginKey);
                };

                editor.events.on(editor.editor, "mouseup." + pluginKey, onmousedown);

                editor.buffer[pluginKey] = true;
            }
        }
    },

    isActive: (editor: Jodit): boolean => {
        return !!editor.buffer[pluginKey];
    },

    tooltip: "Paint format",
} as ControlType;
