import * as consts from '../constants';
import Component from './Component';
import {each, gebi} from './Helpers';

export default class Selection extends Component{
    /**
     * Restores user selections using marker invisible elements in the DOM.
     *
     * @param {array} selectionInfo
     */
    restore(selectionInfo = []) {
        if (Array.isArray(selectionInfo)) {


            let sel = this.win.getSelection();
            sel.removeAllRanges();

            each(selectionInfo, (i, selection) => {
                let range = this.doc.createRange(),
                    end = gebi(selection.endId, this.doc),
                    start = gebi(selection.startId, this.doc);

                if (!start) {
                    return;
                }


                //debugger
                if (selection.collapsed || !end) {
                    let previousNode = start.previousSibling;

                    if (previousNode && previousNode.nodeType == Node.TEXT_NODE) {
                        range.setStart(previousNode, previousNode.nodeValue.length);
                    } else {
                        range.setStartBefore(start)
                    }

                    start.parentNode.removeChild(start);
                    range.collapse(true);
                } else {
                    range.setStartAfter(start)
                    start.parentNode.removeChild(start);
                    range.setEndBefore(end)
                    end.parentNode.removeChild(end);
                }

                sel.addRange(range);
            });
        }
    }

    /**
     * Saves selections using marker invisible elements in the DOM.
     *
     * @return {Array}
     */
    save() {

        let _marker = (range, atStart = false) => {
            let newRange = range.cloneRange();
            newRange.collapse(atStart);

            let marker = this.doc.createElement('span');
            marker.id = 'jodit_selection_marker_' + (+new Date()) + "_" + ("" + Math.random()).slice(2);
            marker.style.lineHeight = "0";
            marker.style.display = "none";
            marker.className = "jodit_selection_marker " + "jodit_selection_marker-" + (atStart ? 'start' : 'end');
            marker.appendChild(this.doc.createTextNode(consts.INVISIBLE_SPACE));
            newRange.insertNode(marker);

            return marker;
        };
        let sel = this.win.getSelection();
        if (!sel.rangeCount) {
            return;
        }

        let info = [], length = sel.rangeCount, i, start, end, ranges = [];
        for (i = 0; i < length; i += 1) {
            ranges[i] = sel.getRangeAt(i);
            if (ranges[i].collapsed) {
                start = _marker(ranges[i]);
                info[i] =  {
                    startId: start.id,
                    collapsed: true,
                };
            } else {
                start = _marker(ranges[i], true);
                end = _marker(ranges[i], false);
                info[i] = {
                    startId: start.id,
                    endId: end.id,
                    collapsed: false,
                };
            }
        }

        sel.removeAllRanges();
        for (i = length - 1; i >= 0; --i) {
            if (info[i].collapsed) {
                ranges[i].setStartAfter(gebi(info[i].startId, this.doc));
                ranges[i].collapse(true);
            } else {
                ranges[i].setStartAfter(gebi(info[i].startId, this.doc));
                ranges[i].setEndBefore(gebi(info[i].endId, this.doc));
            }
            sel.addRange(ranges[i].cloneRange());
        }

        return info;
    }

    /**
     * Set focus in editor
     */
    focus () {
        if (!this.isFocused()) {
            this.win.focus();
            this.parent.editor.focus();
        }
    }

    /**
     * Checks whether the current selection is something or just set the cursor is
     *
     * @return {Boolean} true Selection does't have content
     */
    isCollapsed () {
        let sel = this.win.getSelection(), r;
        for (r = 0; r < sel.rangeCount; r += 1) {
            if (!sel.getRangeAt(r).collapsed) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether the editor currently in focus
     *
     * @return {Boolean}
     */
    isFocused (){
        return this.doc.hasFocus() && this.parent.editor === this.doc.activeElement;
    }

    /**
     * Returns the current element under the cursor inside editor
     *
     * @method  current
     * @return {Boolean|Node} The element under the cursor or false if undefined or not in editor
     */
    current () {
        if (this.win.getSelection !== undefined) {
            let sel = this.win.getSelection();
            if (sel.rangeCount > 0) {
                let range = sel.getRangeAt(0);
                let node = range.startContainer, elm = node;
                if (range.startContainer.nodeType !== Node.TEXT_NODE && range.startContainer === range.endContainer && range.startOffset !== range.endOffset) {
                    node = range.startContainer.childNodes[range.startOffset];
                }
                while (elm.parentNode) {
                    if (elm.parentNode === this.parent.editor) {
                        return node;
                    }
                    elm = elm.parentNode;
                }
            }
        }
        return false;
    }

    /**
     * Insert element in editor
     *
     * @param {Node} node
     * @param {Boolean} [insertCursorAfter=true] After insert, cursor will move after element
     */
    insertNode (node, insertCursorAfter = true) {
        if (!(node instanceof Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        let sel,
            range,
            html,
            isOrContainsNode = (ancestor, descendant) => {
                let node = descendant;
                while (node) {
                    if (node === ancestor) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            };

        this.focus();

        if (this.win.getSelection) {
            sel = this.win.getSelection()

            if (!this.isCollapsed()) {
                //sel.getRangeAt(0).extractContents();
                //sel.getRangeAt(0).collapse(true);
                this.parent.execCommand('Delete');
            }

            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (isOrContainsNode(this.parent.editor, range.commonAncestorContainer)) {
                    range.deleteContents();
                    range.insertNode(node);
                } else {
                    this.parent.editor.appendChild(node);
                }

                if (insertCursorAfter) {
                    this.setCursorAfter(node);
                }
            }
        } else if (this.doc.selection && this.doc.selection.createRange) {
            range = this.doc.selection.createRange();
            if (isOrContainsNode(this.parent.editor, range.parentElement())) {
                html = (node.nodeType === Node.TEXT_NODE) ? node.data : node.outerHTML;
                range.pasteHTML(html);
            } else {
                this.parent.editor.appendChild(node);
            }
        }

        this.parent.setEditorValue();
    }

    /**
     * Set cursor after the node
     *
     * @param {Node} node
     * @return {TextNode} fake invisible textnode. After insert it can be removed
     */
    setCursorAfter(node) {
        if (!(node instanceof Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        if (!this.parent.node.up(node, (elm) => (elm === this.parent.editor || elm.parentNode === this.parent.editor))) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.win.getSelection(),
            range = this.doc.createRange(),
            fakeNode = this.doc.createTextNode(consts.INVISIBLE_SPACE);



        if (node.nodeType !== Node.TEXT_NODE) {
            range.setStartAfter(node);
            range.insertNode(fakeNode);
            range.setStartAfter(fakeNode);
        } else {
            range.setStart(node, node.nodeValue.length);
        }

        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        // if (textNode.parentNode) {
        //     textNode.parentNode.removeChild(textNode);
        // }
        return fakeNode;
    }

    /**
     * Set cursor before the node
     *
     * @param {Node} node
     * @return {TextNode} fake invisible textnode. After insert it can be removed
     */
    setCursorBefore(node) {
        if (!(node instanceof Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        if (!this.parent.node.up(node, (elm) => (elm === this.parent.editor || elm.parentNode === this.parent.editor))) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.win.getSelection(),
            range = this.doc.createRange(),
            fakeNode = this.doc.createTextNode(consts.INVISIBLE_SPACE);

        if (node.nodeType !== Node.TEXT_NODE) {
            range.setStartBefore(node);
            range.insertNode(fakeNode);
            range.selectNode(fakeNode);
        } else {
            range.setStart(node, node.nodeValue.length);
        }

        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        // if (textNode.parentNode) {
        //     textNode.parentNode.removeChild(textNode);
        // }
        return fakeNode;
    }

    /**
     * Set cursor in the node
     *
     * @param {Node} node
     * @param {boolean} [inStart=false] set cursor in start of element
     */
    setCursorIn(node, inStart = false) {
        if (!(node instanceof Node)) {
            throw new Error('Parameter node most be instance of Node');
        }
        if (!this.parent.node.up(node, (elm) => (elm === this.parent.editor || elm.parentNode === this.parent.editor))) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.win.getSelection(),
            range = this.doc.createRange();
        let start = node, last = node;

        do {
            if (start.nodeType === Node.TEXT_NODE) {
                break;
            }
            last = start;
            start = start[inStart ? 'firstChild' : 'lastChild'];
        } while (start);

        range.selectNodeContents(start || last);
        range.collapse(inStart);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    /**
     * Select node
     *
     * @param {Node} node
     * @param {boolean} [inward=false] select all inside
     */
    select(node, inward = false) {
        if (!(node instanceof Node)) {
            throw new Error('Parameter node most be instance of Node');
        }
        if (!this.parent.node.up(node, (elm) => (elm === this.parent.editor || elm.parentNode === this.parent.editor))) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.win.getSelection(),
            range = this.doc.createRange();

        range[inward ? 'selectNodeContents' : 'selectNode'](node);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}