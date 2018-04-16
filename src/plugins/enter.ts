/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {$$, getRange, scrollIntoView} from "../modules/Helpers"
import * as consts from '../constants';
import {Dom} from "../modules/Dom";

/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @param {CSSStyleSheet} [style]
 * @return {HTMLElement}
 */
export const insertParagraph = (editor: Jodit, fake ?: Text | false, wrapperTag ?: string, style?: CSSStyleDeclaration): HTMLElement => {
    if (!wrapperTag) {
        wrapperTag = editor.options.enter.toLowerCase();
    }

    const p: HTMLElement = editor.editorDocument.createElement(wrapperTag),
        helper_node: HTMLBRElement = editor.editorDocument.createElement('br');

    p.appendChild(helper_node);

    if (style && style.cssText) {
        p.setAttribute('style', style.cssText);
    }

    editor.selection.insertNode(p, false, false);
    editor.selection.setCursorBefore(helper_node);

    const range: Range = editor.editorDocument.createRange();
    range.setStartBefore(helper_node);
    range.collapse(true);

    editor.selection.selectRange(range);

    if (fake && fake.parentNode) {
        fake.parentNode.removeChild(fake);
    }

    scrollIntoView(p, editor.editor, editor.editorDocument);

    editor.events && editor.events.fire('synchro'); // fire change

    return p;
};

/**
 * One of most important core plugins. It is responsible for all the browsers to have the same effect when the Enter button is pressed. By default, it should insert the <p>
 */
export function enter(editor: Jodit) {
    editor.events.on('keydown', (event: KeyboardEvent): false | void => {
        if (event.which === consts.KEY_ENTER) {
            /**
             * Fired on processing `Enter` key. If return some value, plugin `enter` will do nothing. if return false - prevent default Enter behavior
             *
             * @event beforeEnter
             */
            const beforeEnter = editor.events.fire('beforeEnter', event);

            if (beforeEnter !== undefined) {
                return beforeEnter;
            }

            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
            }

            editor.selection.focus();

            let current: Node = <Node>editor.selection.current(false);

            const sel: Selection = editor.editorWindow.getSelection();

            let range: Range = sel.rangeCount ? sel.getRangeAt(0) : editor.editorDocument.createRange();

            if (!current || current === editor.editor) {
                editor.selection.current();

                current = editor.editorDocument.createTextNode(consts.INVISIBLE_SPACE);

                if (sel.rangeCount) {
                    range.insertNode(current);
                } else {
                    editor.editor.appendChild(current);
                }

                range.selectNode(current);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }


            let currentBox: HTMLElement | false = current ? <HTMLElement>Dom.up(current, Dom.isBlock, editor.editor) : false;

            // if use <br> tag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
            if (editor.options.enter.toLowerCase() === consts.BR.toLowerCase() || event.shiftKey || Dom.closest(current, 'PRE|BLOCKQUOTE', editor.editor)) {
                const br: HTMLBRElement = editor.editorDocument.createElement('br');
                editor.selection.insertNode(br, true);
                scrollIntoView(br, editor.editor, editor.editorDocument);
                return false;
            }

            // wrap no wrapped element
            if (!currentBox && current && !Dom.prev(current, (elm: Node | null) => (Dom.isBlock(elm) || (!!elm && Dom.isImage(elm, editor.ownerWindow))), editor.editor)) {
                let needWrap: Node = current;

                Dom.up(needWrap, (node: Node) => {
                    if (node && node.hasChildNodes() && node !== editor.editor) {
                        needWrap = node;
                    }
                }, editor.editor);

                currentBox = Dom.wrapInline(needWrap, editor.options.enter, editor);

                if (Dom.isEmpty(currentBox)) {
                    const helper_node: HTMLBRElement = editor.editorDocument.createElement('br');

                    currentBox.appendChild(helper_node);
                    editor.selection.setCursorBefore(helper_node);
                }

                range = sel.rangeCount ? sel.getRangeAt(0) : editor.editorDocument.createRange();
            }

            let isLi: boolean = false,
                fake: Text | false = false,
                insertNew: boolean = false;

            if (currentBox) {
                if (!Dom.canSplitBlock(currentBox, editor.editorWindow)) {
                    const br: HTMLBRElement = editor.editorDocument.createElement('br');
                    editor.selection.insertNode(br, false);
                    editor.selection.setCursorAfter(br);
                    return false;
                }


                isLi = currentBox.nodeName === 'LI';
                if (isLi) {
                    if (Dom.isEmpty(currentBox)) {
                        let fake: Text | false = false;
                        const ul: HTMLUListElement = <HTMLUListElement>Dom.closest(currentBox, 'ol|ul', editor.editor);
                        // If there is no LI element before
                        if (!Dom.prev(currentBox, (elm: Node | null) => elm && elm.nodeName === 'LI', ul)) {
                            fake = editor.selection.setCursorBefore(ul);
                            // If there is no LI element after
                        } else if (!Dom.next(currentBox, (elm: Node | null) => elm && elm.nodeName === 'LI', ul)) {
                            fake = editor.selection.setCursorAfter(ul);
                        } else {
                            let leftRange = editor.editorDocument.createRange();
                            leftRange.setStartBefore(ul);
                            leftRange.setEndAfter(currentBox);
                            let fragment: DocumentFragment = leftRange.extractContents();
                            if (ul.parentNode) {
                                ul.parentNode.insertBefore(fragment, ul);
                            }
                            fake = editor.selection.setCursorBefore(ul);
                        }

                        if (currentBox.parentNode) {
                            currentBox.parentNode.removeChild(currentBox);
                        }

                        insertParagraph(editor, fake);

                        if (!$$('li', ul).length && ul.parentNode) {
                            ul.parentNode.removeChild(ul);
                        }
                        return false;

                    }
                }


                if (editor.selection.cursorInTheEdge(true, currentBox)) {
                    // if we are in the left edge of paragraph
                    fake = editor.selection.setCursorBefore(currentBox);
                    insertParagraph(editor, fake, isLi ? 'li' : editor.options.enter, currentBox.style);
                    editor.selection.setCursorIn(currentBox, true);
                    return false;
                }

                if (editor.selection.cursorInTheEdge(false, currentBox) === false) {
                    // if we are not in right edge of paragraph
                    // split p,h1 etc on two parts
                    const leftRange: Range = editor.editorDocument.createRange();

                    leftRange.setStartBefore(currentBox);
                    leftRange.setEnd(range.startContainer, range.startOffset);

                    const fragment: DocumentFragment = leftRange.extractContents();

                    if (currentBox.parentNode) {
                        currentBox.parentNode.insertBefore(fragment, currentBox);
                    }

                    editor.selection.setCursorIn(currentBox, true);
                } else {
                    fake = editor.selection.setCursorAfter(currentBox);
                }
            } else {
                insertNew = true;
            }

            if (insertNew || fake) {
                insertParagraph(editor, fake, isLi ? 'li' : editor.options.enter, currentBox ? currentBox.style : void(0));
            }

            return false;
        }
    });
}