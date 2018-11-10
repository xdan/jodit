/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from '../Jodit';
import { Config } from "../Config";
import { Dom } from "../modules/Dom";
import { ControlType } from "../types/toolbar";
import { BR, PARAGRAPH } from "../constants";

Config.prototype.controls.indent = <ControlType>{
    tooltip: "Increase Indent",
};

Config.prototype.controls.outdent = <ControlType>{
    isDisable: (editor: Jodit): boolean => {
        const current: Node | false = editor.selection.current();

        if (current) {
            const currentBox: HTMLElement | false = <HTMLElement | false>Dom.closest(current, Dom.isBlock, editor.editor);
            if (currentBox && currentBox.style && currentBox.style.marginLeft) {
                return parseInt(currentBox.style.marginLeft, 10) <= 0;
            }
        }

        return true;
    },
    tooltip: "Decrease Indent",
};

declare module "../Config" {
    interface Config {
        indentMargin: number;
    }
}

/**
 * The number of pixels to use for indenting the current line.
 * @type {number}
 */
Config.prototype.indentMargin = 10;

/**
 * Indents the line containing the selection or insertion point.
 * @param {Jodit} editor
 */
export  function indent(editor: Jodit) {
    const callback: Function = (command: string): void | false => {
        editor.selection.eachSelection((current: Node): false | void => {
            const selectionInfo = editor.selection.save();
            let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

            const enter: string = editor.options.enter;
            if (!currentBox && current) {
                currentBox = Dom.wrapInline(current, enter !== BR ? enter : PARAGRAPH, editor);
            }

            if (!currentBox) {
                editor.selection.restore(selectionInfo);
                return false;
            }

            if (currentBox && currentBox.style) {
                let marginLeft: number = currentBox.style.marginLeft ? parseInt(currentBox.style.marginLeft, 10) : 0;
                marginLeft += editor.options.indentMargin * (command === 'outdent' ? - 1 : 1);
                currentBox.style.marginLeft = marginLeft > 0 ? marginLeft + 'px' : '';

                if (!currentBox.getAttribute('style')) {
                    currentBox.removeAttribute('style');
                }
            }

            editor.selection.restore(selectionInfo);
        });


        editor.setEditorValue();

        return false;
    };

    editor.registerCommand('indent', {
        exec: callback,
        hotkeys: ['ctrl+]', 'cmd+]']
    });
    editor.registerCommand('outdent', {
        exec: callback,
        hotkeys: ['ctrl+[', 'cmd+[']
    });
}
