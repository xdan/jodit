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

export default class Table extends Component{
    selectedClass = 'jodit_selected_cell';

    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    getRowsCount(table) {
        return $$(':scope>tr, :scope>tbody>tr, :scope>tfoot>tr, :scope>thead>tr', table).length;
    }

    /**
     * @param {HTMLTableElement} table
     * @return {number}
     */
    getColumnsCount(table) {
        const matrix = this.formalMatrix(table);
        return matrix.reduce((max_count, row) => {
            return Math.max(max_count, row.length);
        }, 0);
    }



    /**
     *
     * @param {HTMLTableElement} table
     * @param {function(HTMLTableCellElement, int, int, int, int):boolean} [callback] if return false cycle break
     * @return {Array}
     */
    formalMatrix(table, callback) {
        let matrix = [[],];
        const rows  = $$(':scope>tr, :scope>tbody>tr, :scope>tfoot>tr, :scope>thead>tr', table) || [];

        let setCell = (cell, i) => {
            if (matrix[i] === undefined) {
                matrix[i] = [];
            }

            let colSpan = 1,
                column,
                rowSpan = 1,
                row,
                currentColumn = 0;

            while (matrix[i][currentColumn]) {
                currentColumn += 1;
            }

            if (cell.hasAttribute('colspan')) {
                colSpan = parseInt(cell.getAttribute('colspan'), 10) || 1;
            }
            if (cell.hasAttribute('rowspan')) {
                rowSpan = parseInt(cell.getAttribute('rowspan'), 10) || 1;
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
        }

        for (let i = 0, j; i < rows.length; i += 1) {
            let cells = $$(':scope>td, :scope>th', rows[i]) || [];
            for (j = 0; j < cells.length; j += 1) {
                if (setCell(cells[j], i) === false) {
                    return matrix;
                }
            }
        }

        return matrix;
    }

    /**
     *
     * @param {HTMLTableElement} table
     * @param {HTMLTableCellElement} cell
     * @param {boolean} [max=false] true - find maximum of column (for set colspan),
     * @return {[{int}i, {int}j, {int}colspan, {int}rowspan]}
     */
    formalCoordinate (table, cell, max = false) {
        let i = 0,
            j = 0,
            width = 1,
            height = 1;

        this.formalMatrix(table, (td, ii, jj, colSpan, rowSpan) => {
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
    appendRow(table, line = false, after = true) {
        let columnsCount = this.getColumnsCount(table),
            row = this.parent.node.create('tr'),
            j;

        for (j = 0; j < columnsCount; j += 1) {
            row.appendChild(this.parent.node.create('td'))
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
    removeRow(table, rowIndex) {
        let box = this.formalMatrix(table), dec;
        let row = $$('tr', table)[rowIndex];

        each(box[rowIndex], (j, cell) => {
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
                let rowSpan = parseInt(cell.getAttribute('rowspan') || 1, 10);
                if (rowSpan - 1 > 1) {
                    cell.setAttribute('rowspan', rowSpan - 1);
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
     * @param {HTMLTableElement} table
     * @param {int} [j]
     * @param {boolean} [after=true]
     */
    appendColumn(table, j, after = true) {
        let box = this.formalMatrix(table), i;
        if (j === undefined) {
            j = this.getColumnsCount(table) - 1;
        }
        for (i = 0; i < box.length; i += 1) {
            let cell = this.parent.node.create('td'), added = false;
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
                box[i][j].setAttribute('colspan', parseInt(box[i][j].getAttribute('colspan'), 10) + 1);
            }
        }
    }

    /**
     * Insert column before / after all the columns containing the selected cells
     *
     * @param {HTMLTableElement} table
     * @param {int} [j]
     * @param {boolean} [after=true]
     */
    removeColumn(table, j) {
        let box = this.formalMatrix(table), dec;
        each(box, (i, cells) => {
            dec = false;
            if (j - 1 >= 0 && box[i][j - 1] === cells[j]) {
                dec = true;
            } else if (j + 1 < cells.length && box[i][j + 1] === cells[j]) {
                dec = true;
            } else {
                cells[j].parentNode && cells[j].parentNode.removeChild(cells[j]);
            }
            if (dec && (i - 1 < 0 || cells[j] !== box[i - 1][j])) {
                let colSpan = parseInt(cells[j].getAttribute('colspan') || 1, 10);
                if (colSpan - 1 > 1) {
                    cells[j].setAttribute('colspan', colSpan - 1);
                } else {
                    cells[j].removeAttribute('colspan');
                }
            }
        });
    }

    getSelectedBound (table) {
        let selCells = $$('.' + this.selectedClass, table),
            maxIndex = 0,
            minIndex = 1000000,
            maxRow = 0,
            minRow = 1000000;

        if (selCells.length) {
            selCells.forEach((cell) => {
                let coordinate = this.formalCoordinate(table, cell);
                maxIndex = Math.max(coordinate[1] + coordinate[2] - 1, maxIndex);
                minIndex = Math.min(coordinate[1], minIndex);
                maxRow = Math.max(coordinate[0]  +  coordinate[3] - 1, maxRow);
                minRow = Math.min(coordinate[0], minRow);
            });

            return [minRow, minIndex, maxRow, maxIndex];
        }

        return false;
    }

    /**
     * It combines all of the selected cells into one. The contents of the cells will also be combined
     *
     */
    mergeSelected(table) {
        var bound = this.getSelectedBound(table),
            w = 0,
            first,
            first_j,
            td,
            html = [],
            cols = 0,
            rows = 0;

        if (bound && (bound[0] - bound[2] || bound[1] - bound[3])) {
            this.formalMatrix(table, (cell, i, j, cs, rs) => {
                if (i >= bound[0] && i <= bound[2]) {
                    if (j >= bound[1] && j <= bound[3]) {
                        td = cell;
                        if (td.__i_am_already_was) {
                            return;
                        }

                        td.__i_am_already_was = true;

                        if (i === bound[0]) {
                            w += td.offsetWidth;
                        }

                        if (trim(cell.innerHTML.replace(/<br(\/)?>/g, '')) !== '') {
                            html.push(cell.innerHTML + '<br/>');
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

            cols = bound[3] - bound[1] + 1;
            rows = bound[2] - bound[0] + 1;

            if (cols > 1 && first) {
                first.setAttribute('colspan', cols);
            }
            if (rows > 1 && first) {
                first.setAttribute('rowspan', rows);
            }

            if (first) {
                this.__mark(first, 'width', ((w / table.offsetWidth) * 100).toFixed(consts.ACCURACY) + '%');
                first.innerHTML = html.join('');
            }

            if (first_j) {
                this.setColumnWidthByDelta(table, first_j, 0, false, true);
            }

            this.__unmark();
        }
    }
    __marked = [];

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {string} key
     * @param {string} value
     * @private
     */
    __mark (cell, key, value) {
        this.__marked.push(cell);
        if (!cell.__marked_value) {
            cell.__marked_value = {};
        }
        cell.__marked_value[key] = value === undefined ? 1 : value;
    }

    __unmark () {
        this.__marked.forEach((cell) => {
            each(cell.__marked_value, (key, value) => {
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
                delete cell.__marked_value[key];
            });
        });
        this.__marked = [];
    }

    /**
     * Set column width used delta value
     *
     * @param {HTMLTableElement} table
     * @param {int} j column
     * @param {int} delta
     * @param {boolean} [left=false]
     * @param {boolean} [noUnmark=false]
     */
    setColumnWidthByDelta (table, j, delta, left = false, noUnmark = false) {
        let i,
            box = this.formalMatrix(table),
            w,
            percent;

        for (i = 0; i < box.length; i += 1) {
            // if (box[i][j] !== box[i][left ? j - 1 : j + 1]) {
                w = parseInt(box[i][j].offsetWidth, 10);
                percent = ((w + delta) / parseInt(table.offsetWidth, 10)) * 100;
                this.__mark(box[i][j], 'width', percent.toFixed(consts.ACCURACY) + '%');
            // }
        }
        if (!noUnmark) {
            this.__unmark();
        }
    }
}