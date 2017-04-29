import Jodit from '../jodit';
import {trim} from "../modules/Helpers"
import * as consts from '../constants';
/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @return {Element}
 */
export const insertParagraph = (editor, fake ?: Node, wrapperTag ?: string) => {
    if (!wrapperTag) {
        wrapperTag = editor.options.enter;
    }

    let p = editor.doc.createElement(wrapperTag),
        helper_node = editor.doc.createTextNode(consts.INVISIBLE_SPACE);

    p.appendChild(helper_node);
    editor.selection.insertNode(p, false);
    editor.selection.setCursorIn(p);

    if (fake && fake.parentNode) {
        fake.parentNode.removeChild(fake);
    }
    return p;
};
/**
 *
 * @param {Node} current
 * @param {Range} range
 * @param {Jodit} editor
 * @return {Element}
 */
export const wrap = (current, range, editor): HTMLElement => {
    let tmp, first = current, last = current, offset = range.startOffset;
    do {
        tmp = editor.node.prev(first, (elm) => (elm && !editor.node.isBlock(elm)), undefined, false);
        if (tmp) {
            first = tmp;
        }
    } while(tmp);
    do {
        tmp = editor.node.next(last, (elm) => (elm && !editor.node.isBlock(elm)), undefined, false);
        if (tmp) {
            last = tmp;
        }
    } while(tmp);

    let newRange = editor.doc.createRange();
    newRange.setStartBefore(first);
    newRange.setEndAfter(last);
    let fragment = newRange.extractContents();

    let p = insertParagraph(editor);
    if (fragment.textContent){
        p.removeChild(p.firstChild);
        p.appendChild(fragment);
    }


    let sel = editor.win.getSelection()
    range = editor.doc.createRange();

    range.setStart(current, offset);
    sel.removeAllRanges();
    sel.addRange(range);

    return p;
}

Jodit.plugins.enter = function (editor: Jodit) {
    editor.events.on('keyup', () => {
        let current = editor.selection.current();
        if (current !== false) {
            let currentParagraph = editor.node.up(current, (node) => (node.tagName === 'P'));
            if (currentParagraph) {
                editor.node.all(currentParagraph, (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (consts.INVISIBLE_SPACE_REG_EXP.test(node.nodeValue) && node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '').length !== 0) {
                            node.nodeValue = node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
                            if (node === current) {
                                editor.selection.setCursorAfter(node);
                            }
                        }
                    }
                });
            }
        }
    });
    editor.events.on('keydown', (event) => {
        if (event.which === consts.KEY_ENTER || event.keyCode === consts.KEY_ENTER) {
            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
            }
            editor.selection.focus();
            let current = editor.selection.current();

            let sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();

            if (!current) {
                current = editor.node.create('text', consts.INVISIBLE_SPACE);
                editor.editor.appendChild(current);
                range.selectNode(current);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            let fake;
            let currentBox = current ? editor.node.up(current, (node) => (editor.node.isBlock(node))) : false;

            if (!currentBox && current) {
                currentBox = wrap(current, range, editor);
                sel = editor.win.getSelection();
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();
            }
            if (currentBox) {
                if (!editor.node.canSplitBlock(currentBox)) {
                    let br = editor.doc.createElement('br');
                    editor.selection.insertNode(br, false);
                    editor.selection.setCursorAfter(br)
                    return false;
                }

                if (currentBox.nodeName === 'LI') {
                    if (trim(currentBox.textContent || currentBox['innerText']).length === 0) {
                        fake = editor.selection.setCursorAfter(editor.node.closest(currentBox, 'ol|ul') || currentBox);
                        currentBox.parentNode.removeChild(currentBox);
                        insertParagraph(editor, fake);
                        return false;
                    }
                }

                //if (!editor.node.prev(current, (elm) => (elm), currentBox) && (current.nodeType !== Node.TEXT_NODE || range.startOffset === 0)) {
                if (editor.selection.cursorInEdge(true)) {
                    // if we are in the left edge of paragraph
                    fake = editor.selection.setCursorBefore(currentBox);
                    insertParagraph(editor, fake);
                    editor.selection.setCursorIn(currentBox, true);
                //} else if ((editor.node.next(current, (elm) => (elm && elm.tagName !== 'BR' && (elm.nodeType !== Node.TEXT_NODE || trim(elm.nodeValue).length)), currentBox)) || (current.nodeType === Node.TEXT_NODE && range.startOffset !== current.nodeValue.length)) {
                } else if (!editor.selection.cursorInEdge(false)) {
                    // if we are not in right edge of paragraph
                    // split p,h1 etc on two parts
                    let leftRange = editor.doc.createRange();

                    leftRange.setStartBefore(currentBox);
                    leftRange.setEnd(range.startContainer, range.startOffset);
                    let fragment = leftRange.extractContents();
                    currentBox.parentNode.insertBefore(fragment, currentBox);

                    editor.selection.setCursorIn(currentBox, true);
                } else {
                    fake = editor.selection.setCursorAfter(currentBox);
                    insertParagraph(editor, fake,  currentBox.nodeName === 'LI' ? 'li' : editor.options.enter);
                }
            } else {
                insertParagraph(editor);
            }


                /*if (current.nodeType === Node.TEXT_NODE) {
                    let position = !range.startOffset ? -1 : ((current.nodeValue.length - range.startOffset) ? 0 : 1);
                    let leftRange = jodit.doc.createRange();

                    leftRange.setStart(current, 0);
                    leftRange.setEnd(current, range.startOffset);
                    let fragment = leftRange.extractContents();
                    let p = insertParagraph();
                    if (fragment.textContent){
                        p.removeChild(p.firstChild);
                        p.appendChild(fragment);
                    }

                    let fake2;
                    if (position>0) {
                        fake2 = jodit.selection.setCursorAfter(p);
                    }

                    let fragment2;
                    if (position <= 0) {
                        let rightRange = jodit.doc.createRange();
                        if (p.nextSibling) {
                            rightRange.selectNode(p.nextSibling);
                        } else {
                            rightRange.setEndAfter(p);
                        }
                        sel.removeAllRanges();
                        sel.addRange(rightRange);

                        fragment2 = rightRange.extractContents();
                    }

                    let p2 = insertParagraph();

                    if (fake2 && fake2.parentNode) {
                        fake2.parentNode.removeChild(fake2);
                    }

                    if (fragment2 && fragment2.textContent) {
                        p2.removeChild(p2.firstChild);
                        p2.appendChild(fragment2);
                    }

                    jodit.selection.setCursorIn(p2, true);
                } else {
                    insertParagraph();
                }*/

            //helper_node.parentNode.removeChild(helper_node)
            return false;
        }
    });
}