/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit}        from '../Jodit';
import * as consts  from '../constants';
import {Table, Dom}        from '../modules/index'


/**
 * Process navigate keypressing in table cell
 *
 * @param {Jodit} editor
 */
export function tableKeyboardNavigation(editor: Jodit) {
    editor.events.on('keydown', (event: KeyboardEvent): false | void => {
        let current: Element,
            block: HTMLElement;

        if (
            event.which === consts.KEY_TAB ||
            event.which === consts.KEY_LEFT ||
            event.which === consts.KEY_RIGHT ||
            event.which === consts.KEY_UP ||
            event.which === consts.KEY_DOWN
        ) {
            current = <Element>editor.selection.current();
            block = <HTMLTableCellElement>Dom.up(current, (elm: Node | false) => (elm && elm.nodeName && /^td|th$/i.test(elm.nodeName)), editor.editor);
            if (!block) {
                return;
            }

            const sel: Selection = editor.editorWindow.getSelection(),
                range: Range = sel.rangeCount ? sel.getRangeAt(0) : editor.editorDocument.createRange();

            if (event.which !== consts.KEY_TAB && current !== block) {
                if (((event.which === consts.KEY_LEFT || event.which === consts.KEY_UP) &&
                        (Dom.prev(current, (elm: Node | null) => (event.which === consts.KEY_UP ? (elm && elm.nodeName === 'BR') : !!elm), block) || (event.which !== consts.KEY_UP && current.nodeType === Node.TEXT_NODE && range.startOffset !== 0))
                    ) || ((event.which === consts.KEY_RIGHT || event.which === consts.KEY_DOWN) &&
                        (Dom.next(current, (elm: Node | null) => (event.which === consts.KEY_DOWN ? (elm && elm.nodeName === 'BR') : !!elm), block) || (event.which !== consts.KEY_DOWN && current.nodeType === Node.TEXT_NODE && current.nodeValue && range.startOffset !== current.nodeValue.length))
                    )) {
                    return;
                }
            }

        } else {
            return;
        }


         const table = <HTMLTableElement>Dom.up(block, (elm: Node | null) => (elm && /^table$/i.test(elm.nodeName)), editor.editor);
         let next: HTMLTableCellElement|null = null;

        switch (event.which) {
            case consts.KEY_TAB:
            // case consts.KEY_RIGHT:
            case consts.KEY_LEFT:
                const sibling: string = (event.which === consts.KEY_LEFT || event.shiftKey) ? 'prev' : 'next';
                next = <HTMLTableCellElement>(<any>Dom)[sibling](block, (elm: Node | null) => (elm && /^td|th$/i.test((<HTMLElement>elm).tagName)), table);
                if (!next) {
                    Table.appendRow(table, sibling === 'next' ? false : <HTMLTableRowElement>table.querySelector('tr'), sibling === 'next');
                    next = <HTMLTableCellElement>(<any>Dom)[sibling](block, (elm: Node | null) => (elm && Dom.isCell(elm, editor.editorWindow)), table);
                }
            break;
            case consts.KEY_UP:
            case consts.KEY_DOWN: {
                let i = 0, j = 0, matrix = Table.formalMatrix(table, (elm, _i, _j) => {
                    if (elm === block) {
                        i = _i;
                        j = _j;
                    }
                });
                if (event.which === consts.KEY_UP) {
                    if (matrix[i - 1] !== undefined) {
                        next = matrix[i - 1][j];
                    }
                } else {
                    if (matrix[i + 1] !== undefined) {
                        next = matrix[i + 1][j];
                    }
                }
            }
            break;
        }

        if (next) {
            if (!next.firstChild) {
                let first: Node = editor.editorDocument.createElement('br');
                next.appendChild(first);
                editor.selection.setCursorBefore(first);
            } else {
                if (event.which === consts.KEY_TAB) {
                    editor.selection.select(next, true)
                } else {
                    editor.selection.setCursorIn(next, event.which === consts.KEY_RIGHT || event.which === consts.KEY_DOWN)
                }
            }
            return false;
        }

    });
}