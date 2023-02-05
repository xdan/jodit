/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/history
 */

import type { IJodit, ISnapshot, Nullable, SnapshotType } from 'jodit/types';
import { ViewComponent } from 'jodit/core/component';
import { Dom } from 'jodit/core/dom';
import { TEMP_ATTR } from 'jodit/core/constants';

/**
 * Module for creating snapshot of editor which includes html content and the current selection
 */
export class Snapshot extends ViewComponent<IJodit> implements ISnapshot {
	/** @override */
	override className(): string {
		return 'Snapshot';
	}

	/**
	 * Compare two snapshotes, if and htmls and selections match, then return true
	 *
	 * @param first - the first snapshote
	 * @param second - second shot
	 */
	static equal(first: SnapshotType, second: SnapshotType): boolean {
		return (
			first.html === second.html &&
			JSON.stringify(first.range) === JSON.stringify(second.range)
		);
	}

	/**
	 * Calc count element before some node in parentNode. All text nodes are joined
	 */
	private static countNodesBeforeInParent(elm: Node): number {
		if (!elm.parentNode) {
			return 0;
		}

		const elms = elm.parentNode.childNodes;

		let count: number = 0,
			previous: Nullable<Node> = null;

		for (let j = 0; j < elms.length; j += 1) {
			if (
				previous &&
				!this.isIgnoredNode(elms[j]) &&
				!(Dom.isText(previous) && Dom.isText(elms[j]))
			) {
				count += 1;
			}

			if (elms[j] === elm) {
				return count;
			}

			previous = elms[j];
		}

		return 0;
	}

	/**
	 * Calc normal offset in joined text nodes
	 */
	private static strokeOffset(elm: Nullable<Node>, offset: number): number {
		while (Dom.isText(elm)) {
			elm = elm.previousSibling;

			if (Dom.isText(elm) && elm.nodeValue) {
				offset += elm.nodeValue.length;
			}
		}

		return offset;
	}

	/**
	 * Calc whole hierarchy path before some element in editor's tree
	 */
	private calcHierarchyLadder(elm: Nullable<Node>): number[] {
		const counts: number[] = [];

		if (!elm || !elm.parentNode || !Dom.isOrContains(this.j.editor, elm)) {
			return [];
		}

		while (elm && elm !== this.j.editor) {
			if (elm && !Snapshot.isIgnoredNode(elm)) {
				counts.push(Snapshot.countNodesBeforeInParent(elm));
			}

			elm = elm.parentNode;
		}

		return counts.reverse();
	}

	private getElementByLadder(ladder: number[]): Node {
		let n: Node = this.j.editor as Node,
			i: number;

		for (i = 0; n && i < ladder.length; i += 1) {
			n = n.childNodes[ladder[i]];
		}

		return n;
	}

	private __isBlocked: boolean = false;
	get isBlocked(): boolean {
		return this.__isBlocked;
	}

	private __block(enable: boolean): void {
		this.__isBlocked = enable;
	}

	transaction(changes: () => void): void {
		this.__block(true);

		try {
			changes();
		} catch (e) {
			!isProd && console.error(e);
		}

		this.__block(false);
	}

	/**
	 * Creates object a snapshot of editor: html and the current selection. Current selection calculate by
	 * offset by start document
	 * \{html: string, range: \{startContainer: int, startOffset: int, endContainer: int, endOffset: int\}\} or
	 * \{html: string\} without selection
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

		snapshot.html = this.removeJoditSelection(this.j.editor);

		const sel = this.j.s.sel;

		if (sel && sel.rangeCount) {
			const range = sel.getRangeAt(0),
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
				range.startContainer !== this.j.editor
			) {
				startOffset = 0;
			}

			if (!endContainer.length && range.endContainer !== this.j.editor) {
				endOffset = 0;
			}

			snapshot.range = {
				startContainer,
				startOffset,
				endContainer,
				endOffset
			};
		}

		return snapshot;
	}

	/**
	 * Restores the state of the editor of the snapshot. Rebounding is not only html but selected text
	 *
	 * @param snapshot - snapshot of editor resulting from the `[[Snapshot.make]]` method
	 * @see make
	 */
	restore(snapshot: SnapshotType): void {
		this.transaction(() => {
			const scroll = this.storeScrollState();

			const value = this.j.getNativeEditorValue();
			if (value !== snapshot.html) {
				this.j.value = snapshot.html;
			}

			this.restoreOnlySelection(snapshot);

			this.restoreScrollState(scroll);
		});
	}

	private storeScrollState(): [number, number] {
		return [this.j.ow.scrollY, this.j.editor.scrollTop];
	}

	private restoreScrollState(scrolls: [number, number]): void {
		const { j } = this,
			{ ow } = j;

		ow.scrollTo(ow.scrollX, scrolls[0]);
		j.editor.scrollTop = scrolls[1];
	}

	/**
	 * Restore selection from snapshot
	 *
	 * @param snapshot - snapshot of editor resulting from the [[Snapshot.make]] method
	 * @see make
	 */
	restoreOnlySelection(snapshot: SnapshotType): void {
		try {
			if (snapshot.range) {
				const range = this.j.ed.createRange();

				range.setStart(
					this.getElementByLadder(snapshot.range.startContainer),
					snapshot.range.startOffset
				);

				range.setEnd(
					this.getElementByLadder(snapshot.range.endContainer),
					snapshot.range.endOffset
				);

				this.j.s.selectRange(range);
			}
		} catch (__ignore) {
			this.j.editor.lastChild &&
				this.j.s.setCursorAfter(this.j.editor.lastChild);

			if (!isProd) {
				// tslint:disable-next-line:no-console
				console.warn('Broken snapshot', __ignore);
			}
		}
	}

	override destruct(): void {
		this.__block(false);
		super.destruct();
	}

	private static isIgnoredNode(node: Node): boolean {
		return (Dom.isText(node) && !node.nodeValue) || Dom.isTemporary(node);
	}

	private removeJoditSelection(node: HTMLElement): string {
		const clone = node.cloneNode(true) as HTMLElement;

		clone.querySelectorAll(`[${TEMP_ATTR}]`).forEach(Dom.unwrap);

		return clone.innerHTML;
	}
}
