/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/select/README.md]]
 * @packageDocumentation
 * @module plugins/select
 */

import type { IJodit, Nullable } from 'jodit/types';
import { IS_INLINE, LIST_TAGS } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { toArray } from 'jodit/core/helpers/array/to-array';
import { camelCase } from 'jodit/core/helpers/string/camel-case';
import { Plugin } from 'jodit/core/plugin';
import { Popup, UIElement } from 'jodit/core/ui';

import './config';

/**
 * A utility plugin that allows you to subscribe to a click/mousedown/touchstart/mouseup on an element in DOM order
 *
 * @example
 * ```js
 * const editor = Jodit.make('#editor');
 * editor.e.on('clickImg', (img) => {
 *   console.log(img.src);
 * })
 * ```
 */
export class select extends Plugin {
	private proxyEventsList = [
		'click',
		'mousedown',
		'touchstart',
		'mouseup',
		'touchend'
	];

	protected override afterInit(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.select', this.onStartSelection);
		});

		jodit.e.on('dblclick', this.__onDblClickBesideRow, { top: true });
	}

	protected override beforeDestruct(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.off(eventName + '.select', this.onStartSelection);
		});

		this.__endPressBesideRow();
		jodit.e.off('dblclick', this.__onDblClickBesideRow);
	}

	@autobind
	private onStartSelection(e: MouseEvent): void {
		const { j } = this;

		let result,
			target = e.target as Nullable<Node>;

		while (result === undefined && target && target !== j.editor) {
			result = j.e.fire(
				camelCase(e.type + '_' + target.nodeName.toLowerCase()),
				target,
				e
			);

			target = target.parentElement;
		}

		if (e.type === 'click' && result === undefined && target === j.editor) {
			j.e.fire(e.type + 'Editor', target, e);
		}
	}

	/**
	 * Where the last press started. Chrome reports a drag that begins in one
	 * element and ends in another as a `click` on their common ancestor, so a
	 * press inside a popup is remembered to tell such a drag from a real click.
	 */
	private __pressTarget: Nullable<Node> = null;

	@watch(['ow:mousedown', 'ow:touchstart'])
	protected onOutsidePress(e: Event): void {
		this.__pressTarget = e.target as Nullable<Node>;
	}

	/**
	 * @event outsideClick(e) - when user clicked on the outside of editor
	 */
	@watch('ow:click')
	protected onOutsideClick(e: MouseEvent): void {
		const node = e.target as Node,
			pressed = this.__pressTarget;

		this.__pressTarget = null;

		if (Dom.up(node, elm => elm === this.j.editor)) {
			return;
		}

		// Selecting the text of a popup input with the mouse and releasing
		// the button past the popup's edge is not a click outside of it.
		if (pressed && UIElement.closestElement(pressed, Popup)) {
			return;
		}

		// An item of a list that closed once it was chosen was in a popup
		if (Dom.isNode(node) && !node.isConnected) {
			return;
		}

		const box = UIElement.closestElement(node, Popup);

		if (!box) {
			this.j.e.fire('outsideClick', e);
		}
	}

	@watch([':beforeCommandCut'])
	protected beforeCommandCut(): void | false {
		const { s } = this.j;

		if (!s.isCollapsed()) {
			const current = s.current();

			if (current && Dom.isOrContains(this.j.editor, current)) {
				this.onCopyNormalizeSelectionBound();
			}
		}
	}

	@watch([':beforeCommandSelectall'])
	protected beforeCommandSelectAll(): false {
		const { s } = this.j;
		s.focus();
		s.select(this.j.editor, true);
		s.expandSelection();
		return false;
	}

	/**
	 * Fix caret position when clicking to the right of a list item that has a
	 * nested list. Blink/WebKit place the caret at the start of the line instead
	 * of the end (#1296); move it to the end of the item's own text.
	 */
	@watch([':click'])
	protected onClickRightOfNestedListItem(e: MouseEvent): void {
		const { s } = this.j;
		const range = s.range;

		if (
			!range.collapsed ||
			range.startOffset !== 0 ||
			!Dom.isText(range.startContainer)
		) {
			return;
		}

		const text = range.startContainer;
		const li = text.parentNode;

		// The text must be the direct content of a list item that has a nested
		// list (the last level has no nested list and behaves correctly).
		if (
			!Dom.isTag(li, 'li') ||
			!Dom.first(li, node => Dom.isTag(node, LIST_TAGS))
		) {
			return;
		}

		const measure = this.j.ed.createRange();
		measure.selectNodeContents(text);
		const rect = measure.getBoundingClientRect();

		// Only when the click happened to the right of the text.
		if (e.clientX > rect.right) {
			s.setCursorAfter(text);
		}
	}

	/**
	 * The row a press to its right was beside, and the caret it put there,
	 * while the button is down
	 */
	private __pressBesideRow: Nullable<{
		row: HTMLTableRowElement;
		caret: Range;
	}> = null;

	/**
	 * The table row the mouse is to the right of
	 */
	private __rowBeside(e: MouseEvent): Nullable<{
		table: HTMLTableElement;
		row: HTMLTableRowElement;
	}> {
		const { j } = this;
		const target = e.target;

		if (
			j.o.readonly ||
			e.button !== 0 ||
			e.detail > 2 ||
			!Dom.isHTMLElement(target) ||
			Dom.closest(target, Dom.isCell, j.editor)
		) {
			return null;
		}

		const table = toArray(target.children).find(
			(elm): elm is HTMLTableElement => {
				if (!Dom.isTag(elm, 'table')) {
					return false;
				}

				const box = elm.getBoundingClientRect();
				return (
					e.clientX >= box.right &&
					e.clientY >= box.top &&
					e.clientY < box.bottom
				);
			}
		);

		const rows = table
			? toArray(table.rows).filter(row => row.cells.length)
			: [];

		if (!table || !rows.length) {
			return null;
		}

		const row =
			rows.find(row => e.clientY < row.getBoundingClientRect().bottom) ??
			rows[rows.length - 1];

		return { table, row };
	}

	/**
	 * A press to the right of a table row puts the caret where Word's typing
	 * goes from there: the start of the next row's first cell, or of the block
	 * after the table for the last row (#1770). The browsers put it after the
	 * table, whichever row it's beside, so typing starts a new line below it.
	 * Their own press is stopped, as its drag would start after the table and
	 * take in the rows below first
	 */
	@watch(':mousedown')
	protected onMouseDownBesideTableRow(e: MouseEvent): void {
		const { j } = this;
		const beside = this.__rowBeside(e);

		if (!beside) {
			return;
		}

		// A press before the last one was let go must not stack its listeners
		this.__endPressBesideRow();
		e.preventDefault();
		this.__putCaretBesideRow(beside.table, beside.row);
		this.__pressBesideRow = {
			row: beside.row,
			caret: j.s.range.cloneRange()
		};

		j.e.on(j.ew, 'mousemove', this.__onDragFromRow);
		new Set([j.ew, j.ow]).forEach(win =>
			j.e.on(win, 'mouseup', this.__onReleaseFromRow)
		);
	}

	/**
	 * A drag from beside a row selects from the end of the row to the mouse,
	 * and back beside the row it's the caret again
	 */
	@autobind
	private __onDragFromRow(e: MouseEvent): void {
		const { s } = this.j;
		const press = this.__pressBesideRow;

		if (!press || !(e.buttons & 1)) {
			this.__endPressBesideRow();
			return;
		}

		if (this.__rowBeside(e)?.row === press.row) {
			if (!s.isCollapsed()) {
				s.selectRange(press.caret.cloneRange());
			}

			return;
		}

		const { cells } = press.row;
		const last = cells[cells.length - 1];

		if (s.insertCursorAtPoint(e.clientX, e.clientY)) {
			const { startContainer, startOffset } = s.range;

			s.sel?.setBaseAndExtent(
				last,
				last.childNodes.length,
				startContainer,
				startOffset
			);
		}
	}

	/**
	 * In iframe mode, a press in an editor without the focus puts the caret at
	 * its end, so a release that selected nothing puts it back
	 */
	@autobind
	private __onReleaseFromRow(): void {
		const press = this.__pressBesideRow;

		this.__endPressBesideRow();

		if (press && this.j.s.isCollapsed()) {
			this.j.s.selectRange(press.caret);
		}
	}

	private __endPressBesideRow(): void {
		const { j } = this;

		this.__pressBesideRow = null;
		j.e.off(j.ew, 'mousemove', this.__onDragFromRow);
		new Set([j.ew, j.ow]).forEach(win =>
			j.e.off(win, 'mouseup', this.__onReleaseFromRow)
		);
	}

	/**
	 * A double click beside a row is two clicks there, so add-new-line,
	 * which adds a line on a double click with a caret, doesn't see it
	 */
	@autobind
	private __onDblClickBesideRow(e: MouseEvent): void | false {
		if (this.__rowBeside(e)) {
			this.j.e.stopPropagation('dblclick');
			return false;
		}
	}

	private __putCaretBesideRow(
		table: HTMLTableElement,
		row: HTMLTableRowElement
	): void {
		const { j } = this;
		const rows = toArray(table.rows);
		const next = rows
			.slice(rows.indexOf(row) + 1)
			.find(row => row.cells.length);

		let after = table.nextSibling;

		while (after && Dom.isEmptyTextNode(after)) {
			after = after.nextSibling;
		}

		if (next) {
			j.s.setCursorIn(next.cells[0], true);
		} else if (
			Dom.isBlock(after) &&
			!Dom.isTag(after, 'table') &&
			Dom.isContentEditable(after, j.editor)
		) {
			j.s.setCursorIn(after, true);
		} else {
			j.s.setCursorAfter(table);
		}
	}

	/**
	 * Keep pending inline formatting after a click. Toggling Bold/Italic/etc. on
	 * a collapsed cursor leaves empty marker elements with the caret inside; a
	 * click puts the caret right before them (outside), so they get cleaned up
	 * and the formatting is lost. Move the caret back into the innermost marker
	 * so the next typed character keeps every pending format (#1291).
	 */
	@watch([':click'])
	protected onClickKeepPendingFormat(): void {
		const { s } = this.j;
		const range = s.range;

		if (!range.collapsed || !Dom.isText(range.startContainer)) {
			return;
		}

		const text = range.startContainer;

		// Caret must sit at the very end of the text, right before the markers.
		if (range.startOffset !== (text.nodeValue?.length ?? 0)) {
			return;
		}

		const marker = text.nextSibling;

		if (
			!Dom.isElement(marker) ||
			!marker.nodeName.match(IS_INLINE) ||
			!Dom.isEmpty(marker)
		) {
			return;
		}

		let inner: Element = marker;

		// Descend into the innermost empty formatting marker.
		while (
			Dom.isElement(inner.firstElementChild) &&
			inner.firstElementChild.nodeName.match(IS_INLINE)
		) {
			inner = inner.firstElementChild;
		}

		s.setCursorIn(inner);
	}

	/**
	 * Normalize selection after triple click
	 */
	@watch([':click'])
	protected onTripleClickNormalizeSelection(e: MouseEvent): void {
		if (e.detail !== 3 || !this.j.o.select.normalizeTripleClick) {
			return;
		}

		const { s } = this.j;
		const { startContainer, startOffset } = s.range;
		if (startOffset === 0 && Dom.isText(startContainer)) {
			s.select(
				Dom.closest(startContainer, Dom.isBlock, this.j.editor) ||
					startContainer,
				true
			);
		}
	}

	@watch([':copy', ':cut'])
	protected onCopyNormalizeSelectionBound(e?: ClipboardEvent): void {
		const { s, editor, o } = this.j;

		if (!o.select.normalizeSelectionBeforeCutAndCopy || s.isCollapsed()) {
			return;
		}

		if (
			e &&
			(!e.isTrusted ||
				!Dom.isNode(e.target) ||
				!Dom.isOrContains(editor, e.target))
		) {
			return;
		}

		this.jodit.s.expandSelection();
	}
}

pluginSystem.add('select', select);
