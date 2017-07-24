import Jodit from '../Jodit';
import * as consts from '../constants';
import Table from '../modules/Table'
import Dom from "../modules/Dom";

/**
 *
 * @param {Jodit} editor
 */
Jodit.plugins.tableKeyboardNavigation = function (editor: Jodit) {
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

            const sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();

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
            case consts.KEY_RIGHT:
            case consts.KEY_LEFT: {
                const sibling = (event.which === consts.KEY_LEFT || event.shiftKey) ? 'prev' : 'next';
                next = <HTMLTableCellElement>Dom[sibling](block, (elm) => (elm && /^td|th$/i.test((<HTMLElement>elm).tagName)), table);
                if (!next) {
                    const proc = new Table(editor);
                    proc.appendRow(table, sibling === 'next' ? false : table.querySelector('tr'), sibling === 'next');
                    next = <HTMLTableCellElement>(Dom[sibling](block, (elm: HTMLElement) => (elm && /^td|th$/i.test((<HTMLElement>elm).tagName)), table));
                }
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
                next.appendChild(Dom.create('br', '', editor.doc));
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
};