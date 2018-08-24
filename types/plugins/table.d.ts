/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
import { Component } from "../modules/index";
declare module "../Config" {
    interface Config {
        /**
         * Use module {@link TableProcessor|TableProcessor}
         */
        useTableProcessor: boolean;
        useExtraClassesOptions: boolean;
    }
}
/**
 * Process tables in editor
 */
export declare class TableProcessor extends Component {
    private __key;
    private __selectMode;
    /**
     *
     * @param {HTMLTableElement} [table]
     * @param {HTMLTableCellElement} [current_cell]
     * @private
     */
    private __deSelectAll;
    private __resizerDelta;
    private __resizerHandler;
    private __drag;
    private __wholeTable;
    private __workCell;
    private __workTable;
    static isCell(tag: Node | null): boolean;
    /**
     *
     * @param {HTMLTableCellElement} cell
     * @param {boolean|null} [wholeTable=null] true - resize whole table by left side, false - resize whole table by right side, null - resize column
     * @private
     */
    private __setWorkCell;
    private __minX;
    private __maxX;
    private __addResizer;
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
    private __calcResizerPosition;
    observe(table: HTMLTableElement): void;
    /**
     *
     * @param {Jodit} editor
     */
    constructor(editor: Jodit);
    /**
     *
     * @param {string} command
     */
    private onExecCommand;
}
