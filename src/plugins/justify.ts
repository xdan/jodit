/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from "../Config";
import { Jodit } from "../Jodit";
import { Dom } from "../modules/Dom";
import { $$, css } from "../modules/Helpers";
import { ToolbarButton } from "../modules/toolbar/button";
import { ToolbarIcon } from "../modules/toolbar/icon";
import { IControlType } from "../types/toolbar";

Config.prototype.controls.align = {
    name: "left",
    tooltip: "Align",
    getLabel: (editor: Jodit, btn: IControlType, button: ToolbarButton): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBox: HTMLElement = Dom.closest(current, Dom.isBlock, editor.editor) as HTMLElement || editor.editor;
            let currentValue: string = css(currentBox, "text-align").toString();

            if (btn.defaultValue && btn.defaultValue.indexOf(currentValue) !== - 1) {
                currentValue = "left";
            }

            if (btn.data && btn.data.currentValue !== currentValue && btn.list && (btn.list as string[]).indexOf(currentValue) !== -1) {
                button.textBox.innerHTML = !editor.options.textIcons ? ToolbarIcon.getIcon(currentValue, "") :  `<span>${currentValue}</span>`;
                (button.textBox.firstChild as HTMLElement).classList.add("jodit_icon");
                btn.data.currentValue = currentValue;
            }
        }

        return false;
    },
    isActive: (editor: Jodit, btn: IControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current && btn.defaultValue) {
            const currentBox: HTMLElement = Dom.closest(current, Dom.isBlock, editor.editor) as HTMLElement || editor.editor;
            return btn.defaultValue.indexOf(css(currentBox, "text-align").toString()) === -1;
        }

        return false;
    },
    defaultValue: ["left", "start", "inherit"],
    data: {
        currentValue: "left",
    },
    list: [
        "center",
        "left",
        "right",
        "justify",
    ],
} as IControlType;

Config.prototype.controls.center = {
    command: "justifyCenter",
        tags: ["center"],
        css: {
        "text-align": "center",
    },
    tooltip: "Align Center",
};
Config.prototype.controls.justify = {
    command: "justifyFull",
        css: {
        "text-align": "justify",
    },
    tooltip: "Align Justify",
};
Config.prototype.controls.left = {
    command: "justifyLeft",
        css: {
        "text-align": "left",
    },
    tooltip: "Align Left",
};
Config.prototype.controls.right = {
    command: "justifyRight",
        css: {
        "text-align": "right",
    },
    tooltip: "Align Right",
};

/**
 * Process commands: `justifyfull`, `justifyleft`, `justifyright`, `justifycenter`
 *
 * @param {Jodit} editor
 */
export function justify(editor: Jodit) {
    const
        callback = (command: string): false | void => {
            const
                justifyElm = (box: HTMLElement) => {
                    if (box instanceof (editor.editorWindow as any).HTMLElement) {
                        switch (command.toLowerCase()) {
                            case "justifyfull":
                                box.style.textAlign = "justify";
                                break;
                            case "justifyright":
                                box.style.textAlign = "right";
                                break;
                            case "justifyleft":
                                box.style.textAlign = "left";
                                break;
                            case "justifycenter":
                                box.style.textAlign = "center";
                                break;
                        }

                    }
                };

            editor.selection.focus();
            editor.selection.eachSelection((current: Node): false | void => {
                if (!current) {
                    if (editor.editor.querySelector(".jodit_selected_cell")) {
                        $$(".jodit_selected_cell", editor.editor).forEach(justifyElm);
                        return false;
                    }
                }

                if (!(current instanceof (editor.editorWindow as any).Node)) {
                    return;
                }

                let
                    currentBox: HTMLElement |false | null = current ? Dom.up(current, Dom.isBlock, editor.editor) as HTMLElement : false;

                if (!currentBox && current) {
                    currentBox = Dom.wrapInline(current, editor.options.enter, editor);
                }

                justifyElm(currentBox as HTMLElement);
            });
            return false;
        };
    editor.registerCommand("justifyfull", callback);
    editor.registerCommand("justifyright", callback);
    editor.registerCommand("justifyleft", callback);
    editor.registerCommand("justifycenter", callback);
}
