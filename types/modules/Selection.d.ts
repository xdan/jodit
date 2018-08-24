/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from './Component';
import { Jodit } from "../Jodit";
export declare type markerInfo = {
    startId: string;
    endId?: string;
    collapsed: boolean;
    startMarker: string;
    endMarker?: string;
};
export declare class Select extends Component {
    /**
     * Remove all selected content
     */
    remove(): void;
    /**
     * Insert the cursor toWYSIWYG any point x, y
     *
     * @method insertAtPoint
     * @param {int} x Coordinate by horizontal
     * @param {int} y Coordinate by vertical
     * @return boolean Something went wrong
     */
    insertCursorAtPoint(x: number, y: number): boolean;
    isMarker: (elm: Node) => boolean;
    /**
     * Remove all markers
     */
    removeMarkers(): void;
    marker: (atStart?: boolean, range?: Range | undefined) => HTMLSpanElement;
    /**
     * Restores user selections using marker invisible elements in the DOM.
     *
     * @param {markerInfo[]|null} selectionInfo
     */
    restore(selectionInfo?: markerInfo[] | null): void;
    /**
     * Saves selections using marker invisible elements in the DOM.
     *
     * @return markerInfo[]
     */
    save(): markerInfo[];
    /**
     * Set focus in editor
     */
    focus: () => boolean;
    /**
     * Checks whether the current selection is something or just set the cursor is
     *
     * @return boolean true Selection does't have content
     */
    isCollapsed(): boolean;
    /**
     * Checks whether the editor currently in focus
     *
     * @return boolean
     */
    isFocused(): boolean;
    /**
     * Returns the current element under the cursor inside editor
     *
     * @return false|Node The element under the cursor or false if undefined or not in editor
     */
    current(checkChild?: boolean): false | Node;
    /**
     * Insert element in editor
     *
     * @param {Node} node
     * @param {Boolean} [insertCursorAfter=true] After insert, cursor will move after element
     * @param {Boolean} [fireChange=true] After insert, editor fire change event. You can prevent this behavior
     */
    insertNode(node: Node, insertCursorAfter?: boolean, fireChange?: boolean): void;
    /**
     * Inserts in the current cursor position some HTML snippet
     *
     * @param  {string} html HTML The text toWYSIWYG be inserted into the document
     * @example
     * ```javascript
     * parent.selection.insertHTML('<img src="image.png"/>');
     * ```
     */
    insertHTML(html: number | string | Node): void;
    /**
     * Insert image in editor
     *
     * @param  {string|HTMLImageElement} url URL for image, or HTMLImageElement
     * @param  {string} [styles] If specified, it will be applied <code>$(image).css(styles)</code>
     *
     * @fired afterInsertImage
     */
    insertImage(url: string | HTMLImageElement, styles?: {
        [key: string]: string;
    }): void;
    eachSelection: (callback: (current: Node) => void) => void;
    /**
     * Set cursor after the node
     *
     * @param {Node} node
     * @return {Node} fake invisible textnode. After insert it can be removed
     */
    setCursorAfter(node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement): Text | false;
    /**
     * Checks if the cursor is at the end(start) block
     *
     * @param  {boolean} start=false true - check whether the cursor is at the start block
     * @param {HTMLElement} parentBlock - Find in this
     *
     * @return {boolean | null} true - the cursor is at the end(start) block, null - cursor somewhere outside
     */
    cursorInTheEdge(start: boolean, parentBlock: HTMLElement): boolean | null;
    /**
     * Set cursor before the node
     *
     * @param {Node} node
     * @return {Text} fake invisible textnode. After insert it can be removed
     */
    setCursorBefore(node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement): Text | false;
    /**
     * Set cursor in the node
     *
     * @param {Node} node
     * @param {boolean} [inStart=false] set cursor in start of element
     */
    setCursorIn(node: Node, inStart?: boolean): Node;
    /**
     * Set range selection
     *
     * @param range
     * @fires changeSelection
     */
    selectRange(range: Range): void;
    /**
     * Select node
     *
     * @param {Node} node
     * @param {boolean} [inward=false] select all inside
     */
    select(node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement, inward?: boolean): void;
    getHTML(): string;
    /**
     * Apply some css rules for all selections. It method wraps selections in nodeName tag.
     *
     * @param {object} cssRules
     * @param {string} nodeName
     * @param {object} options
     */
    applyCSS: (cssRules?: {
        [key: string]: string | number | undefined;
    } | undefined, nodeName?: string, options?: Function | {
        [key: string]: string | string[];
    } | {
        [key: string]: (editor: Jodit, elm: HTMLElement) => boolean;
    } | undefined) => void;
}
