/**
 * Module for working with tables . Delete, insert , merger, division of cells , rows and columns. When creating elements such as <table> for each of them
 * creates a new instance Jodit.modules.TableProcessor and it can be accessed via $('table').data('table-processor')
 *
 * @module Table
 * @param {Object} parent Jodit main object
 * @param {HTMLTableElement} table Table for which to create a module
 */

import Component from './Component';
import {$$, each, trim} from './Helpers'
import * as consts from '../constants';
import Dom from "./Dom";

export const JODIT_SELECTED_CELL_MARKER = 'data-jodit-selected-cell';

export default class Table extends Component{
    static addSelected(td: HTMLTableCellElement) {
        td.setAttribute(JODIT_SELECTED_CELL_MARKER, '1');
    }
    static removeSelected(td: HTMLTableCellElement) {
        td.removeAttribute(JODIT_SELECTED_CELL_MARKER);
    }

    /**
     *
     * @param {HTMLTableElement} table
     * @return {HTMLTableCellElement[]}
     */
    static getAllSelectedCells(table: HTMLElement|HTMLTableElement): HTMLTableCellElement[] {
        return <HTMLTableCellElement[]>$$(`td[${JODIT_SELECTED_CELL_MARKER}],th[${JODIT_SELECTED_CELL_MARKER}]`, table);
    }

    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    static getRowsCount(table: HTMLTableElement) {
        return table.rows.length;
    }

    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    static getColumnsCount(table: HTMLTableElement) {
        const matrix = Table.formalMatrix(table);
        return matrix.reduce((max_count, cells) => {
            return Math.max(max_count, cells.length);
        }, 0);
    }



    /**
     *
     * @param {HTMLTableElement} table
     * @param {function(HTMLTableCellElement, int, int, int, int):boolean} [callback] if return false cycle break
     * @return {Array}
     */
    static formalMatrix(table: HTMLTableElement, callback ?: (cell: HTMLTableCellElement, row: number, col: number, colSpan?: number, rowSpan?: number) => false|void): HTMLTableCellElement[][] {
        const matrix = [[],];
        const rows  = Array.prototype.slice.call(table.rows);

        const setCell = (cell, i) => {
            if (matrix[i] === undefined) {
                matrix[i] = [];
            }

            let colSpan: number = cell.colSpan,
                column: number,
                rowSpan = cell.rowSpan,
                row: number,
                currentColumn: number = 0;

            while (matrix[i][currentColumn]) {
                currentColumn += 1;
            }

            for (row = 0; row < rowSpan; row += 1) {
                for (column = 0; column < colSpan; column += 1) {
                    if (matrix[i + row] === undefined) {
                        matrix[i + row] = [];
                    }
                    if (callback && callback(cell, i + row, currentColumn + column, colSpan, rowSpan) === false) {
                        return false;
                    }
                    matrix[i + row][currentColumn + column] = cell;
                }
            }
        };

        for (let i = 0, j; i < rows.length; i += 1) {
            let cells = Array.prototype.slice.call(rows[i].cells);
            for (j = 0; j < cells.length; j += 1) {
                if (setCell(cells[j], i) === false) {
                    return matrix;
                }
            }
        }

        return matrix;
    }

    /**
     * Get cell coordinate in formal table (without colspan and rowspan)
     */
    static formalCoordinate (table: HTMLTableElement, cell: HTMLTableCellElement, max = false): number[] {
        let i: number = 0,
            j: number = 0,
            width: number = 1,
            height: number = 1;

        Table.formalMatrix(table, (td, ii, jj, colSpan, rowSpan) => {
            if (cell === td) {
                i = ii;
                j = jj;
                width = colSpan;
                height = rowSpan;
                if (max) {
                    j += colSpan - 1;
                    i += rowSpan - 1;
                }
                return false;
            }
        });

        return [i, j, width, height];
    }

    /**
     * Inserts a new line after row what contains the selected cell
     *
     * @param {HTMLTableElement} table
     * @param {Boolean|HTMLTableRowElement} [line=false] Insert a new line after/before this line contains the selected cell
     * @param {Boolean} [after=true] Insert a new line after line contains the selected cell
     */
    appendRow(table, line:false|HTMLTableRowElement = false, after = true) {
        let columnsCount = Table.getColumnsCount(table),
            row = Dom.create('tr', '', this.doc),
            j;

        for (j = 0; j < columnsCount; j += 1) {
            row.appendChild(Dom.create('td', '', this.doc))
        }

        if (after && line && line.nextSibling) {
            line.parentNode.insertBefore(row, line.nextSibling)
        }else if (!after && line) {
            line.parentNode.insertBefore(row, line)
        } else {
            ($$(':scope>tbody', table)[0]  || table).appendChild(row);
        }
    }

    /**
     * Remove row
     *
     * @param {HTMLTableElement} table
     * @param {int} rowIndex
     */
    static removeRow(table, rowIndex) {
        let box = Table.formalMatrix(table), dec;
        let row = table.rows[rowIndex];

        each(box[rowIndex], (j: number, cell: HTMLTableCellElement) => {
            dec = false;
            if (rowIndex - 1 >= 0 && box[rowIndex - 1][j] === cell) {
                dec = true;
            } else if (box[rowIndex + 1] && box[rowIndex + 1][j] === cell) {
                if (cell.parentNode === row && cell.parentNode.nextSibling) {
                    dec = true;
                    let nextCell = j + 1;
                    while (box[rowIndex + 1][nextCell] === cell) {
                        nextCell += 1;
                    }
                    if (box[rowIndex + 1][nextCell]) {
                        cell.parentNode.nextSibling.insertBefore(cell, box[rowIndex + 1][nextCell]);
                    } else {
                        cell.parentNode.nextSibling.appendChild(cell);
                    }
                }
            } else {
                cell.parentNode && cell.parentNode.removeChild(cell);
            }
            if (dec && (cell.parentNode === row || cell !== box[rowIndex][j - 1])) {
                let rowSpan: number = cell.rowSpan;
                if (rowSpan - 1 > 1) {
                    cell.setAttribute('rowspan', (rowSpan - 1).toString());
                } else {
                    cell.removeAttribute('rowspan');
                }
            }
        });

        if (row) {
            row.parentNode.removeChild(row);
        }
    }

    /**
     * Insert column before / after all the columns containing the selected cells
     *
     */
    appendColumn(table: HTMLTableElement, j: number, after = true) {
        let box = Table.formalMatrix(table), i;
        if (j === undefined) {
            j = Table.getColumnsCount(table) - 1;
        }
        for (i = 0; i < box.length; i += 1) {
            const cell = Dom.create('td', '', this.parent.doc);
            let added = false;
            if (after) {
                if (j + 1 >= box[i].length || box[i][j] !== box[i][j + 1]) {
                    if (box[i][j].nextSibling) {
                        box[i][j].parentNode.insertBefore(cell, box[i][j].nextSibling);
                    } else {
                        box[i][j].parentNode.appendChild(cell)
                    }
                    added = true;
                }
            } else {
                if (j - 1 < 0 || box[i][j] !== box[i][j - 1]) {
                    box[i][j].parentNode.insertBefore(cell, box[i][j]);
                    added = true;
                }
            }
            if (!added) {
                box[i][j].setAttribute('colspan', (parseInt(box[i][j].getAttribute('colspan'), 10) + 1).toString());
            }
        }
    }

    /**
     * Insert column before / after all the columns containing the selected cells
     *
     * @param {HTMLTableElement} table
     * @param {int} [j]
     */
    static removeColumn(table: HTMLTableElement, j: number) {
        const box = Table.formalMatrix(table);
        let dec: boolean;
        each(box, (i: number, cells: HTMLTableCellElement[]) => {
            dec = false;
            if (j - 1 >= 0 && box[i][j - 1] === cells[j]) {
                dec = true;
            } else if (j + 1 < cells.length && box[i][j + 1] === cells[j]) {
                dec = true;
            } else {
                cells[j].parentNode && cells[j].parentNode.removeChild(cells[j]);
            }
            if (dec && (i - 1 < 0 || cells[j] !== box[i - 1][j])) {
                const colSpan:number = cells[j].colSpan;
                if (colSpan - 1 > 1) {
                    cells[j].setAttribute('colspan', (colSpan - 1).toString());
                } else {
                    cells[j].removeAttribute('colspan');
                }
            }
        });
    }

    /**
     * Define bound for selected cells
     *
     * @param {HTMLTableElement} table
     * @param {Array.<HTMLTableCellElement>} selectedCells
     * @return {[[left, top], [right, bottom]]}
     */
    static getSelectedBound (table, selectedCells) {
        let bound = [[Infinity, Infinity], [0, 0]];
        let box = Table.formalMatrix(table);

        for (let i = 0; i < box.length; i += 1) {
            for (let j = 0; j < box[i].length; j += 1) {
                if (selectedCells.indexOf(box[i][j]) !== -1) {
                    bound[0][0] = Math.min(i, bound[0][0]);
                    bound[0][1] = Math.min(j, bound[0][1]);
                    bound[1][0] = Math.max(i, bound[1][0]);
                    bound[1][1] = Math.max(j, bound[1][1]);
                }
            }
        }
        for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
            for (let k = 1, j = bound[0][1]; j <= bound[1][1]; j += 1) {
                while (box[i][j - k] && box[i][j] === box[i][j - k]) {
                    bound[0][1] = Math.min(j - k, bound[0][1]);
                    bound[1][1] = Math.max(j - k, bound[1][1]);
                    k += 1;
                }
                k = 1;
                while (box[i][j + k] && box[i][j] === box[i][j + k]) {
                    bound[0][1] = Math.min(j + k, bound[0][1]);
                    bound[1][1] = Math.max(j + k, bound[1][1]);
                    k += 1;
                }
                k = 1;
                while (box[i - k] && box[i][j] === box[i - k][j]) {
                    bound[0][0] = Math.min(i - k, bound[0][0]);
                    bound[1][0] = Math.max(i - k, bound[1][0]);
                    k += 1;
                }
                k = 1;
                while (box[i + k] && box[i][j] === box[i + k][j]) {
                    bound[0][0] = Math.min(i + k, bound[0][0]);
                    bound[1][0] = Math.max(i + k, bound[1][0]);
                    k += 1;
                }
            }
        }

        return bound;
    }

    /**
     *
     * @param {HTMLTableElement} table
     */
    normalizeTable (table: HTMLTableElement) {
        let i: number,
            j: number,
            min: number,
            not: boolean;

        const box = Table.formalMatrix(table);

        // remove extra colspans
        for (j = 0; j < box[0].length; j += 1) {
            min = 1000000;
            not = false;
            for (i = 0; i < box.length; i += 1) {
                if (box[i][j] === undefined) {
                    continue; // broken table
                }
                if (box[i][j].colSpan < 2) {
                    not = true;
                    break;
                }
                min = Math.min(min, box[i][j].colSpan);
            }
            if (!not) {
                for (i = 0; i < box.length; i += 1) {
                    if (box[i][j] === undefined) {
                        continue; // broken table
                    }
                    this.__mark(box[i][j], 'colspan', box[i][j].colSpan - min + 1);
                }
            }
        }


        // remove extra rowspans
        for (i = 0; i < box.length; i += 1) {
            min = 1000000;
            not = false;
            for (j = 0; j < box[i].length; j += 1) {
                if (box[i][j] === undefined) {
                    continue; // broken table
                }
                if (box[i][j].rowSpan < 2) {
                    not = true;
                    break;
                }
                min = Math.min(min, box[i][j].rowSpan);
            }
            if (!not) {
                for (j = 0; j < box[i].length; j += 1) {
                    if (box[i][j] === undefined) {
                        continue; // broken table
                    }
                    this.__mark(box[i][j], 'rowspan', box[i][j].rowSpan - min + 1);
                }
            }
        }

        // remove rowspans and colspans equal 1 and empty class
        for (i = 0; i < box.length; i += 1) {
            for (j = 0; j < box[i].length; j += 1) {
                if (box[i][j] === undefined) {
                    continue; // broken table
                }
                if (box[i][j].hasAttribute('rowspan') && box[i][j].rowSpan === 1) {
                    box[i][j].removeAttribute('rowspan');
                }
                if (box[i][j].hasAttribute('colspan') && box[i][j].colSpan === 1) {
                    box[i][j].removeAttribute('colspan');
                }
                if (box[i][j].hasAttribute('class') && !box[i][j].getAttribute('class')) {
                    box[i][j].removeAttribute('class');
                }
            }
        }

        this.__unmark();
    }

    /**
     * It combines all of the selected cells into one. The contents of the cells will also be combined
     *
     * @param {HTMLTableElement} table
     *
     */
    mergeSelected(table: HTMLTableElement) {
        let bound = Table.getSelectedBound(table, Table.getAllSelectedCells(table)),
            w = 0,
            first,
            first_j,
            td,
            html = [],
            cols = 0,
            rows = 0;

        if (bound && (bound[0][0] - bound[1][0] || bound[0][1] - bound[1][1])) {
            Table.formalMatrix(table, (cell, i, j, cs, rs) => {
                if (i >= bound[0][0] && i <= bound[1][0]) {
                    if (j >= bound[0][1] && j <= bound[1][1]) {
                        td = cell;
                        if (td.__i_am_already_was) {
                            return;
                        }

                        td.__i_am_already_was = true;

                        if (i === bound[0][0] && td.style.width) {
                            w += parseInt(td.offsetWidth, 10);
                        }

                        if (trim(cell.innerHTML.replace(/<br(\/)?>/g, '')) !== '') {
                            html.push(cell.innerHTML);
                        }

                        if (cs > 1) {
                            cols += cs - 1;
                        }
                        if (rs > 1) {
                            rows += rs - 1;
                        }

                        if (!first) {
                            first = cell;
                            first_j = j;
                        } else {
                            this.__mark(td, 'remove', 1);
                        }
                    }
                }
            });

            cols = bound[1][1] - bound[0][1] + 1;
            rows = bound[1][0] - bound[0][0] + 1;

            if (first) {
                if (cols > 1) {
                    this.__mark(first, 'colspan', cols);
                }
                if (rows > 1) {
                    this.__mark(first, 'rowspan', rows);
                }


                if (w) {
                    this.__mark(first, 'width', ((w / table.offsetWidth) * 100).toFixed(consts.ACCURACY) + '%');
                    if (first_j) {
                        this.setColumnWidthByDelta(table, first_j, 0, true);
                    }
                }

                delete first.__i_am_already_was;

                first.innerHTML = html.join('<br/>');

                this.__unmark();

                this.normalizeTable(table);

                each([].slice.call(table.rows), (index, tr) => {
                    if (!tr.cells.length) {
                        tr.parentNode.removeChild(tr);
                    }
                })
            }
        }
    }


    /**
     * Divides all selected by `jodit_focused_cell` class table cell in 2 parts vertical. Those division into 2 columns
     */
    splitHorizontal(table: HTMLTableElement) {
        let coord: number[],
            td: HTMLTableCellElement,
            tr: HTMLTableRowElement,
            parent: HTMLTableRowElement,
            after: HTMLTableCellElement;

        Table.getAllSelectedCells(table).forEach((cell: HTMLTableCellElement) => {
            td = <HTMLTableCellElement>Dom.create('td', '', this.doc);
            td.appendChild(Dom.create('br', '', this.doc));
            tr = <HTMLTableRowElement>Dom.create('tr', '', this.doc);

            coord = Table.formalCoordinate(table, cell);

            if (cell.rowSpan < 2) {
                Table.formalMatrix(table, (td, i, j) => {
                    if (coord[0] === i && coord[1] !== j && td !== cell) {
                        this.__mark(td, 'rowspan', td.rowSpan + 1);
                    }
                });
                Dom.after(<HTMLTableRowElement>Dom.closest(cell, 'tr', this.parent.editor), tr);
                tr.appendChild(td);
            } else {
                this.__mark(cell, 'rowspan', cell.rowSpan - 1);
                Table.formalMatrix(table, (td: HTMLTableCellElement, i: number, j: number) => {
                    if (i > coord[0] && i < coord[0] + cell.rowSpan && coord[1] >  j && (<HTMLTableRowElement>td.parentNode).rowIndex === i) {
                        after = td;
                    }
                    if (coord[0] < i && td === cell) {
                        parent = table.rows[i];
                    }
                });
                if (after) {
                    Dom.after(after, td);
                } else {
                    parent.insertBefore(td, parent.firstChild);
                }
            }

            if (cell.colSpan > 1) {
                this.__mark(td, 'colspan', cell.colSpan);
            }

            this.__unmark();
            Table.removeSelected(cell);
        });
        this.normalizeTable(table);
    }

    /**
     * It splits all the selected cells into 2 parts horizontally. Those. are added new row
     *
     * @param {HTMLTableElement} table
     */
    splitVertical(table: HTMLTableElement) {
        let coord: number[],
            td: HTMLTableCellElement,
            w: number,
            percentage: number;

        Table.getAllSelectedCells(table).forEach((cell: HTMLTableCellElement) => {
            coord = Table.formalCoordinate(table, cell);
            if (cell.colSpan < 2) {
                Table.formalMatrix(table, (td, i, j) => {
                    if (coord[1] === j && coord[0] !== i && td !== cell) {
                        this.__mark(td, 'colspan', td.colSpan + 1);
                    }
                });
            } else {
                this.__mark(cell, 'colspan', cell.colSpan - 1);
            }

            td = <HTMLTableCellElement>Dom.create('td', '', this.doc);
            td.appendChild(Dom.create('br', '', this.doc));

            if (cell.rowSpan > 1) {
                this.__mark(td, 'rowspan', cell.rowSpan);
            }

            Dom.after(cell, td);
            w = cell.offsetWidth;
            percentage = (w / table.offsetWidth) / 2;
            this.__mark(cell, 'width', (percentage * 100).toFixed(consts.ACCURACY) + '%');
            this.__mark(td, 'width', (percentage * 100).toFixed(consts.ACCURACY) + '%');
            this.__unmark();

            Table.removeSelected(cell);
        });
        this.normalizeTable(table);
    }

    private __marked: HTMLTableCellElement[] = [];

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {string} key
     * @param {string} value
     * @private
     */
    private __mark (cell: HTMLTableCellElement, key: string, value: string|number) {
        this.__marked.push(cell);
        if (!cell['__marked_value']) {
            cell['__marked_value'] = {};
        }
        cell['__marked_value'][key] = value === undefined ? 1 : value;
    }

    private __unmark () {
        this.__marked.forEach((cell) => {
            if (cell['__marked_value']) {
                each(cell['__marked_value'], (key, value) => {
                    switch (key) {
                        case 'remove':
                            cell.parentNode.removeChild(cell);
                            break;
                        case 'rowspan':
                            if (value > 1) {
                                cell.setAttribute('rowspan', value);
                            } else {
                                cell.removeAttribute('rowspan');
                            }
                            break;
                        case 'colspan':
                            if (value > 1) {
                                cell.setAttribute('colspan', value);
                            } else {
                                cell.removeAttribute('colspan');
                            }
                            break;
                        case 'width':
                            cell.style.width = value;
                            break;
                    }
                    delete cell['__marked_value'][key];
                });
                delete (<any>cell).__marked_value;
            }
        });
        this.__marked = [];
    }

    /**
     * Set column width used delta value
     *
     * @param {HTMLTableElement} table
     * @param {int} j column
     * @param {int} delta
     * @param {boolean} [noUnmark=false]
     */
    setColumnWidthByDelta (table: HTMLTableElement, j: number, delta: number, noUnmark = false) {
        let i: number,
            box = Table.formalMatrix(table),
            w: number,
            percent: number;

        for (i = 0; i < box.length; i += 1) {
            w = box[i][j].offsetWidth;
            percent = ((w + delta) / table.offsetWidth) * 100;
            this.__mark(box[i][j], 'width', percent.toFixed(consts.ACCURACY) + '%');
        }

        if (!noUnmark) {
            this.__unmark();
        }
    }
}