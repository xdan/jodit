/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
export declare class Dom {
    /**
     * Remove all connetn form element
     *
     * @param {Node} node
     */
    static detach(node: Node): void;
    /**
     *
     * @param {Node} current
     * @param {String | Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrapInline: (current: Node, tag: string | Node, editor: Jodit) => HTMLElement;
    /**
     *
     * @param {Node} current
     * @param {String | Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrap: (current: Node, tag: string | Node, editor: Jodit) => HTMLElement | null;
    /**
     *
     * @param node
     */
    static unwrap(node: Node): void;
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
    static each(elm: Node | HTMLElement, callback: (this: Node, node: Node) => void | false): boolean;
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
    static create(nodeName: string, content: string | undefined, doc: Document): HTMLElement | Text;
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
    static replace(elm: HTMLElement, newTagName: string | HTMLElement, withAttributes: boolean | undefined, notMoveContent: boolean | undefined, doc: Document): HTMLElement;
    /**
     *  Check if element is table cell
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isCell(elm: Node, win: Window): boolean;
    /**
     * Check is element is Image element
     *
     * @param {Node} elm
     * @param {Window} win
     * @return {boolean}
     */
    static isImage(elm: Node, win: Window): boolean;
    /**
     * Check the `node` is a block element
     *
     * @param node
     * @return {boolean}
     */
    static isBlock(node: Node | null): boolean;
    static isInlineBlock(node: Node | null): boolean;
    /**
     * It's block and it can be split
     *
     */
    static canSplitBlock(node: any, win: Window): boolean;
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
    static prev(node: Node, condition: (element: Node | null) => boolean | null, root: HTMLElement, withChild?: Boolean): false | Node | HTMLElement | HTMLTableCellElement;
    /**
     * Find next node what `condition(next) === true`
     *
     * @param {Node} node
     * @param {function} condition
     * @param {Node} root
     * @param {boolean} [withChild=true]
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement}
     */
    static next(node: Node, condition: (element: Node | null) => boolean | null, root: Node | HTMLElement, withChild?: Boolean): false | Node | HTMLElement | HTMLTableCellElement;
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
    static find(node: Node, condition: (element: Node | null) => boolean | null, root: HTMLElement | Node, recurse?: boolean, sibling?: string, child?: string | false): false | Node;
    static findInline: (node: Node | null, toLeft: boolean, root: Node) => Node | null;
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
    static findWithCurrent(node: Node, condition: (element: Node | null) => boolean, root: HTMLElement | Node, sibling?: 'nextSibling' | 'previousSibling', child?: 'firstChild' | 'lastChild'): false | Node;
    /**
     * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters , it is also empty )
     *
     * @param  {Node} node The element of wood to be checked
     * @return {Boolean} true element is empty
     */
    static isEmptyTextNode(node: Node): boolean;
    /**
     * Check if element is not empty
     *
     * @param {Node} node
     * @param {RegExp} condNoEmptyElement
     * @return {boolean}
     */
    static isEmpty(node: Node, condNoEmptyElement?: RegExp): boolean;
    /**
     * Returns true if it is a DOM node
     */
    static isNode(object: any, win: Window): boolean;
    /**
     * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
     *
     * @param {callback} node
     * @param {function} condition
     * @param {Node} root Root element
     * @return {boolean|Node|HTMLElement|HTMLTableCellElement|HTMLTableElement} Return false if condition not be true
     */
    static up(node: Node, condition: Function, root: Node): false | Node | HTMLElement | HTMLTableCellElement | HTMLTableElement;
    /**
     * Find parent by tag name
     *
     * @param {Node} node
     * @param {String|Function} tags
     * @param {HTMLElement} root
     * @return {Boolean|Node}
     */
    static closest(node: Node, tags: string | Function | RegExp, root: HTMLElement): Node | HTMLTableElement | HTMLElement | false | HTMLTableCellElement;
    /**
     * Insert newElement after element
     *
     * @param elm
     * @param newElement
     */
    static after(elm: HTMLElement, newElement: HTMLElement | DocumentFragment): void;
    /**
     * Move all content to another element
     *
     * @param {Node} from
     * @param {Node} to
     * @param {boolean} inStart
     */
    static moveContent(from: Node, to: Node, inStart?: boolean): void;
    static all(node: Node, condition: (element: Node) => boolean | void, prev?: boolean): Node | void;
    /**
     * Check root contains child
     *
     * @param root
     * @param child
     * @return {boolean}
     */
    static contains: (root: Node, child: Node) => boolean;
    /**
     * Check root contains child or equal child
     *
     * @param {Node} root
     * @param {Node} child
     * @param {boolean} onlyContains
     * @return {boolean}
     */
    static isOrContains: (root: Node, child: Node, onlyContains?: boolean) => boolean;
}
