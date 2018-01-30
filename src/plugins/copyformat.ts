/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from '../Config'
import {Jodit} from "../Jodit";
import {Dom} from "../modules/Dom";
import {css} from "../modules/Helpers";
import {ControlType} from "../modules/ToolbarCollection";

const pluginKey: string = 'copyformat';

/**
 * Plug-in copy and paste formatting from elements
 *
 * @module copyformat
 */

const copyStyles: string[] = [
    'fontWeight',
    'fontStyle',
    'fontSize',
    'color',
    'backgroundColor',
    'textDecorationLine',
    'fontFamily'
];

const getStyle = (editor: Jodit, key: string, box: HTMLElement, defaultStyles: {[key: string]: string | number}):  string | number | undefined => {
    let result:  string | number  | undefined = css(box, key);

    if (result == defaultStyles[key]) {
        if (box.parentNode && box !== editor.editor && box.parentNode !== editor.editor) {
            result = getStyle(editor, key, <HTMLElement>box.parentNode, defaultStyles);
        } else {
            result = void(0);
        }
    }

    return result;
};

const getStyles = (editor: Jodit, box: HTMLElement, defaultStyles: {[key: string]: string | number}): {[key: string]: string | number | undefined} => {
    const result: {[key: string]: string | number | undefined} = {};

    if (box) {
        copyStyles.forEach((key: string) => {
            result[key] = getStyle(editor, key, box, defaultStyles);
        });
    }

    return result;
};

Config.prototype.controls.copyformat = <ControlType>{
    exec: (editor: Jodit, current: Node|false) => {
        if (current) {
            if (editor.buffer[pluginKey]) {
                editor.buffer[pluginKey] = false;
                editor.events.off(editor.editor,'mouseup.' + pluginKey);
            } else {
                const defaultStyles: {[key: string]: string | number} = {};
                copyStyles.forEach((key: string) => {
                    defaultStyles[key] = css(editor.editor, key);
                });

                const box: HTMLElement = <HTMLElement>Dom.up(current, (elm: Node | null) => (elm && elm.nodeType !== Node.TEXT_NODE), editor.editor) || editor.editor;
                const format: {[key: string]: string | number | undefined}  = getStyles(editor, box, defaultStyles);

                const onmousedown: Function = () => {
                    editor.buffer[pluginKey] = false;

                    if (editor.selection.current()) {
                        editor.selection.applyCSS(format);
                    }

                    editor.events.off(editor.editor,'mouseup.' + pluginKey);
                };

                editor.events.on(editor.editor,'mouseup.' + pluginKey, onmousedown);

                editor.buffer[pluginKey] = true;
            }
        }
    },

    isActive: (editor: Jodit) => {
        return !!editor.buffer[pluginKey];
    },

    tooltip: "Paint format"
};

