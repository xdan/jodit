/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Component} from './Component'

type RangeType = {
    startContainer: number[];
    startOffset: number;
    endContainer: number[];
    endOffset: number;
}

export type SnapshotType = {
    html: string;
    range: RangeType;
}

/**
 * Module for creating snapshot of editor which includes html content and the current selection
 */
export class Snapshot extends Component {
    private static __countElementsBefore (elm: Node|null): number {
        if (!elm || !elm.parentNode) {
            return 0;
        }

        let elms: NodeList = elm.parentNode.childNodes,
            count: number = 0,
            last: Node|null = null,
            j: number;

        for (j = 0; j < elms.length; j += 1) {
            if (last && (
                    !(elms[j].nodeType === Node.TEXT_NODE && elms[j].textContent === '') &&
                    !(last.nodeType === Node.TEXT_NODE && elms[j].nodeType === Node.TEXT_NODE)
                )) {
                count += 1;
            }

            if (elms[j] === elm) {
                return count;
            }

            last = elms[j];
        }

        return 0;
    }
    private __decomposeHierarchyNodes (elm: Node|null): number[] {
        const counts: number[] = [];

        if (!elm || !elm.parentNode) {
            return [];
        }

        while (elm && elm !== this.jodit.editor) {
            if (elm) {
                counts.push(Snapshot.__countElementsBefore(elm));
            }
            elm = elm.parentNode;
        }

        return counts.reverse();
    }

    private static __strokeOffset (elm: Node|null, offset: number): number {
        while (elm && elm.nodeType === Node.TEXT_NODE) {
            elm = elm.previousSibling;
            if (elm && elm.nodeType === Node.TEXT_NODE && elm.textContent !== null) {
                offset += elm.textContent.length;
            }
        }
        return offset;
    }

    /**
     * Creates object a snapshot of editor: html and the current selection. Current selection calculate by offset by start document
     *
     * @return {object} {html: string, range: {startContainer: int, startOffset: int, endContainer: int, endOffset: int}} или {html: string} при отсутствии выделения
     */
    make(): SnapshotType {
        const snapshot: SnapshotType = {
            html: '',
            range: {
                startContainer: [],
                startOffset: 0,
                endContainer: [],
                endOffset: 0
            }
        };
        snapshot.html = this.jodit.getEditorValue();
        const sel: Selection = this.jodit.editorWindow.getSelection();

        if (sel.rangeCount) {
            const range: Range = sel.getRangeAt(0);
            snapshot.range = {
                startContainer: this.__decomposeHierarchyNodes(range.startContainer),
                startOffset: Snapshot.__strokeOffset(range.startContainer, range.startOffset),
                endContainer: this.__decomposeHierarchyNodes(range.endContainer),
                endOffset: Snapshot.__strokeOffset(range.endContainer, range.endOffset)
            }
        }
        return snapshot;
    }

    private __restoreElementByLadder (ladder: number[]): Node {
        let n: Node = <Node>this.jodit.editor,
            i: number;

        for (i = 0; n && i < ladder.length; i += 1) {
            n = n.childNodes[ladder[i]];
        }

        return n;
    }

    /**
     * Compare two snapshotes, if and htmls and selections match, then return true
     *
     * @param {SnapshotType} first - the first snapshote
     * @param {SnapshotType} second - second shot
     * @return {boolean}
     */
    static equal (first: SnapshotType, second: SnapshotType): boolean {
        return first.html === second.html && JSON.stringify(first.range) === JSON.stringify(second.range);
    }

    /**
     * Restores the state of the editor of the picture. Rebounding is not only html but selected text
     *
     * @param {object} snapshot - snapshot of editor resulting from the `{@link Snapshot~make|make}`
     * @see make
     */
    restore (snapshot: SnapshotType) {
        this.jodit.setEditorValue(snapshot.html);

        try {
            if (snapshot.range) {
                const sel: Selection = this.jodit.editorWindow.getSelection(),
                    range: Range = this.jodit.editorDocument.createRange();

                range.setStart(this.__restoreElementByLadder(snapshot.range.startContainer), snapshot.range.startOffset);
                range.setEnd(this.__restoreElementByLadder(snapshot.range.endContainer), snapshot.range.endOffset);

                sel.removeAllRanges();
                sel.addRange(range);
            }
        } catch(__ignore) {

        }
    }
}