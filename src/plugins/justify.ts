/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {$$, css} from '../modules/Helpers';
import {Dom} from "../modules/Dom";
import {Config} from "../Config";
import {ToolbarIcon, ControlType, ToolbarButton} from "../modules/ToolbarCollection";

Config.prototype.controls.align = <ControlType>{
    name: 'left',
    tooltip: "Align",
    getLabel: (editor: Jodit, btn: ControlType, button: ToolbarButton): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBox: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor) || editor.editor;
            let currentValue: string = css(currentBox, 'text-align').toString();

            if (btn.defaultValue && btn.defaultValue.indexOf(currentValue) !== - 1) {
                currentValue = 'left'
            }

            if (btn.data && btn.data.currentValue !== currentValue && btn.list && (<string[]>btn.list).indexOf(currentValue) !== -1) {
                button.textBox.innerHTML = !editor.options.textIcons ? ToolbarIcon.getIcon(currentValue, '') :  `<span>${currentValue}</span>`;
                (<HTMLElement>button.textBox.firstChild).classList.add('jodit_icon');
                btn.data.currentValue = currentValue;
            }
        }

        return false;
    },
    isActive: (editor: Jodit, btn: ControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current && btn.defaultValue) {
            const currentBox: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor) || editor.editor;
            return btn.defaultValue.indexOf(css(currentBox, 'text-align').toString()) === -1;
        }

        return false;
    },
    defaultValue: ['left', 'start', 'inherit'],
    data: {
        currentValue: 'left'
    },
    list: [
        'center',
        'left',
        'right',
        'justify',
    ],
};

Config.prototype.controls.center = {
    command: 'justifyCenter',
        tags: ["center"],
        css: {
        "text-align": "center"
    },
    tooltip: "Align Center"
};
Config.prototype.controls.justify = {
    command: 'justifyFull',
        css: {
        "text-align": "justify"
    },
    tooltip: "Align Justify"
};
Config.prototype.controls.left = {
    command: 'justifyLeft',
        css: {
        "text-align": "left"
    },
    tooltip: "Align Left"
};
Config.prototype.controls.right = {
    command: 'justifyRight',
        css: {
        "text-align": "right"
    },
    tooltip: "Align Right"
};

/**
 * Process commands: `justifyfull`, `justifyleft`, `justifyright`, `justifycenter`
 *
 * @param {Jodit} editor
 */
export function justify(editor: Jodit) {
    const callback: Function = (command: string): false | void => {
        const justify = (box: HTMLElement) => {
            if (box instanceof (<any>editor.editorWindow).HTMLElement) {
                switch (command.toLowerCase()) {
                    case 'justifyfull':
                        box.style.textAlign = 'justify';
                        break;
                    case 'justifyright':
                        box.style.textAlign = 'right';
                        break;
                    case 'justifyleft':
                        box.style.textAlign = 'left';
                        break;
                    case 'justifycenter':
                        box.style.textAlign = 'center';
                        break;
                }

            }
        };


        editor.selection.focus();
        editor.selection.eachSelection((current: Node): false | void => {
            if (!current) {
                if (editor.editor.querySelector('.jodit_selected_cell')) {
                    $$('.jodit_selected_cell', editor.editor).forEach(justify);
                    return false;
                }
            }

            if (!(current instanceof (<any>editor.editorWindow).Node)) {
                return;
            }

            let currentBox: HTMLElement |false | null = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;


            if (!currentBox && current) {
                currentBox = Dom.wrapInline(current, editor.options.enter, editor);
            }

            justify(<HTMLElement>currentBox);
        });
        return false;
    };
    editor.registerCommand('justifyfull', callback);
    editor.registerCommand('justifyright', callback);
    editor.registerCommand('justifyleft', callback);
    editor.registerCommand('justifycenter', callback);
}