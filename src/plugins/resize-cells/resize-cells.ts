/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		this.j.workplace.appendChild(this.resizeHandler);
	}

	private hideResizeHandle(): void {
		this.hideTimeout = this.j.async.setTimeout(
			() => {
				Dom.safeRemove(this.resizeHandler);
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

		let box: ClientRect,
			tableBox = this.workTable.getBoundingClientRect();

		this.minX = 0;
		this.maxX = 1000000;

		if (this.wholeTable != null) {
			tableBox = (
				this.workTable.parentNode as HTMLElement
			).getBoundingClientRect();

			this.minX = tableBox.left;
			this.maxX = this.minX + tableBox.width;
		} else {
			// find maximum columns
			const coordinate = Table.formalCoordinate(
				this.workTable,
				this.workCell,
				true
			);

			Table.formalMatrix(this.workTable, (td, i, j) => {
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

		if (x < this.minX) {
			x = this.minX;
		}

		if (x > this.maxX) {
			x = this.maxX;
		}

		this.resizeDelta =
			x - this.startX + (!this.j.o.iframe ? 0 : workplacePosition.left);

		this.resizeHandler.style.left =
			x - (this.j.o.iframe ? 0 : workplacePosition.left) + 'px';

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

		if (this.startX !== e.clientX) {
			// resize column
			if (this.wholeTable == null) {
				this.resizeColumns();
			} else {
				this.resizeTable();
			}
		}

		this.j.synchronizeValues();
		this.j.s.focus();
	}

	/**
	 * Resize only one column
	 */
	private resizeColumns(): void {
		const delta = this.resizeDelta;

		const marked: HTMLTableCellElement[] = [];

		Table.setColumnWidthByDelta(
			this.workTable,
			Table.formalCoordinate(this.workTable, this.workCell, true)[1],
			delta,
			true,
			marked
		);

		const nextTD = call(
			this.isRTL ? Dom.prev : Dom.next,
			this.workCell,
			Dom.isCell,
			this.workCell.parentNode as HTMLElement
		) as HTMLTableCellElement;

		Table.setColumnWidthByDelta(
			this.workTable,
			Table.formalCoordinate(this.workTable, nextTD)[1],
			-delta,
			false,
			marked
		);
	}

	/**
	 * Resize whole table
	 */
	private resizeTable(): void {
		const delta = this.resizeDelta * (this.isRTL ? -1 : 1);

		const width = this.workTable.offsetWidth,
			parentWidth = getContentWidth(
				this.workTable.parentNode as HTMLElement,
				this.j.ew
			);

		// for RTL use mirror logic
		const rightSide = !this.wholeTable;
		const needChangeWidth = this.isRTL ? !rightSide : rightSide;

		// right side
		if (needChangeWidth) {
			this.workTable.style.width =
				((width + delta) / parentWidth) * 100 + '%';
		} else {
			const side = this.isRTL ? 'marginRight' : 'marginLeft';

			const margin = parseInt(
				this.j.ew.getComputedStyle(this.workTable)[side] || '0',
				10
			);

			this.workTable.style.width =
				((width - delta) / parentWidth) * 100 + '%';

			this.workTable.style[side] =
				((margin + delta) / parentWidth) * 100 + '%';
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
		delta: number = 0
	): void {
		const box = offset(cell, this.j, this.j.ed);

		if (offsetX > consts.NEARBY && offsetX < box.width - consts.NEARBY) {
			this.hideResizeHandle();
			return;
		}

		const workplacePosition: IBound = offset(
				this.j.workplace,
				this.j,
				this.j.od,
				true
			),
			parentBox: IBound = offset(table, this.j, this.j.ed);

		this.resizeHandler.style.left =
			(offsetX <= consts.NEARBY ? box.left : box.left + box.width) -
			workplacePosition.left +
			delta +
			'px';

		Object.assign(this.resizeHandler.style, {
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
					$$('table', editor.editor).forEach(this.observe);
				}
			)
			.on(this.j.ow, 'scroll.resize-cells', () => {
				if (!this.drag) {
					return;
				}

				const parent = Dom.up(
					this.workCell,
					(elm: Node | null) => Dom.isTag(elm, 'table'),
					editor.editor
				) as HTMLElement;

				if (parent) {
					const parentBox = parent.getBoundingClientRect();
					this.resizeHandler.style.top = parentBox.top + 'px';
				}
			})
			.on('beforeSetMode.resize-cells', () => {
				this.module.getAllSelectedCells().forEach(td => {
					this.module.removeSelection(td);
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
	private observe(table: HTMLTableElement): void {
		if (dataBind(table, key)) {
			return;
		}

		dataBind(table, key, true);

		this.j.e
			.on(table, 'mouseleave.resize-cells', (e: MouseEvent) => {
				if (
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

						this.calcHandlePosition(table, cell, event.offsetX);
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

pluginSystem.add('resizeCells', resizeCells);
