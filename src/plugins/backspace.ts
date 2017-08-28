import Jodit from '../Jodit';
import * as consts from '../constants';
import {trim} from '../modules/Helpers';
import Dom from "../modules/Dom";

Jodit.plugins.backspace = function (editor: Jodit) {
    editor.events.on('afterCommand', (command) => {
        if (command === 'delete') {
            let current = editor.selection.current();
            if (current && current.firstChild && current.firstChild['tagName'] ==='BR') {
                current.removeChild(current.firstChild);
            }
            if (!trim(editor.editor.innerText) && !editor.editor.querySelector('img')) {
                editor.editor.innerHTML = '';
                editor.selection.setCursorIn(editor.editor);
            }
        }
    });
    editor.events.on('keydown', (event) => {
        if (event.which === consts.KEY_BACKSPACE || event.keyCode === consts.KEY_DELETE) {
            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
                return false;
            }

            const sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : false;

            if (range) {
                if (
                    range.startContainer.nodeType === Node.TEXT_NODE ||
                    range.startContainer.childNodes[range.startOffset].nodeType === Node.TEXT_NODE
                ) {
                    let textNode = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer : range.startContainer.childNodes[range.startOffset],
                        value = textNode.nodeValue,
                        startOffset = range.startOffset;

                    while (startOffset >= 0 && value[startOffset - 1] === consts.INVISIBLE_SPACE) {
                        startOffset -= 1;
                    }

                    if (startOffset !== range.startOffset) {
                        const oldStart = range.startOffset;
                        value = value.substr(0, startOffset) + value.substr(oldStart);
                        textNode.nodeValue = value;

                        if (value) {
                            range.setStart(textNode, startOffset);
                            return;
                        }
                    }
                }

                if (range.startOffset === 0) {
                    const prevBox = Dom.prev(range.startContainer, Dom.isBlock, editor.editor);
                    if (prevBox) {
                        editor.selection.setCursorIn(prevBox, false);
                        const container = <HTMLElement>Dom.up(range.startContainer, Dom.isBlock, editor.editor);
                        const html: string = container.innerHTML.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
                        if (!html.length || html == '<br>') {
                            container.parentNode.removeChild(container)
                        }
                        return false;
                    }
                }
            }
        }
    })
};