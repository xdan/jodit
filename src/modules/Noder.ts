import Component from './Component';
import * as consts from '../constants';
import {each} from './Helpers'

export default class Noder extends Component{
    /**
     *
     * @param node
     */
    unwrap(node: Node) {
        let parent = node.parentNode, el = node;
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
    }

    /**
     * It goes through all the internal elements of the node , causing a callback function
     *
     * @param  {HTMLElement} elm elements , the internal node is necessary to sort out
     * @param  {Function} callback It called for each item found
     * @example
     * parent.node.each(parent.selection.current(), function (node) {
     *  if (node.nodeType === Node.TEXT_NODE) {
     *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of the text element codes invisible character
     *  }
     * });
     */
    each (elm: HTMLElement, callback: Function) {
        let node: any = elm;
        do {
            node = this.next(node, (node) => (node), elm);
            if (node) {
                callback.call(node, node);
            }
        } while (node);
    }

    /**
     * Create new element
     *
     * @method create
     * @param  {string} node_name Can be `div`, `span` or `text`
     * @param  {string} [content] Content for new element
     * @return {Node}
     * @example
     * var textnode = parent.node.create('text', 'Hello world');
     * var div = parent.node.create('div', '<img src="test.jpg">');
     */
    create(nodeName: string, content ?: string) : HTMLElement|Text {
        let newnode;
        nodeName = nodeName.toLowerCase();

        if (nodeName === 'text') {
            newnode = this.doc.createTextNode(typeof content === 'string' ? content : '');
        } else {
            newnode = this.doc.createElement(nodeName);
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
     * @return {Node} Returns a new tag
     * @example
     * parent.node.replace(parent.editor.getElementsByTagName('span')[0], 'p'); // Replace the first <span> element to the < p >
     */
    replace (elm, newTagName, withAttributes = false, notMoveContent = false) {
        let tag = typeof newTagName === 'string' ? this.doc.createElement(newTagName) : newTagName;

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

        elm.parentNode.replaceChild(tag, elm);
        return tag;
    }

    /**
     * Check the `node` is a block element
     *
     * @param node
     * @return {boolean}
     */
    isBlock(node) {
        return (node && node.tagName && consts.IS_BLOCK.test(node.tagName))
    }
    /**
     * It's block and it can be split
     *
     */
    canSplitBlock (node: any): boolean {
        return node && node instanceof HTMLElement &&
            this.isBlock(node) &&
            !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
            node.style !== void(0) && !/^(fixed|absolute)/i.test(node.style.position);
    }

    /**
     * Find previous node
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} [root]
     * @param {boolean} [withChild=true]
     *
     * @return {Boolean|Node} false if not found
     */
    prev(node, condition, root, withChild: Boolean = true) {
        return this.find(node, condition, root, false, 'previousSibling', withChild ? 'lastChild' : false);
    }

    /**
     * Find next node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} [root]
     * @param {boolean} [withChild=true]
     * @return {Node|Boolean}
     */
    next(node, condition, root, withChild = true): false|Node|HTMLElement|HTMLTableCellElement{
        return this.find(node, condition, root, undefined, undefined, withChild ? 'firstChild' : '');
    }


    /**
     * Find next/prev node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} [root]
     * @param {boolean} [recurse=false] check first argument
     * @param {string} [sibling=nextSibling] nextSibling or previousSibling
     * @param {string} [child=firstChild] firstChild or lastChild
     * @return {Node|Boolean}
     */
    find(node, condition, root, recurse = false, sibling = 'nextSibling', child: string|false = 'firstChild') : false|Node {
        if (recurse && condition(node)) {
            return node;
        }
        if (!root) {
            root = this.parent.editor;
        }
        let start = node, next;
        do {
            next = start[sibling]
            if (condition(next)) {
                return next;
            }

            if (child && next && next[child]) {
                let nextOne = this.find(next[child], condition, next, true, sibling, child);
                if (nextOne) {
                    return nextOne;
                }
            }

            if (!next) {
                next = start.parentNode;
            }

            start = next;
        } while (start && start !== root)

        return false;
    }

    /**
     * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters , it is also empty )
     *
     * @param  {Node} node The element of wood to be checked
     * @return {Boolean} true element is empty
     */
    isEmptyTextNode(node: Node): boolean {
        return node && node.nodeType === Node.TEXT_NODE && node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '').length === 0;
    }

    /**
     * Returns true if it is a DOM node
     */
    isNode(o: any): boolean {
        if (typeof Node === "object") {
            return o instanceof Node;
        }
        if (typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string") {
            return true;
        }
        return false;
    }

    /**
     * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
     *
     * @param {callback} node
     * @param {function} condition
     * @param {Node} [root] Root element
     * @returns {false|Node} Return false if condition not be true
     */
    up(node: Node, condition: Function, root ?: Node): false|Node|HTMLElement|HTMLTableCellElement|HTMLTableElement {
        if (!root) {
            root = this.parent.editor;
        }
        let start = node;
        if (!node) {
            return false;
        }
        do {
            if (condition(start)) {
                return start;
            }
            start = start.parentNode;
        } while (start && start !== root)

        return false;
    }

    /**
     * Find parent by tag name
     *
     * @param {Node} node
     * @param {String} tags
     * @return {Boolean|Node}
     */
    closest(node: Node, tags): Node|HTMLElement|false|HTMLTableCellElement {
        return this.up(node, (tag) => ((new RegExp('^(' + tags + ')$', 'i')).test(tag.tagName)));
    }

    /**
     * Insert newElement after element
     *
     * @param elm
     * @param newElement
     */
    after(elm, newElement) {
        let parent = elm.parentNode;
        if (parent.lastChild === elm) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, elm.nextSibling);
        }
    }

    all(node, condition) {
        let start = node;
        let nodes = start.childNodes ? Array.prototype.slice.call(start.childNodes) : [];

        if (condition(start)) {
            return start;
        }

        nodes.forEach((child) => {
            this.all(child, condition);
        })
    }
}