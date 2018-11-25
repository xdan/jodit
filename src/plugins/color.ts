/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from "../Config";
import { Jodit } from "../Jodit";
import TabsWidget = Widget.TabsWidget;
import ColorPickerWidget = Widget.ColorPickerWidget;
import { Dom } from "../modules/Dom";
import { css, normalizeColor } from "../modules/Helpers";
import { ToolbarButton } from "../modules/toolbar/button";
import { Widget } from "../modules/Widget";
import { Dictionary } from "../types";
import { ControlType } from "../types/toolbar";

Config.prototype.controls.brush = {
    isActive: (editor: Jodit, btn: ControlType, button: ToolbarButton): boolean => {
        const current: Node|false = editor.selection.current();
        const icon: SVGSVGElement|null = button.container.querySelector("svg");

        if (current) {
            const currentBpx: HTMLElement = Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) as HTMLElement || editor.editor;

            const color: string = css(currentBpx, "color").toString();
            const bg: string = css(currentBpx, "background-color").toString();

            if (color !== css(editor.editor, "color").toString()) {
                icon && (icon.style.fill = color);
                return true;
            }

            if (bg !== css(editor.editor, "background-color").toString()) {
                icon && (icon.style.fill = bg);
                return true;
            }
        }

        if (icon && icon.style.fill) {
            icon.style.fill = null;
        }

        return false;
    },

    popup: (editor: Jodit, current: Node | false, self: ControlType, close: Function) => {
        let color: string = "",
            bg_color: string = "",
            tabs: Dictionary<HTMLElement>,
            currentElement: HTMLElement|null = null;

        if (current && current !== editor.editor && Dom.isNode(current, editor.editorWindow) && current.nodeType === Node.ELEMENT_NODE) {
            color = css(current as HTMLElement, "color").toString();
            bg_color = css(current as HTMLElement, "background-color").toString();
            currentElement = current as HTMLElement;
        }

        const backgroundTag: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            if (!currentElement) {
                editor.execCommand("background", false, value);
            } else {
                currentElement.style.backgroundColor = value;
            }
            close();
        }, bg_color);

        const colorTab: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            if (!currentElement) {
                editor.execCommand("forecolor", false, value);
            } else {
                currentElement.style.color = value;
            }
            close();
        }, color);

        if (editor.options.colorPickerDefaultTab === "background") {
            tabs = {
                Background : backgroundTag,
                Text : colorTab,
            };
        } else {
            tabs = {
                Text : colorTab,
                Background : backgroundTag,
            };
        }

        return TabsWidget(editor, tabs, currentElement as any);
    },
    tooltip: "Fill color or set the text color",
} as ControlType;

/**
 * Process commands `background` and `forecolor`
 * @param {Jodit} editor
 */
export function color(editor: Jodit) {
    const callback: Function = (command: string, second: string, third: string): false | void => {
        const color: string|false = normalizeColor(third);

        switch (command) {
            case "background":
                editor.selection.applyCSS({
                    backgroundColor: !color ? "" : color as string,
                });
                break;
            case "forecolor":
                editor.selection.applyCSS({
                    color: !color ? "" : color as string,
                });
                break;
        }

        editor.setEditorValue();
        return false;
    };

    editor.registerCommand("forecolor", callback);
    editor.registerCommand("background", callback);
}
