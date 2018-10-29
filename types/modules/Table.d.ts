/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
export declare class Table {
    static addSelected(td: HTMLTableCellElement): void;
    static restoreSelection(td: HTMLTableCellElement): void;
    /**
     *
     * @param {HTMLTableElement} table
     * @return {HTMLTableCellElement[]}
     */
    static getAllSelectedCells(table: HTMLElement | HTMLTableElement): HTMLTableCellElement[];
    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    static getRowsCount(table: HTMLTableElement): number;
    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    static getColumnsCount(table: HTMLTableElement): number;
    /**
     *
     * @param {HTMLTableElement} table
     * @param {function(HTMLTableCellElement, int, int, int, int):boolean} [callback] if return false cycle break
     * @return {Array}
     */
    static formalMatrix(table: HTMLTableElement, callback?: (cell: HTMLTableCellElement, row: number, col: number, colSpan: number, rowSpan: number) => false | void): HTMLTableCellElement[][];
    /**
     * Get cell coordinate in formal table (without colspan and rowspan)
     */
    static formalCoordinate(table: HTMLTableElement, cell: HTMLTableCellElement, max?: boolean): number[];
    /**
     * Inserts a new line after row what contains the selected cell
     *
     * @param {HTMLTableElement} table
     * @param {Boolean|HTMLTableRowElement} [line=false] Insert a new line after/before this line contains the selected cell
     * @param {Boolean} [after=true] Insert a new line after line contains the selected cell
     */
    static appendRow(table: HTMLTableElement, line?: false | HTMLTableRowElement, after?: boolean): void;
    /**
     * Remove row
     *
     * @param {HTMLTableElement} table
     * @param {int} rowIndex
     */
    static removeRow(table: HTMLTableElement, rowIndex: number): void;
    /**
     * Insert column before / after all the columns containing the selected cells
     *
     */
    static appendColumn(table: HTMLTableElement, j: number, after?: boolean): void;
    /**
     * Remove column by index
     *
     * @param {HTMLTableElement} table
     * @param {int} [j]
     */
    static removeColumn(table: HTMLTableElement, j: number): void;
    /**
     * Define bound for selected cells
     *
     * @param {HTMLTableElement} table
     * @param {Array.<HTMLTableCellElement>} selectedCells
     * @return {number[][]}
     */
    static getSelectedBound(table: HTMLTableElement, selectedCells: HTMLTableCellElement[]): number[][];
    /**
     *
     * @param {HTMLTableElement} table
     */
    static normalizeTable(table: HTMLTableElement): void;
    /**
     * It combines all of the selected cells into one. The contents of the cells will also be combined
     *
     * @param {HTMLTableElement} table
     *
     */
    static mergeSelected(table: HTMLTableElement): void;
    /**
     * Divides all selected by `jodit_focused_cell` class table cell in 2 parts vertical. Those division into 2 columns
     */
    static splitHorizontal(table: HTMLTableElement): void;
    /**
     * It splits all the selected cells into 2 parts horizontally. Those. are added new row
     *
     * @param {HTMLTableElement} table
     */
    static splitVertical(table: HTMLTableElement): void;
    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {string} key
     * @param {string} value
     * @param {HTMLTableCellElement[]} __marked
     * @private
     */
    private static __mark;
    private static __unmark;
    /**
     * Set column width used delta value
     *
     * @param {HTMLTableElement} table
     * @param {int} j column
     * @param {int} delta
     * @param {boolean} noUnmark
     * @param {HTMLTableCellElement[]} __marked
     */
    static setColumnWidthByDelta(table: HTMLTableElement, j: number, delta: number, noUnmark: boolean, __marked: HTMLTableCellElement[]): void;
}
