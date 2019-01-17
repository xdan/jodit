/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import * as consts from '../constants';
import { Dom } from '../modules/Dom';
import { $$, scrollIntoView } from '../modules/helpers/';
import { HTMLTagNames, IJodit } from '../types';

/**
 * Insert default paragraph
 *
 * @param {Jodit} editor
 * @param {Node} [fake]
 * @param {String} [wrapperTag]
 * @param {CSSStyleSheet} [style]
 * @return {HTMLElement}
 */
export const insertParagraph = (
    editor: IJodit,
    fake: Text | false,
    wrapperTag: HTMLTagNames,
    style?: CSSStyleDeclaration
): HTMLElement => {
    const p: HTMLElement = editor.create.inside.element(wrapperTag),
        helper_node: HTMLBRElement = editor.create.inside.element('br');

    p.appendChild(helper_node);

    if (style && style.cssText) {
        p.setAttribute('style', style.cssText);
    }

    editor.selection.insertNode(p, false, false);
    editor.selection.setCursorBefore(helper_node);

    const range: Range = editor.editorDocument.createRange();

    range.setStartBefore(wrapperTag.toLowerCase() !== 'br' ? helper_node : p);
    range.collapse(true);

    editor.selection.selectRange(range);

    Dom.safeRemove(fake);

    scrollIntoView(p, editor.editor, editor.editorDocument);

    editor.events && editor.events.fire('synchro'); // fire change

    return p;
};

/**
 * One of most important core plugins. It is responsible for all the browsers to have the same effect when the Enter
 * button is pressed. By default, it should insert the <p>
 */
export function enter(editor: IJodit) {
    // use 'enter' option if no set
    if (!editor.options.enterBlock) {
        editor.options.enterBlock =
            editor.options.enter.toLowerCase() === 'br'
                ? consts.PARAGRAPH
                : (editor.options.enter.toLowerCase() as 'p' | 'div');
    }

    editor.events.on(
        'keydown',
        (event: KeyboardEvent): false | void => {
            if (event.which === consts.KEY_ENTER) {
                /**
                 * Fired on processing `Enter` key. If return some value, plugin `enter` will do nothing.
                 * if return false - prevent default Enter behavior
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

                let current: Node = editor.selection.current(false) as Node;

                const sel: Selection = editor.editorWindow.getSelection();

                let range: Range = sel.rangeCount
                    ? sel.getRangeAt(0)
                    : editor.editorDocument.createRange();

                if (!current || current === editor.editor) {
                    editor.selection.current();

                    current = editor.create.inside.text(consts.INVISIBLE_SPACE);

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

                let currentBox: HTMLElement | false = current
                    ? (Dom.up(
                          current,
                          node => Dom.isBlock(node, editor.editorWindow),
                          editor.editor
                      ) as HTMLElement)
                    : false;
                const isLi: boolean =
                    currentBox && currentBox.nodeName === 'LI';

                // if use <br> tag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
                if (
                    !isLi &&
                    (editor.options.enter.toLowerCase() ===
                        consts.BR.toLowerCase() ||
                        event.shiftKey ||
                        Dom.closest(current, 'PRE|BLOCKQUOTE', editor.editor))
                ) {
                    const br: HTMLBRElement = editor.create.inside.element(
                        'br'
                    );

                    editor.selection.insertNode(br, true);
                    scrollIntoView(br, editor.editor, editor.editorDocument);

                    return false;
                }

                // wrap no wrapped element
                if (
                    !currentBox &&
                    current &&
                    !Dom.prev(
                        current,
                        (elm: Node | null) =>
                            Dom.isBlock(elm, editor.editorWindow) ||
                            (!!elm && Dom.isImage(elm, editor.editorWindow)),
                        editor.editor
                    )
                ) {
                    let needWrap: Node = current;

                    Dom.up(
                        needWrap,
                        node => {
                            if (
                                node &&
                                node.hasChildNodes() &&
                                node !== editor.editor
                            ) {
                                needWrap = node;
                            }
                        },
                        editor.editor
                    );

                    currentBox = Dom.wrapInline(
                        needWrap,
                        editor.options.enter,
                        editor
                    );

                    if (Dom.isEmpty(currentBox)) {
                        const helper_node: HTMLBRElement = editor.editorDocument.createElement(
                            'br'
                        );

                        currentBox.appendChild(helper_node);
                        editor.selection.setCursorBefore(helper_node);
                    }

                    range = sel.rangeCount
                        ? sel.getRangeAt(0)
                        : editor.editorDocument.createRange();
                }

                let fake: Text | false = false,
                    insertNew: boolean = false;

                if (currentBox) {
                    if (!Dom.canSplitBlock(currentBox, editor.editorWindow)) {
                        const br = editor.create.inside.element('br');

                        editor.selection.insertNode(br, false);
                        editor.selection.setCursorAfter(br);

                        return false;
                    }

                    if (isLi) {
                        if (Dom.isEmpty(currentBox)) {
                            let fakeTextNode: Text | false = false;

                            const ul: HTMLUListElement = Dom.closest(
                                currentBox,
                                'ol|ul',
                                editor.editor
                            ) as HTMLUListElement;

                            // If there is no LI element before
                            if (
                                !Dom.prev(
                                    currentBox,
                                    (elm: Node | null) =>
                                        elm && elm.nodeName === 'LI',
                                    ul
                                )
                            ) {
                                fakeTextNode = editor.selection.setCursorBefore(
                                    ul
                                );
                                // If there is no LI element after
                            } else if (
                                !Dom.next(
                                    currentBox,
                                    (elm: Node | null) =>
                                        elm && elm.nodeName === 'LI',
                                    ul
                                )
                            ) {
                                fakeTextNode = editor.selection.setCursorAfter(
                                    ul
                                );
                            } else {
                                const leftRange = editor.editorDocument.createRange();
                                leftRange.setStartBefore(ul);
                                leftRange.setEndAfter(currentBox);
                                const fragment: DocumentFragment = leftRange.extractContents();
                                if (ul.parentNode) {
                                    ul.parentNode.insertBefore(fragment, ul);
                                }
                                fakeTextNode = editor.selection.setCursorBefore(
                                    ul
                                );
                            }

                            Dom.safeRemove(currentBox);

                            insertParagraph(
                                editor,
                                fakeTextNode,
                                editor.options.enter
                            );

                            if (!$$('li', ul).length) {
                                Dom.safeRemove(ul);
                            }

                            return false;
                        }
                    }

                    if (editor.selection.cursorInTheEdge(true, currentBox)) {
                        // if we are in the left edge of paragraph
                        fake = editor.selection.setCursorBefore(currentBox);

                        insertParagraph(
                            editor,
                            fake,
                            isLi ? 'li' : editor.options.enter,
                            currentBox.style
                        );

                        currentBox &&
                            editor.selection.setCursorIn(currentBox, true);

                        return false;
                    }

                    if (
                        editor.selection.cursorInTheEdge(false, currentBox) ===
                        false
                    ) {
                        // if we are not in right edge of paragraph
                        // split p,h1 etc on two parts
                        const leftRange: Range = editor.editorDocument.createRange();

                        leftRange.setStartBefore(currentBox);
                        leftRange.setEnd(
                            range.startContainer,
                            range.startOffset
                        );

                        const fragment: DocumentFragment = leftRange.extractContents();

                        if (currentBox.parentNode) {
                            currentBox.parentNode.insertBefore(
                                fragment,
                                currentBox
                            );
                        }

                        editor.selection.setCursorIn(currentBox, true);
                    } else {
                        fake = editor.selection.setCursorAfter(currentBox);
                    }
                } else {
                    insertNew = true;
                }

                if (insertNew || fake) {
                    insertParagraph(
                        editor,
                        fake,
                        isLi ? 'li' : editor.options.enter,
                        currentBox ? currentBox.style : void 0
                    );
                }

                return false;
            }
        }
    );
}
