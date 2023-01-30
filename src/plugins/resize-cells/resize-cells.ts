/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/resize-cells/README.md]]
 * @packageDocumentation
 * @module plugins/resize-cells
 */

import './resize-cells.less';

import type { IBound, IJodit } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Plugin, Table } from 'jodit/modules';
import {
	$$,
	call,
	dataBind,
	getContentWidth,
	offset
} from 'jodit/core/helpers';
import { autobind } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';

import './config';

const key = 'table_processor_observer-resize';

/**
 * Process tables in editor
 */
export class resizeCells extends Plugin {
	/**
	 * Shortcut for Table module
	 */
	private get __module(): Table {
		return this.j.getInstance<Table>('Table', this.j.o);
	}

	/**
	 * Now editor has rtl direction
	 */
	private get __isRTL(): boolean {
		return this.j.o.direction === 'rtl';
	}

	private __selectMode: boolean = false;

	private __resizeDelta: number = 0;
	private __resizeHandler!: HTMLElement;

	private __showResizeHandle(): void {
		this.j.async.clearTimeout(this.__hideTimeout);
		this.j.workplace.appendChild(this.__resizeHandler);
	}

	private __hideResizeHandle(): void {
		this.__hideTimeout = this.j.async.setTimeout(
			() => {
				Dom.safeRemove(this.__resizeHandler);
			},
			{
				timeout: this.j.defaultTimeout,
				label: 'hideResizer'
			}
		);
	}

	@autobind
	private __createResizeHandle(): void {
		if (!this.__resizeHandler) {
			this.__resizeHandler = this.j.c.div('jodit-table-resizer');

			this.j.e
				.on(
					this.__resizeHandler,
					'mousedown.table touchstart.table',
					this.__onHandleMouseDown
				)
				.on(this.__resizeHandler, 'mouseenter.table', () => {
					this.j.async.clearTimeout(this.__hideTimeout);
				});
		}
	}

	private __hideTimeout: number = 0;

	private __drag: boolean = false;

	private __wholeTable!: boolean | null;
	private __workCell!: HTMLTableCellElement;
	private __workTable!: HTMLTableElement;

	private __minX: number = 0;
	private __maxX: number = 0;

	private __startX: number = 0;

	/**
	 * Click on resize handle
	 */
	@autobind
	private __onHandleMouseDown(event: MouseEvent): boolean | void {
		if (this.j.isLocked) {
			return;
		}

		this.__drag = true;

		this.j.e
			.on(
				this.j.ow,
				'mouseup.resize-cells touchend.resize-cells',
				this.__onMouseUp
			)
			.on(
				this.j.ew,
				'mousemove.table touchmove.table',
				this.__onMouseMove
			);

		this.__startX = event.clientX;

		this.j.lock(key);
		this.__resizeHandler.classList.add('jodit-table-resizer_moved');

		let box: ClientRect,
			tableBox = this.__workTable.getBoundingClientRect();

		this.__minX = 0;
		this.__maxX = 1000000;

		if (this.__wholeTable != null) {
			tableBox = (
				this.__workTable.parentNode as HTMLElement
			).getBoundingClientRect();

			this.__minX = tableBox.left;
			this.__maxX = this.__minX + tableBox.width;
		} else {
			// find maximum columns
			const coordinate = Table.formalCoordinate(
				this.__workTable,
				this.__workCell,
				true
			);

			Table.formalMatrix(this.__workTable, (td, i, j) => {
				if (coordinate[1] === j) {
					box = td.getBoundingClientRect();

					this.__minX = Math.max(
						box.left + consts.NEARBY / 2,
						this.__minX
					);
				}

				if (coordinate[1] + (this.__isRTL ? -1 : 1) === j) {
					box = td.getBoundingClientRect();

					this.__maxX = Math.min(
						box.left + box.width - consts.NEARBY / 2,
						this.__maxX
					);
				}
			});
		}

		return false;
	}

	/**
	 * Mouse move after click on resize handle
	 */
	@autobind
	private __onMouseMove(event: MouseEvent): void {
		if (!this.__drag) {
			return;
		}

		this.j.e.fire('closeAllPopups');

		let x = event.clientX;

		const workplacePosition: IBound = offset(
			(this.__resizeHandler.parentNode ||
				this.j.od.documentElement) as HTMLElement,
			this.j,
			this.j.od,
			true
		);

		if (x < this.__minX) {
			x = this.__minX;
		}

		if (x > this.__maxX) {
			x = this.__maxX;
		}

		this.__resizeDelta =
			x - this.__startX + (!this.j.o.iframe ? 0 : workplacePosition.left);

		this.__resizeHandler.style.left =
			x - (this.j.o.iframe ? 0 : workplacePosition.left) + 'px';

		const sel = this.j.s.sel;

		sel && sel.removeAllRanges();
	}

	/**
	 * Mouse up every where after move and click
	 */
	@autobind
	private __onMouseUp(e: MouseEvent): void {
		if (this.__selectMode || this.__drag) {
			this.__selectMode = false;
			this.j.unlock();
		}

		if (!this.__resizeHandler || !this.__drag) {
			return;
		}

		this.__drag = false;

		this.j.e.off(
			this.j.ew,
			'mousemove.table touchmove.table',
			this.__onMouseMove
		);

		this.__resizeHandler.classList.remove('jodit-table-resizer_moved');

		if (this.__startX !== e.clientX) {
			// resize column
			if (this.__wholeTable == null) {
				this.__resizeColumns();
			} else {
				this.__resizeTable();
			}
		}

		this.j.synchronizeValues();
		this.j.s.focus();
	}

	/**
	 * Resize only one column
	 */
	private __resizeColumns(): void {
		const delta = this.__resizeDelta;

		const marked: HTMLTableCellElement[] = [];

		Table.setColumnWidthByDelta(
			this.__workTable,
			Table.formalCoordinate(this.__workTable, this.__workCell, true)[1],
			delta,
			true,
			marked
		);

		const nextTD = call(
			this.__isRTL ? Dom.prev : Dom.next,
			this.__workCell,
			Dom.isCell,
			this.__workCell.parentNode as HTMLElement
		) as HTMLTableCellElement;

		Table.setColumnWidthByDelta(
			this.__workTable,
			Table.formalCoordinate(this.__workTable, nextTD)[1],
			-delta,
			false,
			marked
		);
	}

	/**
	 * Resize whole table
	 */
	private __resizeTable(): void {
		const delta = this.__resizeDelta * (this.__isRTL ? -1 : 1);

		const width = this.__workTable.offsetWidth,
			parentWidth = getContentWidth(
				this.__workTable.parentNode as HTMLElement,
				this.j.ew
			);

		// for RTL use mirror logic
		const rightSide = !this.__wholeTable;
		const needChangeWidth = this.__isRTL ? !rightSide : rightSide;

		// right side
		if (needChangeWidth) {
			this.__workTable.style.width =
				((width + delta) / parentWidth) * 100 + '%';
		} else {
			const side = this.__isRTL ? 'marginRight' : 'marginLeft';

			const margin = parseInt(
				this.j.ew.getComputedStyle(this.__workTable)[side] || '0',
				10
			);

			this.__workTable.style.width =
				((width - delta) / parentWidth) * 100 + '%';

			this.__workTable.style[side] =
				((margin + delta) / parentWidth) * 100 + '%';
		}
	}

	/**
	 * Memoize current cell
	 *
	 * @param wholeTable - resize whole table by left side,
	 * false - resize whole table by right side, null - resize column
	 */
	private __setWorkCell(
		cell: HTMLTableCellElement,
		wholeTable: boolean | null = null
	): void {
		this.__wholeTable = wholeTable;

		this.__workCell = cell;

		this.__workTable = Dom.up(
			cell,
			(elm: Node | null) => Dom.isTag(elm, 'table'),
			this.j.editor
		) as HTMLTableElement;
	}

	/**
	 * Calc helper resize handle position
	 */
	private __calcHandlePosition(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		offsetX: number = 0,
		delta: number = 0
	): void {
		const box = offset(cell, this.j, this.j.ed);

		if (offsetX > consts.NEARBY && offsetX < box.width - consts.NEARBY) {
			this.__hideResizeHandle();
			return;
		}

		const workplacePosition: IBound = offset(
				this.j.workplace,
				this.j,
				this.j.od,
				true
			),
			parentBox: IBound = offset(table, this.j, this.j.ed);

		this.__resizeHandler.style.left =
			(offsetX <= consts.NEARBY ? box.left : box.left + box.width) -
			workplacePosition.left +
			delta +
			'px';

		Object.assign(this.__resizeHandler.style, {
			height: parentBox.height + 'px',
			top: parentBox.top - workplacePosition.top + 'px'
		});

		this.__showResizeHandle();

		if (offsetX <= consts.NEARBY) {
			const prevTD = call(
				this.__isRTL ? Dom.next : Dom.prev,
				cell,
				Dom.isCell,
				cell.parentNode as HTMLElement
			) as HTMLTableCellElement;

			this.__setWorkCell(prevTD || cell, prevTD ? null : true);
		} else {
			const nextTD = call(
				!this.__isRTL ? Dom.next : Dom.prev,
				cell,
				Dom.isCell,
				cell.parentNode as HTMLElement
			);

			this.__setWorkCell(cell, !nextTD ? false : null);
		}
	}

	/** @override */
	afterInit(editor: IJodit): void {
		if (!editor.o.tableAllowCellResize) {
			return;
		}

		editor.e
			.off(this.j.ow, '.resize-cells')
			.off('.resize-cells')
			.on(
				'change.resize-cells afterCommand.resize-cells afterSetMode.resize-cells',
				() => {
					$$('table', editor.editor).forEach(this.__observe);
				}
			)
			.on(this.j.ow, 'scroll.resize-cells', () => {
				if (!this.__drag) {
					return;
				}

				const parent = Dom.up(
					this.__workCell,
					(elm: Node | null) => Dom.isTag(elm, 'table'),
					editor.editor
				) as HTMLElement;

				if (parent) {
					const parentBox = parent.getBoundingClientRect();
					this.__resizeHandler.style.top = parentBox.top + 'px';
				}
			})
			.on('beforeSetMode.resize-cells', () => {
				this.__module.getAllSelectedCells().forEach(td => {
					this.__module.removeSelection(td);
					Table.normalizeTable(
						Dom.closest(
							td,
							'table',
							editor.editor
						) as HTMLTableElement
					);
				});
			});
	}

	/**
	 * Add to every Table listeners
	 */
	@autobind
	private __observe(table: HTMLTableElement): void {
		if (dataBind(table, key)) {
			return;
		}

		dataBind(table, key, true);

		this.j.e
			.on(table, 'mouseleave.resize-cells', (e: MouseEvent) => {
				if (
					this.__resizeHandler &&
					this.__resizeHandler !== e.relatedTarget
				) {
					this.__hideResizeHandle();
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

						this.__calcHandlePosition(table, cell, event.offsetX);
					},
					{
						timeout: this.j.defaultTimeout
					}
				)
			);

		this.__createResizeHandle();
	}

	beforeDestruct(jodit: IJodit): void {
		if (jodit.events) {
			jodit.e.off(this.j.ow, '.resize-cells');
			jodit.e.off('.resize-cells');
		}
	}
}

pluginSystem.add('resizeCells', resizeCells);
