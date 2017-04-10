import Jodit from '../jodit';
import Table from '../modules/Table';
import * as consts from '../constants';
import {each, getContentWidth, $$, dom} from '../modules/Helpers';
import config from '../config'

/**
 * @prop {boolean} useTableProcessor=true true Use module {@link module:TableProcessor|TableProcessor}
 * @memberof Jodit.defaultOptions
 */
config.useTableProcessor = true;

/**
 *
 */
class TableProcessor extends Table{
    __key = 'table_processor_observer';
    __selectMode = false;

    /**
     *
     * @param {HTMLTableElement} [table]
     * @param {HTMLTableCellElement} [current_cell]
     * @private
     */
    __deSelectAll(table, current_cell) {
        let cells = table ? this.getAllSelectedCells(table) : $$(this.selectedClass, this.parent.editor);
        if (cells.length) {
            each(cells, (i, cell) => {
                if (!current_cell || current_cell !== cell) {
                    cell.classList.remove(this.selectedClass);
                }
            })
        }
    }

    __resizerDelta = 0;
    __resizerHandler;
    __drag = false;

    __wholeTable;
    __workCell;
    __workTable;

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {boolean|null} [wholeTable=null] true - resize whole table by left side, false - resize whole table by right side, null - resize column
     * @private
     */
    __setWorkCell(cell, wholeTable = null) {
        this.__wholeTable = wholeTable;
        this.__workCell = cell;
        this.__workTable = this.parent.node.up(cell, (elm) => (elm.tagName === 'TABLE'));
    }

    __minX;
    __maxX;

    __scope = [];
    __off() {
        this.__scope.forEach((data) => {
            data.element.removeEventListener(data.event, data.callback)
        })
    }
    __on(element, event, callback) {
        element.addEventListener(event, callback);
        this.__scope.push({
            element,
            event,
            callback
        });
    }

    __addResizer() {
        if (!this.__resizerHandler) {
            this.__resizerHandler = this.parent.container.querySelector('.jodit_table_resizer');
            if (!this.__resizerHandler) {
                this.__resizerHandler = dom('<div class="jodit_table_resizer"></div>');
                let startX = 0;//, startLeft = 0;
                this.__resizerHandler.addEventListener('mousedown', (event) => {
                    this.__drag = true;

                    startX = event.clientX;
                    //startLeft = parseInt(this.__resizerHandler.style.left, 10);

                    this.parent.startDrag();
                    this.__resizerHandler.classList.add('jodit_table_resizer-moved');

                    let box,
                        tableBox = this.__workTable.getBoundingClientRect();

                    this.__minX = 0;
                    this.__maxX = 1000000;

                    if (this.__wholeTable !== null) {
                        tableBox = this.__workTable.parentNode.getBoundingClientRect();
                        this.__minX = tableBox.left;
                        this.__maxX = tableBox.left + tableBox.width;
                    } else {
                        // find maximum columns
                        let coordinate = this.formalCoordinate(this.__workTable, this.__workCell, true);

                        this.formalMatrix(this.__workTable, (td, i, j) => {
                            if (coordinate[1] === j) {
                                box = td.getBoundingClientRect();
                                this.__minX = Math.max(box.left + consts.NEARBY / 2, this.__minX);
                            }
                            if (coordinate[1] + 1 === j) {
                                box = td.getBoundingClientRect();
                                this.__maxX = Math.min(box.left + box.width - consts.NEARBY / 2, this.__maxX);
                            }
                        });
                    }
                });

                this.__on(window, 'mousemove', (event) => {
                    if (this.__drag) {
                        let x = event.clientX;//startLeft + (event.clientX - startX);

                        if (x < this.__minX) {
                            x = this.__minX;
                        }
                        if (x > this.__maxX) {
                            x = this.__maxX;
                        }

                        this.__resizerDelta = x - startX;
                        this.__resizerHandler.style.left =  x + 'px';

                        this.win.getSelection().removeAllRanges();
                        if(event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                });

                this.parent.container.appendChild(this.__resizerHandler);
            }
        }
    }

    /**
     * Calc helper resizer position
     *
     * @param {HTMLTableElement} table
     * @param {HTMLTableCellElement} cell
     * @param {int} [offsetX=0]
     * @param {int} [delta=0]
     *
     * @private
     */
    __calcResizerPosition(table, cell, offsetX = 0, delta = 0) {
        let box = cell.getBoundingClientRect();
        if (offsetX <= consts.NEARBY || box.width - offsetX <= consts.NEARBY) {
            let parentBox = table.getBoundingClientRect();
            this.__resizerHandler.style.left = (offsetX <= consts.NEARBY ? box.left : box.left + box.width) + delta + 'px';
            this.__resizerHandler.style.height = parentBox.height  + 'px';
            this.__resizerHandler.style.top = parentBox.top  + 'px';
            this.__resizerHandler.style.display = 'block';

            if (offsetX <= consts.NEARBY) {
                if (cell.previousSibling) {
                    this.__setWorkCell(cell.previousSibling);
                } else {
                    this.__setWorkCell(cell, true);
                }
            } else {
                this.__setWorkCell(cell, !cell.nextSibling ? false : null);
            }

        } else {
            this.__resizerHandler.style.display = 'none';
        }
    }

    observe(table) {
        table[this.__key] = true;
        let start;
        table.addEventListener('mousedown', (event) => {
            let cell = this.parent.node.up(event.target, (tag) => (/^TD|TH$/i.test(tag.tagName)), table);
            if (cell) {
                if (!cell.firstChild) {
                    cell.appendChild(this.parent.node.create('br'))
                }

                start = cell;
                cell.classList.add(this.selectedClass);
                this.__selectMode = true;
                this.parent.startDrag();
            }
        })
        table.addEventListener('mouseleave', (e) => {
            if (this.__resizerHandler && this.__resizerHandler !== e.relatedTarget) {
                this.__resizerHandler.style.display = 'none';
            }
        });
        table.addEventListener('mousemove', (event) => {
            if (this.__drag) {
                return;
            }
            let cell = this.parent.node.up(event.target, (tag) => (/^TD|TH$/i.test(tag.tagName)), table);
            if (cell) {
                if (this.__selectMode) {
                    if (cell !== start) {
                        this.win.getSelection().removeAllRanges();
                        if(event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                    this.__deSelectAll(table);
                    let bound = this.getSelectedBound(table, [cell, start]),
                        box = this.formalMatrix(table);

                    for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
                        for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
                            box[i][j].classList.add(this.selectedClass);
                        }
                    }
                } else {
                    this.__calcResizerPosition(table, cell, event.offsetX);
                }
            }
            event.stopPropagation();
        })
        this.__addResizer();
    }

    /**
     *
     * @param {Jodit} editor
     */
    constructor(editor) {
        super(editor);
        if (!editor.options.useTableProcessor) {
            return;
        }

        this.__on(window, 'mouseup', () => {
            if (this.__selectMode || this.__drag) {
                this.__selectMode = false;
                this.parent.endDrag();
            }
            if (this.__resizerHandler && this.__drag) {
                this.__drag = false;
                this.__resizerHandler.classList.remove('jodit_table_resizer-moved');

                // resize column
                if (this.__wholeTable === null) {
                    this.setColumnWidthByDelta(this.__workTable, this.formalCoordinate(this.__workTable, this.__workCell, true)[1], this.__resizerDelta, false, true);
                    this.setColumnWidthByDelta(this.__workTable, this.formalCoordinate(this.__workTable, this.__workCell.nextSibling)[1], -this.__resizerDelta, true);
                } else {
                    let width = parseInt(this.__workTable.offsetWidth, 10),
                        parentWidth = getContentWidth(this.__workTable.parentNode, this.win);

                    // right side
                    if (this.__wholeTable === false) {
                        this.__workTable.style.width = ((width + this.__resizerDelta)/parentWidth) * 100 + '%';
                    } else {
                        let margin = parseInt(this.win.getComputedStyle(this.__workTable).marginLeft || 0, 10);
                        this.__workTable.style.width = ((width - this.__resizerDelta)/parentWidth) * 100 + '%';
                        this.__workTable.style.marginLeft = ((margin + this.__resizerDelta)/parentWidth) * 100 + '%';
                    }

                }
            }
        })
        this.__on(window, 'scroll', () => {
            if (this.__drag) {
                let parentBox = editor.node.up(this.__workCell, (elm) => (elm.tagName === 'TABLE')).getBoundingClientRect();
                this.__resizerHandler.style.top = parentBox.top  + 'px';
            }
        })
        this.__on(window, 'mousedown', (event) => {
            let current_cell = this.parent.node.closest(event.target, 'TD|TH'), table;
            if (current_cell) {
                table = this.parent.node.closest(current_cell, 'table')
            }
            this.__deSelectAll(table, current_cell);
        });
        editor.events
            .on('change afterCommand', () => {
                each(editor.editor.querySelectorAll('table'), (i, table) => {
                    if (!table[this.__key]) {
                        this.observe(table);
                    }
                })
            })
            .on('beforeSetMode', () => {
                $$('.' + this.selectedClass, editor.editor).forEach((td) => {
                    td.classList.remove(this.selectedClass);
                    this.normalizeTable(editor.node.closest(td, 'table'))
                })
            })
            .on('keydown', (event) => {
                if (event.which === consts.KEY_TAB) {
                    each(editor.editor.querySelectorAll('table'), (i, table) => {
                        this.__deSelectAll(table);
                    })
                }
            })
            .on('beforeCommand', (command) => {
                this.onExecCommand(command);
            });

    }

    /**
     *
     * @param {string} command
     */
    onExecCommand(command) {
        switch (command) {
            case 'splitvertical': {
                let cell = $$('.' + this.selectedClass, this.parent.editor)[0];
                if (cell) {
                    this.splitVertical(this.parent.node.closest(cell, 'table'));
                }
                break;
            }
            case 'splithorizontal': {
                let cell = $$('.' + this.selectedClass, this.parent.editor)[0];
                if (cell) {
                    this.splitHorizontal(this.parent.node.closest(cell, 'table'));
                }
                break;
            }
            case 'mergeselectedcells': {
                let cell = $$('.' + this.selectedClass, this.parent.editor)[0];
                if (cell) {
                    this.mergeSelected(this.parent.node.closest(cell, 'table'));
                }
                break;
            }
        }
    }



    destruct() {
        this.__off();
    }
}
Jodit.plugines.table = TableProcessor;