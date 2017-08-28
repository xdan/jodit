import * as consts from '../constants';
import Component from './Component';
import {each, dom, trim, $$, css, normilizeCSSValue, isIE} from './Helpers';
import Dom from "./Dom";
import Jodit from "../Jodit";

export type markerInfo = {
    startId: string,
    endId?: string,
    collapsed: boolean,
    startMarker: string
    endMarker?: string
}

export default class Selection extends Component{

    // private __normalizeSelection(range: Range, atStart) {
    //     if (!this.isCollapsed() && this.cursorInTheEdge(!atStart, elm => elm && elm.nodeType !== Node.TEXT_NODE && elm !== this.jodit.editor, true)) {
    //         if (atStart) {
    //             range.setStartAfter(range.startContainer)
    //         } else {
    //             range.setEndBefore(range.endContainer)
    //         }
    //     }
    // }

    /**
     * Insert the cursor toWYSIWYG any point x, y
     *
     * @method insertAtPoint
     * @param {int} x Coordinate by horizontal
     * @param {int} y Coordinate by vertical
     * @return {boolean} Something went wrong
     */
    insertCursorAtPoint(x: number, y: number): boolean {
        let caret;

        this.clear();

        try {
            let rng: Range = null;

            if (this.jodit.doc['caretPositionFromPoint']) {
                caret = this.jodit.doc['caretPositionFromPoint'](x, y);
                rng = this.jodit.doc.createRange();
                rng.setStart(caret.offsetNode, caret.offset);
            } else if (this.jodit.doc.caretRangeFromPoint) {
                caret = this.jodit.doc.caretRangeFromPoint(x, y);
                rng = this.jodit.doc.createRange();
                rng.setStart(caret.startContainer, caret.startOffset);
            }

            if (rng !== null && typeof window.getSelection != "undefined") {
                rng.collapse(true);
                let sel = this.jodit.win.getSelection();
                sel.removeAllRanges();
                sel.addRange(rng);
            } else if (typeof this.jodit.doc.body['createTextRange'] != "undefined") {
                let range = this.jodit.doc.body['createTextRange']();
                range.moveToPoint(x, y);
                range.select();
            }

            return true;
        } catch (e) {
        }

        return false;
    }

    private isMarker = (elm: HTMLElement) => (
        Dom.isNode(elm, this.jodit.win) && elm.tagName === 'SPAN' && elm.getAttribute('data-' + consts.MARKER_CLASS)
    )

    /**
     * Remove all markers
     */
    clear() {
        $$('span[data-' + consts.MARKER_CLASS + ']', this.jodit.editor).forEach((marker) => {
            marker.parentNode.removeChild(marker)
        })
    }

    marker = (atStart = false, range?: Range): HTMLSpanElement => {
        let newRange: Range;
        if (range) {
            newRange = range.cloneRange();
            newRange.collapse(atStart);
        }

        const marker = this.jodit.doc.createElement('span');
        marker.id = consts.MARKER_CLASS + '_' + (+new Date()) + "_" + ("" + Math.random()).slice(2);
        marker.style.lineHeight = "0";
        marker.style.display = "none";
        marker.setAttribute('data-' + consts.MARKER_CLASS, (atStart ? 'start' : 'end'));
        marker.appendChild(this.jodit.doc.createTextNode(consts.INVISIBLE_SPACE));

        if (newRange) {
            newRange.insertNode(marker);
        }

        return marker;
    };

    /**
     * Restores user selections using marker invisible elements in the DOM.
     *
     * @param {Array} selectionInfo
     */
    restore(selectionInfo: markerInfo[]|null = []) {
        if (Array.isArray(selectionInfo)) {
            const sel = this.jodit.win.getSelection();
            sel.removeAllRanges();

            selectionInfo.forEach((selection: markerInfo) => {
                const range: Range = this.jodit.doc.createRange(),
                    end: HTMLElement = <HTMLElement>this.jodit.editor.querySelector('#' + selection.endId),
                    start: HTMLElement = <HTMLElement>this.jodit.editor.querySelector('#' + selection.startId);

                if (!start) {
                    return;
                }

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
            });

            //this.clear();
        }
    }

    /**
     * Saves selections using marker invisible elements in the DOM.
     *
     * @return {Array}
     */
    save():markerInfo[]  {
        const sel = this.jodit.win.getSelection();
        if (!sel.rangeCount) {
            return null;
        }


        let info: markerInfo[] = [], length = sel.rangeCount, i, start, end, ranges = [];
        for (i = 0; i < length; i += 1) {
            ranges[i] = sel.getRangeAt(i);
            if (ranges[i].collapsed) {
                start = this.marker(true, ranges[i]);
                info[i] =  {
                    startId: start.id,
                    collapsed: true,
                    startMarker: start.outerHTML,
                };
            } else {
                start = this.marker(true, ranges[i]);
                end = this.marker(false, ranges[i]);
                info[i] = {
                    startId: start.id,
                    endId: end.id,
                    collapsed: false,
                    startMarker: start.outerHTML,
                    endMarker: end.outerHTML,
                };
            }
        }

        sel.removeAllRanges();
        for (i = length - 1; i >= 0; --i) {
            if (info[i].collapsed) {
                ranges[i].setStartAfter(this.jodit.doc.getElementById(info[i].startId));
                ranges[i].collapse(true);
            } else {
                ranges[i].setStartBefore(this.jodit.doc.getElementById(info[i].startId));
                ranges[i].setEndAfter(this.jodit.doc.getElementById(info[i].endId));
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
    focus = () => {
        const jodit: Jodit = this.jodit;
        if (!this.isFocused()) {
            if (jodit.options.iframe && isIE()) {
                let start: number = 0;
                while (start < 100000 && jodit.doc.readyState !== 'complete') {
                    start++;
                }
            }
            if (jodit.iframe) {
                jodit.iframe.focus();
            }
            jodit.win.focus();
            jodit.editor.focus();
            const sel = jodit.win.getSelection(),
                range = jodit.doc.createRange();

            if (!sel.rangeCount) {
                if (!jodit.editor.firstChild) {
                    jodit.editor.appendChild(jodit.doc.createTextNode(consts.INVISIBLE_SPACE));
                }
                range.selectNodeContents(jodit.editor.firstChild);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            return true;
        }
    };

    /**
     * Checks whether the current selection is something or just set the cursor is
     *
     * @return {Boolean} true Selection does't have content
     */
    isCollapsed () {
        let sel = this.jodit.win.getSelection(), r;
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
        return (this.jodit.doc.hasFocus && this.jodit.doc.hasFocus()) && this.jodit.editor === this.jodit.doc.activeElement;
    }

    /**
     * Returns the current element under the cursor inside editor
     *
     * @return {boolean|Node} The element under the cursor or false if undefined or not in editor
     */
    current(): false|Node {
        if (this.jodit.getRealMode() === consts.MODE_WYSIWYG && this.jodit.win.getSelection !== undefined) {
            const sel = this.jodit.win.getSelection();
            if (sel.rangeCount > 0) {
                const range: Range = sel.getRangeAt(0);
                let node = range.startContainer;
                if (range.startContainer.nodeType !== Node.TEXT_NODE && range.startContainer === range.endContainer && range.startOffset !== range.endOffset) {
                    node = range.startContainer.childNodes[range.startOffset];
                }

                // check - cursor inside editor
                if (Dom.contains(this.jodit.editor, node)) {
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
    insertNode (node: Node, insertCursorAfter = true) {
        if (!(node instanceof (<any>this.jodit.win).Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        const isOrContainsNode = (ancestor: Node, descendant: Node) => {
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

        if (this.jodit.win.getSelection) {
            const sel = this.jodit.win.getSelection();

            if (!this.isCollapsed()) {
                this.jodit.execCommand('Delete');
            }

            if (sel.rangeCount) {
                const range = sel.getRangeAt(0);
                if (isOrContainsNode(this.jodit.editor, range.commonAncestorContainer)) {
                    range.deleteContents();
                    range.insertNode(node);
                } else {
                    this.jodit.editor.appendChild(node);
                }
            } else {
                this.jodit.editor.appendChild(node)
            }

            if (insertCursorAfter) {
                this.setCursorAfter(node);
            }
        } else {
            throw new Error('Jodit does\'n support this browser')
        }

        this.jodit.setEditorValue();
    }


    /**
     * Inserts in the current cursor position some HTML snippet
     *
     * @param  {string} html HTML The text toWYSIWYG be inserted into the document
     * @example
     * ```javascript
     * parent.selection.insertHTML('<img src="image.png"/>');
     * ```
     */
    insertHTML(html: number|string|Node) {
        let node = this.jodit.doc.createElement('DIV'),
            fragment = this.jodit.doc.createDocumentFragment(),
            lastChild,
            lastEditorElement;

        if (!this.isFocused()) {
            this.jodit.editor.focus();
        }

        if (!(html instanceof (<any>this.jodit.win).Node)) {
            node.innerHTML = html.toString();
        } else if (Dom.isNode(html, this.jodit.win)) {
            node.appendChild(<Node>html);
        }

        lastChild = node.lastChild;

        while (node.firstChild) {
            lastChild = node.firstChild;
            fragment.appendChild(node.firstChild);
        }

        this.insertNode(fragment, false);
        this.setCursorAfter(lastChild);

        lastEditorElement = this.jodit.editor.lastChild;
        while (lastEditorElement && lastEditorElement.nodeType === Node.TEXT_NODE && lastEditorElement.previousSibling && (/^\s*$/).test(lastEditorElement.data)) {
            lastEditorElement = lastEditorElement.previousSibling;
        }

        if (lastChild) {
            if (lastEditorElement && lastChild === lastEditorElement && lastChild.nodeType === 1) {
                this.jodit.editor.appendChild(this.jodit.doc.createElement('br'));
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
    insertImage(url, styles: {[key: string]: string} = {}) {
        let dw: string;
        const image: HTMLImageElement = typeof url === 'string' ? <HTMLImageElement>dom('<img/>', this.jodit.doc) : <HTMLImageElement>dom(url, this.jodit.doc);

        // delete selected
        if (!this.isCollapsed()) {
            this.jodit.execCommand('Delete');
        }

        if (typeof url === 'string') {
            image.setAttribute('src', url);
        }

        dw = this.jodit.options.imageDefaultWidth.toString();
        if (dw && "auto" !== dw && (String(dw)).indexOf("px") < 0 && (String(dw)).indexOf("%") < 0) {
            dw += "px";
        }

        styles.width = dw;
        if (styles && typeof styles === 'object') {
            each(styles, (value: string, key: string) => {
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
         * Triggered after image was inserted {@link Selection~insertImage|insertImage}. This method can executed from {@link FileBrowser|FileBrowser} or {@link Uploader|Uploader}
         * @event afterInsertImage
         * @param {HTMLImageElement} image
         * @example
         * ```javascript
         * var editor = new Jodit("#redactor");
         * editor.events.on('afterInsertImage', function (image) {
         *     image.className = 'bloghead4';
         * });
         * ```
         */
        this.jodit.events.fire('afterInsertImage', [image]);
    }

    eachSelection = (callback: Function) => {
        const sel = this.jodit.win.getSelection();
        if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let nodes = [],
                start = range.startContainer === this.jodit.editor ? this.jodit.editor.childNodes[range.startOffset] : range.startContainer,
                end = range.endContainer === this.jodit.editor ? this.jodit.editor.childNodes[range.endOffset - 1] : range.endContainer;

            Dom.find(start, (node: Node|HTMLElement) => {
                if (node && !Dom.isEmptyTextNode(node) && !this.isMarker(<HTMLElement>node)) {
                    nodes.push(node);
                }
                if (node === end) {
                    // if (range.endContainer.nodeType !== Node.TEXT_NODE) {
                    //     nodes.pop()
                    // }
                    return true;
                }
            }, this.jodit.editor, true, 'nextSibling', false);
            nodes.forEach((current) => {
                callback(current);
            })
        }
    };

    /**
     * Set cursor after the node
     *
     * @param {Node} node
     * @return {Node} fake invisible textnode. After insert it can be removed
     */
    setCursorAfter(node) {
        if (!(node instanceof (<any>this.jodit.win).Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        if (!Dom.up(node, (elm) => (elm === this.jodit.editor || elm.parentNode === this.jodit.editor), this.jodit.editor)) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.jodit.win.getSelection(),
            range = this.jodit.doc.createRange(),
            fakeNode = this.jodit.doc.createTextNode(consts.INVISIBLE_SPACE);



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
     * @param {HTMLElement} parentBlock - Find in this
     * @param {boolean} [inverse=false] - find last element on left side and inverse
     *
     * @return {boolean} true - the cursor is at the end(start) block
     */
    cursorInTheEdge (start: boolean = false, parentBlock: HTMLElement|Function|false = false, inverse: boolean = false): boolean {
        const sel = this.jodit.win.getSelection(),
            isNoEmptyNode = (elm: Node) => (!Dom.isEmptyTextNode(elm));
        let
            container: HTMLElement = <HTMLElement>parentBlock;

        if (!sel.rangeCount) {
            return false;
        }

        const range: Range = sel.getRangeAt(0),
            isStart = () => {
                return inverse === false ? start : !start;
            },
            startContainer = isStart() ? range.startContainer : range.endContainer;

        if (parentBlock === false) {
            container = <HTMLElement>Dom.up(startContainer, Dom.isBlock, this.jodit.editor)
        } else if (typeof parentBlock === 'function') {
            container = <HTMLElement>Dom.up(startContainer, parentBlock, this.jodit.editor)
        } else {
            if (!Dom.isOrContains(parentBlock, range.startContainer)) {
                return null;
            }
        }

        if (!container) {
            return false;
        }


        if (startContainer === container) {
            if (start) {
                return range.startOffset === 0;
            } else {
                return range.endOffset === [].slice.call(container.childNodes).filter(isNoEmptyNode).length;
            }
        } else {
            if (start) {
                return (startContainer.nodeType !== Node.TEXT_NODE || range.startOffset === 0) && !Dom.prev(<HTMLElement>startContainer, isNoEmptyNode, container);
            } else {
                return (startContainer.nodeType !== Node.TEXT_NODE || range.endOffset === range.startContainer.nodeValue.length) && !Dom.next(<HTMLElement>startContainer,isNoEmptyNode, container);
            }
        }

        /*let sel = this.jodit.win.getSelection();
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
            parentBlock = <HTMLElement>Dom.up(container, Dom.isBlock, this.jodit.editor)
        } else if (typeof parentBlock === 'function') {
            parentBlock = <HTMLElement>Dom.up(container, parentBlock, this.jodit.editor)
        } else {
            if (!Dom.isOrContains(parentBlock, container)) {
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
        if (start && container.nodeType === Node.ELEMENT_NODE && ((parentBlock && container === parentBlock.firstChild) || (container === this.jodit.editor.firstChild))) {
            return true;
        }

        // In end some of ELEMENT_NODE
        if (!start && container.nodeType === Node.ELEMENT_NODE && ((parentBlock && container === parentBlock.lastChild) || (container === this.jodit.editor.lastChild))) {
            return true;
        }

        // Caret can be before/after a table
        if (container.nodeName === "TABLE" || (container.previousSibling && container.previousSibling.nodeName === "TABLE")) {
            return (isAfterLastNodeInContainer && !start) || (!isAfterLastNodeInContainer && start);
        }

        node = container;

        if (container.nodeType === Node.TEXT_NODE) {
            if (start && offset === 0) {
                node = Dom.find(node, node => !!node, parentBlock, false, 'previousSibling', 'lastChild');
            } else if (!start && offset === newNodeValue.length) {
                node = Dom.next(node, node => !!node, parentBlock);
            }
        }

        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName !== 'BR') {
                    return false;
                }
            } else if (node.nodeType === Node.TEXT_NODE && !/^[ \t\r\n]*$/.test(node.nodeValue) && !Dom.isEmptyTextNode(node)) {
                return false;
            }

            if (start) {
                node = Dom.find(node, node => !!node, parentBlock, false,  'previousSibling', 'lastChild');
            } else {
                node = Dom.next(node, node => !!node, parentBlock);
            }
        }

        return true;*/
    }

    /**
     * Set cursor before the node
     *
     * @param {Node} node
     * @return {Text} fake invisible textnode. After insert it can be removed
     */
    setCursorBefore(node) {
        if (!(node instanceof (<any>this.jodit.win).Node)) {
            throw new Error('Parameter node most be instance of Node');
        }

        if (!Dom.up(node, (elm) => (elm === this.jodit.editor || elm.parentNode === this.jodit.editor), this.jodit.editor)) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.jodit.win.getSelection(),
            range = this.jodit.doc.createRange(),
            fakeNode = this.jodit.doc.createTextNode(consts.INVISIBLE_SPACE);

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
        if (!(node instanceof (<any>this.jodit.win).Node)) {
            throw new Error('Parameter node most be instance of Node');
        }
        if (!Dom.up(node, (elm) => (elm === this.jodit.editor || elm.parentNode === this.jodit.editor), this.jodit.editor)) {
            throw new Error('Node element must be in editor');
        }

        let sel = this.jodit.win.getSelection(),
            range = this.jodit.doc.createRange();
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
    select(node: Node, inward = false) {
        if (!(node instanceof (<any>this.jodit.win).Node)) {
            throw new Error('Parameter node most be instance of Node');
        }
        if (!Dom.up(node, (elm) => (elm === this.jodit.editor || elm.parentNode === this.jodit.editor), this.jodit.editor)) {
            throw new Error('Node element must be in editor');
        }

        const sel = this.jodit.win.getSelection(),
            range = this.jodit.doc.createRange();

        range[inward ? 'selectNodeContents' : 'selectNode'](node);
        sel.removeAllRanges();
        sel.addRange(range);
    }


    /**
     * Apply some css rules for all selections. It method wraps selections in nodeName tag.
     *
     * @param {object} cssRules
     * @param {string} nodeName
     * @param {object} options
     */
    applyCSS = (cssRules ?: {[key:string]: string}, nodeName:string = 'span', options?: {[key: string]: string|string[]}|{[key: string]: (editor: Jodit, value: string) => boolean}) => {
        const WRAP  = 1;
        const UNWRAP  = 0;

        let mode: 1|0;

        const defaultTag = 'SPAN';

        const findNextCondition = (elm: HTMLElement) => (elm && !Dom.isEmptyTextNode(elm) && !this.isMarker(elm));

        const checkCssRulesFor = (elm: HTMLElement) => {
            return elm.nodeName !== 'FONT' && elm.nodeType === Node.ELEMENT_NODE && each(options, (cssPropertyKey: string, cssPropertyValues: string[]) => {
                const value = css(elm, cssPropertyKey);
                return  cssPropertyValues.indexOf(value.toString().toLowerCase()) !== -1;
            }) !== false
        };

        const isSuitElement = (elm: HTMLElement) => {
            const reg = new RegExp('^' + elm.nodeName + '$', 'i');
            return ((reg.test(nodeName)) || (options && checkCssRulesFor(elm))) && findNextCondition(elm);
        };

        const toggleStyles =  (elm: HTMLElement) => {
            if (isSuitElement(elm)) {
                // toggle CSS rules
                if (elm.nodeName === defaultTag) {
                    Object.keys(cssRules).forEach((rule: string) => {
                        if (mode === UNWRAP || css(elm, rule) == normilizeCSSValue(rule, <string>cssRules[rule])) {
                            css(elm, rule, '');
                            if (mode === undefined) {
                                mode = UNWRAP;
                            }
                        } else {
                            css(elm, rule, cssRules[rule]);
                            if (mode === undefined) {
                                mode = WRAP;
                            }
                        }
                    });
                }

                if (!elm.getAttribute('style') || elm.nodeName !== defaultTag) {
                    Dom.unwrap(elm); // toggle `<strong>test</strong>` toWYSIWYG `test`, and `<span style="">test</span>` toWYSIWYG `test`
                    if (mode === undefined) {
                        mode = UNWRAP;
                    }
                }
            }
        };



        if (!this.isCollapsed()) {
            const selInfo = this.save();
            this.jodit.editor.normalize(); // FF fix for test "commandsTest - Exec command "bold" for some text that contains a few STRONG elements, should unwrap all of these"
            this.jodit.doc.execCommand('fontsize', false, 7);

            $$('font[size="7"]', this.jodit.editor).forEach((font: HTMLFontElement) => {
                if (!Dom.next(font, findNextCondition, <HTMLElement>font.parentNode) && !Dom.prev(font, findNextCondition, <HTMLElement>font.parentNode) && isSuitElement(<HTMLElement>font.parentNode)) {
                    toggleStyles(<HTMLElement>font.parentNode);
                } else if (!Dom.next(font.firstChild, findNextCondition, <HTMLElement>font) && !Dom.prev(font.firstChild, findNextCondition, <HTMLElement>font) && isSuitElement(<HTMLElement>font.firstChild)) {
                    toggleStyles(<HTMLElement>font.firstChild);
                } else if (Dom.closest(font, isSuitElement, this.jodit.editor)) {
                    const leftRange = this.jodit.doc.createRange(),
                        wrapper = <HTMLElement>Dom.closest(font, isSuitElement, this.jodit.editor);

                    leftRange.setStartBefore(wrapper);
                    leftRange.setEndBefore(font);
                    const leftFragment = leftRange.extractContents();

                    if (!trim(leftFragment.textContent).length) {
                        Dom.unwrap(leftFragment.firstChild);
                    }

                    wrapper.parentNode.insertBefore(leftFragment, wrapper);
                    leftRange.setStartAfter(font);
                    leftRange.setEndAfter(wrapper);
                    const rightFragment = leftRange.extractContents();

                    // case then marker can be inside fragnment
                    if (!trim(rightFragment.textContent).length) {
                        Dom.unwrap(rightFragment.firstChild);
                    }

                    Dom.after(wrapper, rightFragment);

                    toggleStyles(wrapper);

                } else {

                    // unwrap all suit elements inside
                    const needUnwrap: Node[] = [];
                    let firstElementSuit: boolean;
                    Dom.find(font.firstChild, (elm: HTMLElement) => {
                        if (elm && isSuitElement(elm)) {
                            if (firstElementSuit === undefined) {
                                firstElementSuit = true;
                            }
                            needUnwrap.push(elm);
                        } else {
                            if (firstElementSuit === undefined) {
                                firstElementSuit = false;
                            }
                        }
                        return false;
                    }, font, true);

                    needUnwrap.forEach(Dom.unwrap);

                    if (!firstElementSuit) {
                        if (mode === undefined) {
                            mode = WRAP;
                        }
                        if (mode === WRAP) {
                            css(Dom.replace(font, nodeName, false, false, this.jodit.doc), nodeName.toUpperCase() === defaultTag ? cssRules : {});
                        }
                    }
                }

                if (font.parentNode) {
                    Dom.unwrap(font);
                }
            });

            this.restore(selInfo);
        } else {
            let clearStyle: boolean = false;
            if (this.current() && Dom.closest(<Node>this.current(), nodeName, this.jodit.editor)) {
                clearStyle = true;
                this.setCursorAfter(Dom.closest(<Node>this.current(), nodeName, this.jodit.editor));
            }

            if (nodeName.toUpperCase() === defaultTag || !clearStyle) {
                const node = Dom.create(nodeName, consts.INVISIBLE_SPACE, this.jodit.doc);
                this.insertNode(node);
                if (nodeName.toUpperCase() === defaultTag) {
                    css(<HTMLElement>node, cssRules);
                }

                this.setCursorIn(node);
            }
        }
    };
}