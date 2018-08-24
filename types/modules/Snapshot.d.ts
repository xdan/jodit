/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from './Component';
declare type RangeType = {
    startContainer: number[];
    startOffset: number;
    endContainer: number[];
    endOffset: number;
};
export declare type SnapshotType = {
    html: string;
    range: RangeType;
};
/**
 * Module for creating snapshot of editor which includes html content and the current selection
 */
export declare class Snapshot extends Component {
    /**
     * Calc count element before some node in parentNode. All text nodes are joined
     *
     * @param {Node | null} elm
     * @return {number}
     */
    private static countNodesBeforeInParent;
    /**
     * Calc whole hierarchy path before some element in editor's tree
     *
     * @param {Node | null} elm
     * @return {number[]}
     * @private
     */
    private calcHierarchyLadder;
    /**
     * Calc normal offset in joined text nodes
     *
     * @param {Node | null} elm
     * @param {number} offset
     * @return {number}
     */
    private static strokeOffset;
    /**
     * Creates object a snapshot of editor: html and the current selection. Current selection calculate by offset by start document
     *
     * @return {object} {html: string, range: {startContainer: int, startOffset: int, endContainer: int, endOffset: int}} или {html: string} при отсутствии выделения
     */
    make(): SnapshotType;
    private getElementByLadder;
    /**
     * Compare two snapshotes, if and htmls and selections match, then return true
     *
     * @param {SnapshotType} first - the first snapshote
     * @param {SnapshotType} second - second shot
     * @return {boolean}
     */
    static equal(first: SnapshotType, second: SnapshotType): boolean;
    isBlocked: boolean;
    /**
     * Restores the state of the editor of the snapshot. Rebounding is not only html but selected text
     *
     * @param {object} snapshot - snapshot of editor resulting from the `{@link Snapshot~make|make}`
     * @see make
     */
    restore(snapshot: SnapshotType): void;
}
export {};
