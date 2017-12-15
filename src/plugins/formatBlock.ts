/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import Dom from "../modules/Dom";
import * as consts from '../constants';
import {ControlType} from "../modules/Toolbar";
import {Config} from "../Config";

Config.prototype.controls.paragraph = {
    command: 'formatBlock',
    exec: (editor: Jodit, event, control: ControlType) => {
        editor.execCommand(control.command, false, control.args[0]);
    },
    list: {
        p : "Normal",
        h1 : "Heading 1",
        h2 : "Heading 2",
        h3 : "Heading 3",
        h4 : "Heading 4",
        blockquote : "Quote",
        pre : "Code"
    },
    template : (editor: Jodit, key: string, value: string) => {
        return '<' + key + ' class="jodit_list_element"><span>' + editor.i18n(value) + '</span></' + key + '></li>';
    },
    tooltip: "Insert format block"
};


export function formatBlock(editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second, third: string) => {
        if (command === 'formatblock') {
             editor.selection.focus();
             let work: boolean = false;

             editor.selection.eachSelection((current: Element) => {
                 const selectionInfo = editor.selection.save();
                 let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

                 if (!currentBox && current) {
                     currentBox = Dom.wrap(current, editor.options.enter, editor);
                 }

                 if (!currentBox) {
                     editor.selection.restore(selectionInfo);
                     return false;
                 }

                 if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
                    Dom.replace(currentBox, third, true, false, editor.editorDocument);
                 } else {
                     if (!editor.selection.isCollapsed()) {
                        editor.selection.applyCSS({}, third)
                     } else {
                         Dom.wrap(current, third, editor);
                     }
                 }

                 work = true;
                 editor.selection.restore(selectionInfo);
             });

             if (!work) {
                 let currentBox: HTMLElement = <HTMLElement>Dom.create(third, consts.INVISIBLE_SPACE, editor.editorDocument);
                 editor.selection.insertNode(currentBox, false);
                 editor.selection.setCursorIn(currentBox);
             }

             editor.setEditorValue();

            return false;
        }
    });
};