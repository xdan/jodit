import Component from "../modules/Component";
import {Config} from '../Config'
import * as consts from '../constants';
import Jodit from "../Jodit";
import {ControlType} from "../modules/Toolbar";
import Dom from "../modules/Dom";
import {css} from "../modules/Helpers";

const key = 'copyformat';

/**
 * Plug-in copy and paste formatting from elements
 *
 * @module copyformat
 */

const getStyles = (editor: Jodit, elm: Node) => {
    const box: HTMLElement = <HTMLElement>Dom.up(elm, (elm) => (elm && elm.nodeType !== Node.TEXT_NODE), editor.editor) || editor.editor;
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
    exec: (editor: Jodit, current: Node|false, btn: ControlType) => {
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

    isActive: (editor: Jodit, btn: ControlType) => {
        return editor.buffer[key] !== undefined ? editor.buffer[key].active : false;
    },

    tooltip: "Paint format"
};



export default function (editor: Jodit) {
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