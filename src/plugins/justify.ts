/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import {$$} from '../modules/Helpers';
import Dom from "../modules/Dom";
import {Config} from "../Config";

Config.prototype.controls.align = {
    tags: ["p", "div", "span", "td", "th", "img"],
        name: 'left',
        tooltip: "Align",
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
    editor.events.on('beforeCommand', (command) => {
        if (/justify/.test(command)) {
            const justify = (box) => {
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
            editor.selection.eachSelection((current: Element) => {
                if (!current) {
                    if (editor.editor.querySelector('.jodit_selected_cell')) {
                        $$('.jodit_selected_cell', editor.editor).forEach(justify);
                        return false;
                    }
                }

                if (!(current instanceof (<any>editor.editorWindow).Node)) {
                    return;
                }

                let currentBox = current ? Dom.up(current, Dom.isBlock, editor.editor) : false;


                if (!currentBox && current) {
                    currentBox = Dom.wrap(current, editor.options.enter, editor);
                }

                justify(currentBox);
            });
            return false;
        }
    });
};