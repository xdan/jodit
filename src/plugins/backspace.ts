/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import * as consts from '../constants';
import {css, trim} from '../modules/Helpers';
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
    const removeEmptyBlocks = (container: HTMLElement) => {
        let box: HTMLElement | null = container, parent: Node | null;
        do {
            const html: string = box.innerHTML.replace(consts.INVISIBLE_SPACE_REG_EXP, '');

            if ((!html.length || html === '<br>') && !Dom.isCell(box, editor.editorWindow) && box.parentNode && container !== editor.editor) {
                parent = box.parentNode;
                box.parentNode.removeChild(box);
            } else {
                break;
            }

            box = <HTMLElement | null>parent;
        } while (box && box !== editor.editor);
    };
    const removeChar = (box: {node : Node | null}, toLeft: boolean, range: Range) :  void | false => {
        if (box.node && box.node.nodeType === Node.TEXT_NODE && typeof box.node.nodeValue === 'string') {
            // remove invisible spaces
            let startOffset: number = toLeft ? box.node.nodeValue.length : 0;
            let startOffsetInRange: number = startOffset;
            let value: string = box.node.nodeValue,
                increment: number = toLeft ? -1 : 1;

            while (startOffset >= 0 && startOffset <= value.length && value[startOffset + (toLeft ? -1 : 0)] === consts.INVISIBLE_SPACE) {
                startOffset += increment;
            }

            if (startOffset !== startOffsetInRange) {
                if (toLeft) {
                    value = value.substr(0, startOffset) + value.substr(startOffsetInRange);
                } else {
                    value = value.substr(0, startOffsetInRange) + value.substr(startOffset);
                    startOffset = startOffsetInRange;
                }

                box.node.nodeValue = value;
            }

            range.setStart(box.node, startOffset);
            range.collapse(true);

            let nextElement: Node | null = toLeft ? box.node.previousSibling : box.node.nextSibling;

            if (value.length) {
                if (toLeft) {
                    if (startOffset) {
                        box.node.nodeValue = value.substr(0, startOffset - 1) + value.substr(startOffset);
                        if (!box.node.nodeValue.length) {
                            box.node.nodeValue = consts.INVISIBLE_SPACE;
                        }
                        range.setStart(box.node, startOffset - 1);
                        range.collapse(true);
                        return false;
                    }
                } else {
                    if (startOffset < value.length) {
                        box.node.nodeValue = value.substr(0, startOffset) + value.substr(startOffset + 1);
                        if (!box.node.nodeValue.length) {
                            box.node.nodeValue = consts.INVISIBLE_SPACE;
                        }
                        range.setStart(box.node, startOffset);
                        range.collapse(true);
                        return false;
                    }
                }
            } else {
                range.setStartBefore(box.node);
                range.collapse(true);

                box.node && box.node.parentNode && box.node.parentNode.removeChild(box.node);

                box.node = nextElement;
            }

            if (nextElement) {
                if (nextElement.nodeType === Node.ELEMENT_NODE && ['inline', 'inline-block'].indexOf(css(<HTMLElement>nextElement, 'display').toString()) !== -1) {
                    nextElement = toLeft ? nextElement.lastChild : nextElement.firstChild;
                }
                if (nextElement && nextElement.nodeType === Node.TEXT_NODE) {
                    box.node = nextElement;
                    return removeChar(box, toLeft, range);
                }
            }
        }
    };

    editor.events.on('keydown', (event: KeyboardEvent): false | void => {
        if (event.which === consts.KEY_BACKSPACE || event.keyCode === consts.KEY_DELETE) {
            const toLeft: boolean = event.which === consts.KEY_BACKSPACE;

            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
                return false;
            }

            const sel: Selection = editor.editorWindow.getSelection(),
                range: Range | false = sel.rangeCount ? sel.getRangeAt(0) : false;

            if (!range) {
                return false;
            }
            const fakeNode: Node = editor.ownerDocument.createTextNode(consts.INVISIBLE_SPACE);
            try {
                range.insertNode(fakeNode);

                let container: HTMLElement | null = <HTMLElement | null>Dom.up(fakeNode, Dom.isBlock, editor.editor);

                let workElement: Node | null;
                workElement = toLeft ? fakeNode.previousSibling : fakeNode.nextSibling;

                if (workElement) {
                    const box = {node: workElement};
                    if (removeChar(box, toLeft, range) === false) {
                        return false;
                    }


                    workElement = box.node || fakeNode.parentNode;

                    if (workElement === editor.editor) {
                        return false;
                    }

                    if (workElement && workElement.nodeName.match(/^(IMG|BR|IFRAME|SCRIPT|INPUT|TEXTAREA|TABLE|HR)$/)) {
                        workElement.parentNode && workElement.parentNode.removeChild(workElement);
                        return false;
                    }
                }

                if (container && container.nodeName.match(/^(TD)$/)) {
                    return false;
                }

                let prevBox: Node | false | null = toLeft ? Dom.prev(workElement || fakeNode, Dom.isBlock, editor.editor) : Dom.next(workElement || fakeNode, Dom.isBlock, editor.editor);

                if (!prevBox && container && container.parentNode) {
                    prevBox = editor.editorDocument.createElement(editor.options.enter);
                    let box: Node = container;

                    while (box && box.parentNode && box.parentNode !== editor.editor) {
                        box = box.parentNode;
                    }

                    box.parentNode && box.parentNode.insertBefore(prevBox, box);
                }

                prevBox && editor.selection.setCursorIn(prevBox, !toLeft);

                if (container) {
                    removeEmptyBlocks(container);

                    if (prevBox && container.parentNode) {
                        if (
                            container.nodeName === prevBox.nodeName &&
                            container.parentNode && prevBox.parentNode &&
                            container.parentNode !== editor.editor && prevBox.parentNode !== editor.editor &&
                            container.parentNode !== prevBox.parentNode &&
                            container.parentNode.nodeName === prevBox.parentNode.nodeName
                        ) {
                            container = <HTMLElement>container.parentNode;
                            prevBox = <HTMLElement>prevBox.parentNode;
                        }
                        Dom.moveContent(container, prevBox, !toLeft);
                    }

                    if (prevBox && prevBox.nodeName === 'LI') {
                        const UL: Node | false = Dom.closest(prevBox, 'Ul|OL', editor.editor);
                        if (UL) {
                            const nextBox: Node | null = UL.nextSibling;
                            if (nextBox && nextBox.nodeName === UL.nodeName && UL !== nextBox) {
                                Dom.moveContent(nextBox, UL, !toLeft);
                                nextBox.parentNode && nextBox.parentNode.removeChild(nextBox);
                            }
                        }
                    }

                    removeEmptyBlocks(container);

                    return false;
                }
            } finally {
                fakeNode.parentNode && fakeNode.parentNode.removeChild(fakeNode);
            }



            // let currentNode: Node | null = null,
            //     startOffset: number = 0;
            //
            // if (range.startContainer.nodeType === Node.TEXT_NODE) {
            //     currentNode = range.startContainer;
            //     startOffset = range.startOffset;
            // } else {
            //     if (toLeft) {
            //         currentNode = range.startContainer.childNodes[range.startOffset - 1];
            //         if (currentNode && currentNode.nodeType === Node.TEXT_NODE && currentNode.nodeValue) {
            //             startOffset = currentNode.nodeValue.length;
            //         }
            //     } else {
            //         currentNode = range.startContainer.childNodes[range.startOffset];
            //     }
            //     if (!currentNode) {
            //
            //     }
            // }
            //
            // if (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
            //     if (removeChar(currentNode, startOffset, startOffset, toLeft, range) === false) {
            //         return false;
            //     }
            // }



            // const textNode: Node = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer : range.startContainer.childNodes[range.startOffset];
            // const startOffsetInRange: number = range.startContainer.nodeType === Node.TEXT_NODE ? range.startOffset : 0;
            //
            // let startOffset: number = startOffsetInRange;
            //
            // if (!Dom.isOrContains(editor.editor, textNode) || textNode === editor.editor) {
            //     return false;
            // }
            //
            // const nextElement: Node | null | false = removeChar(textNode, startOffset, startOffsetInRange, toLeft, range);
            //
            // if (nextElement === false) {
            //     return false;
            // }
            //
            // if (nextElement && nextElement.nodeName.match(/^(IMG|BR|IFRAME|SCRIPT|INPUT|TEXTAREA|TABLE)$/)) {
            //     nextElement.parentNode && nextElement.parentNode.removeChild(nextElement);
            //     return false;
            // }



            // if (startOffset === 0 && toLeft && textNode) {
            //     const prevBox: Node | false = Dom.prev(textNode, Dom.isBlock, editor.editor);
            //
            //     if (prevBox) {
            //         editor.selection.setCursorIn(prevBox, false);
            //     }
            //
            //     try {
            //         const container: HTMLElement | null = <HTMLElement | null>Dom.up(range.startContainer, Dom.isBlock, editor.editor);
            //
            //         if (container) {
            //             const html: string = container.innerHTML.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
            //             if ((!html.length || html === '<br>') && !Dom.isCell(container, editor.editorWindow) && container.parentNode && container !== editor.editor) {
            //                 container.parentNode.removeChild(container);
            //
            //                 return false;
            //             }
            //
            //             if (container && container.nodeName === 'LI') {
            //
            //             }
            //         }
            //     } finally {
            //         // Ul near with UL
            //         if (prevBox && prevBox.nodeName === 'LI') {
            //             const UL: Node | false = Dom.closest(prevBox, 'Ul|OL', editor.editor);
            //             if (UL) {
            //                 const nextBox: Node | null = UL.nextSibling;
            //                 if (nextBox && nextBox.nodeName === UL.nodeName && UL !== nextBox) {
            //                     [].slice.call(nextBox.childNodes).forEach(function (node: HTMLLIElement) {
            //                         UL.appendChild(node);
            //                     });
            //                     nextBox.parentNode && nextBox.parentNode.removeChild(nextBox);
            //                 }
            //             }
            //         }
            //     }
            // }


            return false;
        }
    })
}