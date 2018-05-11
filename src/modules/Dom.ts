/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import * as consts from '../constants';
import {css, each, trim} from './Helpers'
import {Jodit} from "../Jodit";

export class Dom {
    /**
     * Remove all connetn form element
     *
     * @param {Node} node
     */
    static detach(node: Node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    /**
     *
     * @param {Node} current
     * @param {String | Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrapInline = (current: Node, tag: Node|string, editor: Jodit): HTMLElement => {
        let tmp: null | Node,
            first: Node = current,
            last: Node = current;

        const selInfo = editor.selection.save();

        let needFindNext: boolean = false;
        do {
            needFindNext = false;
            tmp = first.previousSibling;
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                first = tmp;
            }
        } while(needFindNext);

        do {
            needFindNext = false;
            tmp = last.nextSibling;
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                last = tmp;
            }
        } while(needFindNext);


        const wrapper = typeof tag === 'string' ? editor.editorDocument.createElement(tag) : tag;

        if (first.parentNode) {
            first.parentNode.insertBefore(wrapper, first);
        }

        let next: Node | null = first;

        while (next) {
            next = first.nextSibling;
            wrapper.appendChild(first);
            if (first === last || !next) {
                break;
            }
            first = next;
        }


        editor.selection.restore(selInfo);

        return <HTMLElement>wrapper;
    };
    /**
     *
     * @param {Node} current
     * @param {String | Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrap = (current: Node, tag: Node | string, editor: Jodit): HTMLElement | null => {

        const selInfo = editor.selection.save();

        const wrapper = typeof tag === 'string' ? editor.editorDocument.createElement(tag) : tag;

        if (!current.parentNode) {
            return null;
        }

        current.parentNode.insertBefore(wrapper, current);

        wrapper.appendChild(current);

        editor.selection.restore(selInfo);

        return <HTMLElement>wrapper;
    };

    /**
     *
     * @param node
     */
    static unwrap(node: Node) {
        let parent: Node | null = node.parentNode,
            el = node;

        if (parent) {
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        }
    }

    /**
     * It goes through all the internal elements of the node , causing a callback function
     *
     * @param  {HTMLElement} elm elements , the internal node is necessary to sort out
     * @param  {Function} callback It called for each item found
     * @example
     * ```javascript
     * Jodit.modules.Dom.each(parent.selection.current(), function (node) {
     *  if (node.nodeType === Node.TEXT_NODE) {
     *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of the text element codes invisible character
     *  }
     * });
     * ```
     */
    static each (elm: Node|HTMLElement, callback: (this: Node, node: Node) => void|false): boolean {
        let node: Node | null | false = elm.firstChild;

        if (node) {
            while (node) {
                if (callback.call(node, node) === false || Dom.each(node, callback) === false) {
                    return false;
                }
                node = Dom.next(node, (node) => (!!node), elm);
            }
        }

        return true;
    }

    /**
     * Create new element
     *
     * @method create
     * @param  {string} nodeName Can be `div`, `span` or `text`
     * @param  {string} content Content for new element
     * @param  {Document} doc
     * @return {HTMLElement|Text}
     * @example
     * ```javascript
     * var textnode = parent.node.create('text', 'Hello world');
     * var div = parent.node.create('div', '<img src="test.jpg">');
     * ```
     * @deprecated
     */
    static create(nodeName: string, content: string|undefined, doc: Document) : HTMLElement | Text {
        let newnode: HTMLElement|Text;
        nodeName = nodeName.toLowerCase();

        if (nodeName === 'text') {
            newnode = doc.createTextNode(typeof content === 'string' ? content : '');
        } else {
            newnode = doc.createElement(nodeName);
            if (content !== undefined) {
                newnode.innerHTML = content;
            }
        }

        return newnode;
    }

    /**
     * Replace one tag to another transfer content
     *
     * @param  {Node} elm The element that needs to be replaced by new
     * @param  {string} newTagName tag name for which will change `elm`
     * @param  {boolean} withAttributes=false If true move tag's attributes
     * @param  {boolean} notMoveContent=false false - Move content from elm to newTagName
     * @param  {Document} [doc=document]
     * @return {Node} Returns a new tag
     * @example
     * ```javascript
     * Jodit.modules.Dom.replace(parent.editor.getElementsByTagName('span')[0], 'p'); // Replace the first <span> element to the < p >
     * ```
     */
    static replace (elm: HTMLElement, newTagName: string | HTMLElement, withAttributes = false, notMoveContent = false, doc: Document): HTMLElement {
        const tag: HTMLElement = typeof newTagName === 'string' ? doc.createElement(newTagName) : newTagName;

        if (!notMoveContent) {
            while (elm.firstChild) {
                tag.appendChild(elm.firstChild);
            }
        }

        if (withAttributes) {
            each(elm.attributes,  (i, attr) => {
                tag.setAttribute(attr.name, attr.nodeValue);
            });
        }

        if (elm.parentNode) {
            elm.parentNode.replaceChild(tag, elm);
        }

        return tag;
    }

    /**
     *  Check if element is table cell
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isCell(elm: Node, win: Window): boolean {
        return Dom.isNode(elm, win) && /^(td|th)$/i.test(elm.nodeName)
    }

    /**
     * Check is element is Image element
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isImage(elm: Node, win: Window): boolean {
        return Dom.isNode(elm, win) && /^(img|svg|picture|canvas)$/i.test(elm.nodeName)
    }

    /**
     * Check the `node` is a block element
     *
     * @param node
     * @return {boolean}
     */
    static isBlock(node: Node | null): boolean {
        return (!!node && typeof node.nodeName === 'string' && consts.IS_BLOCK.test(node.nodeName));
    }

    static isInlineBlock(node: Node | null): boolean {
        return !!node && node.nodeType === Node.ELEMENT_NODE && ['inline', 'inline-block'].indexOf(css(<HTMLElement>node, 'display').toString()) !== -1;
    }
    /**
     * It's block and it can be split
     *
     */
    static canSplitBlock (node: any, win: Window): boolean {
        return node && node instanceof (<any>win).HTMLElement &&
            this.isBlock(node) &&
            !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
            node.style !== void(0) && !/^(fixed|absolute)/i.test(node.style.position);
    }

    /**
     * Find previous node
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} root
     * @param {boolean} [withChild=true]
     *
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement} false if not found
     */
    static prev(node: Node, condition: (element: Node | null) => boolean | null, root: HTMLElement, withChild: Boolean = true): false|Node|HTMLElement|HTMLTableCellElement{
        return Dom.find(node, condition, root, false, 'previousSibling', withChild ? 'lastChild' : false);
    }

    /**
     * Find next node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} root
     * @param {boolean} [withChild=true]
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement}
     */
    static next(node: Node, condition: (element: Node | null) => boolean | null, root: Node|HTMLElement, withChild: Boolean = true): false|Node|HTMLElement|HTMLTableCellElement {
        return Dom.find(node, condition, root, undefined, undefined, withChild ? 'firstChild' : '');
    }


    /**
     * Find next/prev node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} root
     * @param {boolean} [recurse=false] check first argument
     * @param {string} [sibling=nextSibling] nextSibling or previousSibling
     * @param {string|boolean} [child=firstChild] firstChild or lastChild
     * @return {Node|Boolean}
     */
    static find(node: Node, condition: (element: Node|null) => boolean | null, root: HTMLElement | Node, recurse = false, sibling = 'nextSibling', child: string|false = 'firstChild') : false|Node {
        if (recurse && condition(node)) {
            return node;
        }

        let start: Node|null = node, next: Node|null;

        do {
            next = (<any>start)[sibling];
            if (condition(next)) {
                return next ? next : false;
            }

            if (child && next && (<any>next)[child]) {
                const nextOne: Node|false = Dom.find((<any>next)[child], condition, next, true, sibling, child);
                if (nextOne) {
                    return nextOne;
                }
            }

            if (!next) {
                next = start.parentNode;
            }

            start = next;
        } while (start && start !== root);

        return false;
    }

    static findInline = (node: Node | null, toLeft: boolean, root: Node): Node | null => {
        let prevElement: Node | null = node,
            nextElement: Node | null = null;

        do {
            if (prevElement) {
                nextElement = toLeft ? prevElement.previousSibling : prevElement.nextSibling;
                if (!nextElement && prevElement.parentNode && prevElement.parentNode !== root && Dom.isInlineBlock(prevElement.parentNode)) {
                    prevElement = prevElement.parentNode;
                } else {
                    break;
                }
            } else {
                break;
            }
        } while(!nextElement);

        while (nextElement && Dom.isInlineBlock(nextElement) && (!toLeft ? nextElement.firstChild : nextElement.lastChild)) {
            nextElement = !toLeft ? nextElement.firstChild : nextElement.lastChild;
        }

        return nextElement;//(nextElement !== root && Dom.isInlineBlock(nextElement)) ? nextElement : null;
    };

    /**
     * Find next/prev node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} root
     * @param {string} [sibling=nextSibling] nextSibling or previousSibling
     * @param {string|boolean} [child=firstChild] firstChild or lastChild
     * @return {Node|Boolean}
     */
    static findWithCurrent(node: Node, condition: (element: Node|null) => boolean, root: HTMLElement|Node, sibling: 'nextSibling'|'previousSibling' = 'nextSibling', child: 'firstChild' | 'lastChild' = 'firstChild') : false|Node {
        let next: Node|null = node;

        do {
            if (condition(next)) {
                return next ? next : false;
            }

            if (child && next && next[child]) {
                const nextOne: Node|false = Dom.findWithCurrent(<Node>next[child], condition, next, sibling, child);
                if (nextOne) {
                    return nextOne;
                }
            }

            while (next && !next[sibling] && next !== root) {
                next = next.parentNode;
            }

            if (next && next[sibling] && next !== root) {
                next = next[sibling];
            }
        } while (next && next !== root);

        return false;
    }

    /**
     * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters , it is also empty )
     *
     * @param  {Node} node The element of wood to be checked
     * @return {Boolean} true element is empty
     */
    static isEmptyTextNode(node: Node): boolean {
        return node && node.nodeType === Node.TEXT_NODE && (!node.nodeValue || node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '').length === 0);
    }

    /**
     * Check if element is not empty
     *
     * @param {Node} node
     * @param {RegExp} condNoEmptyElement
     * @return {boolean}
     */
    static isEmpty(node: Node, condNoEmptyElement: RegExp = /^(img|svg|canvas|input|textarea|form)$/): boolean {

        if (!node) {
            return true;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue === null || trim(node.nodeValue).length === 0;
        }

        return !node.nodeName.toLowerCase().match(condNoEmptyElement) && Dom.each(<HTMLElement>node, (elm: Node | null): false | void => {
            if (
                (
                    elm && elm.nodeType === Node.TEXT_NODE &&
                    (
                        elm.nodeValue !== null &&
                        trim(elm.nodeValue).length !== 0
                    )
                ) ||
                (
                    elm && elm.nodeType === Node.ELEMENT_NODE &&
                    elm.nodeName.toLowerCase().match(condNoEmptyElement)
                )
            ) {
                return false;
            }
        });
    }

    /**
     * Returns true if it is a DOM node
     */
    static isNode(object: any, win: Window): boolean {
        if (typeof (<any>win) === "object") {
            return object instanceof (<any>win).Node;
        }

        return typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
    }

    /**
     * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
     *
     * @param {callback} node
     * @param {function} condition
     * @param {Node} root Root element
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement|HTMLTableElement} Return false if condition not be true
     */
    static up(node: Node, condition: Function, root: Node): false|Node|HTMLElement|HTMLTableCellElement|HTMLTableElement {
        let start = node;
        if (!node) {
            return false;
        }
        do {
            if (condition(start)) {
                return start;
            }
            if (start === root || !start.parentNode) {
                break;
            }
            start = start.parentNode;
        } while (start && start !== root);

        return false;
    }

    /**
     * Find parent by tag name
     *
     * @param {Node} node
     * @param {String|Function} tags
     * @param {HTMLElement} root
     * @return {Boolean|Node}
     */
    static closest(node: Node, tags: string|Function|RegExp, root: HTMLElement): Node | HTMLTableElement | HTMLElement | false | HTMLTableCellElement {
        let condition: Function;

        if (typeof tags  === 'function') {
            condition = tags
        } else if (tags instanceof RegExp) {
            condition = (tag: Node) => tags.test(tag.nodeName)
        } else {
            condition = (tag: Node) => (new RegExp('^(' + tags + ')$', 'i')).test(tag.nodeName)
        }

        return Dom.up(node, condition, root);
    }

    /**
     * Insert newElement after element
     *
     * @param elm
     * @param newElement
     */
    static after(elm: HTMLElement, newElement: HTMLElement | DocumentFragment) {
        const parentNode: Node | null = elm.parentNode;

        if (!parentNode) {
            return;
        }

        if (parentNode.lastChild === elm) {
            parentNode.appendChild(newElement);
        } else {
            parentNode.insertBefore(newElement, elm.nextSibling);
        }
    }

    /**
     * Move all content to another element
     *
     * @param {Node} from
     * @param {Node} to
     * @param {boolean} inStart
     */
    static moveContent(from: Node, to: Node, inStart: boolean = false) {
        const fragment: DocumentFragment = from.ownerDocument.createDocumentFragment();

        [].slice.call(from.childNodes).forEach((node: Node) => {
            if (node.nodeType !== Node.TEXT_NODE || node.nodeValue !== consts.INVISIBLE_SPACE) {
                fragment.appendChild(node);
            }
        });

        if (!inStart || !to.firstChild) {
            to.appendChild(fragment);
        } else {
            to.insertBefore(fragment, to.firstChild);
        }
    }

    static all(node: Node, condition: (element: Node) => boolean|void, prev: boolean = false): Node|void {
        let nodes: Node[] = node.childNodes ? Array.prototype.slice.call(node.childNodes) : [];

        if (condition(node)) {
            return node;
        }

        if (prev) {
            nodes = nodes.reverse();
        }

        nodes.forEach((child) => {
            Dom.all(child, condition, prev);
        })
    }

    /**
     * Check root contains child
     *
     * @param root
     * @param child
     * @return {boolean}
     */
    static contains = (root: Node, child: Node): boolean => {
        while (child.parentNode) {
            if (child.parentNode === root) {
                return true;
            }
            child = child.parentNode;
        }

        return false;
    };

    /**
     * Check root contains child or equal child
     *
     * @param {Node} root
     * @param {Node} child
     * @param {boolean} onlyContains
     * @return {boolean}
     */
    static isOrContains = (root: Node, child: Node, onlyContains: boolean = false): boolean => {
        return child && root && ((root === child && !onlyContains) || Dom.contains(root, child));
    };
}