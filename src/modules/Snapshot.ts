/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IJodit, SnapshotType } from '../types';
import { Component } from './Component';
import { Dom } from './Dom';

/**
 * Module for creating snapshot of editor which includes html content and the current selection
 */
export class Snapshot extends Component<IJodit> {
    /**
     * Compare two snapshotes, if and htmls and selections match, then return true
     *
     * @param {SnapshotType} first - the first snapshote
     * @param {SnapshotType} second - second shot
     * @return {boolean}
     */
    public static equal(first: SnapshotType, second: SnapshotType): boolean {
        return (
            first.html === second.html &&
            JSON.stringify(first.range) === JSON.stringify(second.range)
        );
    }
    /**
     * Calc count element before some node in parentNode. All text nodes are joined
     *
     * @param {Node | null} elm
     * @return {number}
     */
    private static countNodesBeforeInParent(elm: Node): number {
        if (!elm.parentNode) {
            return 0;
        }

        const elms: NodeList = elm.parentNode.childNodes;
        let count: number = 0,
            last: Node | null = null,
            j: number;

        for (j = 0; j < elms.length; j += 1) {
            if (
                last &&
                (!(
                    elms[j].nodeType === Node.TEXT_NODE &&
                    elms[j].textContent === ''
                ) &&
                    !(
                        last.nodeType === Node.TEXT_NODE &&
                        elms[j].nodeType === Node.TEXT_NODE
                    ))
            ) {
                count += 1;
            }

            if (elms[j] === elm) {
                return count;
            }

            last = elms[j];
        }

        return 0;
    }

    /**
     * Calc normal offset in joined text nodes
     *
     * @param {Node | null} elm
     * @param {number} offset
     * @return {number}
     */
    private static strokeOffset(elm: Node | null, offset: number): number {
        while (elm && elm.nodeType === Node.TEXT_NODE) {
            elm = elm.previousSibling;
            if (
                elm &&
                elm.nodeType === Node.TEXT_NODE &&
                elm.textContent !== null
            ) {
                offset += elm.textContent.length;
            }
        }

        return offset;
    }

    /**
     * Calc whole hierarchy path before some element in editor's tree
     *
     * @param {Node | null} elm
     * @return {number[]}
     * @private
     */
    private calcHierarchyLadder(elm: Node | null): number[] {
        const counts: number[] = [];

        if (
            !elm ||
            !elm.parentNode ||
            !Dom.isOrContains(this.jodit.editor, elm)
        ) {
            return [];
        }

        while (elm && elm !== this.jodit.editor) {
            if (elm) {
                counts.push(Snapshot.countNodesBeforeInParent(elm));
            }
            elm = elm.parentNode;
        }

        return counts.reverse();
    }

    private getElementByLadder(ladder: number[]): Node {
        let n: Node = this.jodit.editor as Node,
            i: number;

        for (i = 0; n && i < ladder.length; i += 1) {
            n = n.childNodes[ladder[i]];
        }

        return n;
    }

    isBlocked: boolean = false;

    /**
     * Creates object a snapshot of editor: html and the current selection. Current selection calculate by
     * offset by start document
     *
     * @return {object}
     * {html: string, range: {startContainer: int, startOffset: int, endContainer: int, endOffset: int}} or
     * {html: string} without selection
     */
    make(): SnapshotType {
        const snapshot: SnapshotType = {
            html: '',
            range: {
                startContainer: [],
                startOffset: 0,
                endContainer: [],
                endOffset: 0,
            },
        };

        snapshot.html = this.jodit.getNativeEditorValue();

        const sel: Selection = this.jodit.editorWindow.getSelection();

        if (sel && sel.rangeCount) {
            const range: Range = sel.getRangeAt(0),
                startContainer = this.calcHierarchyLadder(range.startContainer),
                endContainer = this.calcHierarchyLadder(range.endContainer);

            let startOffset = Snapshot.strokeOffset(
                    range.startContainer,
                    range.startOffset
                ),
                endOffset = Snapshot.strokeOffset(
                    range.endContainer,
                    range.endOffset
                );

            if (
                !startContainer.length &&
                range.startContainer !== this.jodit.editor
            ) {
                startOffset = 0;
            }

            if (
                !endContainer.length &&
                range.endContainer !== this.jodit.editor
            ) {
                endOffset = 0;
            }

            snapshot.range = {
                startContainer,
                startOffset,
                endContainer,
                endOffset,
            };
        }

        return snapshot;
    }

    /**
     * Restores the state of the editor of the snapshot. Rebounding is not only html but selected text
     *
     * @param {object} snapshot - snapshot of editor resulting from the `{@link Snapshot~make|make}`
     * @see make
     */
    restore(snapshot: SnapshotType) {
        this.isBlocked = true;
        this.jodit.setEditorValue(snapshot.html);

        try {
            if (snapshot.range) {
                const range: Range = this.jodit.editorDocument.createRange();

                range.setStart(
                    this.getElementByLadder(snapshot.range.startContainer),
                    snapshot.range.startOffset
                );
                range.setEnd(
                    this.getElementByLadder(snapshot.range.endContainer),
                    snapshot.range.endOffset
                );

                this.jodit.selection.selectRange(range);
            }
        } catch (__ignore) {
            if (process.env.NODE_ENV !== 'production') {
                throw __ignore;
            }
        }

        this.isBlocked = false;
    }

    destruct(): any {
        this.isBlocked = false;
        super.destruct();
    }
}
