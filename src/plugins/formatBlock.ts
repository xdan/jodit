/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Dom} from "../modules/Dom";
import * as consts from '../constants';
import {Config} from "../Config";
import {ToolbarButton, ControlType} from "../modules/ToolbarCollection";
import {markerInfo} from "../modules/Selection";


Config.prototype.controls.paragraph = <ControlType>{
    command: 'formatBlock',
    getLabel: (editor: Jodit, btn: ControlType, button: ToolbarButton): boolean => {
        const current: Node|false = editor.selection.current();

        if (current && editor.options.textIcons) {
            const currentBox: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor) || editor.editor,
                currentValue: string = currentBox.nodeName.toLowerCase();

            if (btn.data && btn.data.currentValue !== currentValue && btn.list && (<any>btn.list)[currentValue]) {
                button.textBox.innerHTML = `<span>${(<any>btn.list)[currentValue]}</span>`;
                (<HTMLElement>button.textBox.firstChild).classList.add('jodit_icon');
                btn.data.currentValue = currentValue;
            }
        }

        return false;
    },
    exec: (editor: Jodit, event, control: ControlType) => {
        editor.execCommand(<string>control.command, false, control.args ? control.args[0] : undefined);
    },
    data: {
        currentValue: 'left'
    },
    list: {
        p : "Normal",
        h1 : "Heading 1",
        h2 : "Heading 2",
        h3 : "Heading 3",
        h4 : "Heading 4",
        blockquote : "Quote",
    },
    isActiveChild: (editor: Jodit, control: ControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBox: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor);

            return currentBox &&
                currentBox !== editor.editor &&
                control.args !== undefined &&
                currentBox.nodeName.toLowerCase() === control.args[0];
        }

        return false;
    },
    isActive: (editor: Jodit, control: ControlType): boolean => {
        const current: Node|false = editor.selection.current();

        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, Dom.isBlock, editor.editor);

            return currentBpx &&
                currentBpx !== editor.editor &&
                control.list !== undefined &&
                currentBpx.nodeName.toLowerCase() !== 'p' &&
                (<any>(<any>control.list)[currentBpx.nodeName.toLowerCase()]) !== undefined;
        }

        return false;
    },
    template : (editor: Jodit, key: string, value: string) => {
        return '<' + key + ' class="jodit_list_element"><span>' + editor.i18n(value) + '</span></' + key + '></li>';
    },
    tooltip: "Insert format block"
};

/**
 * Process command - `formatblock`
 *
 * @param {Jodit} editor
 */
export function formatBlock(editor: Jodit) {
    editor.registerCommand('formatblock', (command: string, second: string, third: string): false | void => {
        editor.selection.focus();
        let work: boolean = false;

        editor.selection.eachSelection((current: Node): false | void => {
            const selectionInfo: markerInfo[] = editor.selection.save();
            let currentBox: HTMLElement | false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

            if ((!currentBox || currentBox.nodeName === 'LI') && current) {
                currentBox = Dom.wrapInline(current, editor.options.enter, editor);
            }

            if (!currentBox) {
                editor.selection.restore(selectionInfo);
                return false;
            }

            if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
                if (
                    third === editor.options.enter.toLowerCase() &&
                    currentBox.parentNode &&
                    currentBox.parentNode.nodeName === 'LI'
                ) {
                    Dom.unwrap(currentBox);
                } else {
                    Dom.replace(currentBox, third, true, false, editor.editorDocument);
                }
            } else {
                if (!editor.selection.isCollapsed()) {
                    editor.selection.applyCSS({}, third)
                } else {
                    Dom.wrapInline(current, third, editor);
                }
            }

            work = true;
            editor.selection.restore(selectionInfo);
        });

        if (!work) {
            let currentBox: HTMLElement = editor.editorDocument.createElement(third);
            currentBox.innerHTML = consts.INVISIBLE_SPACE;
            editor.selection.insertNode(currentBox, false);
            editor.selection.setCursorIn(currentBox);
        }

        editor.setEditorValue();

        return false;
    });
}