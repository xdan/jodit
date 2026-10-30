/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/select-cells/README.md]]
 * @packageDocumentation
 * @module plugins/select-cells
 */

import type { IBound, IJodit, Nullable } from 'jodit/types';
import { KEY_TAB } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { $$, alignElement, position, toArray } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { isMoved } from 'jodit/core/selection/helpers';
import { Table } from 'jodit/modules/table/table';

import './config';

const key = 'table_processor_observer';
const MOUSE_MOVE_LABEL = 'onMoveTableSelectCell';

export class selectCells extends Plugin {
	static override requires = ['select'];

	/**
	 * Shortcut for Jodit.modules.Table
	 */
	private get __tableModule(): Table {
		return this.j.getInstance<Table>(Table, this.j.o);
	}

	protected afterInit(jodit: IJodit): void {
		if (!jodit.o.tableAllowCellSelection) {
			return;
		}

		jodit.e
			// Handlers without a namespace run first, ahead of those that
			// move the caret, as table-keyboard-navigation's do
			.on('keydown', this.__onKeyDown, { top: true })
			.on('keydown.select-cells', (event: KeyboardEvent) => {
				if (event.key === KEY_TAB) {
					this.unselectCells();
				}
			})

			.on('beforeCommand.select-cells', this.onExecCommand)
			.on('afterCommand.select-cells', this.onAfterCommand)

			// see `plugins/select.ts`
			.on(
				[
					'clickEditor',
					'mousedownTd',
					'mousedownTh',
					'touchstartTd',
					'touchstartTh'
				]
					.map(e => e + '.select-cells')
					.join(' '),
				this.onStartSelection
			)
			// For `clickEditor` correct working. Because `mousedown` on first cell
			// and mouseup on another cell call `click` only for their common
			// ancestor: the row, the section, or the table across sections
			.on(
				'clickTr clickTbody clickThead clickTfoot clickTable',
				(): void | false => {
					const cellsCount =
						this.__tableModule.getAllSelectedCells().length;

					if (cellsCount) {
						if (cellsCount > 1) {
							this.j.s.sel?.removeAllRanges();
						}

						return false;
					}
				}
			);
	}

	/**
	 * The cell with the caret, and the selection, when a key went down
	 */
	private __keyDownCell: Nullable<HTMLTableCellElement> = null;
	private __keyDownRange: Nullable<Range> = null;

	@autobind
	private __onKeyDown(event?: KeyboardEvent): void {
		// A key held down moves the caret on every repeat, with one keyup
		if (event?.repeat) {
			this.__followCaret();
		}

		this.__keyDownCell = this.__caretCell();
		this.__keyDownRange = this.j.s.range.cloneRange();
		this.__keyDownInLink = this.__isInLink();
	}

	/**
	 * A link's popup replaces the cell's while the caret is in the link
	 */
	private __keyDownInLink: boolean = false;

	private __isInLink(): boolean {
		return Boolean(
			Dom.closest(this.j.s.range.startContainer, 'a', this.j.editor)
		);
	}

	/**
	 * Where the selection starts rather than `s.current()`, which finds the
	 * first cell when the caret is just before the table
	 */
	private __caretCell(): Nullable<HTMLTableCellElement> {
		return Dom.closest<HTMLTableCellElement>(
			this.j.s.range.startContainer,
			Dom.isCell,
			this.j.editor
		);
	}

	/**
	 * A key that moves the caret into a cell, from another cell or from
	 * outside the table, marks that cell and opens its popup, as a click on
	 * it does. One that moves the caret out of the table unmarks the cells
	 */
	@watch(':keyup')
	protected onKeyUp(): void {
		this.__followCaret();
	}

	private __followCaret(): void {
		const before = this.__keyDownRange;
		this.__keyDownRange = null;

		if (this.j.o.readonly || !isMoved(this.j, before)) {
			return;
		}

		const cell = this.__caretCell();
		const hasLeftLink = this.__keyDownInLink && !this.__isInLink();

		if (cell === this.__keyDownCell && !(cell && hasLeftLink)) {
			return;
		}

		const hadMarked = this.__tableModule.getAllSelectedCells().length > 0;
		this.unselectCells();

		if (!cell) {
			if (hadMarked) {
				this.j.e.fire('hidePopup', 'cells');
			}

			return;
		}

		const table = Dom.closest(cell, 'table', this.j.editor);

		if (!table) {
			return;
		}

		// As after a click, the first change to the cell keeps the mark
		this.__selectedCell = cell;
		this.__tableModule.addSelection(cell);
		this.j.e.fire(
			'showPopup',
			table,
			(): IBound => position(cell, this.j),
			'cells'
		);
	}

	/**
	 * First selected cell
	 */
	private __selectedCell: Nullable<HTMLTableCellElement> = null;

	/**
	 * User is selecting cells now
	 */
	private __isSelectionMode: boolean = false;

	/**
	 * Mouse click inside the table
	 */
	@autobind
	protected onStartSelection(
		cell: HTMLTableCellElement,
		event?: MouseEvent
	): void | false {
		if (this.j.o.readonly) {
			return;
		}

		const table = Dom.closest(
			cell,
			'table',
			this.j.editor
		) as HTMLTableElement;

		// Ctrl/Cmd + click toggles a single cell into the existing selection
		// instead of resetting it — non-contiguous multi-cell selection.
		// See https://github.com/xdan/jodit/issues/1163
		if (
			(event?.ctrlKey || event?.metaKey) &&
			cell !== this.j.editor &&
			table &&
			Dom.isCell(cell)
		) {
			if (this.__tableModule.getAllSelectedCells().includes(cell)) {
				this.__tableModule.removeSelection(cell);
			} else {
				if (!cell.firstChild) {
					Dom.append(cell, this.j.createInside.element('br'));
				}
				this.__tableModule.addSelection(cell);
			}

			this.__selectedCell = cell;
			this.j.s.sel?.removeAllRanges();

			if (this.__tableModule.getAllSelectedCells().length) {
				this.j.e.fire(
					'showPopup',
					table,
					(): IBound => position(cell, this.j),
					'cells'
				);
			} else {
				this.j.e.fire('hidePopup', 'cells');
			}

			return false;
		}

		this.unselectCells();

		if (cell === this.j.editor) {
			return;
		}

		if (!cell || !table) {
			return;
		}

		if (!cell.firstChild) {
			Dom.append(cell, this.j.createInside.element('br'));
		}

		this.__isSelectionMode = true;
		this.__selectedCell = cell;

		this.__tableModule.addSelection(cell);

		this.j.e
			.on(
				table,
				'mousemove.select-cells touchmove.select-cells',
				// Don't use decorator because need clear label on mouseup
				this.j.async.throttle(this.__onMove.bind(this, table), {
					label: MOUSE_MOVE_LABEL,
					timeout: this.j.defaultTimeout / 2
				})
			)
			.on(
				table,
				'mouseup.select-cells touchend.select-cells',
				this.__onStopSelection.bind(this, table)
			);

		return false;
	}

	@watch(':outsideClick')
	protected onOutsideClick(): void {
		this.__selectedCell = null;
		this.__onRemoveSelection();
	}

	@watch(':change')
	protected onChange(): void {
		if (!this.j.isLocked && !this.__isSelectionMode) {
			this.__onRemoveSelection();
		}
	}

	/**
	 * Mouse move inside the table
	 */
	private __onMove(table: HTMLTableElement, e: MouseEvent): void {
		if (this.j.o.readonly && !this.j.isLocked) {
			return;
		}

		if (this.j.isLockedNotBy(key)) {
			return;
		}

		// Inside Shadow DOM `document.elementFromPoint` returns the shadow
		// host, so the lookup must start from the shadow root
		const node = (this.j.o.shadowRoot ?? this.j.ed).elementFromPoint(
			e.clientX,
			e.clientY
		);

		if (!node) {
			return;
		}

		const cell = Dom.closest(node, ['td', 'th'], table);

		if (!cell || !this.__selectedCell) {
			return;
		}

		if (cell !== this.__selectedCell) {
			this.j.lock(key);
		}

		this.unselectCells();

		const bound = this.__tableModule.getSelectedBound(table, [
				cell,
				this.__selectedCell
			]),
			box = this.__tableModule.formalMatrix(table);

		for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
			for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
				this.__tableModule.addSelection(box[i][j]);
			}
		}

		const cellsCount = this.__tableModule.getAllSelectedCells().length;

		if (cellsCount > 1) {
			this.j.s.sel?.removeAllRanges();
		}

		this.j.e.fire('hidePopup');
		e.stopPropagation();

		// Hack for FireFox for force redraw selection
		((): void => {
			const n = this.j.createInside.fromHTML(
				'<div style="color:rgba(0,0,0,0.01);width:0;height:0">&nbsp;</div>'
			);

			Dom.append(cell, n);

			this.j.async.setTimeout(() => {
				Dom.safeRemove(n);
			}, this.j.defaultTimeout / 5);
		})();
	}

	/**
	 * On click in outside - remove selection
	 */
	@autobind
	private __onRemoveSelection(e?: MouseEvent): void {
		if (
			!e?.buffer?.actionTrigger &&
			!this.__selectedCell &&
			this.__tableModule.getAllSelectedCells().length
		) {
			this.j.unlock();
			this.unselectCells();
			this.j.e.fire('hidePopup', 'cells');
			return;
		}

		this.__isSelectionMode = false;
		this.__selectedCell = null;
	}

	/**
	 * Stop a selection process
	 */
	@autobind
	private __onStopSelection(table: HTMLTableElement, e: MouseEvent): void {
		if (!this.__selectedCell) {
			return;
		}

		this.__isSelectionMode = false;

		this.j.unlock();

		// Inside Shadow DOM `document.elementFromPoint` returns the shadow
		// host, so the lookup must start from the shadow root
		const node = (this.j.o.shadowRoot ?? this.j.ed).elementFromPoint(
			e.clientX,
			e.clientY
		);

		if (!node) {
			return;
		}

		const cell = Dom.closest(node, ['td', 'th'], table);

		if (!cell) {
			return;
		}

		const ownTable = Dom.closest(cell, 'table', table);

		if (ownTable && ownTable !== table) {
			return; // Nested tables
		}

		const bound = this.__tableModule.getSelectedBound(table, [
				cell,
				this.__selectedCell
			]),
			box = this.__tableModule.formalMatrix(table);

		const max = box[bound[1][0]]?.[bound[1][1]],
			min = box[bound[0][0]]?.[bound[0][1]];

		// `getSelectedBound` keeps its `Infinity` sentinel when none of the
		// selected cells belong to this table's matrix — e.g. after a
		// drag-and-drop that moved/removed the cells, leaving a stale anchor and
		// a drop target outside the table. Bail out instead of dereferencing an
		// out-of-range matrix slot (which threw `Cannot read properties of
		// undefined`).
		if (!min || !max) {
			return;
		}

		this.j.e.fire(
			'showPopup',
			table,
			(): IBound => {
				const minOffset = position(min, this.j),
					maxOffset = position(max, this.j);

				return {
					left: minOffset.left,
					top: minOffset.top,

					width: maxOffset.left - minOffset.left + maxOffset.width,

					height: maxOffset.top - minOffset.top + maxOffset.height
				};
			},
			'cells'
		);

		$$('table', this.j.editor).forEach(table => {
			this.j.e.off(
				table,
				'mousemove.select-cells touchmove.select-cells mouseup.select-cells touchend.select-cells'
			);
		});

		this.j.async.clearTimeout(MOUSE_MOVE_LABEL);
	}

	/**
	 * Remove selection for all cells
	 */
	private unselectCells(currentCell?: Nullable<HTMLTableCellElement>): void {
		const module = this.__tableModule;
		const cells = module.getAllSelectedCells();

		if (cells.length) {
			cells.forEach(cell => {
				if (!currentCell || currentCell !== cell) {
					module.removeSelection(cell);
				}
			});
		}
	}

	/**
	 * Execute custom commands for table
	 */
	@autobind
	private onExecCommand(command: string): false | void {
		// When several cells are selected, Backspace/Delete must clear the
		// selected cells instead of running the normal delete (whose collapsed
		// document-level range threw `insertNode ... #document`). See #1273.
		if (
			/^(delete|backspace)(word|sentence)?button$/.test(command) &&
			this.__tableModule.getAllSelectedCells().length > 1
		) {
			const cells = this.__tableModule.getAllSelectedCells();

			cells.forEach(td => {
				Dom.detach(td);
				Dom.append(td, this.j.createInside.element('br'));
			});

			this.unselectCells();
			this.j.s.setCursorIn(cells[0]);
			this.j.synchronizeValues();

			return false;
		}

		if (
			/table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow|headerrow)/.test(
				command
			)
		) {
			command = command.replace('table', '');

			const cells = this.__tableModule.getAllSelectedCells();

			if (cells.length) {
				const [cell] = cells;

				if (!cell) {
					return;
				}

				const table = Dom.closest(cell, 'table', this.j.editor);

				if (!table) {
					return;
				}

				switch (command) {
					case 'splitv':
						this.__tableModule.splitVertical(table);
						break;

					case 'splitg':
						this.__tableModule.splitHorizontal(table);
						break;

					case 'merge':
						this.__tableModule.mergeSelected(table);
						break;

					case 'empty':
						cells.forEach(td => {
							Dom.detach(td);
							Dom.append(td, this.j.createInside.element('br'));
						});
						break;

					case 'bin':
						this.__removeTable(table);
						break;

					case 'binrow':
						{
							const rows = new Set(
								cells.map(
									td => td.parentNode as HTMLTableRowElement
								)
							);

							const next = this.__nearestCell(
								table,
								cell,
								toArray(rows).map(row => row.rowIndex),
								true
							);

							rows.forEach(row => {
								this.__tableModule.removeRow(
									table,
									row.rowIndex
								);
							});

							next && this.j.s.setCursorIn(next);
						}
						break;

					case 'bincolumn':
						{
							const columnsSet = new Set<number>();
							const columns: number[] = [];

							cells.forEach(td => {
								const [, col] =
									this.__tableModule.formalCoordinate(
										table,
										td
									);

								if (!columnsSet.has(col)) {
									columns.push(col);
									columnsSet.add(col);
								}
							});

							const next = this.__nearestCell(
								table,
								cell,
								columns,
								false
							);

							columns
								.sort((a, b) => b - a)
								.forEach(col => {
									this.__tableModule.removeColumn(table, col);
								});

							next && this.j.s.setCursorIn(next);
						}
						break;

					case 'addcolumnafter':
					case 'addcolumnbefore':
						this.__tableModule.appendColumn(
							table,
							cell,
							command === 'addcolumnafter'
						);
						break;

					case 'addrowafter':
					case 'addrowbefore':
						this.__tableModule.appendRow(
							table,
							cell.parentNode as HTMLTableRowElement,
							command === 'addrowafter'
						);
						break;

					case 'headerrow':
						this.__toggleHeaderRow(table, cells);
						break;
				}

				if (
					/^bin(row|column)$/.test(command) &&
					!this.__tableModule.getColumnsCount(table)
				) {
					this.__removeTable(table);
				}
			}

			return false;
		}
	}

	/**
	 * Turns the table's header row on or off. The caret and the marked cells
	 * move to the cells that replace them
	 */
	private __toggleHeaderRow(
		table: HTMLTableElement,
		cells: HTMLTableCellElement[]
	): void {
		const module = this.__tableModule;

		this.j.s.save();
		const replaced = module.toggleHeaderRow(table);
		this.j.s.restore();

		cells.forEach(cell => {
			const next = replaced.get(cell);

			if (next) {
				module.removeSelection(cell);
				module.addSelection(next);
			}
		});

		// As after the click that marked it, the command's own change keeps
		// the marks, so the popup can stay open for another toggle
		const anchor = this.__selectedCell ?? cells[0];
		this.__selectedCell = replaced.get(anchor) ?? anchor;
	}

	/**
	 * The cell that takes the caret when rows or columns are deleted: the next
	 * one in the same column (or row) that is not deleted, else the previous one
	 */
	private __nearestCell(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		deleted: number[],
		isRow: boolean
	): Nullable<HTMLTableCellElement> {
		const box = this.__tableModule.formalMatrix(table);
		const [row, column] = this.__tableModule.formalCoordinate(table, cell);
		const start = isRow ? row : column;
		const count = isRow ? box.length : box[row].length;

		const find = (i: number): Nullable<HTMLTableCellElement> =>
			(!deleted.includes(i) && (isRow ? box[i][column] : box[row][i])) ||
			null;

		for (let i = start + 1; i < count; i += 1) {
			const next = find(i);

			if (next) {
				return next;
			}
		}

		for (let i = start - 1; i >= 0; i -= 1) {
			const prev = find(i);

			if (prev) {
				return prev;
			}
		}

		return null;
	}

	/**
	 * Add some align after native command
	 */
	@autobind
	private onAfterCommand(command: string): void {
		if (/^justify/.test(command)) {
			this.__tableModule
				.getAllSelectedCells()
				.forEach(elm => alignElement(command, elm));
		}
	}

	/**
	 * Remove the table and put the caret where it stood: at the start of what
	 * follows it, else at the end of what precedes it
	 */
	private __removeTable(table: HTMLTableElement): void {
		const parent = table.parentNode as Node,
			next = Dom.findNotEmptySibling(table, false),
			prev = Dom.findNotEmptySibling(table, true);

		Dom.safeRemove(table);

		this.j.s.setCursorIn(next || prev || parent, Boolean(next));
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.__onRemoveSelection();

		jodit.e.off('.select-cells').off('keydown', this.__onKeyDown);
	}
}

pluginSystem.add('selectCells', selectCells);
