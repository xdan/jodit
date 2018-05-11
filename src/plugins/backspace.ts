/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import * as consts from '../constants';
import {normalizeNode, trim} from '../modules/Helpers';
import {Dom} from "../modules/Dom";

/**
 * Plug-in process entering Backspace key
 *
 * @module backspace
 */
export function backspace(editor: Jodit) {
    const removeEmptyBlocks = (container: HTMLElement) => {
        let box: HTMLElement | null = container,
            parent: Node | null;

        normalizeNode(container);

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
    const removeChar = (box: {node : Node | null}, toLeft: boolean, range: Range) :  void | boolean => {
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
            editor.selection.selectRange(range);

            let nextElement: Node | null = Dom.findInline(box.node, toLeft, editor.editor);

            if (value.length) {
                let setRange : boolean = false;
                if (toLeft) {
                    if (startOffset) {
                        // box.node.nodeValue = value.substr(0, startOffset - 1) + value.substr(startOffset);
                        // if (!box.node.nodeValue.length) {
                        //     box.node.nodeValue = consts.INVISIBLE_SPACE;
                        // }
                        // startOffset -= 1;
                        setRange = true;
                    }
                } else {
                    if (startOffset < value.length) {
                        // box.node.nodeValue = value.substr(0, startOffset) + value.substr(startOffset + 1);
                        // if (!box.node.nodeValue.length) {
                        //     box.node.nodeValue = consts.INVISIBLE_SPACE;
                        // }
                        setRange = true;
                    }
                }

                if (setRange) {
                    // range.setStart(box.node, startOffset);
                    // range.collapse(true);
                    // editor.selection.selectRange(range);
                    return true;
                }
            } else {
                range.setStartBefore(box.node);
                range.collapse(true);
                editor.selection.selectRange(range);

                box.node && box.node.parentNode && box.node.parentNode.removeChild(box.node);

                box.node = nextElement;
            }

            if (nextElement) {
                if (Dom.isInlineBlock(nextElement)) {
                    nextElement = toLeft ? nextElement.lastChild : nextElement.firstChild;
                }

                if (nextElement && nextElement.nodeType === Node.TEXT_NODE) {
                    box.node = nextElement;
                    return removeChar(box, toLeft, range);
                }
            }
        }
    };
    const potentialRemovable: RegExp = /^(IMG|BR|IFRAME|SCRIPT|INPUT|TEXTAREA|HR)$/;
    const removePotential = (node: Node | null): false | void => {
        if (node && potentialRemovable.test(node.nodeName)) {
            node.parentNode && node.parentNode.removeChild(node);
            return false;
        }
    };
    const removeInline = (box: {node : Node | null}, toLeft: boolean, range: Range): boolean | void => {
        if (box.node) {
            const workElement: Node = box.node;
            const removeCharFlag: void | boolean = removeChar(box, toLeft, range);

            if (removeCharFlag !== undefined) {
                return true;
            }

            if (!box.node) {
                box.node = workElement.parentNode;
            }

            if (box.node === editor.editor) {
                return false;
            }

            let node: Node | null = box.node;

            if (removePotential(node) === false) {
                return false;
            }


            if (node) {
                node = toLeft ? node.previousSibling : node.nextSibling;;
            }

            while (node && node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.match(/^[\n\r]+$/)) {
                node = toLeft ? node.previousSibling : node.nextSibling;
            }

            return removePotential(node);

        }
    };
    const isEmpty = (node: Node): boolean => {
        if (node.nodeName.match(/^(TD|TH|TR|TABLE|LI)$/) !== null) {
            return false;
        }

        if (Dom.isEmpty(node) || node.nodeName.match(potentialRemovable) !== null) {
            return true;
        }

        if (node.nodeType === Node.TEXT_NODE && !Dom.isEmptyTextNode(node)) {
            return false;
        }

        return node.childNodes.length ? [].slice.call(node.childNodes).every(isEmpty) : true;
    };

    editor.events
        .on('afterCommand', (command: string) => {
            if (command === 'delete') {
                let current: Node | false = editor.selection.current();
                if (current && current.firstChild && current.firstChild.nodeName ==='BR') {
                    current.removeChild(current.firstChild);
                }
                if (!trim(editor.editor.innerText) && !editor.editor.querySelector('img') && (!current || !Dom.closest(current, 'table', editor.editor))) {
                    editor.editor.innerHTML = '';
                    let node : Node = editor.selection.setCursorIn(editor.editor);
                    node.parentNode && node.parentNode.removeChild(node);
                }
            }
        })
        .on('keydown', (event: KeyboardEvent): false | void => {
            if (event.which === consts.KEY_BACKSPACE || event.which === consts.KEY_DELETE) {
                const toLeft: boolean = event.which === consts.KEY_BACKSPACE;

                if (!editor.selection.isFocused()) {
                    !editor.selection.focus();
                }

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
                const marker: HTMLElement = editor.editorDocument.createElement('span');

                try {
                    range.insertNode(fakeNode);
                    if (!Dom.isOrContains(editor.editor, fakeNode)) {
                        return false;
                    }

                    let container: HTMLElement | null = <HTMLElement | null>Dom.up(fakeNode, Dom.isBlock, editor.editor);
                    let workElement: Node | null = Dom.findInline(fakeNode, toLeft, editor.editor);

                    const box = {
                        node: workElement
                    };

                    let tryRemoveInline: boolean | void;
                    if (workElement) {
                        tryRemoveInline = removeInline(box, toLeft, range);

                    } else if (fakeNode.parentNode) {
                         tryRemoveInline = removeInline({
                            node: toLeft ? fakeNode.parentNode.previousSibling : fakeNode.parentNode.nextSibling
                        }, toLeft, range);
                    }

                    if (tryRemoveInline !== void(0)) {
                        return tryRemoveInline ? void(0) : false;
                    }

                    if (container && container.nodeName.match(/^(TD)$/)) {
                        return false;
                    }

                    let prevBox: Node | false | null = toLeft ? Dom.prev(box.node || fakeNode, Dom.isBlock, editor.editor) : Dom.next(box.node || fakeNode, Dom.isBlock, editor.editor);

                    if (!prevBox && container && container.parentNode) {
                        prevBox = editor.editorDocument.createElement(editor.options.enter);
                        let box: Node = container;

                        while (box && box.parentNode && box.parentNode !== editor.editor) {
                            box = box.parentNode;
                        }

                        box.parentNode && box.parentNode.insertBefore(prevBox, box);
                    } else {
                        if (prevBox && isEmpty(prevBox)) {
                            prevBox.parentNode && prevBox.parentNode.removeChild(prevBox);
                            return false;
                        }
                    }


                    if (prevBox) {

                        let tmpNode: Node = editor.selection.setCursorIn(prevBox, !toLeft);
                        editor.selection.insertNode(marker, false, false);
                        if (tmpNode.nodeType === Node.TEXT_NODE && tmpNode.nodeValue === consts.INVISIBLE_SPACE) {
                            tmpNode.parentNode && tmpNode.parentNode.removeChild(tmpNode);
                        }
                    }

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
                            normalizeNode(prevBox);
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
                    fakeNode.parentNode && fakeNode.nodeValue === consts.INVISIBLE_SPACE && fakeNode.parentNode.removeChild(fakeNode);

                    if (marker && Dom.isOrContains(editor.editor, marker, true)) {
                        let tmpNode: Text | false = editor.selection.setCursorBefore(marker);
                        marker.parentNode && marker.parentNode.removeChild(marker);
                        if (tmpNode && tmpNode.parentNode && (Dom.findInline(tmpNode, true, tmpNode.parentNode) || Dom.findInline(tmpNode, true, tmpNode.parentNode))) {
                             tmpNode.parentNode.removeChild(tmpNode);
                        }
                    }

                    editor.setEditorValue();
                }

                return false;
            }
        })
}