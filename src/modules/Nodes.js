import Component from './Component';
import * as consts from '../constants';
import {each} from '../modules/Helpers'

export default class Nodes extends Component{
    /**
     * Create DOM element from HTML text
     *
     * @param {string} html
     */
    dom(html) {
        let div = this.create('div');
        div.innerHTML = html;
        return div.firstChild;
    }

    unwrap(node) {
        let parent = node.parentNode, el = node;
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
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
    create = function (nodeName, content) {
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
     * @param {Node} node
     * @return {boolean}
     */
    canSplitBlock (node) {
        return node && node instanceof this.win.Node &&
            this.isBlock(node) &&
            !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
            !/^(fixed|absolute)/i.test(node.style.position);
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
    prev(node, condition, root, withChild = true) {
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
    next(node, condition, root, withChild = true) {
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
    find(node, condition, root, recurse = false, sibling = 'nextSibling', child = 'firstChild') {
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
     * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
     *
     * @param {callback} node
     * @param {function} condition
     * @param {Node} [root] Root element
     * @returns {Boolean|Node} Return false if condition not be true
     */
    up(node, condition, root) {
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