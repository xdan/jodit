/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {$$, css} from '../modules/Helpers';
import {Dom} from "../modules/Dom";
import {Config} from "../Config";
import {ControlType} from "../modules/Toolbar";

Config.prototype.controls.align = <ControlType>{
    name: 'left',
    tooltip: "Align",
    isActive: (editor: Jodit, btn: ControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current && btn.defaultValue) {
            let currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor) || editor.editor;
            return btn.defaultValue.indexOf(css(currentBpx, 'text-align').toString()) === -1;
        }

        return false;
    },
    defaultValue: ['left', 'start', 'inherit'],
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


export function justify(editor: Jodit) {
    editor.events.on('beforeCommand', (command: string): false | void => {
        if (/justify/.test(command)) {
            const justify = (box: HTMLElement) => {
                if (box instanceof (<any>editor.editorWindow).HTMLElement) {
                    switch (command) {
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
                    currentBox = Dom.wrap(current, editor.options.enter, editor);
                }

                justify(<HTMLElement>currentBox);
            });
            return false;
        }
    });
}