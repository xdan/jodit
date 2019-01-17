/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { setTimeout } from '../modules/helpers/async';
import { IJodit } from '../types';

declare module '../Config' {
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
export function autofocus(editor: IJodit) {
    let timeout: number;
    editor.events
        .on('afterInit', () => {
            if (editor.options.autofocus) {
                if (editor.defaultTimeout) {
                    timeout = setTimeout(editor.selection.focus, 300);
                } else {
                    editor.selection.focus();
                }
            }
        })
        .on('mousedown', (e: MouseEvent) => {
            if (
                editor.isEditorMode() &&
                e.target &&
                Dom.isBlock(e.target as Node, editor.editorWindow) &&
                !(e.target as HTMLElement).childNodes.length
            ) {
                if (editor.editor === e.target) {
                    editor.selection.focus();
                } else {
                    editor.selection.setCursorIn(e.target as HTMLElement);
                }
            }
        })
        .on('beforeDestruct', () => {
            clearTimeout(timeout);
        });
}
