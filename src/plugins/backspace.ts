import Jodit from '../jodit';
import * as consts from '../constants';
import {trim} from '../modules/Helpers';

Jodit.plugins.backspace = function (editor) {
    editor.events.on('afterCommand', (command) => {
        if (command === 'delete') {
            let current = editor.selection.current();
            if (current && current.firstChild && current.firstChild.tagName ==='BR') {
                current.removeChild(current.firstChild);
            }
            if (!trim(editor.editor.innerText) && !editor.editor.querySelector('img')) {
                editor.editor.innerHTML = '';
                editor.selection.setCursorIn(editor.editor);
            }
        }
    })
    editor.events.on('keydown', (event) => {
        if (event.which === consts.KEY_BACKSPACE || event.keyCode === consts.KEY_DELETE) {
            if (!editor.selection.isCollapsed()) {
                editor.execCommand('Delete');
                return false;
            }
            let sel = editor.win.getSelection(),
                range = sel.rangeCount ? sel.getRangeAt(0) : false;

            if (range && range.startOffset !== 0 && range.startContainer.nodeType === Node.TEXT_NODE) {
                let textNode = range.startContainer,
                    value = textNode.nodeValue,
                    startOffset = range.startOffset;

                while (startOffset >= 0 && value[startOffset - 1] === consts.INVISIBLE_SPACE) {
                    startOffset -= 1;
                }

                if (startOffset !== range.startOffset) {
                    let oldStart = range.startOffset;
                    value = value.substr(0, startOffset) + value.substr(oldStart);
                    textNode.nodeValue = value;

                    if (value) {
                        range.setStart(textNode, startOffset);
                        return;
                    }
                }
                if (!textNode.previousSibling) {
                    let prevBox = editor.node.prev(textNode, editor.node.isBlock);
                    if (prevBox) {
                        editor.selection.setCursorIn(prevBox, false)
                        let container = editor.node.up(textNode, editor.node.isBlock);
                        if (!container.innerHTML) {
                            container.parentNode.removeChild(container)
                        }
                        return false;
                    }
                }
            }
        }
    })
}