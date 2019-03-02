/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import * as consts from '../constants';
import { HTMLTagNames, IJodit, NodeCondition } from '../types';
import { css } from './helpers/';
import { trim } from './helpers/string';

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
    static wrapInline = (
        current: Node,
        tag: Node | HTMLTagNames,
        editor: IJodit
    ): HTMLElement => {
        let tmp: null | Node,
            first: Node = current,
            last: Node = current;

        const selInfo = editor.selection.save();

        let needFindNext: boolean = false;

        do {
            needFindNext = false;
            tmp = first.previousSibling;
            if (tmp && !Dom.isBlock(tmp, editor.editorWindow)) {
                needFindNext = true;
                first = tmp;
            }
        } while (needFindNext);

        do {
            needFindNext = false;
            tmp = last.nextSibling;
            if (tmp && !Dom.isBlock(tmp, editor.editorWindow)) {
                needFindNext = true;
                last = tmp;
            }
        } while (needFindNext);

        const wrapper =
            typeof tag === 'string' ? editor.create.inside.element(tag) : tag;

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

        return wrapper as HTMLElement;
    };

    /**
     *
     * @param {Node} current
     * @param {String | Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrap = (
        current: Node,
        tag: Node | string,
        editor: IJodit
    ): HTMLElement | null => {
        const selInfo = editor.selection.save();

        const wrapper =
            typeof tag === 'string'
                ? editor.editorDocument.createElement(tag)
                : tag;

        if (!current.parentNode) {
            return null;
        }

        current.parentNode.insertBefore(wrapper, current);

        wrapper.appendChild(current);

        editor.selection.restore(selInfo);

        return wrapper as HTMLElement;
    };

    /**
     *
     * @param node
     */
    static unwrap(node: Node) {
        const parent: Node | null = node.parentNode,
            el = node;

        if (parent) {
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }

            Dom.safeRemove(el);
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
     *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of
     *      the text element codes invisible character
     *  }
     * });
     * ```
     */
    static each(
        elm: Node | HTMLElement,
        callback: (this: Node, node: Node) => void | false
    ): boolean {
        let node: Node | null | false = elm.firstChild;

        if (node) {
            while (node) {
                if (
                    callback.call(node, node) === false ||
                    !Dom.each(node, callback)
                ) {
                    return false;
                }
                node = Dom.next(node, nd => !!nd, elm);
            }
        }

        return true;
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
     * Jodit.modules.Dom.replace(parent.editor.getElementsByTagName('span')[0], 'p');
     * // Replace the first <span> element to the < p >
     * ```
     */
    static replace(
        elm: HTMLElement,
        newTagName: string | HTMLElement,
        withAttributes = false,
        notMoveContent = false,
        doc: Document
    ): HTMLElement {
        const tag: HTMLElement =
            typeof newTagName === 'string'
                ? doc.createElement(newTagName)
                : newTagName;

        if (!notMoveContent) {
            while (elm.firstChild) {
                tag.appendChild(elm.firstChild);
            }
        }

        if (withAttributes) {
            Array.from(elm.attributes).forEach(attr => {
                tag.setAttribute(attr.name, attr.value);
            });
        }

        if (elm.parentNode) {
            elm.parentNode.replaceChild(tag, elm);
        }

        return tag;
    }

    /**
     * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters ,
     * it is also empty )
     *
     * @param  {Node} node The element of wood to be checked
     * @return {Boolean} true element is empty
     */
    static isEmptyTextNode(node: Node): boolean {
        return (
            node &&
            node.nodeType === Node.TEXT_NODE &&
            (!node.nodeValue ||
                node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '')
                    .length === 0)
        );
    }

    /**
     * Check if element is not empty
     *
     * @param {Node} node
     * @param {RegExp} condNoEmptyElement
     * @return {boolean}
     */
    static isEmpty(
        node: Node,
        condNoEmptyElement: RegExp = /^(img|svg|canvas|input|textarea|form)$/
    ): boolean {
        if (!node) {
            return true;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue === null || trim(node.nodeValue).length === 0;
        }

        return (
            !node.nodeName.toLowerCase().match(condNoEmptyElement) &&
            Dom.each(
                node as HTMLElement,
                (elm: Node | null): false | void => {
                    if (
                        (elm &&
                            elm.nodeType === Node.TEXT_NODE &&
                            (elm.nodeValue !== null &&
                                trim(elm.nodeValue).length !== 0)) ||
                        (elm &&
                            elm.nodeType === Node.ELEMENT_NODE &&
                            condNoEmptyElement.test(elm.nodeName.toLowerCase()))
                    ) {
                        return false;
                    }
                }
            )
        );
    }

    /**
     * Returns true if it is a DOM node
     */
    static isNode(object: unknown, win?: Window): object is Node {
        if (
            typeof win === 'object' &&
            win &&
            (typeof (win as any).Node === 'function' || typeof (win as any).Node === 'object')
        ) {
            return object instanceof (win as any).Node; // for Iframe Node !== iframe.contentWindow.Node
        }

        return false;
    }

    /**
     *  Check if element is table cell
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isCell(elm: unknown, win: Window): elm is HTMLTableCellElement {
        return Dom.isNode(elm, win) && /^(td|th)$/i.test(elm.nodeName);
    }

    /**
     * Check is element is Image element
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isImage(elm: unknown, win: Window): elm is HTMLImageElement {
        return (
            Dom.isNode(elm, win) &&
            /^(img|svg|picture|canvas)$/i.test(elm.nodeName)
        );
    }

    /**
     * Check the `node` is a block element
     *
     * @param node
     * @param win
     *
     * @return {boolean}
     */
    static isBlock(node: unknown, win: Window): boolean {
        return (
            node &&
            typeof node === 'object' &&
            Dom.isNode(node, win) &&
            consts.IS_BLOCK.test((<Node>node).nodeName)
        );
    }

    /**
     * Check element is inline block
     *
     * @param node
     */
    static isInlineBlock(node: unknown): boolean {
        return (
            !!node &&
            (<Node>node).nodeType === Node.ELEMENT_NODE &&
            ['inline', 'inline-block'].indexOf(
                css(node as HTMLElement, 'display').toString()
            ) !== -1
        );
    }

    /**
     * It's block and it can be split
     *
     */
    static canSplitBlock(node: any, win: Window): boolean {
        return (
            node &&
            node instanceof (win as any).HTMLElement &&
            this.isBlock(node, win) &&
            !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
            node.style !== void 0 &&
            !/^(fixed|absolute)/i.test(node.style.position)
        );
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
    static prev(
        node: Node,
        condition: NodeCondition,
        root: HTMLElement,
        withChild: boolean = true
    ): false | Node | HTMLElement | HTMLTableCellElement {
        return Dom.find(
            node,
            condition,
            root,
            false,
            'previousSibling',
            withChild ? 'lastChild' : false
        );
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
    static next(
        node: Node,
        condition: NodeCondition,
        root: Node | HTMLElement,
        withChild: boolean = true
    ): false | Node | HTMLElement | HTMLTableCellElement {
        return Dom.find(
            node,
            condition,
            root,
            undefined,
            undefined,
            withChild ? 'firstChild' : ''
        );
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
    static find(
        node: Node,
        condition: NodeCondition,
        root: HTMLElement | Node,
        recurse = false,
        sibling = 'nextSibling',
        child: string | false = 'firstChild'
    ): false | Node {
        if (recurse && condition(node)) {
            return node;
        }

        let start: Node | null = node,
            next: Node | null;

        do {
            next = (start as any)[sibling];
            if (condition(next)) {
                return next ? next : false;
            }

            if (child && next && (next as any)[child]) {
                const nextOne: Node | false = Dom.find(
                    (next as any)[child],
                    condition,
                    next,
                    true,
                    sibling,
                    child
                );
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

    /**
     * Find next/previous inline element
     *
     * @param node
     * @param toLeft
     * @param root
     */
    static findInline = (
        node: Node | null,
        toLeft: boolean,
        root: Node
    ): Node | null => {
        let prevElement: Node | null = node,
            nextElement: Node | null = null;

        do {
            if (prevElement) {
                nextElement = toLeft
                    ? prevElement.previousSibling
                    : prevElement.nextSibling;
                if (
                    !nextElement &&
                    prevElement.parentNode &&
                    prevElement.parentNode !== root &&
                    Dom.isInlineBlock(prevElement.parentNode)
                ) {
                    prevElement = prevElement.parentNode;
                } else {
                    break;
                }
            } else {
                break;
            }
        } while (!nextElement);

        while (
            nextElement &&
            Dom.isInlineBlock(nextElement) &&
            (!toLeft ? nextElement.firstChild : nextElement.lastChild)
        ) {
            nextElement = !toLeft
                ? nextElement.firstChild
                : nextElement.lastChild;
        }

        return nextElement; // (nextElement !== root && Dom.isInlineBlock(nextElement)) ? nextElement : null;
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
    static findWithCurrent(
        node: Node,
        condition: NodeCondition,
        root: HTMLElement | Node,
        sibling: 'nextSibling' | 'previousSibling' = 'nextSibling',
        child: 'firstChild' | 'lastChild' = 'firstChild'
    ): false | Node {
        let next: Node | null = node;

        do {
            if (condition(next)) {
                return next ? next : false;
            }

            if (child && next && next[child]) {
                const nextOne: Node | false = Dom.findWithCurrent(
                    next[child] as Node,
                    condition,
                    next,
                    sibling,
                    child
                );
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
     * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
     *
     * @param {callback} node
     * @param {function} condition
     * @param {Node} root Root element
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement|HTMLTableElement} Return false if condition not be true
     */
    static up(
        node: Node,
        condition: NodeCondition,
        root: Node
    ): false | Node | HTMLElement | HTMLTableCellElement | HTMLTableElement {
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
    static closest(
        node: Node,
        tags: string | NodeCondition | RegExp,
        root: HTMLElement
    ): Node | HTMLTableElement | HTMLElement | false | HTMLTableCellElement {
        let condition: NodeCondition;

        if (typeof tags === 'function') {
            condition = tags;
        } else if (tags instanceof RegExp) {
            condition = (tag: Node | null) => tag && tags.test(tag.nodeName);
        } else {
            condition = (tag: Node | null) =>
                tag && new RegExp('^(' + tags + ')$', 'i').test(tag.nodeName);
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
        const fragment: DocumentFragment = (
            from.ownerDocument || document
        ).createDocumentFragment();

        [].slice.call(from.childNodes).forEach((node: Node) => {
            if (
                node.nodeType !== Node.TEXT_NODE ||
                node.nodeValue !== consts.INVISIBLE_SPACE
            ) {
                fragment.appendChild(node);
            }
        });

        if (!inStart || !to.firstChild) {
            to.appendChild(fragment);
        } else {
            to.insertBefore(fragment, to.firstChild);
        }
    }

    /**
     * Call callback condition function for all elements of node
     *
     * @param node
     * @param condition
     * @param prev
     */
    static all(
        node: Node,
        condition: NodeCondition,
        prev: boolean = false
    ): Node | void {
        let nodes: Node[] = node.childNodes
            ? Array.prototype.slice.call(node.childNodes)
            : [];

        if (condition(node)) {
            return node;
        }

        if (prev) {
            nodes = nodes.reverse();
        }

        nodes.forEach(child => {
            Dom.all(child, condition, prev);
        });
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
    static isOrContains = (
        root: Node,
        child: Node,
        onlyContains: boolean = false
    ): boolean => {
        return (
            child &&
            root &&
            ((root === child && !onlyContains) || Dom.contains(root, child))
        );
    };

    /**
     * Safe remove element from DOM
     *
     * @param node
     */
    static safeRemove(node: Node | false | null) {
        node && node.parentNode && node.parentNode.removeChild(node);
    }
}
