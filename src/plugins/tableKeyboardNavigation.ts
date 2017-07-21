import Jodit from '../Jodit';
import * as consts from '../constants';
import Table from '../modules/Table'

/**
 *
 * @param {Jodit} editor
 */
Jodit.plugins.tableKeyboardNavigation = function (editor) {
    editor.events.on('keydown', (event) => {
        let current, block;
        if (
            event.which === consts.KEY_TAB ||
            event.which === consts.KEY_LEFT ||
            event.which === consts.KEY_RIGHT ||
            event.which === consts.KEY_TOP ||
            event.which === consts.KEY_BOTTOM
        ) {
            current = editor.selection.current();
            block = editor.node.up(current, (elm) => (elm && /^td|th$/i.test(elm.tagName)));
            if (!block) {
                return;
            }

            let sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange()

            if (event.which !== consts.KEY_TAB && current !== block) {
                if (((event.which === consts.KEY_LEFT || event.which === consts.KEY_TOP) &&
                        (editor.node.prev(current, (elm) => (event.which === consts.KEY_TOP ? (elm && elm.tagName === 'BR') : elm), block) || (event.which !== consts.KEY_TOP && current.nodeType === Node.TEXT_NODE && range.startOffset !== 0))
                    ) || ((event.which === consts.KEY_RIGHT || event.which === consts.KEY_BOTTOM) &&
                        (editor.node.next(current, (elm) => (event.which === consts.KEY_BOTTOM ? (elm && elm.tagName === 'BR') : elm), block) || (event.which !== consts.KEY_BOTTOM && current.nodeType === Node.TEXT_NODE && range.startOffset !== current.nodeValue.length))
                    )) {
                    return;
                }
            }

        } else {
            return;
        }


        let table = editor.node.up(block, (elm) => (elm && /^table$/i.test(elm.tagName))),
            next;

        switch (event.which) {
            case consts.KEY_TAB:
            case consts.KEY_RIGHT:
            case consts.KEY_LEFT: {
                let sibling = (event.which === consts.KEY_LEFT || event.shiftKey) ? 'prev' : 'next';
                next = editor.node[sibling](block, (elm) => (elm && /^td|th$/i.test(elm.tagName)), table);
                if (!next) {
                    let proc = new Table(editor);
                    proc.appendRow(table, sibling === 'next' ? false : table.querySelector('tr'), sibling === 'next');
                    next = editor.node[sibling](block, (elm) => (elm && /^td|th$/i.test(elm.tagName)), table);
                }
            }
            break;
            case consts.KEY_TOP:
            case consts.KEY_BOTTOM: {
                let proc = new Table(editor);
                let i = 0, j = 0, matrix = proc.formalMatrix(table, (elm, _i, _j) => {
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
                next.appendChild(editor.node.create('br'))
                editor.selection.setCursorBefore(next.firstChild)
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