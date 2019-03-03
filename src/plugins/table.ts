/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';
import { Table } from '../modules/Table';
import {
    $$,
    getContentWidth,
    offset,
    scrollIntoView,
} from '../modules/helpers/';
import { setTimeout } from '../modules/helpers/async';
import { IControlType } from '../types/toolbar';
import { IBound, IDictionary } from '../types/types';
import { IJodit } from '../types';

declare module '../Config' {
    interface Config {
        /**
         * Use module {@link TableProcessor|TableProcessor}
         */
        useTableProcessor: boolean;
        useExtraClassesOptions: boolean;
    }
}

Config.prototype.useTableProcessor = true;
Config.prototype.useExtraClassesOptions = true;

Config.prototype.controls.table = {
    data: {
        cols: 10,
        rows: 10,
        classList: {
            'table table-bordered': 'Bootstrap Bordered',
            'table table-striped': 'Bootstrap Striped',
            'table table-dark': 'Bootstrap Dark',
        },
    },
    popup: (editor: IJodit, current, control, close, button) => {
        let i: number,
            j: number,
            k: number,
            div: HTMLDivElement,
            rows_count: number = 1,
            cols_count: number = 1;

        const default_rows_count: number =
                control.data && control.data.rows ? control.data.rows : 10,
            default_cols_count: number =
                control.data && control.data.cols ? control.data.cols : 10;

        const generateExtraClasses = (): string => {
            if (!editor.options.useExtraClassesOptions) {
                return '';
            }

            const out: string[] = [];
            if (control.data) {
                const classList: IDictionary<string> = control.data.classList;
                Object.keys(classList).forEach((classes: string) => {
                    out.push(
                        `<label><input value="${classes}" type="checkbox"/>${
                            classList[classes]
                        }</label>`
                    );
                });
            }
            return out.join('');
        };

        const form: HTMLFormElement = editor.create.fromHTML(
                '<form class="jodit_form jodit_form_inserter">' +
                    '<label>' +
                    '<span>1</span> &times; <span>1</span>' +
                    '</label>' +
                    '<div class="jodit_form-table-creator-box">' +
                    '<div class="jodit_form-container"></div>' +
                    '<div class="jodit_form-options">' +
                    generateExtraClasses() +
                    '</div>' +
                    '</div>' +
                    '</form>'
            ) as HTMLFormElement,

            rows: HTMLSpanElement = form.querySelectorAll('span')[0],
            cols: HTMLSpanElement = form.querySelectorAll('span')[1],

            blocksContainer: HTMLDivElement = form.querySelector(
                '.jodit_form-container'
            ) as HTMLDivElement,
            mainBox: HTMLDivElement = form.querySelector(
                '.jodit_form-table-creator-box'
            ) as HTMLDivElement,
            options: HTMLDivElement = form.querySelector(
                '.jodit_form-options'
            ) as HTMLDivElement,
            cells: HTMLDivElement[] = [];

        const generateRows = (need_rows: number) => {
            const cnt: number = need_rows * default_cols_count;

            if (cells.length > cnt) {
                for (i = cnt; i < cells.length; i += 1) {
                    Dom.safeRemove(cells[i]);
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

            const width: number =
                (cells[0].offsetWidth || 18) * default_cols_count;
            blocksContainer.style.width = width + 'px';
            mainBox.style.width = width + options.offsetWidth + 1 + 'px';
        };

        const mouseenter = (e: MouseEvent, index?: number): void => {
            const dv: HTMLDivElement = e.target as HTMLDivElement;
            if (!dv || dv.tagName !== 'DIV') {
                return;
            }

            k =
                index === undefined || isNaN(index)
                    ? parseInt(dv.getAttribute('data-index') || '0', 10)
                    : index || 0;

            rows_count = Math.ceil((k + 1) / default_cols_count);
            cols_count = (k % default_cols_count) + 1;

            for (i = 0; i < cells.length; i += 1) {
                if (
                    cols_count >= (i % default_cols_count) + 1 &&
                    rows_count >= Math.ceil((i + 1) / default_cols_count)
                ) {
                    cells[i].className = 'hovered';
                } else {
                    cells[i].className = '';
                }
            }

            cols.innerText = cols_count.toString();
            rows.innerText = rows_count.toString();
        };

        blocksContainer.addEventListener('mousemove', mouseenter);

        editor.events.on(
            blocksContainer,
            'touchstart mousedown',
            (e: MouseEvent) => {
                const dv: HTMLDivElement = e.target as HTMLDivElement,
                    doc: Document = editor.editorDocument;

                e.preventDefault();
                e.stopImmediatePropagation();

                if (dv.tagName !== 'DIV') {
                    return;
                }

                k = parseInt(dv.getAttribute('data-index') || '0', 10);
                rows_count = Math.ceil((k + 1) / default_cols_count);
                cols_count = (k % default_cols_count) + 1;

                const table: HTMLTableElement = doc.createElement('table');

                table.style.width = '100%';

                let first_td: HTMLTableCellElement | null = null,
                    tr: HTMLTableRowElement,
                    td: HTMLTableCellElement,
                    br: HTMLBRElement;
                // w: string = (100 / cols_count).toFixed(7);

                for (i = 1; i <= rows_count; i += 1) {
                    tr = doc.createElement('tr');

                    for (j = 1; j <= cols_count; j += 1) {
                        td = doc.createElement('td');

                        // td.style.width = w + '%';

                        if (!first_td) {
                            first_td = td;
                        }

                        br = doc.createElement('br');
                        td.appendChild(br);
                        tr.appendChild(doc.createTextNode('\n'));
                        tr.appendChild(doc.createTextNode('\t'));
                        tr.appendChild(td);
                    }

                    table.appendChild(doc.createTextNode('\n'));
                    table.appendChild(tr);
                }

                const crnt: Node | false = editor.selection.current();

                if (crnt && editor.selection.isCollapsed()) {
                    const block: HTMLElement | false = Dom.closest(
                        crnt,
                        node => Dom.isBlock(node, editor.editorWindow),
                        editor.editor
                    ) as HTMLElement | false;
                    if (
                        block &&
                        block !== editor.editor &&
                        !block.nodeName.match(
                            /^TD|TH|TBODY|TABLE|THEADER|TFOOTER$/
                        )
                    ) {
                        editor.selection.setCursorAfter(block);
                    }
                }

                $$('input[type=checkbox]:checked', options).forEach(
                    (input: HTMLElement) => {
                        (input as HTMLInputElement).value
                            .split(/[\s]+/)
                            .forEach((className: string) => {
                                table.classList.add(className);
                            });
                    }
                );

                editor.selection.insertNode(doc.createTextNode('\n'));
                editor.selection.insertNode(table, false);

                if (first_td) {
                    editor.selection.setCursorIn(first_td);
                    scrollIntoView(
                        first_td,
                        editor.editor,
                        editor.editorDocument
                    );
                }

                close();
            }
        );

        if (button && button.parentToolbar) {
            editor.events
                .off(
                    button.parentToolbar.container as object,
                    'afterOpenPopup.tableGenerator'
                )
                .on(
                    button.parentToolbar.container as object,
                    'afterOpenPopup.tableGenerator',
                    () => {
                        generateRows(default_rows_count);
                        if (cells[0]) {
                            cells[0].className = 'hovered';
                        }
                    },
                    '',
                    true
                );
        }

        return form;
    },
    tooltip: 'Insert table',
} as IControlType;

/**
 * Process tables in editor
 */
export class TableProcessor extends Plugin {
    static isCell(tag: Node | null): boolean {
        return !!tag && /^TD|TH$/i.test(tag.nodeName);
    }

    private __key: string = 'table_processor_observer';

    private __selectMode: boolean = false;

    private __resizerDelta: number = 0;
    private __resizerHandler: HTMLElement;

    showResizer() {
        clearTimeout(this.hideTimeout);
        this.__resizerHandler.style.display = 'block';
    }

    hideResizer() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.__resizerHandler.style.display = 'none';
        }, this.jodit.defaultTimeout);
    }

    private hideTimeout: number;

    private __drag: boolean = false;

    private __wholeTable: boolean | null;
    private __workCell: HTMLTableCellElement;
    private __workTable: HTMLTableElement;

    private __minX: number;
    private __maxX: number;

    /**
     *
     * @param {HTMLTableElement} [table]
     * @param {HTMLTableCellElement} [current_cell]
     * @private
     */
    private __deSelectAll(
        table?: HTMLTableElement,
        current_cell?: HTMLTableCellElement | false
    ) {
        const cells: HTMLTableCellElement[] = table
            ? Table.getAllSelectedCells(table)
            : Table.getAllSelectedCells(this.jodit.editor);
        if (cells.length) {
            cells.forEach((cell: HTMLTableCellElement) => {
                if (!current_cell || current_cell !== cell) {
                    Table.restoreSelection(cell);
                }
            });
        }
    }

    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {boolean|null} [wholeTable=null] true - resize whole table by left side,
     * false - resize whole table by right side, null - resize column
     * @private
     */
    private __setWorkCell(
        cell: HTMLTableCellElement,
        wholeTable: boolean | null = null
    ) {
        this.__wholeTable = wholeTable;
        this.__workCell = cell;
        this.__workTable = Dom.up(
            cell,
            (elm: Node | null) => elm && elm.nodeName === 'TABLE',
            this.jodit.editor
        ) as HTMLTableElement;
    }

    private __addResizer = () => {
        if (!this.__resizerHandler) {
            this.__resizerHandler = this.jodit.container.querySelector(
                '.jodit_table_resizer'
            ) as HTMLElement;

            if (!this.__resizerHandler) {
                this.__resizerHandler = this.jodit.create.div(
                    'jodit_table_resizer'
                );

                let startX: number = 0;

                this.jodit.events
                    .on(
                        this.__resizerHandler,
                        'mousedown.table touchstart.table',
                        (event: MouseEvent) => {
                            this.__drag = true;

                            startX = event.clientX;

                            this.jodit.lock(this.__key);
                            this.__resizerHandler.classList.add(
                                'jodit_table_resizer-moved'
                            );

                            let box: ClientRect,
                                tableBox: ClientRect = this.__workTable.getBoundingClientRect();

                            this.__minX = 0;
                            this.__maxX = 1000000;

                            if (this.__wholeTable !== null) {
                                tableBox = (this.__workTable
                                    .parentNode as HTMLElement).getBoundingClientRect();
                                this.__minX = tableBox.left;
                                this.__maxX = tableBox.left + tableBox.width;
                            } else {
                                // find maximum columns
                                const coordinate: number[] = Table.formalCoordinate(
                                    this.__workTable,
                                    this.__workCell,
                                    true
                                );

                                Table.formalMatrix(
                                    this.__workTable,
                                    (td, i, j) => {
                                        if (coordinate[1] === j) {
                                            box = td.getBoundingClientRect();
                                            this.__minX = Math.max(
                                                box.left + consts.NEARBY / 2,
                                                this.__minX
                                            );
                                        }
                                        if (coordinate[1] + 1 === j) {
                                            box = td.getBoundingClientRect();
                                            this.__maxX = Math.min(
                                                box.left +
                                                    box.width -
                                                    consts.NEARBY / 2,
                                                this.__maxX
                                            );
                                        }
                                    }
                                );
                            }

                            return false;
                        }
                    )
                    .on(
                        this.__resizerHandler,
                        'mouseenter.table',
                        () => {
                            clearTimeout(this.hideTimeout);
                        }
                    )
                    .on(
                        this.jodit.editorWindow,
                        'mousemove.table touchmove.table',
                        (event: MouseEvent) => {
                            if (this.__drag) {
                                let x = event.clientX;

                                const workplacePosition: IBound = offset(
                                    (this.__resizerHandler.parentNode ||
                                        this.jodit.ownerDocument
                                            .documentElement) as HTMLElement,
                                    this.jodit,
                                    this.jodit.ownerDocument,
                                    true
                                );

                                if (x < this.__minX) {
                                    x = this.__minX;
                                }
                                if (x > this.__maxX) {
                                    x = this.__maxX;
                                }

                                this.__resizerDelta = x - startX + (!this.jodit.options.iframe ? 0 : workplacePosition.left);
                                this.__resizerHandler.style.left = (x - (this.jodit.options.iframe ? 0 : workplacePosition.left)) + 'px';

                                this.jodit.editorWindow
                                    .getSelection()
                                    .removeAllRanges();

                                if (event.preventDefault) {
                                    event.preventDefault();
                                }
                            }
                        }
                    );

                this.jodit.workplace.appendChild(this.__resizerHandler);
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
    private __calcResizerPosition(
        table: HTMLTableElement,
        cell: HTMLTableCellElement,
        offsetX: number = 0,
        delta: number = 0
    ) {
        const
            box = offset(cell, this.jodit, this.jodit.editorDocument);

        if (offsetX <= consts.NEARBY || box.width - offsetX <= consts.NEARBY) {
            const
                workplacePosition: IBound = offset(
                    (this.__resizerHandler.parentNode ||
                        this.jodit.ownerDocument
                            .documentElement) as HTMLElement,
                    this.jodit,
                    this.jodit.ownerDocument,
                    true
                ),
                parentBox: IBound = offset(
                    table,
                    this.jodit,
                    this.jodit.editorDocument
                );

            this.__resizerHandler.style.left =
                ((offsetX <= consts.NEARBY ? box.left : box.left + box.width) - workplacePosition.left + delta) + 'px';

            this.__resizerHandler.style.height = parentBox.height + 'px';
            this.__resizerHandler.style.top = (parentBox.top - workplacePosition.top) + 'px';

            this.showResizer();

            if (offsetX <= consts.NEARBY) {
                const prevTD = Dom.prev(
                    cell,
                    TableProcessor.isCell,
                    cell.parentNode as HTMLElement
                ) as HTMLTableCellElement;
                if (prevTD) {
                    this.__setWorkCell(prevTD);
                } else {
                    this.__setWorkCell(cell, true);
                }
            } else {
                const nextTD = Dom.next(
                    cell,
                    TableProcessor.isCell,
                    cell.parentNode as HTMLElement
                );
                this.__setWorkCell(cell, !nextTD ? false : null);
            }
        } else {
            this.hideResizer();
        }
    }

    /**
     *
     * @param {string} command
     */
    private onExecCommand = (command: string): false | void => {
        if (
            /table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow)/.test(
                command
            )
        ) {
            command = command.replace('table', '');
            const cells = Table.getAllSelectedCells(this.jodit.editor);
            if (cells.length) {
                const cell: HTMLTableCellElement | undefined = cells.shift();

                if (!cell) {
                    return;
                }

                const table = Dom.closest(
                    cell,
                    'table',
                    this.jodit.editor
                ) as HTMLTableElement;

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
                        Table.getAllSelectedCells(this.jodit.editor).forEach(
                            td => (td.innerHTML = '')
                        );
                        break;
                    case 'bin':
                        Dom.safeRemove(table);
                        break;
                    case 'binrow':
                        Table.removeRow(
                            table,
                            (cell.parentNode as HTMLTableRowElement).rowIndex
                        );
                        break;
                    case 'bincolumn':
                        Table.removeColumn(table, cell.cellIndex);
                        break;
                    case 'addcolumnafter':
                    case 'addcolumnbefore':
                        Table.appendColumn(
                            table,
                            cell.cellIndex,
                            command === 'addcolumnafter'
                        );
                        break;
                    case 'addrowafter':
                    case 'addrowbefore':
                        Table.appendRow(
                            table,
                            cell.parentNode as HTMLTableRowElement,
                            command === 'addrowafter'
                        );
                        break;
                }
            }
            return false;
        }
    };

    observe(table: HTMLTableElement) {
        (table as any)[this.__key] = true;

        let start: HTMLTableCellElement;

        this.jodit.events
            .on(table, 'mousedown.table touchstart.table', (event: MouseEvent) => {
                if (this.jodit.options.readonly) {
                    return;
                }

                const cell: HTMLTableCellElement = Dom.up(
                    event.target as HTMLElement,
                    TableProcessor.isCell,
                    table
                ) as HTMLTableCellElement;
                if (
                    cell &&
                    cell instanceof (this.jodit.editorWindow as any).HTMLElement
                ) {
                    if (!cell.firstChild) {
                        cell.appendChild(
                            this.jodit.editorDocument.createElement('br')
                        );
                    }

                    start = cell;
                    Table.addSelected(cell);
                    this.__selectMode = true;
                }
            })
            .on(table, 'mouseleave.table', (e: MouseEvent) => {
                if (
                    this.__resizerHandler &&
                    this.__resizerHandler !== e.relatedTarget
                ) {
                    this.hideResizer();
                }
            })
            .on(table, 'mousemove.table touchmove.table', (event: MouseEvent) => {
                if (this.jodit.options.readonly) {
                    return;
                }

                if (this.__drag || this.jodit.isLockedNotBy(this.__key)) {
                    return;
                }

                const cell = Dom.up(
                    event.target as HTMLElement,
                    TableProcessor.isCell,
                    table
                ) as HTMLTableCellElement;

                if (cell) {
                    if (this.__selectMode) {
                        if (cell !== start) {
                            this.jodit.lock(this.__key);
                            this.jodit.editorWindow
                                .getSelection()
                                .removeAllRanges();
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                        this.__deSelectAll(table);
                        const bound = Table.getSelectedBound(table, [
                                cell,
                                start,
                            ]),
                            box = Table.formalMatrix(table);

                        for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
                            for (
                                let j = bound[0][1];
                                j <= bound[1][1];
                                j += 1
                            ) {
                                Table.addSelected(box[i][j]);
                            }
                        }

                        const
                            max = box[bound[1][0]][bound[1][1]],
                            min = box[bound[0][0]][bound[0][1]];

                        this.jodit.events.fire(
                            'showPopup',
                            table,
                            (): IBound => {
                                const minOffset: IBound = offset(
                                    min,
                                    this.jodit,
                                    this.jodit.editorDocument
                                );
                                const maxOffset: IBound = offset(
                                    max,
                                    this.jodit,
                                    this.jodit.editorDocument
                                );

                                return {
                                    left: minOffset.left,
                                    top: minOffset.top,
                                    width:
                                        maxOffset.left -
                                        minOffset.left +
                                        maxOffset.width,
                                    height:
                                        maxOffset.top -
                                        minOffset.top +
                                        maxOffset.height,
                                };
                            }
                        );

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
    afterInit(editor: IJodit): void {
        if (!editor.options.useTableProcessor) {
            return;
        }

        editor.events
            .on(this.jodit.ownerWindow, 'mouseup.table touchend.table', () => {
                if (this.__selectMode || this.__drag) {
                    this.__selectMode = false;
                    this.jodit.unlock();
                }
                if (this.__resizerHandler && this.__drag) {
                    this.__drag = false;
                    this.__resizerHandler.classList.remove(
                        'jodit_table_resizer-moved'
                    );

                    // resize column
                    if (this.__wholeTable === null) {
                        const __marked: HTMLTableCellElement[] = [];

                        Table.setColumnWidthByDelta(
                            this.__workTable,
                            Table.formalCoordinate(
                                this.__workTable,
                                this.__workCell,
                                true
                            )[1],
                            this.__resizerDelta,
                            true,
                            __marked
                        );
                        const nextTD = Dom.next(
                            this.__workCell,
                            TableProcessor.isCell,
                            this.__workCell.parentNode as HTMLElement
                        ) as HTMLTableCellElement;

                        Table.setColumnWidthByDelta(
                            this.__workTable,
                            Table.formalCoordinate(this.__workTable, nextTD)[1],
                            -this.__resizerDelta,
                            false,
                            __marked
                        );
                    } else {
                        const width = this.__workTable.offsetWidth,
                            parentWidth = getContentWidth(
                                this.__workTable.parentNode as HTMLElement,
                                this.jodit.editorWindow
                            );

                        // right side
                        if (!this.__wholeTable) {
                            this.__workTable.style.width =
                                ((width + this.__resizerDelta) / parentWidth) *
                                    100 +
                                '%';
                        } else {
                            const margin = parseInt(
                                this.jodit.editorWindow.getComputedStyle(
                                    this.__workTable
                                ).marginLeft || '0',
                                10
                            );
                            this.__workTable.style.width =
                                ((width - this.__resizerDelta) / parentWidth) *
                                    100 +
                                '%';
                            this.__workTable.style.marginLeft =
                                ((margin + this.__resizerDelta) / parentWidth) *
                                    100 +
                                '%';
                        }
                    }

                    editor.setEditorValue();
                    editor.selection.focus();
                }
            })
            .on(this.jodit.ownerWindow, 'scroll.table', () => {
                if (this.__drag) {
                    const parent = Dom.up(
                        this.__workCell,
                        (elm: Node | null) => elm && elm.nodeName === 'TABLE',
                        editor.editor
                    ) as HTMLElement;
                    if (parent) {
                        const parentBox = parent.getBoundingClientRect();
                        this.__resizerHandler.style.top = parentBox.top + 'px';
                    }
                }
            })
            .on(
                this.jodit.ownerWindow,
                'mousedown.table touchend.table',
                (event: MouseEvent) => {
                    // need use event['originalEvent'] because of IE can not set target from
                    // another window to current window
                    const current_cell: HTMLTableCellElement = Dom.closest(
                        (event as any).originalEvent.target as HTMLElement,
                        'TD|TH',
                        this.jodit.editor
                    ) as HTMLTableCellElement;
                    let table: HTMLTableElement | null = null;

                    if (
                        current_cell instanceof
                        (this.jodit.editorWindow as any).HTMLTableCellElement
                    ) {
                        table = Dom.closest(
                            current_cell,
                            'table',
                            this.jodit.editor
                        ) as HTMLTableElement;
                    }

                    if (table) {
                        this.__deSelectAll(
                            table,
                            current_cell instanceof
                                (this.jodit.editorWindow as any)
                                    .HTMLTableCellElement
                                ? current_cell
                                : false
                        );
                    } else {
                        this.__deSelectAll();
                    }
                }
            )
            .on('afterGetValueFromEditor.table', (data: { value: string }) => {
                data.value = data.value.replace(
                    new RegExp(
                        `([\s]*)${consts.JODIT_SELECTED_CELL_MARKER}="1"`,
                        'g'
                    ),
                    ''
                );
            })
            .on('change.table afterCommand.table afterSetMode.table', () => {
                ($$('table', editor.editor) as HTMLTableElement[]).forEach(
                    (table: HTMLTableElement) => {
                        if (!(table as any)[this.__key]) {
                            this.observe(table);
                        }
                    }
                );
            })
            .on('beforeSetMode.table', () => {
                Table.getAllSelectedCells(editor.editor).forEach(td => {
                    Table.restoreSelection(td);
                    Table.normalizeTable(Dom.closest(
                        td,
                        'table',
                        editor.editor
                    ) as HTMLTableElement);
                });
            })
            .on('keydown.table', (event: KeyboardEvent) => {
                if (event.which === consts.KEY_TAB) {
                    ($$('table', editor.editor) as HTMLTableElement[]).forEach(
                        (table: HTMLTableElement) => {
                            this.__deSelectAll(table);
                        }
                    );
                }
            })
            .on('beforeCommand.table', this.onExecCommand.bind(this));
    }

    beforeDestruct(jodit: IJodit): void {
        if (jodit.events) {
            jodit.events.off(this.jodit.ownerWindow, '.table');
            jodit.events.off('.table');
        }
    }
}
