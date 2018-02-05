/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import * as consts from '../constants';
import {trim} from '../modules/Helpers';
import {Dom} from "../modules/Dom";

/**
 * Plug-in process entering Backspace key
 *
 * @module backspace
 */
export function backspace(editor: Jodit) {

    editor.events.on('afterCommand', (command: string) => {
        if (command === 'delete') {
            let current = editor.selection.current();
            if (current && current.firstChild && current.firstChild.nodeName ==='BR') {
                current.removeChild(current.firstChild);
            }
            if (!trim(editor.editor.innerText) && !editor.editor.querySelector('img')) {
                editor.editor.innerHTML = '';
                editor.selection.setCursorIn(editor.editor);
            }
        }
    });

    editor.events.on('keydown', (event: KeyboardEvent): false | void => {
        if (event.which === consts.KEY_BACKSPACE || event.keyCode === consts.KEY_DELETE) {
            const toLeft: boolean = event.which === consts.KEY_BACKSPACE;

            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
                return false;
            }

            const sel: Selection = editor.editorWindow.getSelection(),
                range: Range|false = sel.rangeCount ? sel.getRangeAt(0) : false;

            if (range) {
                const textNode: Node = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer : range.startContainer.childNodes[range.startOffset];
                const startOffsetInRange: number = range.startContainer.nodeType === Node.TEXT_NODE ? range.startOffset : 0;
                let startOffset: number = startOffsetInRange;

                if (!Dom.isOrContains(editor.editor, textNode) || textNode === editor.editor) {
                    return;
                }

                if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.nodeValue) {
                    let value: string = textNode.nodeValue,
                        increment: number = toLeft ? -1 : 1;

                    while (startOffset >= 0 && startOffset <= value.length && value[startOffset + increment] === consts.INVISIBLE_SPACE) {
                        startOffset += increment;
                    }

                    if (startOffset !== startOffsetInRange) {
                        if (toLeft) {
                            value = value.substr(0, startOffset) + value.substr(startOffsetInRange);
                        } else {
                            value = value.substr(0, startOffsetInRange) + value.substr(startOffset);
                        }

                        textNode.nodeValue = value;
                        if (value) {
                            range.setStart(textNode, startOffset);
                            return;
                        }
                    }
                }

                if (startOffset === 0 && toLeft && textNode) {
                    const prevBox: Node | false = Dom.prev(textNode, Dom.isBlock, editor.editor);

                    if (prevBox) {
                        editor.selection.setCursorIn(prevBox, false);
                    }

                    try {
                        const container: HTMLElement | null = <HTMLElement | null>Dom.up(range.startContainer, Dom.isBlock, editor.editor);

                        if (container) {
                            const html: string = container.innerHTML.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
                            if ((!html.length || html == '<br>') && !Dom.isCell(container, editor.editorWindow) && container.parentNode && container !== editor.editor) {
                                container.parentNode.removeChild(container);

                                return false;
                            }
                        }
                    } finally {
                        // Ul near with UL
                        if (prevBox && prevBox.nodeName === 'LI') {
                            const UL: Node | false = Dom.closest(prevBox, 'Ul|OL', editor.editor);
                            if (UL) {
                                const nextBox: Node | null = UL.nextSibling;
                                if (nextBox && nextBox.nodeName === UL.nodeName) {
                                    [].slice.call(nextBox.childNodes).forEach(function (node: HTMLLIElement) {
                                        UL.appendChild(node);
                                    });
                                    nextBox.parentNode && nextBox.parentNode.removeChild(nextBox);
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}