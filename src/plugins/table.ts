import Jodit from '../Jodit';
import Table, {JODIT_SELECTED_CELL_MARKER} from '../modules/Table';
import * as consts from '../constants';
import {each, getContentWidth, $$, dom} from '../modules/Helpers';
import {Config} from '../Config'
import Dom from "../modules/Dom";

/**
 * @prop {boolean} useTableProcessor=true true Use module {@link TableProcessor|TableProcessor}
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
    __key: string = 'table_processor_observer';
    __selectMode: boolean = false;

    /**
     *
     * @param {HTMLTableElement} [table]
     * @param {HTMLTableCellElement} [current_cell]
     * @private
     */
    __deSelectAll(table: HTMLTableElement, current_cell ?: HTMLTableCellElement|false) {
        let cells: HTMLTableCellElement[] = table ? Table.getAllSelectedCells(table) : Table.getAllSelectedCells(this.parent.editor);
        if (cells.length) {
            each(cells, (i, cell) => {
                if (!current_cell || current_cell !== cell) {
                    Table.removeSelected(cell);
                }
            })
        }
    }

    __resizerDelta: number = 0;
    __resizerHandler: HTMLElement;
    __drag: boolean = false;

    __wholeTable: boolean | null;
    __workCell: HTMLTableCellElement;
    __workTable: HTMLTableElement;

    private static __isCell(tag: HTMLElement): boolean {
        return tag && /^TD|TH$/i.test(tag.tagName)
    }

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {boolean|null} [wholeTable=null] true - resize whole table by left side, false - resize whole table by right side, null - resize column
     * @private
     */
    __setWorkCell(cell: HTMLTableCellElement, wholeTable = null) {
        this.__wholeTable = wholeTable;
        this.__workCell = cell;
        this.__workTable = <HTMLTableElement>Dom.up(cell, (elm) => (elm.tagName === 'TABLE'), this.parent.editor);
    }

    __minX: number;
    __maxX: number;

    __addResizer() {
        if (!this.__resizerHandler) {
            this.__resizerHandler = <HTMLElement>this.parent.container.querySelector('.jodit_table_resizer');
            if (!this.__resizerHandler) {
                this.__resizerHandler = dom('<div class="jodit_table_resizer"></div>');
                let startX = 0;//, startLeft = 0;
                this.__resizerHandler.addEventListener('mousedown', (event: MouseEvent) => {
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
                        tableBox = (<HTMLElement>this.__workTable.parentNode).getBoundingClientRect();
                        this.__minX = tableBox.left;
                        this.__maxX = tableBox.left + tableBox.width;
                    } else {
                        // find maximum columns
                        let coordinate = Table.formalCoordinate(this.__workTable, this.__workCell, true);

                        Table.formalMatrix(this.__workTable, (td, i, j) => {
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

                this.__on(window, 'mousemove', (event: MouseEvent) => {
                    if (this.__drag) {
                        let x = event.clientX;

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
                const prevTD = <HTMLTableCellElement>Dom.prev(cell, TableProcessor.__isCell, <HTMLElement>cell.parentNode);
                if (prevTD) {
                    this.__setWorkCell(prevTD);
                } else {
                    this.__setWorkCell(cell, true);
                }
            } else {
                const nextTD = Dom.next(cell, TableProcessor.__isCell, <HTMLElement>cell.parentNode);
                this.__setWorkCell(cell, !nextTD ? false : null);
            }

        } else {
            this.__resizerHandler.style.display = 'none';
        }
    }

    observe(table: HTMLTableElement) {
        table[this.__key] = true;
        let start: HTMLTableCellElement;
        table.addEventListener('mousedown', (event: MouseEvent) => {
            let cell: HTMLTableCellElement = <HTMLTableCellElement>Dom.up(<HTMLElement>event.target, TableProcessor.__isCell, table);
            if (cell && cell instanceof  HTMLElement) {
                if (!cell.firstChild) {
                    cell.appendChild(Dom.create('br', '', this.doc))
                }

                start = cell;
                Table.addSelected(cell);
                this.__selectMode = true;
                this.parent.startDrag();
            }
        });
        table.addEventListener('mouseleave', (e: MouseEvent) => {
            if (this.__resizerHandler && this.__resizerHandler !== e.relatedTarget) {
                this.__resizerHandler.style.display = 'none';
            }
        });
        table.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.__drag) {
                return;
            }
            let cell = <HTMLTableCellElement>Dom.up(<HTMLElement>event.target, TableProcessor.__isCell, table);
            if (cell) {
                if (this.__selectMode) {
                    if (cell !== start) {
                        this.win.getSelection().removeAllRanges();
                        if(event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                    this.__deSelectAll(table);
                    let bound = Table.getSelectedBound(table, [cell, start]),
                        box = Table.formalMatrix(table);

                    for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
                        for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
                            Table.addSelected(box[i][j])
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
                    this.setColumnWidthByDelta(this.__workTable, Table.formalCoordinate(this.__workTable, this.__workCell, true)[1], this.__resizerDelta, true);
                    const nextTD = <HTMLTableCellElement>Dom.next(this.__workCell, TableProcessor.__isCell, <HTMLElement>this.__workCell.parentNode);
                    this.setColumnWidthByDelta(this.__workTable, Table.formalCoordinate(this.__workTable, nextTD)[1], -this.__resizerDelta);
                } else {
                    let width = this.__workTable.offsetWidth,
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
                let parent = <HTMLElement>Dom.up(this.__workCell, (elm) => (elm.tagName === 'TABLE'), editor.editor);
                if (parent) {
                    let parentBox = parent.getBoundingClientRect();
                    this.__resizerHandler.style.top = parentBox.top  + 'px';
                }
            }
        });
        this.__on(window, 'mousedown', (event) => {
            let current_cell = Dom.closest(event.target, 'TD|TH', this.parent.editor), table;
            if (current_cell instanceof HTMLTableCellElement) {
                table = Dom.closest(current_cell, 'table', this.parent.editor)
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
                Table.getAllSelectedCells(editor.editor).forEach((td) => {
                    Table.removeSelected(td);
                    this.normalizeTable(<HTMLTableElement>Dom.closest(td, 'table', editor.editor))
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
            const cells = Table.getAllSelectedCells(this.parent.editor);
            if (cells.length) {
                let cell: HTMLTableCellElement = cells.shift();
                switch (command) {
                    case 'splitvertical': {
                        this.splitVertical(<HTMLTableElement>Dom.closest(cell, 'table', this.parent.editor));
                        break;
                    }
                    case 'splithorizontal': {
                        this.splitHorizontal(<HTMLTableElement>Dom.closest(cell, 'table', this.parent.editor));
                        break;
                    }
                    case 'mergeselectedcells': {
                        this.mergeSelected(<HTMLTableElement>Dom.closest(cell, 'table', this.parent.editor));
                        break;
                    }
                }
            }
        }
    };



    destruct() {
        this.__off();
    }
}
Jodit.plugins.table = TableProcessor;