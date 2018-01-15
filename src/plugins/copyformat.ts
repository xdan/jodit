/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from '../Config'
import {Jodit} from "../Jodit";
import {Dom} from "../modules/Dom";
import {css} from "../modules/Helpers";

const key = 'copyformat';

/**
 * Plug-in copy and paste formatting from elements
 *
 * @module copyformat
 */

const getStyles = (editor: Jodit, elm: Node): {[key: string]: string | number} | void => {
    const box: HTMLElement = <HTMLElement>Dom.up(elm, (elm: Node | null) => (elm && elm.nodeType !== Node.TEXT_NODE), editor.editor) || editor.editor;
    if (box) {
        return {
            fontSize: css(box, 'fontSize'),
            fontWeight: css(box, 'fontWeight'),
            fontStyle: css(box, 'fontStyle'),
            color: css(box, 'color'),
            backgroundColor: css(box, 'backgroundColor'),
        };
    }
};

Config.prototype.controls.copyformat = {
    exec: (editor: Jodit, current: Node|false) => {
        if (current) {
            if (editor.buffer[key].active) {
                editor.buffer[key].active = false;
            } else {
                editor.buffer[key].format = getStyles(editor, current);
                if (editor.buffer[key].format) {
                    editor.buffer[key].active = true;
                }
            }
        }
    },

    isActive: (editor: Jodit) => {
        return editor.buffer[key] !== undefined ? editor.buffer[key].active : false;
    },

    tooltip: "Paint format"
};



export function copyformat(editor: Jodit) {
    editor.buffer[key] = {
        active: false,
        format: {

        },
    };

    editor.events.on('mouseup', () => {
        if (editor.buffer[key].active) {
            editor.buffer[key].active = false;
            editor.selection.applyCSS(editor.buffer[key].format);
        }
    });
}