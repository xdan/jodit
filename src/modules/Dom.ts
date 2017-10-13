import * as consts from '../constants';
import {each, trim} from './Helpers'
import Jodit from "../Jodit";

export default class Dom {
    /**
     *
     * @param {Node} current
     * @param {String|Node} tag
     * @param {Jodit} editor
     *
     * @return {HTMLElement}
     */
    static wrap = (current, tag: Node|string, editor: Jodit): HTMLElement => {
        let tmp: false|Node|HTMLElement|HTMLTableCellElement,
            first: Node = current,
            last: Node = current;

        const selInfo = editor.selection.save();

        let needFindNext: boolean = false;
        do {
            needFindNext = false;
            tmp = Dom.prev(first, (elm) => !!elm, editor.editor, false);
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                first = tmp;
            }
        } while(needFindNext);

        do {
            needFindNext = false;
            tmp = Dom.next(last, (elm) => !!elm, editor.editor, false);
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                last = tmp;
            }
        } while(needFindNext);


        const wrapper = typeof tag === 'string' ? Dom.create(tag, '', editor.editorDocument) : tag;

        first.parentNode.insertBefore(wrapper, first);

        let next = first;
        while (next) {
            next = first.nextSibling;
            wrapper.appendChild(first);
            if (first === last) {
                break;
            }
            first = next;
        }


        editor.selection.restore(selInfo);

        return <HTMLElement>wrapper;
    };

    /**
     *
     * @param node
     */
    static unwrap(node: Node) {
        let parent = node.parentNode,
            el = node;

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
     * ```javascript
     * Jodit.modules.Dom.each(parent.selection.current(), function (node) {
     *  if (node.nodeType === Node.TEXT_NODE) {
     *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of the text element codes invisible character
     *  }
     * });
     * ```
     */
    static each (elm: HTMLElement, callback: (this: Node, node: Node) => void|false): boolean {
        let node: any = elm.firstChild;

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
     */
    static create(nodeName: string, content: string, doc: Document) : HTMLElement|Text {
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
    static replace (elm: HTMLElement, newTagName: string|HTMLElement, withAttributes = false, notMoveContent = false, doc: Document): HTMLElement {
        const tag: HTMLElement = typeof newTagName === 'string' ? <HTMLElement>Dom.create(newTagName, '', doc) : newTagName;

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
    static isBlock(node): boolean {
        return (node && typeof node.tagName === 'string' && consts.IS_BLOCK.test(node.tagName));
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
    static prev(node: Node, condition: (element: Node) => boolean, root: HTMLElement, withChild: Boolean = true): false|Node|HTMLElement|HTMLTableCellElement{
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
    static next(node: Node, condition: (element: Node) => boolean, root: HTMLElement, withChild: Boolean = true): false|Node|HTMLElement|HTMLTableCellElement {
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
    static find(node: Node, condition: (element: Node) => boolean, root: HTMLElement, recurse = false, sibling = 'nextSibling', child: string|false = 'firstChild') : false|Node {
        if (recurse && condition(node)) {
            return node;
        }

        let start = node, next;
        do {
            next = start[sibling];
            if (condition(next)) {
                return next;
            }

            if (child && next && next[child]) {
                const nextOne = Dom.find(next[child], condition, next, true, sibling, child);
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
     * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters , it is also empty )
     *
     * @param  {Node} node The element of wood to be checked
     * @return {Boolean} true element is empty
     */
    static isEmptyTextNode(node: Node): boolean {
        return node && node.nodeType === Node.TEXT_NODE && node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '').length === 0;
    }

    static isEmpty(node: Node): boolean {
        if (!node) {
            return true;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            return trim(node.nodeValue).length === 0;
        }

        return Dom.each(<HTMLElement>node, (elm: Node) => {
            if ((elm.nodeType === Node.TEXT_NODE && trim(elm.nodeValue).length !== 0) || (elm.nodeType === Node.ELEMENT_NODE && elm.nodeName.match(/^(img|table)$/i))) {
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
            if (start === root) {
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
    static closest(node: Node, tags: string|Function|RegExp, root: HTMLElement): Node|HTMLTableElement|HTMLElement|false|HTMLTableCellElement {
        let condition;
        if (typeof tags  === 'function') {
            condition = tags
        } else if (tags instanceof RegExp) {
            condition = tag => tags.test(tag.tagName)
        } else {
            condition = tag => (new RegExp('^(' + tags + ')$', 'i')).test(tag.tagName)
        }
        return Dom.up(node, condition, root);
    }

    /**
     * Insert newElement after element
     *
     * @param elm
     * @param newElement
     */
    static after(elm: HTMLElement, newElement: HTMLElement|DocumentFragment) {
        const parentNode = elm.parentNode;
        if (parentNode.lastChild === elm) {
            parentNode.appendChild(newElement);
        } else {
            parentNode.insertBefore(newElement, elm.nextSibling);
        }
    }

    static all(node: Node, condition: (element: Node) => boolean|void) {
        const start = node,
            nodes = start.childNodes ? Array.prototype.slice.call(start.childNodes) : [];

        if (condition(start)) {
            return start;
        }

        nodes.forEach((child) => {
            Dom.all(child, condition);
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
     * @param root
     * @param child
     * @return {boolean}
     */
    static isOrContains = (root: Node, child: Node): boolean => {
        return root === child || Dom.contains(root, child);
    };

   /*static apply = (options, addPropertyCallback, editor: Jodit) => {
         const WRAP  = 1;
         const UNWRAP  = 0;
         let selectionInfo,
             mode;

         // const getCSS = (elm: HTMLElement, key: string): string => {
         //         return editor.editorWindow.getComputedStyle(elm).getPropertyValue(key).toString()
         //     },
         const checkCssRulesFor = (elm: HTMLElement) => {
             return elm.nodeType === Node.ELEMENT_NODE && each(options.css, (cssPropertyKey: string, cssPropertyValues: string[]) => {
                 const value = css(elm, cssPropertyKey);
                 return  cssPropertyValues.indexOf(value.toString().toLowerCase()) !== -1
             }) !== false
         };

         const oldWrappers = [];

         editor.selection.eachSelection((current) => {
             let sel = editor.editorWindow.getSelection(),
                 wrapper,
                 range = sel.getRangeAt(0);

             wrapper = <HTMLElement>Dom.closest(current, (elm) => {
                 return checkCssRulesFor(<HTMLElement>elm);
             }, editor.editor);

             if (wrapper && oldWrappers.reduce((was, oldWprapper) => {
                     return was || oldWprapper === wrapper
                 }, false)) {
                 return;
             }

             if (mode === undefined) {
                 mode = wrapper ? UNWRAP : WRAP;
             }

             if (wrapper) {
                 // element full selected !range.collapsed && editor.selection.cursorInTheEdge(true, wrapper) && editor.selection.cursorInTheEdge(false, wrapper)
                 if (!range.collapsed) {
                     let cursorInTheStart = editor.selection.cursorInTheEdge(true, wrapper),
                         cursorInTheEnd = editor.selection.cursorInTheEdge(false, wrapper);

                     selectionInfo = editor.selection.save();

                     if (cursorInTheStart === false || cursorInTheEnd === false) {
                         let leftRange = editor.editorDocument.createRange();

                         if (cursorInTheStart) {
                             leftRange.setStart(range.endContainer, range.endOffset);
                             leftRange.setEndAfter(wrapper);
                             let fragment = leftRange.extractContents();
                             Dom.after(wrapper, fragment)
                         } else if (cursorInTheEnd) {
                             leftRange.setStartBefore(wrapper);
                             leftRange.setEnd(range.startContainer, range.startOffset);
                             let fragment = leftRange.extractContents();
                             wrapper.parentNode.insertBefore(fragment, wrapper);
                         } else {
                             let cloneRange = range.cloneRange();
                             leftRange.setStartBefore(wrapper);
                             leftRange.setEnd(cloneRange.startContainer, cloneRange.startOffset);
                             let fragment = leftRange.extractContents();
                             wrapper.parentNode.insertBefore(fragment, wrapper);
                             leftRange.setStart(cloneRange.endContainer, cloneRange.endOffset);
                             leftRange.setEndAfter(wrapper);
                             fragment = leftRange.extractContents();
                             Dom.after(wrapper, fragment)
                         }
                     }

                 } else {
                     if (editor.selection.cursorInTheEdge(true, wrapper)) {
                         editor.selection.setCursorBefore(wrapper);
                     } else {
                         editor.selection.setCursorAfter(wrapper);
                     }
                     return false;
                 }




                 // wrapper already exists
                 if (options.tagRegExp && wrapper.tagName.toLowerCase().match(options.tagRegExp)) {
                     while (wrapper.firstChild) {
                         wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                     }

                     editor.selection.restore(selectionInfo);
                     wrapper.parentNode.removeChild(wrapper); // because in FF selection can be inside wrapper
                 } else {
                     each(options.css, (cssPropertyKey) => {
                         wrapper.style.removeProperty(cssPropertyKey);
                     });

                     if (!wrapper.getAttribute('style')) {
                         wrapper.removeAttribute('style')
                     }

                     wrapper.normalize();

                     editor.selection.restore(selectionInfo);
                 }

                 editor.setEditorValue();
                 return false;
             }

             if (mode === WRAP) {
                 wrapper = addPropertyCallback(options);
                 wrapper.normalize();
             }

             if (wrapper) {
                 oldWrappers.push(wrapper);
             }
         });
     }*/
}