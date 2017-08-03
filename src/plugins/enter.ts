import Jodit from '../Jodit';
import {trim,$$} from "../modules/Helpers"
import * as consts from '../constants';
import Dom from "../modules/Dom";
/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @return {Element}
 */
export const insertParagraph = (editor: Jodit, fake ?: Node, wrapperTag ?: string) => {
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


Jodit.plugins.enter = function (editor: Jodit) {
    editor.events.on('keyup', () => {
        let current: false|Node = editor.selection.current();
        if (current !== false) {
            let currentParagraph = Dom.up(current, (node: HTMLElement) => (node.tagName === editor.options.enter.toUpperCase()), editor.editor);
            if (currentParagraph) {
                Dom.all(currentParagraph, (node: Node) => {
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
    editor.events.on('keydown', (event: KeyboardEvent) => {
        if (event.which === consts.KEY_ENTER || event.keyCode === consts.KEY_ENTER) {
            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
            }
            editor.selection.focus();
            let current = editor.selection.current();

            let sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();

            if (!current) {
                current = Dom.create('text', consts.INVISIBLE_SPACE, editor.doc);
                editor.editor.appendChild(current);
                range.selectNode(current);
                sel.removeAllRanges();
                sel.addRange(range);
            }

            let fake;
            let currentBox: HTMLElement|false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

            if (!currentBox && current) {
                currentBox = Dom.wrap(current, editor.options.enter, editor);
                sel = editor.win.getSelection();
                range = sel.rangeCount ? sel.getRangeAt(0) : editor.doc.createRange();
            }

            if (currentBox) {
                if (!Dom.canSplitBlock(currentBox)) {
                    let br = editor.doc.createElement('br');
                    editor.selection.insertNode(br, false);
                    editor.selection.setCursorAfter(br);
                    return false;
                }

                if (currentBox.nodeName === 'LI') {
                    if (trim(currentBox.textContent || currentBox['innerText']).length === 0) {
                        const ul = <HTMLElement>Dom.closest(currentBox, 'ol|ul', editor.editor);
                        // If there is no LI element before
                        if (!Dom.prev(currentBox, (elm: HTMLElement) => elm && elm.tagName === 'LI', ul)) {
                            fake = editor.selection.setCursorBefore(ul);
                            // If there is no LI element after
                        } else if (!Dom.next(currentBox, (elm: HTMLElement) => elm && elm.tagName === 'LI', ul)) {
                            fake = editor.selection.setCursorAfter(ul);
                        } else {
                            let leftRange = editor.doc.createRange();
                            leftRange.setStartBefore(ul);
                            leftRange.setEndAfter(currentBox);
                            let fragment = leftRange.extractContents();
                            ul.parentNode.insertBefore(fragment, ul);
                            fake = editor.selection.setCursorBefore(ul);
                        }

                        currentBox.parentNode.removeChild(currentBox);
                        insertParagraph(editor, fake);
                        if (!$$('li', ul).length) {
                            ul.parentNode.removeChild(ul);
                        }
                        return false;

                    }
                }


                if (editor.selection.cursorInTheEdge(true, currentBox)) {
                    // if we are in the left edge of paragraph
                    fake = editor.selection.setCursorBefore(currentBox);
                    insertParagraph(editor, fake, currentBox.nodeName === 'LI' ? 'li' : editor.options.enter);
                    editor.selection.setCursorIn(currentBox, true);
                } else if (!editor.selection.cursorInTheEdge(false, currentBox)) {
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

            return false;
        }
    });
};