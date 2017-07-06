import * as consts from '../constants';
import Component from './Component';
import {each, gebi, dom, trim, $$} from './Helpers';

export default class Selection extends Component{

    __normalizeSelection(range: Range, atStart) {
        if (this.cursorInTheEdge(!atStart, elm => elm && elm.nodeType !== Node.TEXT_NODE && elm !== this.parent.editor, true)) {
            if (atStart) {
                range.setStartAfter(range.startContainer)
            } else {
                range.setEndBefore(range.endContainer)
            }
        }
    }

    /**
     * Insert the cursor to any point x, y
     *
     * @method insertAtPoint
     * @param {int} x Coordinate by horizontal
     * @param {int} y Coordinate by vertical
     * @return {boolean} Something went wrong
     */
    insertCursorAtPoint(x: number, y: number): boolean {
        let caret,
            doc = this.doc,
            rng;

        this.clear();

        try {
            caret = doc.caretRangeFromPoint(x, y);
            rng = doc.createRange();
            rng.setStart(caret.startContainer, caret.startOffset);
            rng.setEnd(caret.startContainer, caret.startOffset);

            let sel = this.win.getSelection();
            sel.removeAllRanges();
            sel.addRange(rng);
            return true;
        } catch (e) {
        }

        return false;
    }

    /**
     * Remove all markers
     */
    clear() {
        $$('.jodit_selection_marker', this.parent.editor).forEach((marker) => {
            marker.parentNode.removeChild(marker)
        })
    }

    /**
     * Restores user selections using marker invisible elements in the DOM.
     *
     * @param {Array} selectionInfo
     */
    restore(selectionInfo: any[]|null = []) {
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
                    range.setStartAfter(start);
                    start.parentNode.removeChild(start);
                    range.setEndBefore(end);
                    end.parentNode.removeChild(end);
                }

                sel.addRange(range);

                this.__normalizeSelection(range, true);
                this.__normalizeSelection(range, false);
            });
        }
    }

    /**
     * Saves selections using marker invisible elements in the DOM.
     *
     * @return {Array}
     */
    save():any[]|null  {
        let sel = this.win.getSelection();
        if (!sel.rangeCount) {
            return null;
        }
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
            try {
                sel.addRange(ranges[i].cloneRange());
            } catch (e) {
                //console.log(e);
            }
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
        return (this.doc.hasFocus && this.doc.hasFocus()) && this.parent.editor === this.doc.activeElement;
    }

    /**
     * Returns the current element under the cursor inside editor
     *
     * @return {false|Node} The element under the cursor or false if undefined or not in editor
     */
    current(): false|Node {
        if (this.win.getSelection !== undefined) {
            let sel = this.win.getSelection();
            if (sel.rangeCount > 0) {
                let range = sel.getRangeAt(0);
                let node = range.startContainer;
                if (range.startContainer.nodeType !== Node.TEXT_NODE && range.startContainer === range.endContainer && range.startOffset !== range.endOffset) {
                    node = range.startContainer.childNodes[range.startOffset];
                }

                // check - cursor inside editor
                if (this.parent.node.contains(this.parent.editor, node)) {
                    return node;
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
            sel = this.win.getSelection();

            if (!this.isCollapsed()) {
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
        } else {
            new Error('Jodit does\'n support this browser')
        }

        this.parent.setEditorValue();
    }


    /**
     * Inserts in the current cursor position some HTML snippet
     *
     * @param  {string} html HTML The text to be inserted into the document
     * @example
     * parent.selection.insertHTML('<img src="image.png"/>');
     */
    insertHTML(html) {
        let node = this.doc.createElement('DIV'),
            fragment = this.doc.createDocumentFragment(),
            lastChild,
            lastEditorElement;

        if (!this.isFocused()) {
            this.parent.editor.focus();
        }

        if (typeof html === 'string') {
            node.innerHTML = html;
        } else if (this.parent.node.isNode(html)) {
            node.appendChild(html);
        }

        lastChild = node.lastChild;

        while (node.firstChild) {
            lastChild = node.firstChild;
            fragment.appendChild(node.firstChild);
        }

        this.insertNode(fragment, false);
        this.setCursorAfter(lastChild);

        lastEditorElement = this.parent.editor.lastChild;
        while (lastEditorElement && lastEditorElement.nodeType === Node.TEXT_NODE && lastEditorElement.previousSibling && (/^\s*$/).test(lastEditorElement.data)) {
            lastEditorElement = lastEditorElement.previousSibling;
        }

        if (lastChild) {
            if (lastEditorElement && lastChild === lastEditorElement && lastChild.nodeType === 1) {
                this.parent.editor.appendChild(this.doc.createElement('br'));
            }
            this.setCursorAfter(lastChild);
        }
    }

    /**
     * Insert image in editor
     *
     * @param  {string|HTMLImageElement} url URL for image, or HTMLImageElement
     * @param  {string} [styles] If specified, it will be applied <code>$(image).css(styles)</code>
     *
     * @fired afterInsertImage
     */
    insertImage(url, styles: any = {}) {
        let image = typeof url === 'string' ? dom('<img/>', this.doc) : dom(url, this.doc),
            dw;

        // delete selected
        if (!this.isCollapsed()) {
            this.parent.execCommand('Delete');
        }

        if (typeof url === 'string') {
            image.setAttribute('src', url);
        }

        dw = this.parent.options.imageDefaultWidth;
        if (dw && "auto" !== dw && (String(dw)).indexOf("px") < 0 && (String(dw)).indexOf("%") < 0) {
            dw += "px";
        }

        styles.width = dw;
        if (styles && typeof styles === 'object') {
            each(styles, (value, key) => {
                image.style[key] = value;
            });
        }


        const onload = () => {
            if (image.naturalHeight < image.offsetHeight || image.naturalWidth < image.offsetWidth) {
                image.style.width = '';
                image.style.height = '';
            }
            image.removeEventListener("load", onload)
        };

        image.addEventListener("load", onload);

        if (image.complete) {
            onload();
        }

        this.insertNode(image);

        /**
         * Triggered after image was inserted {@link module:Selection~insertImage|insertImage}. This method can executed from {@link module:Filebrowser|Filebrowser} or {@link module:Uploader|Uploader}
         * @event afterInsertImage
         * @param {HTMLImageElement} image
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('afterInsertImage', function (image) {
                 *     image.className = 'bloghead4';
                 * });
         */
        this.parent.events.fire('afterInsertImage', [image]);
    }

    eachSelection = (callback: Function) => {
        let sel = this.win.getSelection()
        if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let nodes = [],
                start = range.startContainer === this.parent.editor ? this.parent.editor.childNodes[range.startOffset] : range.startContainer,
                end = range.endContainer === this.parent.editor ? this.parent.editor.childNodes[range.endOffset - 1] : range.endContainer;

            this.parent.node.find(start, (node: Node|HTMLElement) => {
                if (node && !this.parent.node.isEmptyTextNode(node) && !(node instanceof HTMLElement && node.classList.contains('jodit_selection_marker'))) {
                    nodes.push(node);
                }
                if (node === end) {
                    // if (range.endContainer.nodeType !== Node.TEXT_NODE) {
                    //     nodes.pop()
                    // }
                    return true;
                }
            }, this.parent.editor, true, 'nextSibling', false);
            nodes.forEach((current) => {
                callback(current);
            })
        }
    }

    /**
     * Set cursor after the node
     *
     * @param {Node} node
     * @return {Node} fake invisible textnode. After insert it can be removed
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
     * Checks if the cursor is at the end(start) block
     *
     * @param  {boolean} [start=false] true - check whether the cursor is at the start block
     * @return {boolean} true - the cursor is at the end(start) block
     */
    cursorInTheEdge (start:boolean = false, parentBlock: HTMLElement|Function|false = false, inverse: boolean = false): boolean {
        let sel = this.win.getSelection();
        if (!sel.rangeCount) {
            return false;
        }

        let rng: Range = sel.getRangeAt(0),
            isStart = () => {
                return inverse === false ? start : !start;
            },
            container = isStart() ? rng.startContainer : rng.endContainer,
            node,
            nodeValue,
            newNodeValue,
            isAfterLastNodeInContainer = false,
            offset = isStart() ? rng.startOffset : rng.endOffset;

        if (parentBlock === false) {
            parentBlock = <HTMLElement>this.parent.node.up(container, this.parent.node.isBlock)
        } else if (typeof parentBlock === 'function') {
            parentBlock = <HTMLElement>this.parent.node.up(container, parentBlock)
        } else {
            if (!this.parent.node.isOrContains(parentBlock, container)) {
                return null;
            }
        }

        if (!container) {
            return false;
        }
        
        if (container.nodeType === Node.ELEMENT_NODE && container.hasChildNodes()) {
            isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
            container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;

            if (isAfterLastNodeInContainer && container.nodeType === Node.TEXT_NODE) {
                offset = container.nodeValue.length;
            } else {
                offset = 0;
            }
        }

        if (container.nodeType === Node.TEXT_NODE) {
            newNodeValue = nodeValue = container.nodeValue;
            if (consts.SPACE_REG_EXP_START.test(nodeValue) && offset) {
                newNodeValue = nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP_START, '');
                offset -= nodeValue.length - newNodeValue.length;
            }
            nodeValue = newNodeValue;
            if (consts.SPACE_REG_EXP_END.test(nodeValue) && offset) {
                newNodeValue = trim(nodeValue);
                if (offset > newNodeValue.length) {
                    offset = newNodeValue.length;
                }
            }
            if (offset < 0) {
                offset = 0;
            }
        }

        // Inside TEXT_NODE and text
        if (container.nodeType === Node.TEXT_NODE && (start ? offset > 0 : offset < newNodeValue.length)) {
            return false;
        }

        // In start some of ELEMENT_NODE
        if (start && container.nodeType === Node.ELEMENT_NODE && ((parentBlock && container === parentBlock.firstChild) || (container === this.parent.editor.firstChild))) {
            return true;
        }

        // In end some of ELEMENT_NODE
        if (!start && container.nodeType === Node.ELEMENT_NODE && ((parentBlock && container === parentBlock.lastChild) || (container === this.parent.editor.lastChild))) {
            return true;
        }

        // Caret can be before/after a table
        if (container.nodeName === "TABLE" || (container.previousSibling && container.previousSibling.nodeName === "TABLE")) {
            return (isAfterLastNodeInContainer && !start) || (!isAfterLastNodeInContainer && start);
        }

        node = container;

        if (container.nodeType === Node.TEXT_NODE) {
            if (start && offset === 0) {
                node = this.parent.node.find(node, node => node, parentBlock, false, 'previousSibling', 'lastChild');
            } else if (!start && offset === newNodeValue.length) {
                node = this.parent.node.next(node, node => node, parentBlock);
            }
        }

        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName !== 'BR') {
                    return false;
                }
            } else if (node.nodeType === Node.TEXT_NODE && !/^[ \t\r\n]*$/.test(node.nodeValue) && !this.parent.node.isEmptyTextNode(node)) {
                return false;
            }

            if (start) {
                node = this.parent.node.find(node, node => node, parentBlock, false,  'previousSibling', 'lastChild');
            } else {
                node = this.parent.node.next(node, node => node, parentBlock);
            }
        }

        return true;
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