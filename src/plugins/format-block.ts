/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Dom } from '../modules/Dom';
import { HTMLTagNames, IJodit, markerInfo } from '../types';
import { IControlType } from '../types/toolbar';

Config.prototype.controls.paragraph = {
    command: 'formatBlock',
    getLabel: (editor: IJodit, btn, button): boolean => {
        const current: Node | false = editor.selection.current();

        if (current && editor.options.textIcons) {
            const currentBox: HTMLElement =
                    (Dom.closest(
                        current,
                        node => Dom.isBlock(node, editor.editorWindow),
                        editor.editor
                    ) as HTMLElement) || editor.editor,
                currentValue: string = currentBox.nodeName.toLowerCase();

            if (
                button &&
                btn.data &&
                btn.data.currentValue !== currentValue &&
                btn.list &&
                (btn.list as any)[currentValue]
            ) {
                button.textBox.innerHTML = `<span>${
                    (btn.list as any)[currentValue]
                }</span>`;

                (button.textBox.firstChild as HTMLElement).classList.add(
                    'jodit_icon'
                );
                btn.data.currentValue = currentValue;
            }
        }

        return false;
    },
    exec: (editor: IJodit, event, control: IControlType) => {
        editor.execCommand(
            control.command as string,
            false,
            control.args ? control.args[0] : undefined
        );
    },
    data: {
        currentValue: 'left',
    },
    list: {
        p: 'Normal',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        h4: 'Heading 4',
        blockquote: 'Quote',
    },
    isActiveChild: (editor: IJodit, control: IControlType): boolean => {
        const current: Node | false = editor.selection.current();

        if (current) {
            const currentBox: HTMLElement = Dom.closest(
                current,
                node => Dom.isBlock(node, editor.editorWindow),
                editor.editor
            ) as HTMLElement;

            return (
                currentBox &&
                currentBox !== editor.editor &&
                control.args !== undefined &&
                currentBox.nodeName.toLowerCase() === control.args[0]
            );
        }

        return false;
    },
    isActive: (editor: IJodit, control: IControlType): boolean => {
        const current: Node | false = editor.selection.current();

        if (current) {
            const currentBpx: HTMLElement = Dom.closest(
                current,
                node => Dom.isBlock(node, editor.editorWindow),
                editor.editor
            ) as HTMLElement;

            return (
                currentBpx &&
                currentBpx !== editor.editor &&
                control.list !== undefined &&
                currentBpx.nodeName.toLowerCase() !== 'p' &&
                ((control.list as any)[
                    currentBpx.nodeName.toLowerCase()
                ] as any) !== undefined
            );
        }

        return false;
    },
    template: (editor: IJodit, key: string, value: string) => {
        return (
            '<' +
            key +
            ' class="jodit_list_element"><span>' +
            editor.i18n(value) +
            '</span></' +
            key +
            '></li>'
        );
    },
    tooltip: 'Insert format block',
} as IControlType;

/**
 * Process command - `formatblock`
 *
 * @param {Jodit} editor
 */
export function formatBlock(editor: IJodit) {
    editor.registerCommand(
        'formatblock',
        (command: string, second: string, third: string): false | void => {
            editor.selection.focus();
            let work: boolean = false;

            editor.selection.eachSelection((current: Node) => {
                const selectionInfo: markerInfo[] = editor.selection.save();
                let currentBox: HTMLElement | false = current
                    ? (Dom.up(
                          current,
                          node => Dom.isBlock(node, editor.editorWindow),
                          editor.editor
                      ) as HTMLElement)
                    : false;

                if ((!currentBox || currentBox.nodeName === 'LI') && current) {
                    currentBox = Dom.wrapInline(
                        current,
                        editor.options.enter,
                        editor
                    );
                }

                if (!currentBox) {
                    editor.selection.restore(selectionInfo);
                    return;
                }

                if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
                    if (
                        third === editor.options.enterBlock.toLowerCase() &&
                        currentBox.parentNode &&
                        currentBox.parentNode.nodeName === 'LI'
                    ) {
                        Dom.unwrap(currentBox);
                    } else {
                        Dom.replace(
                            currentBox,
                            third,
                            true,
                            false,
                            editor.editorDocument
                        );
                    }
                } else {
                    if (!editor.selection.isCollapsed()) {
                        editor.selection.applyCSS({}, <HTMLTagNames>third);
                    } else {
                        Dom.wrapInline(current, <HTMLTagNames>third, editor);
                    }
                }

                work = true;
                editor.selection.restore(selectionInfo);
            });

            if (!work) {
                const currentBox: HTMLElement = editor.editorDocument.createElement(
                    third
                );
                currentBox.innerHTML = consts.INVISIBLE_SPACE;
                editor.selection.insertNode(currentBox, false);
                editor.selection.setCursorIn(currentBox);
            }

            editor.setEditorValue();

            return false;
        }
    );
}
