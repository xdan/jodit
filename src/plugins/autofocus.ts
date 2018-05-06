/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config';
import {Dom} from "../modules/Dom";

declare module "../Config" {
    interface Config {
        autofocus: boolean;
    }
}

/**
 * @property{boolean} autofocus=false true After loading the page into the editor once the focus is set
 */
Config.prototype.autofocus = false;

/**
 * Autofocus plugin - set focus inside the editor after reload
 *
 * @param {Jodit} editor
 */
export function autofocus(editor: Jodit) {
    let timeout: number;
    editor.events
        .on('afterInit', () => {
            if (editor.options.autofocus) {
                if (editor.defaultTimeout) {
                    timeout = window.setTimeout(editor.selection.focus, 300)
                } else {
                    editor.selection.focus();
                }
            }
        })
        .on('mousedown', (e: MouseEvent) => {
            if (editor.isEditorMode() && e.target && Dom.isBlock(<Node>e.target) && !(<HTMLElement>e.target).childNodes.length) {
                if (editor.editor === e.target) {
                    editor.selection.focus()
                } else {
                    editor.selection.setCursorIn(<HTMLElement>e.target);
                }
            }
        })
        .on('beforeDestruct', () => {
            clearTimeout(timeout);
        })
}