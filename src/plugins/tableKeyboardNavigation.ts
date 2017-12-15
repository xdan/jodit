/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit        from '../Jodit';
import * as consts  from '../constants';
import Table        from '../modules/Table'
import Dom          from "../modules/Dom";

/**
 * Process navigate keypressing in table cell
 *
 * @param {Jodit} editor
 */
export function tableKeyboardNavigation(editor: Jodit) {
    editor.events.on('keydown', (event: KeyboardEvent) => {
        let current: Element,
            block: HTMLElement;

        if (
            event.which === consts.KEY_TAB ||
            event.which === consts.KEY_LEFT ||
            event.which === consts.KEY_RIGHT ||
            event.which === consts.KEY_TOP ||
            event.which === consts.KEY_BOTTOM
        ) {
            current = <Element>editor.selection.current();
            block = <HTMLTableCellElement>Dom.up(current, (elm) => (elm && elm['tagName'] && /^td|th$/i.test(elm['tagName'])), editor.editor);
            if (!block) {
                return;
            }

            const sel: Selection = editor.editorWindow.getSelection(),
                range: Range = sel.rangeCount ? sel.getRangeAt(0) : editor.editorDocument.createRange();

            if (event.which !== consts.KEY_TAB && current !== block) {
                if (((event.which === consts.KEY_LEFT || event.which === consts.KEY_TOP) &&
                        (Dom.prev(current, (elm) => (event.which === consts.KEY_TOP ? (elm && elm['tagName'] === 'BR') : !!elm), block) || (event.which !== consts.KEY_TOP && current.nodeType === Node.TEXT_NODE && range.startOffset !== 0))
                    ) || ((event.which === consts.KEY_RIGHT || event.which === consts.KEY_BOTTOM) &&
                        (Dom.next(current, (elm) => (event.which === consts.KEY_BOTTOM ? (elm && elm['tagName'] === 'BR') : !!elm), block) || (event.which !== consts.KEY_BOTTOM && current.nodeType === Node.TEXT_NODE && range.startOffset !== current.nodeValue.length))
                    )) {
                    return;
                }
            }

        } else {
            return;
        }


         const table = <HTMLTableElement>Dom.up(block, (elm) => (elm && /^table$/i.test(elm.tagName)), editor.editor);
         let next: HTMLTableCellElement;

        switch (event.which) {
            case consts.KEY_TAB:
            // case consts.KEY_RIGHT:
            case consts.KEY_LEFT:
                const sibling: string = (event.which === consts.KEY_LEFT || event.shiftKey) ? 'prev' : 'next';
                next = <HTMLTableCellElement>Dom[sibling](block, (elm) => (elm && /^td|th$/i.test((<HTMLElement>elm).tagName)), table);
                if (!next) {
                    Table.appendRow(table, sibling === 'next' ? false : <HTMLTableRowElement>table.querySelector('tr'), sibling === 'next');
                    next = <HTMLTableCellElement>(Dom[sibling](block, (elm: HTMLElement) => (elm && Dom.isCell(elm, editor.editorWindow)), table));
                }
            break;
            case consts.KEY_TOP:
            case consts.KEY_BOTTOM: {
                let i = 0, j = 0, matrix = Table.formalMatrix(table, (elm, _i, _j) => {
                    if (elm === block) {
                        i = _i;
                        j = _j;
                    }
                });
                if (event.which === consts.KEY_TOP) {
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
                next.appendChild(Dom.create('br', '', editor.editorDocument));
                editor.selection.setCursorBefore(next.firstChild);
            } else {
                if (event.which === consts.KEY_TAB) {
                    editor.selection.select(next, true)
                } else {
                    editor.selection.setCursorIn(next, event.which === consts.KEY_RIGHT || event.which === consts.KEY_BOTTOM)
                }
            }
            return false;
        }

    });
}