/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import * as consts from '../constants';
import {each, getContentWidth, $$, dom, offset, scrollIntoView} from '../modules/Helpers';
import {Config} from '../Config'
import {Dom, Component, Table} from "../modules/index";
import {ControlType} from "../modules/ToolbarCollection";


declare module "../Config" {
    interface Config {
        /**
         * Use module {@link TableProcessor|TableProcessor}
         */
        useTableProcessor: boolean;
        // useBootstrapClasses: boolean; TODO use this option
    }
}

Config.prototype.useTableProcessor = true;
// Config.prototype.useBootstrapClasses = true;

Config.prototype.controls.table = <ControlType> {
    cols: 10,
    popup: (editor: Jodit, current,  control: ControlType, close: Function) => {
        let i: number,
            j: number,
            k: number,
            div: HTMLDivElement,
            rows_count: number = 1,
            cols_count: number = 1,
            default_cols_count: number = control.cols || 10;

        const form: HTMLFormElement = <HTMLFormElement>dom(
            '<form class="jodit_form jodit_form_inserter">' +
                '<label>' +
                    '<span>1</span> &times; <span>1</span>' +
                '</label>' +
                '<p class="jodit_form-container"></p>' +
            '</form>', editor.ownerDocument),


            rows: HTMLSpanElement = form.querySelectorAll('span')[0],
            cols: HTMLSpanElement = form.querySelectorAll('span')[1],
            blocksContainer: HTMLDivElement = <HTMLDivElement>form.querySelector('.jodit_form-container'),
            cells: HTMLDivElement[] = [];

        const generateRows = (need_rows: number) => {
            const cnt: number = (need_rows + 1) * default_cols_count;

            if (cells.length > cnt) {
                for (i = cnt; i < cells.length; i += 1) {
                    blocksContainer.removeChild(cells[i]);
                    delete cells[i];
                }
                cells.length = cnt;
            }

            for (i = 0; i < cnt; i += 1) {
                if (!cells[i]) {
                    div = editor.ownerDocument.createElement('div');
                    div.setAttribute('data-index', i.toString());
                    cells.push(div);
                }
            }

            cells.forEach((cell: HTMLDivElement) => {
                blocksContainer.appendChild(cell);
            });

            blocksContainer.style.width = (cells[0].offsetWidth * default_cols_count) + 'px';
        };

        generateRows(1);

        cells[0].className = 'hovered';

        const mouseenter = (e: MouseEvent, index?: number): void => {
            const div: HTMLDivElement = <HTMLDivElement>e.target;
            if (!div || div.tagName !== 'DIV') {
                return;
            }

            k = (index === undefined || isNaN(index)) ? parseInt(div.getAttribute('data-index') || '0', 10) : index || 0;

            rows_count = Math.ceil((k + 1) / default_cols_count);
            cols_count = k % default_cols_count + 1;
            generateRows(rows_count);

            if (cols_count === default_cols_count || (cols_count < default_cols_count - 1 && default_cols_count > 10)) {
                default_cols_count = cols_count === default_cols_count ? default_cols_count + 1 : default_cols_count - 1;
                return mouseenter(e, cols_count + (rows_count - 1)  * default_cols_count - 1);
            }

            for (i = 0; i < cells.length; i += 1) {
                if (cols_count >= i % default_cols_count + 1 &&  rows_count >= Math.ceil((i + 1) / default_cols_count)) {
                    cells[i].className = 'hovered';
                } else {
                    cells[i].className = '';
                }
            }

            cols.innerText = cols_count.toString();
            rows.innerText = rows_count.toString();
        };

        blocksContainer.addEventListener('mousemove', mouseenter);

        editor.events
            .on(blocksContainer, 'touchstart mousedown', (e: MouseEvent) => {
                const div: HTMLDivElement = <HTMLDivElement>e.target,
                    doc: Document = editor.editorDocument;

                e.preventDefault();
                e.stopImmediatePropagation();

                if (div.tagName !== 'DIV') {
                    return;
                }

                k =  parseInt(div.getAttribute('data-index') || '0', 10);
                rows_count = Math.ceil((k + 1) / default_cols_count);
                cols_count = k % default_cols_count + 1;

                const table: HTMLTableElement = doc.createElement('table');

                table.style.width = '100%';

                let first_td: HTMLTableCellElement|null = null,
                    tr: HTMLTableRowElement,
                    td: HTMLTableCellElement,
                    br: HTMLBRElement,
                    w: string = (100 / cols_count).toFixed(7);

                for (i = 1; i <= rows_count; i += 1) {
                    tr = doc.createElement('tr');

                    for (j = 1; j <= cols_count; j += 1) {
                        td = doc.createElement('td');

                        td.style.width = w + '%';

                        if (!first_td) {
                            first_td = td;
                        }

                        br = doc.createElement('br');
                        td.appendChild(br);
                        tr.appendChild(doc.createTextNode("\n"));
                        tr.appendChild(doc.createTextNode("\t"));
                        tr.appendChild(td);
                    }

                    table.appendChild(doc.createTextNode("\n"));
                    table.appendChild(tr);
                }

                const current: Node | false = editor.selection.current();

                if (current && editor.selection.isCollapsed()) {
                    const block: HTMLElement | false = <HTMLElement | false>Dom.closest(current, Dom.isBlock, editor.editor);
                    if (block && block !== editor.editor && !block.nodeName.match(/^TD|TH|TBODY|TABLE|THEADER|TFOOTER$/)) {
                        editor.selection.setCursorAfter(block);
                    }
                }

                editor.selection.insertNode(doc.createTextNode("\n"));
                editor.selection.insertNode(table, false);

                if (first_td) {
                    editor.selection.setCursorIn(first_td);
                    scrollIntoView(first_td, editor.editor, editor.editorDocument);
                }

                close();
            });

        return form;
    },
    tooltip: "Insert table"
};
/**
 *
 */
export class TableProcessor extends Component{
    private __key: string = 'table_processor_observer';
    private __selectMode: boolean = false;

    /**
     *
     * @param {HTMLTableElement} [table]
     * @param {HTMLTableCellElement} [current_cell]
     * @private
     */
    private __deSelectAll(table: HTMLTableElement, current_cell ?: HTMLTableCellElement|false) {
        let cells: HTMLTableCellElement[] = table ? Table.getAllSelectedCells(table) : Table.getAllSelectedCells(this.jodit.editor);
        if (cells.length) {
            each(cells, (i, cell) => {
                if (!current_cell || current_cell !== cell) {
                    Table.restoreSelection(cell);
                }
            })
        }
    }

    private __resizerDelta: number = 0;
    private __resizerHandler: HTMLElement;
    private __drag: boolean = false;

    private __wholeTable: boolean | null;
    private __workCell: HTMLTableCellElement;
    private __workTable: HTMLTableElement;

    static isCell(tag: Node | null): boolean {
        return !!tag && /^TD|TH$/i.test(tag.nodeName)
    }

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {boolean|null} [wholeTable=null] true - resize whole table by left side, false - resize whole table by right side, null - resize column
     * @private
     */
    private __setWorkCell(cell: HTMLTableCellElement, wholeTable: boolean|null = null) {
        this.__wholeTable = wholeTable;
        this.__workCell = cell;
        this.__workTable = <HTMLTableElement>Dom.up(cell, (elm: Node | null) => (elm && elm.nodeName === 'TABLE'), this.jodit.editor);
    }

    private __minX: number;
    private __maxX: number;

    private __addResizer = () => {
        if (!this.__resizerHandler) {
            this.__resizerHandler = <HTMLElement>this.jodit.container.querySelector('.jodit_table_resizer');
            if (!this.__resizerHandler) {
                this.__resizerHandler = dom('<div class="jodit_table_resizer"></div>', this.jodit.ownerDocument);
                let startX: number = 0;//, startLeft = 0;
                this.jodit.events
                    .on(this.__resizerHandler,'mousedown touchstart', (event: MouseEvent) => {

                        this.__drag = true;

                        startX = event.clientX;

                        this.jodit.lock(this.__key);
                        this.__resizerHandler.classList.add('jodit_table_resizer-moved');

                        let box: ClientRect,
                            tableBox: ClientRect = this.__workTable.getBoundingClientRect();

                        this.__minX = 0;
                        this.__maxX = 1000000;

                        if (this.__wholeTable !== null) {
                            tableBox = (<HTMLElement>this.__workTable.parentNode).getBoundingClientRect();
                            this.__minX = tableBox.left;
                            this.__maxX = tableBox.left + tableBox.width;
                        } else {
                            // find maximum columns
                            const coordinate: number[] = Table.formalCoordinate(this.__workTable, this.__workCell, true);

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

                        return false;
                    })
                    .on(this.jodit.ownerWindow, 'mousemove touchmoove', (event: MouseEvent) => {
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

                            this.jodit.editorWindow.getSelection().removeAllRanges();
                            if(event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                    });

                this.jodit.container.appendChild(this.__resizerHandler);
            }
        }
    };

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
    private __calcResizerPosition(table: HTMLTableElement, cell: HTMLTableCellElement, offsetX: number = 0, delta: number = 0) {
        const box = offset(cell, this.jodit);
        if (offsetX <= consts.NEARBY || box.width - offsetX <= consts.NEARBY) {
            const parentBox: Bound = offset(table, this.jodit);

            this.__resizerHandler.style.left = (offsetX <= consts.NEARBY ? box.left : box.left + box.width) + delta + 'px';
            this.__resizerHandler.style.height = parentBox.height  + 'px';
            this.__resizerHandler.style.top = parentBox.top  + 'px';
            this.__resizerHandler.style.display = 'block';

            if (offsetX <= consts.NEARBY) {
                const prevTD = <HTMLTableCellElement>Dom.prev(cell, TableProcessor.isCell, <HTMLElement>cell.parentNode);
                if (prevTD) {
                    this.__setWorkCell(prevTD);
                } else {
                    this.__setWorkCell(cell, true);
                }
            } else {
                const nextTD = Dom.next(cell, TableProcessor.isCell, <HTMLElement>cell.parentNode);
                this.__setWorkCell(cell, !nextTD ? false : null);
            }

        } else {
            this.__resizerHandler.style.display = 'none';
        }
    }

    observe(table: HTMLTableElement) {
        (<any>table)[this.__key] = true;
        let start: HTMLTableCellElement;

        this.jodit.events
            .on(table, 'mousedown touchstart', (event: MouseEvent) => {
                if (this.jodit.options.readonly) {
                    return;
                }

                const cell: HTMLTableCellElement = <HTMLTableCellElement>Dom.up(<HTMLElement>event.target, TableProcessor.isCell, table);
                if (cell && cell instanceof (<any>this.jodit.editorWindow).HTMLElement) {
                    if (!cell.firstChild) {
                        cell.appendChild(Dom.create('br', '', this.jodit.editorDocument))
                    }

                    start = cell;
                    Table.addSelected(cell);
                    this.__selectMode = true;
                }
            })
            .on(table,'mouseleave', (e: MouseEvent) => {
                if (this.__resizerHandler && this.__resizerHandler !== e.relatedTarget) {
                    this.__resizerHandler.style.display = 'none';
                }
            })
            .on(table,'mousemove touchmove', (event: MouseEvent) => {
                if (this.jodit.options.readonly) {
                    return;
                }

                if (this.__drag || this.jodit.isLockedNotBy(this.__key)) {
                    return;
                }

                const cell = <HTMLTableCellElement>Dom.up(<HTMLElement>event.target, TableProcessor.isCell, table);
                if (cell) {
                    if (this.__selectMode) {
                        if (cell !== start) {
                            this.jodit.lock(this.__key);
                            this.jodit.editorWindow.getSelection().removeAllRanges();
                            if(event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                        this.__deSelectAll(table);
                        const bound = Table.getSelectedBound(table, [cell, start]),
                            box = Table.formalMatrix(table);

                        for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
                            for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
                                Table.addSelected(box[i][j])
                            }
                        }

                        const   max = box[bound[1][0]][bound[1][1]],
                                min = box[bound[0][0]][bound[0][1]];

                        this.jodit.events
                            .fire('showPopap', table, offset(min, this.jodit).left + Math.round((offset(max, this.jodit).left + max.offsetWidth - offset(min, this.jodit).left) / 2), offset(max, this.jodit).top + max.offsetHeight);
                        event.stopPropagation();
                    } else {
                        this.__calcResizerPosition(table, cell, event.offsetX);
                    }
                }
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

        editor.events
            .on(this.jodit.ownerWindow, 'mouseup touchend', () => {
                if (this.__selectMode || this.__drag) {
                    this.__selectMode = false;
                    this.jodit.unlock();
                }
                if (this.__resizerHandler && this.__drag) {
                    this.__drag = false;
                    this.__resizerHandler.classList.remove('jodit_table_resizer-moved');

                    // resize column
                    if (this.__wholeTable === null) {
                        let __marked: HTMLTableCellElement[] = [];
                        Table.setColumnWidthByDelta(this.__workTable, Table.formalCoordinate(this.__workTable, this.__workCell, true)[1], this.__resizerDelta, true, __marked);
                        const nextTD = <HTMLTableCellElement>Dom.next(this.__workCell, TableProcessor.isCell, <HTMLElement>this.__workCell.parentNode);
                        Table.setColumnWidthByDelta(this.__workTable, Table.formalCoordinate(this.__workTable, nextTD)[1], -this.__resizerDelta, false, __marked);
                    } else {
                        const width = this.__workTable.offsetWidth,
                            parentWidth = getContentWidth(<HTMLElement>this.__workTable.parentNode, this.jodit.editorWindow);

                        // right side
                        if (this.__wholeTable === false) {
                            this.__workTable.style.width = ((width + this.__resizerDelta)/parentWidth) * 100 + '%';
                        } else {
                            let margin = parseInt(this.jodit.editorWindow.getComputedStyle(this.__workTable).marginLeft || '0', 10);
                            this.__workTable.style.width = ((width - this.__resizerDelta)/parentWidth) * 100 + '%';
                            this.__workTable.style.marginLeft = ((margin + this.__resizerDelta)/parentWidth) * 100 + '%';
                        }

                    }
                    editor.setEditorValue();
                    editor.selection.focus();
                }
            })
            .on(this.jodit.ownerWindow, 'scroll', () => {
                if (this.__drag) {
                    let parent = <HTMLElement>Dom.up(this.__workCell, (elm: Node | null) => (elm && elm.nodeName === 'TABLE'), editor.editor);
                    if (parent) {
                        let parentBox = parent.getBoundingClientRect();
                        this.__resizerHandler.style.top = parentBox.top  + 'px';
                    }
                }
            })
            .on(this.jodit.ownerWindow, 'mousedown touchend', (event: MouseEvent) => {
                // need use event['originalEvent'] because of IE can not set target from another window to current window
                const current_cell: HTMLTableCellElement = <HTMLTableCellElement>Dom.closest(<HTMLElement>(<any>event)['originalEvent'].target, 'TD|TH', this.jodit.editor);
                let table: HTMLTableElement|null = null;

                if (current_cell instanceof (<any>this.jodit.editorWindow).HTMLTableCellElement) {
                    table = <HTMLTableElement>Dom.closest(current_cell, 'table', this.jodit.editor)
                }

                if (table) {
                    this.__deSelectAll(table, current_cell instanceof (<any>this.jodit.editorWindow).HTMLTableCellElement ? current_cell : false);
                }
            })
            .on('afterGetValueFromEditor', (data: {value: string}) => {
                data.value = data.value.replace(new RegExp(`([\s]*)${consts.JODIT_SELECTED_CELL_MARKER}="1"`, 'g'), '');
            })
            .on('change afterCommand afterSetMode', () => {
                (<HTMLTableElement[]>$$('table', editor.editor)).forEach((table: HTMLTableElement) => {
                    if (!(<any>table)[this.__key]) {
                        this.observe(table);
                    }
                })
            })
            .on('beforeSetMode', () => {
                Table.getAllSelectedCells(editor.editor).forEach((td) => {
                    Table.restoreSelection(td);
                    Table.normalizeTable(<HTMLTableElement>Dom.closest(td, 'table', editor.editor))
                })
            })
            .on('keydown', (event: KeyboardEvent) => {
                if (event.which === consts.KEY_TAB) {
                    (<HTMLTableElement[]>$$('table', editor.editor)).forEach((table: HTMLTableElement) => {
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
    private onExecCommand = (command: string): false | void => {
        if (/table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow)/.test(command)) {
            command = command.replace('table', '');
            const cells = Table.getAllSelectedCells(this.jodit.editor);
            if (cells.length) {
                let cell: HTMLTableCellElement|undefined = cells.shift();

                if (!cell) {
                    return;
                }

                const  table = <HTMLTableElement>Dom.closest(cell, 'table', this.jodit.editor);

                switch (command) {
                    case 'splitv':
                        Table.splitVertical(table);
                        break;
                    case 'splitg':
                        Table.splitHorizontal(table);
                        break;
                    case 'merge':
                        Table.mergeSelected(table);
                        break;
                    case 'empty':
                        Table.getAllSelectedCells(this.jodit.editor).forEach(cell => cell.innerHTML = '');
                        break;
                    case 'bin':
                        if (table.parentNode) {
                            table.parentNode.removeChild(table);
                        }
                        break;
                    case 'binrow':
                        Table.removeRow(table, (<HTMLTableRowElement>cell.parentNode).rowIndex);
                        break;
                    case 'bincolumn':
                        Table.removeColumn(table, cell.cellIndex);
                        break;
                    case 'addcolumnafter':
                    case 'addcolumnbefore':
                        Table.appendColumn(table, cell.cellIndex, command === 'addcolumnafter');
                        break;
                    case 'addrowafter':
                    case 'addrowbefore':
                        Table.appendRow(table, <HTMLTableRowElement>cell.parentNode, command === 'addrowafter');
                        break;
                }
            }
            return false;
        }
    };
}