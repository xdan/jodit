import Component from './Component'

/**
 * Module for creating snapshot of editor which includes html content and the current selection
 * @module Snapshot
 * @params {Object} parent Jodit main object
 */
type RangeType = {
    startContainer: number[];
    startOffset: number;
    endContainer: number[];
    endOffset: number;
}
type SnapshotType = {
    html: string;
    range: RangeType;
}
export default class Snapshot extends Component {
    __countElementsBefore (elm): number {
        if (!elm.parentNode) {
            return 0;
        }

        let elms = elm.parentNode.childNodes,
            count = 0,
            last,
            j;

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
    }
    __decomposeHierarchyNodes (elm): number[] {
        let counts = [];
        if (!elm.parentNode) {
            return [];
        }
        while (elm && elm !== this.parent.editor) {
            counts.push(this.__countElementsBefore(elm));
            elm = elm.parentNode;
        }
        return counts.reverse();
    }

    __strokeOffset (elm, offset): number {
        while (elm && elm.nodeType === Node.TEXT_NODE) {
            elm = elm.previousSibling;
            if (elm && elm.nodeType === Node.TEXT_NODE) {
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
    make() {
        let snapshot: SnapshotType = {
            html: '',
            range: {
                startContainer: [],
                startOffset: 0,
                endContainer: [],
                endOffset: 0
            }
        }, range;
        snapshot.html = this.parent.getEditorValue();
        let sel = this.parent.win.getSelection();

        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            snapshot.range = {
                startContainer: this.__decomposeHierarchyNodes(range.startContainer),
                startOffset: this.__strokeOffset(range.startContainer, range.startOffset),
                endContainer: this.__decomposeHierarchyNodes(range.endContainer),
                endOffset: this.__strokeOffset(range.endContainer, range.endOffset)
            }
        }
        return snapshot;
    }
    __restoreElementByLadder (ladder) {
        let n = <Node>this.parent.editor,
            i;
        for (i = 0; n && i < ladder.length; i += 1) {
            n = n.childNodes[ladder[i]];
        }
        return n;
    }

    /**
     * Compare two snapshotes, if and htmls and selections match, then return true
     *
     * @param {object} first - the first snapshote
     * @param {object} second - second shot
     * @return {boolean}
     */
    equal (first, second) {
        return first.html === second.html && JSON.stringify(first.range) === JSON.stringify(second.range);
    }

    /**
     * Restores the state of the editor of the picture. Rebounding is not only html but selected text
     *
     * @param {object} snapshot - snapshot of editor resulting from the `{@link module:Snapshot~make|make}`
     * @see make
     */
    restore (snapshot) {
        this.parent.setEditorValue(snapshot.html);
        try {
            if (snapshot.range) {
                let sel = this.win.getSelection(),
                    range = this.doc.createRange();

                range.setStart(this.__restoreElementByLadder(snapshot.range.startContainer), snapshot.range.startOffset);
                range.setEnd(this.__restoreElementByLadder(snapshot.range.endContainer), snapshot.range.endOffset);

                sel.removeAllRanges();
                sel.addRange(range);
            }
        } catch(__ignore) {

        }
    }
}