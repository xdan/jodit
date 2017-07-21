import Jodit from '../Jodit';
import Table, {JODIT_SELECTED_CELL_MARKER} from '../modules/Table';
import * as consts from '../constants';
import {each, getContentWidth, $$, dom} from '../modules/Helpers';
import {Config} from '../Config'

/**
 * @prop {boolean} useTableProcessor=true true Use module {@link module:TableProcessor|TableProcessor}
 * @memberof Jodit.defaultOptions
 */
declare module "../Config" {
    interface Config {
        useTableProcessor: boolean;
    }
}
Config.prototype.useTableProcessor = true;
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
    __deSelectAll(table, current_cell ?: HTMLTableCellElement|false) {
        let cells = table ? this.getAllSelectedCells(table) : this.getAllSelectedCells(this.parent.editor);
        if (cells.length) {
            each(cells, (i, cell) => {
                if (!current_cell || current_cell !== cell) {
                    this.removeSelected(cell);
                }
            })
        }
    }

    __resizerDelta = 0;
    __resizerHandler;
    __drag = false;

    __wholeTable: boolean | null;
    __workCell: HTMLTableCellElement;
    __workTable;

    __isCell(tag) {
        return tag && /^TD|TH$/i.test(tag.tagName)
    }

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
    __calcResizerPosition(table: HTMLTableElement, cell: HTMLTableCellElement, offsetX: number = 0, delta: number = 0) {
        let box = cell.getBoundingClientRect();
        if (offsetX <= consts.NEARBY || box.width - offsetX <= consts.NEARBY) {
            let parentBox = table.getBoundingClientRect();
            this.__resizerHandler.style.left = (offsetX <= consts.NEARBY ? box.left : box.left + box.width) + delta + 'px';
            this.__resizerHandler.style.height = parentBox.height  + 'px';
            this.__resizerHandler.style.top = parentBox.top  + 'px';
            this.__resizerHandler.style.display = 'block';

            if (offsetX <= consts.NEARBY) {
                let prevTD = this.parent.node.prev(cell, this.__isCell, cell.parentNode);
                if (prevTD) {
                    this.__setWorkCell(prevTD);
                } else {
                    this.__setWorkCell(cell, true);
                }
            } else {
                let nextTD = this.parent.node.next(cell, this.__isCell, cell.parentNode);
                this.__setWorkCell(cell, !nextTD ? false : null);
            }

        } else {
            this.__resizerHandler.style.display = 'none';
        }
    }

    observe(table: HTMLTableElement) {
        table[this.__key] = true;
        let start;
        table.addEventListener('mousedown', (event: MouseEvent) => {
            let cell: HTMLTableCellElement = <HTMLTableCellElement>this.parent.node.up(<HTMLElement>event.target, this.__isCell, table);
            if (cell && cell instanceof  HTMLElement) {
                if (!cell.firstChild) {
                    cell.appendChild(this.parent.node.create('br'))
                }

                start = cell;
                this.addSelected(cell);
                this.__selectMode = true;
                this.parent.startDrag();
            }
        });
        table.addEventListener('mouseleave', (e) => {
            if (this.__resizerHandler && this.__resizerHandler !== e.relatedTarget) {
                this.__resizerHandler.style.display = 'none';
            }
        });
        table.addEventListener('mousemove', (event) => {
            if (this.__drag) {
                return;
            }
            let cell = <HTMLTableCellElement>this.parent.node.up(<HTMLElement>event.target, this.__isCell, table);
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
                            this.addSelected(box[i][j])
                        }
                    }
                } else {
                    this.__calcResizerPosition(table, cell, event.offsetX);
                }
            }
            event.stopPropagation();
        });
        this.__addResizer();
    }

    /**
     *
     * @param {Jodit} editor
     */
    constructor(editor: Jodit) {
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
                    let nextTD = this.parent.node.next(this.__workCell, this.__isCell, this.__workCell.parentNode);
                    this.setColumnWidthByDelta(this.__workTable, this.formalCoordinate(this.__workTable, nextTD)[1], -this.__resizerDelta, true);
                } else {
                    let width = parseInt(this.__workTable.offsetWidth, 10),
                        parentWidth = getContentWidth(this.__workTable.parentNode, this.win);

                    // right side
                    if (this.__wholeTable === false) {
                        this.__workTable.style.width = ((width + this.__resizerDelta)/parentWidth) * 100 + '%';
                    } else {
                        let margin = parseInt(this.win.getComputedStyle(this.__workTable).marginLeft || '0', 10);
                        this.__workTable.style.width = ((width - this.__resizerDelta)/parentWidth) * 100 + '%';
                        this.__workTable.style.marginLeft = ((margin + this.__resizerDelta)/parentWidth) * 100 + '%';
                    }

                }
                editor.setEditorValue();
            }
        });
        this.__on(window, 'scroll', () => {
            if (this.__drag) {
                let parent = <HTMLElement>editor.node.up(this.__workCell, (elm) => (elm.tagName === 'TABLE'));
                if (parent) {
                    let parentBox = parent.getBoundingClientRect();
                    this.__resizerHandler.style.top = parentBox.top  + 'px';
                }
            }
        });
        this.__on(window, 'mousedown', (event) => {
            let current_cell = this.parent.node.closest(event.target, 'TD|TH'), table;
            if (current_cell instanceof HTMLTableCellElement) {
                table = this.parent.node.closest(current_cell, 'table')
            }
            this.__deSelectAll(table, current_cell instanceof HTMLTableCellElement ? current_cell : false);
        });
        editor.events
            .on('afterGetValueFromEditor', (data) => {
                data.value = data.value.replace(new RegExp(`([\s]*)${JODIT_SELECTED_CELL_MARKER}="1"`, 'g'), '');
            })
            .on('change afterCommand afterSetMode', () => {
                $$('table', editor.editor).forEach((table) => {
                    if (!table[this.__key]) {
                        this.observe(table);
                    }
                })
            })
            .on('beforeSetMode', () => {
                this.getAllSelectedCells(editor.editor).forEach((td) => {
                    this.removeSelected(td)
                    this.normalizeTable(editor.node.closest(td, 'table'))
                })
            })
            .on('keydown', (event) => {
                if (event.which === consts.KEY_TAB) {
                    $$('table', editor.editor).forEach((table) => {
                        this.__deSelectAll(table);
                    })
                }
            })
            .on('beforeCommand', this.onExecCommand.bind(this));

    }

    /**
     *
     * @param {string} command
     */
    onExecCommand = (command: string) => {
        if (/splitvertical|splithorizontal|mergeselectedcells/.test(command)) {
            const cells = this.getAllSelectedCells(this.parent.editor);
            if (cells.length) {
                let cell = cells.shift();
                switch (command) {
                    case 'splitvertical': {
                        this.splitVertical(this.parent.node.closest(cell, 'table'));
                        break;
                    }
                    case 'splithorizontal': {
                        this.splitHorizontal(this.parent.node.closest(cell, 'table'));
                        break;
                    }
                    case 'mergeselectedcells': {
                        this.mergeSelected(this.parent.node.closest(cell, 'table'));
                        break;
                    }
                }
            }
        }
    }



    destruct() {
        this.__off();
    }
}
Jodit.plugins.table = TableProcessor;