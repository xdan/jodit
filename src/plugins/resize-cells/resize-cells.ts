/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/resize-cells/README.md]]
 * @packageDocumentation
 * @module plugins/resize-cells
 */

import type { IBound, IJodit, Nullable } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { autobind } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import {
	$$,
	attr,
	call,
	dataBind,
	getContentWidth,
	offset
} from 'jodit/core/helpers';
import { css } from 'jodit/core/helpers/utils/css';
import { Plugin, Table } from 'jodit/modules';

import './config';

import './resize-cells.less';

const key = 'table_processor_observer-resize';

/**
 * How near the top or bottom of what a row scrolls in the pointer starts
 * scrolling it, as the editor's iframe passes on no moves outside it
 */
const SCROLL_EDGE = 20;

/**
 * Process tables in editor
 */
export class resizeCells extends Plugin {
	/**
	 * Shortcut for Table module
	 */
	private get module(): Table {
		return this.j.getInstance<Table>('Table', this.j.o);
	}

	/**
	 * Now editor has rtl direction
	 */
	private get isRTL(): boolean {
		return this.j.o.direction === 'rtl';
	}

	private selectMode: boolean = false;

	private resizeDelta: number = 0;
	private resizeHandler!: HTMLElement;

	private showResizeHandle(): void {
		this.j.async.clearTimeout(this.hideTimeout);
		Dom.append(this.j.workplace, this.resizeHandler);
	}

	private hideResizeHandle(): void {
		this.hideTimeout = this.j.async.setTimeout(
			() => {
				// A late move from inside the cell can come once the pointer
				// is on the handle, which covers the border
				if (!this.resizeHandler.matches(':hover')) {
					Dom.safeRemove(this.resizeHandler);
				}
			},
			{
				timeout: this.j.defaultTimeout,
				label: 'hideResizer'
			}
		);
	}

	private createResizeHandle = (): void => {
		if (!this.resizeHandler) {
			this.resizeHandler = this.j.c.div('jodit-table-resizer');

			this.j.e
				.on(
					this.resizeHandler,
					'mousedown.table touchstart.table',
					this.onHandleMouseDown
				)
				.on(this.resizeHandler, 'mouseenter.table', () => {
					this.j.async.clearTimeout(this.hideTimeout);
				})
				.on(this.resizeHandler, 'mouseleave.table', () => {
					if (!this.drag) {
						this.hideResizeHandle();
					}
				});
		}
	};

	private hideTimeout: number = 0;

	private drag: boolean = false;

	private wholeTable!: boolean | null;
	private workCell!: HTMLTableCellElement;
	private workTable!: HTMLTableElement;

	private minX: number = 0;
	private maxX: number = 0;

	private startX: number = 0;

	/**
	 * The table's and its cells' styles as a column drag started, put back
	 * as it ends, before the final widths
	 */
	private startStyles: Array<[HTMLElement, Nullable<string>]> = [];
	private startLeft: number = 0;
	private startEdge: number = 0;

	/**
	 * For each of the two columns a drag resizes, the cell whose width
	 * `setColumnWidthByDelta` sets, with its width as the drag started, and
	 * the cells below it, whose widths it clears
	 */
	private startWidths: Array<
		[HTMLTableCellElement | undefined, number, HTMLTableCellElement[]]
	> = [];

	/**
	 * The table's width as the drag started, and for a drag of its edge, the
	 * width inside what holds it and its margin on that side
	 */
	private startTableWidth: number = 0;
	private startParentWidth: number = 0;
	private startMargin: number = 0;

	/**
	 * The row whose height the handle sets, or null while it sets a width
	 */
	private workRow: Nullable<HTMLTableRowElement> = null;

	private startY: number = 0;
	private startHeight: number = 0;
	private rowStyle: Nullable<string> = null;

	/**
	 * The boxes that scroll the row, with their styles, as a row drag turns
	 * off their scroll anchoring, which would move the border off the pointer
	 */
	private anchored: Array<[HTMLElement, Nullable<string>]> = [];

	private scrolled: number = 0;
	private scrollFrame: number = 0;
	private pointerY: number = 0;

	/**
	 * Click on resize handle
	 */
	@autobind
	private onHandleMouseDown(event: MouseEvent): boolean | void {
		if (this.j.isLocked) {
			return;
		}

		this.drag = true;

		this.j.e
			.on(
				this.j.ow,
				'mouseup.resize-cells touchend.resize-cells',
				this.onMouseUp
			)
			.on(this.j.ew, 'mousemove.table touchmove.table', this.onMouseMove);

		this.startX = event.clientX;

		this.j.lock(key);
		this.resizeHandler.classList.add('jodit-table-resizer_moved');

		if (this.workRow) {
			this.startY = event.clientY;
			this.startHeight = this.workRow.offsetHeight;
			this.rowStyle = attr(this.workRow, 'style');
			this.scrolled = 0;
			this.anchored = scrollersOf(this.workRow).map(elm => {
				const style = attr(elm, 'style');
				css(elm, 'overflowAnchor', 'none');
				return [elm, style];
			});
			return false;
		}

		this.startStyles = [this.workTable, ...$$('td,th', this.workTable)].map(
			elm => [elm, attr(elm, 'style')]
		);
		this.startLeft = parseFloat(this.resizeHandler.style.left);
		this.startEdge = this.columnEdge();

		let box: ClientRect;

		this.minX = 0;
		this.maxX = 1000000;
		this.startTableWidth = this.workTable.offsetWidth;

		if (this.wholeTable != null) {
			const parent = this.workTable.parentNode as HTMLElement;
			const tableBox = parent.getBoundingClientRect();

			this.minX = tableBox.left;
			this.maxX = this.minX + tableBox.width;

			const side = this.isRTL ? 'marginRight' : 'marginLeft';

			this.startParentWidth = getContentWidth(parent, this.j.ew);
			this.startMargin = parseInt(
				this.j.ew.getComputedStyle(this.workTable)[side] || '0',
				10
			);
		} else {
			// find maximum columns
			const coordinate = this.module.formalCoordinate(
				this.workTable,
				this.workCell,
				true
			);

			this.module.formalMatrix(this.workTable, (td, i, j) => {
				if (coordinate[1] === j) {
					box = td.getBoundingClientRect();

					this.minX = Math.max(
						box.left + consts.NEARBY / 2,
						this.minX
					);
				}

				if (coordinate[1] + (this.isRTL ? -1 : 1) === j) {
					box = td.getBoundingClientRect();

					this.maxX = Math.min(
						box.left + box.width - consts.NEARBY / 2,
						this.maxX
					);
				}
			});

			const matrix = this.module.formalMatrix(this.workTable);

			this.startWidths = this.resizedColumns().map(column => {
				const cells = matrix.map(row => row[column]);
				const index = cells.findIndex(
					td => td.colSpan === 1 || cells.length === 1
				);
				const cell = cells[index];

				return [
					cell,
					cell ? cell.offsetWidth : 0,
					cells.slice(Math.max(index, 0) + 1)
				];
			});
		}

		return false;
	}

	/**
	 * Mouse move after click on resize handle
	 */
	@autobind
	private onMouseMove(event: MouseEvent): void {
		if (!this.drag) {
			return;
		}

		this.j.e.fire('closeAllPopups');

		let x = event.clientX;

		const workplacePosition: IBound = offset(
			(this.resizeHandler.parentNode ||
				this.j.od.documentElement) as HTMLElement,
			this.j,
			this.j.od,
			true
		);

		if (this.workRow) {
			const view = scrollViewOf(this.workRow);

			this.pointerY =
				Math.min(Math.max(event.clientY, view.top), view.bottom) +
				(!this.j.o.iframe ? 0 : workplacePosition.top);
			this.resizeRow(this.workRow);
			this.scrollAlong(view, event.clientY);

			this.j.s.sel?.removeAllRanges();
			return;
		}

		if (x < this.minX) {
			x = this.minX;
		}

		if (x > this.maxX) {
			x = this.maxX;
		}

		this.resizeDelta =
			x - this.startX + (!this.j.o.iframe ? 0 : workplacePosition.left);

		if (this.wholeTable == null) {
			this.setColumnWidths();
		} else {
			this.resizeTable();
		}

		const tableBox: IBound = offset(this.workTable, this.j, this.j.ed);

		Object.assign(this.resizeHandler.style, {
			left: this.startLeft + this.columnEdge() - this.startEdge + 'px',
			top: tableBox.top - workplacePosition.top + 'px',
			height: tableBox.height + 'px'
		});

		const sel = this.j.s.sel;

		sel && sel.removeAllRanges();
	}

	/**
	 * Mouse up every where after move and click
	 */
	@autobind
	private onMouseUp(e: MouseEvent): void {
		if (this.selectMode || this.drag) {
			this.selectMode = false;
			this.j.unlock();
		}

		if (!this.resizeHandler || !this.drag) {
			return;
		}

		this.drag = false;

		this.j.e.off(
			this.j.ew,
			'mousemove.table touchmove.table',
			this.onMouseMove
		);

		this.resizeHandler.classList.remove('jodit-table-resizer_moved');

		if (this.workRow) {
			this.j.async.cancelAnimationFrame(this.scrollFrame);
			this.anchored.forEach(([elm, style]) => attr(elm, 'style', style));
			this.anchored = [];

			const height = this.workRow.offsetHeight;

			if (height !== this.startHeight) {
				css(this.workRow, 'height', height + 'px');
			} else {
				attr(this.workRow, 'style', this.rowStyle);
			}
		} else {
			this.restoreStyles();

			if (this.startX !== e.clientX) {
				this.resizeColumnsOrTable();
			}
		}

		this.j.synchronizeValues();
		this.j.s.focus();
	}

	private resizeColumnsOrTable(): void {
		if (this.wholeTable == null) {
			this.resizeColumns();
		} else {
			this.resizeTable();
		}
	}

	private restoreStyles(): void {
		this.startStyles.forEach(([elm, style]) => attr(elm, 'style', style));
	}

	/**
	 * Where the border the handle is on lies: the work cell's left side
	 * for the table's left edge, otherwise its right side
	 */
	private columnEdge(): number {
		const { left, right } = this.workCell.getBoundingClientRect();
		return this.wholeTable === true ? left : right;
	}

	/**
	 * Sets the row's height from where the pointer is, and how far the drag
	 * has scrolled. The browser keeps the row as tall as its content
	 */
	private resizeRow(row: HTMLTableRowElement): boolean {
		const height = Math.max(
			0,
			Math.round(
				this.startHeight + this.pointerY - this.startY + this.scrolled
			)
		);

		css(row, 'height', height + 'px');
		this.placeRowHandle(row);

		return row.offsetHeight === height;
	}

	/**
	 * While the pointer is near or past the top or bottom of the part of the
	 * row's scroller in view, scrolls it on, and the row's border with it
	 */
	private scrollAlong(view: ScrollView, clientY: number): void {
		this.j.async.cancelAnimationFrame(this.scrollFrame);

		const past =
			clientY < view.top + SCROLL_EDGE
				? clientY - view.top - SCROLL_EDGE
				: clientY > view.bottom - SCROLL_EDGE
					? clientY - view.bottom + SCROLL_EDGE
					: 0;

		if (!past) {
			return;
		}

		const { scroller } = view;
		const step =
			Math.sign(past) * Math.min(Math.ceil(Math.abs(past) / 2), 20);

		const scroll = (): void => {
			const { workRow } = this;

			if (!workRow) {
				return;
			}

			const scrollTop = scroller.scrollTop;

			if (step > 0) {
				// Growing the row first makes the room to scroll down into
				this.scrolled += step;
				this.resizeRow(workRow);
				scroller.scrollTop = scrollTop + step;

				const missed = step - (scroller.scrollTop - scrollTop);

				if (missed > 0.5) {
					this.scrolled -= missed;
					this.resizeRow(workRow);
					return;
				}

				this.placeRowHandle(workRow);
			} else {
				scroller.scrollTop = scrollTop + step;

				const moved = scroller.scrollTop - scrollTop;
				this.scrolled += moved;

				// A row at its content's height can't follow the pointer up
				if (!moved || !this.resizeRow(workRow)) {
					scroller.scrollTop = scrollTop;
					this.scrolled -= moved;
					this.resizeRow(workRow);
					return;
				}
			}

			this.scrollFrame = this.j.async.requestAnimationFrame(scroll);
		};

		this.scrollFrame = this.j.async.requestAnimationFrame(scroll);
	}

	/**
	 * The two columns a column drag resizes: the work cell's last, and the
	 * next cell's first
	 */
	private resizedColumns(): number[] {
		const nextTD = call(
			this.isRTL ? Dom.prev : Dom.next,
			this.workCell,
			Dom.isCell,
			this.workCell.parentNode as HTMLElement
		) as HTMLTableCellElement;

		return [
			this.module.formalCoordinate(
				this.workTable,
				this.workCell,
				true
			)[1],
			this.module.formalCoordinate(this.workTable, nextTD)[1]
		];
	}

	/**
	 * Resize only one column
	 */
	private resizeColumns(): void {
		const delta = this.resizeDelta;

		const marked: HTMLTableCellElement[] = [];

		const tableModule = this.module;
		const [column, nextColumn] = this.resizedColumns();

		tableModule.setColumnWidthByDelta(
			this.workTable,
			column,
			delta,
			true,
			marked
		);

		tableModule.setColumnWidthByDelta(
			this.workTable,
			nextColumn,
			-delta,
			false,
			marked
		);
	}

	/**
	 * Sets the widths `resizeColumns` would while the handle is dragged, from
	 * the widths the drag started with, so that a move doesn't put back every
	 * cell's style and lay the table out again to measure them
	 */
	private setColumnWidths(): void {
		this.startWidths.forEach(([cell, width, below], index) => {
			const delta = index ? -this.resizeDelta : this.resizeDelta;

			if (cell) {
				css(
					cell,
					'width',
					(((width + delta) / this.startTableWidth) * 100).toFixed(
						consts.ACCURACY
					) + '%'
				);
			}

			below.forEach(td => {
				td.style.removeProperty('width');

				if (!attr(td, 'style')) {
					attr(td, 'style', null);
				}
			});
		});
	}

	/**
	 * Resize whole table
	 */
	private resizeTable(): void {
		const delta = this.resizeDelta * (this.isRTL ? -1 : 1);

		const width = this.startTableWidth,
			parentWidth = this.startParentWidth;

		// for RTL use mirror logic
		const rightSide = !this.wholeTable;
		const needChangeWidth = this.isRTL ? !rightSide : rightSide;

		// right side
		if (needChangeWidth) {
			css(
				this.workTable,
				'width',
				((width + delta) / parentWidth) * 100 + '%'
			);
		} else {
			const side = this.isRTL ? 'marginRight' : 'marginLeft';

			css(this.workTable, {
				width: ((width - delta) / parentWidth) * 100 + '%',
				[side]: ((this.startMargin + delta) / parentWidth) * 100 + '%'
			});
		}
	}

	/**
	 * Memoize current cell
	 *
	 * @param wholeTable - resize whole table by left side,
	 * false - resize whole table by right side, null - resize column
	 */
	private setWorkCell(
		cell: HTMLTableCellElement,
		wholeTable: boolean | null = null
	): void {
		this.wholeTable = wholeTable;

		this.workCell = cell;

		this.workTable = Dom.up(
			cell,
			(elm: Node | null) => Dom.isTag(elm, 'table'),
			this.j.editor
		) as HTMLTableElement;
	}

	/**
	 * Calc helper resize handle position
	 */
	private calcHandlePosition(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		offsetX: number = 0,
		delta: number = 0,
		clientY: number = NaN
	): void {
		const box = offset(cell, this.j, this.j.ed);

		if (offsetX > consts.NEARBY && offsetX < box.width - consts.NEARBY) {
			if (!this.calcRowHandlePosition(cell, clientY)) {
				this.hideResizeHandle();
			}

			return;
		}

		this.workRow = null;
		this.resizeHandler.classList.remove('jodit-table-resizer_row');

		const workplacePosition: IBound = offset(
				this.j.workplace,
				this.j,
				this.j.od,
				true
			),
			parentBox: IBound = offset(table, this.j, this.j.ed);

		css(
			this.resizeHandler,
			'left',
			(offsetX <= consts.NEARBY ? box.left : box.left + box.width) -
				workplacePosition.left +
				delta +
				'px'
		);

		Object.assign(this.resizeHandler.style, {
			width: '',
			height: parentBox.height + 'px',
			top: parentBox.top - workplacePosition.top + 'px'
		});

		this.showResizeHandle();

		if (offsetX <= consts.NEARBY) {
			const prevTD = call(
				this.isRTL ? Dom.next : Dom.prev,
				cell,
				Dom.isCell,
				cell.parentNode as HTMLElement
			) as HTMLTableCellElement;

			this.setWorkCell(prevTD || cell, prevTD ? null : true);
		} else {
			const nextTD = call(
				!this.isRTL ? Dom.next : Dom.prev,
				cell,
				Dom.isCell,
				cell.parentNode as HTMLElement
			);

			this.setWorkCell(cell, !nextTD ? false : null);
		}
	}

	/**
	 * Shows the handle across the table on the border below a row, near the
	 * cell's bottom or near its top, which is the bottom of the row above.
	 * The table's top edge has no row above it
	 */
	private calcRowHandlePosition(
		cell: HTMLTableCellElement,
		clientY: number
	): boolean {
		const { top, bottom } = cell.getBoundingClientRect();
		const table = Dom.up(
			cell,
			(elm: Node | null) => Dom.isTag(elm, 'table'),
			this.j.editor
		) as HTMLTableElement;
		const index = (cell.parentNode as HTMLTableRowElement).rowIndex;

		const row =
			Math.abs(bottom - clientY) <= consts.NEARBY
				? table.rows[index + cell.rowSpan - 1]
				: Math.abs(clientY - top) <= consts.NEARBY
					? table.rows[index - 1]
					: null;

		if (!row) {
			return false;
		}

		this.workRow = row;
		this.workTable = table;
		this.resizeHandler.classList.add('jodit-table-resizer_row');
		this.placeRowHandle(row);
		this.showResizeHandle();

		return true;
	}

	/**
	 * Lays the handle across the table on the border below the row
	 */
	private placeRowHandle(row: HTMLTableRowElement): void {
		const workplacePosition: IBound = offset(
				this.j.workplace,
				this.j,
				this.j.od,
				true
			),
			tableBox: IBound = offset(this.workTable, this.j, this.j.ed),
			rowBox: IBound = offset(row, this.j, this.j.ed);

		Object.assign(this.resizeHandler.style, {
			left: tableBox.left - workplacePosition.left + 'px',
			width: tableBox.width + 'px',
			height: '',
			top: rowBox.top + rowBox.height - workplacePosition.top + 'px'
		});
	}

	/** @override */
	afterInit(editor: IJodit): void {
		if (!editor.o.tableAllowCellResize) {
			return;
		}

		const observeTables = (): void => {
			$$('table', editor.editor).forEach(this.observe);
		};

		editor.e
			.off(this.j.ow, '.resize-cells')
			.off('.resize-cells')
			.on(
				'change.resize-cells afterCommand.resize-cells afterSetMode.resize-cells',
				observeTables
			)
			.on(this.j.ow, 'scroll.resize-cells', () => {
				if (!this.drag || this.workRow) {
					return;
				}

				const parent = Dom.up(
					this.workCell,
					(elm: Node | null) => Dom.isTag(elm, 'table'),
					editor.editor
				) as HTMLElement;

				if (parent) {
					const parentBox = parent.getBoundingClientRect();
					css(this.resizeHandler, 'top', parentBox.top + 'px');
				}
			})
			.on('beforeSetMode.resize-cells', () => {
				const tableModule = this.module;
				tableModule.getAllSelectedCells().forEach(td => {
					tableModule.removeSelection(td);
					tableModule.normalizeTable(
						Dom.closest(
							td,
							'table',
							editor.editor
						) as HTMLTableElement
					);
				});
			});

		// None of those events comes with the editor's starting value
		observeTables();
	}

	/**
	 * Add to every Table listeners
	 */
	@autobind
	private observe(table: HTMLTableElement): void {
		if (dataBind(table, key)) {
			return;
		}

		dataBind(table, key, true);

		this.j.e
			.on(table, 'mouseleave.resize-cells', (e: MouseEvent) => {
				if (
					!this.drag &&
					this.resizeHandler &&
					this.resizeHandler !== e.relatedTarget
				) {
					this.hideResizeHandle();
				}
			})
			.on(
				table,
				'mousemove.resize-cells touchmove.resize-cells',
				this.j.async.throttle(
					(event: MouseEvent) => {
						if (this.j.isLocked) {
							return;
						}

						const cell = Dom.up(
							event.target as HTMLElement,
							Dom.isCell,
							table
						) as HTMLTableCellElement;

						if (!cell) {
							return;
						}

						this.calcHandlePosition(
							table,
							cell,
							event.offsetX,
							0,
							event.clientY
						);
					},
					{
						timeout: this.j.defaultTimeout
					}
				)
			);

		this.createResizeHandle();
	}

	beforeDestruct(jodit: IJodit): void {
		if (jodit.events) {
			jodit.e.off(this.j.ow, '.resize-cells');
			jodit.e.off('.resize-cells');
		}
	}
}

interface ScrollView {
	scroller: HTMLElement;
	top: number;
	bottom: number;
}

/**
 * The boxes around the row that can scroll it, nearest first, and its
 * document's
 */
function scrollersOf(row: HTMLTableRowElement): HTMLElement[] {
	const doc = row.ownerDocument;
	const root = (doc.scrollingElement || doc.documentElement) as HTMLElement;
	const scrollers: HTMLElement[] = [];

	for (
		let elm = row.parentElement;
		elm && elm !== root;
		elm = elm.parentElement
	) {
		if (/auto|scroll|overlay/.test(String(css(elm, 'overflowY')))) {
			scrollers.push(elm);
		}
	}

	return [...scrollers, root];
}

/**
 * What scrolls the row up and down, the nearest box around it with more
 * than it shows or else its document, and the part of it in the window's view
 */
function scrollViewOf(row: HTMLTableRowElement): ScrollView {
	const height = row.ownerDocument.defaultView?.innerHeight ?? 0;
	const scrollers = scrollersOf(row);
	const scroller =
		scrollers.find(elm => elm.scrollHeight > elm.clientHeight) ??
		scrollers[scrollers.length - 1];

	if (scroller === scrollers[scrollers.length - 1]) {
		return { scroller, top: 0, bottom: height };
	}

	const top = scroller.getBoundingClientRect().top + scroller.clientTop;

	return {
		scroller,
		top: Math.max(top, 0),
		bottom: Math.min(top + scroller.clientHeight, height)
	};
}

pluginSystem.add('resizeCells', resizeCells);
