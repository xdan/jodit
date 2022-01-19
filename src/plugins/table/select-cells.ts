/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/table
 */

import type { IBound, IJodit, Nullable } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom, Table } from '../../modules';
import { $$, position } from 'jodit/core/helpers';
import { alignElement } from '../justify/justify';
import { KEY_TAB } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';

const key = 'table_processor_observer';
const MOUSE_MOVE_LABEL = 'onMoveTableSelectCell';

export class selectCells extends Plugin {
	override requires = ['select'];

	/**
	 * Shortcut for Table module
	 */
	private get module(): Table {
		return this.j.getInstance<Table>('Table', this.j.o);
	}

	protected afterInit(jodit: IJodit): void {
		if (!jodit.o.table.allowCellSelection) {
			return;
		}

		jodit.e
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
			// and mouseup on another cell call `click` only for `TR` element.
			.on('clickTr clickTbody', (): void | false => {
				const cellsCount = this.module.getAllSelectedCells().length;

				if (cellsCount) {
					if (cellsCount > 1) {
						this.j.s.sel?.removeAllRanges();
					}

					return false;
				}
			});
	}

	/**
	 * First selected cell
	 */
	private selectedCell: Nullable<HTMLTableCellElement> = null;

	/**
	 * User is selecting cells now
	 */
	private isSelectionMode: boolean = false;

	/**
	 * Mouse click inside the table
	 */
	@autobind
	protected onStartSelection(cell: HTMLTableCellElement): void | false {
		if (this.j.o.readonly) {
			return;
		}

		this.unselectCells();

		if (cell === this.j.editor) {
			return;
		}

		const table = Dom.closest(
			cell,
			'table',
			this.j.editor
		) as HTMLTableElement;

		if (!cell || !table) {
			return;
		}

		if (!cell.firstChild) {
			cell.appendChild(this.j.createInside.element('br'));
		}

		this.isSelectionMode = true;
		this.selectedCell = cell;

		this.module.addSelection(cell);

		this.j.e
			.on(
				table,
				'mousemove.select-cells touchmove.select-cells',
				// Don't use decorator because need clear label on mouseup
				this.j.async.throttle(this.onMove.bind(this, table), {
					label: MOUSE_MOVE_LABEL,
					timeout: this.j.defaultTimeout / 2
				})
			)
			.on(
				table,
				'mouseup.select-cells touchend.select-cells',
				this.onStopSelection.bind(this, table)
			);

		return false;
	}

	@watch(':outsideClick')
	protected onOutsideClick(): void {
		this.selectedCell = null;
		this.onRemoveSelection();
	}

	@watch(':change')
	protected onChange(): void {
		if (!this.j.isLocked && !this.isSelectionMode) {
			this.onRemoveSelection();
		}
	}

	/**
	 * Mouse move inside the table
	 */
	private onMove(table: HTMLTableElement, e: MouseEvent): void {
		if (this.j.o.readonly) {
			return;
		}

		if (this.j.isLockedNotBy(key)) {
			return;
		}

		const node = this.j.ed.elementFromPoint(e.clientX, e.clientY);

		if (!node) {
			return;
		}

		const cell = Dom.closest(node, ['td', 'th'], table);

		if (!cell || !this.selectedCell) {
			return;
		}

		if (cell !== this.selectedCell) {
			this.j.lock(key);
		}

		this.unselectCells();

		const bound = Table.getSelectedBound(table, [cell, this.selectedCell]),
			box = Table.formalMatrix(table);

		for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
			for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
				this.module.addSelection(box[i][j]);
			}
		}

		const cellsCount = this.module.getAllSelectedCells().length;

		if (cellsCount > 1) {
			this.j.s.sel?.removeAllRanges();
		}

		this.j.e.fire('hidePopup');
		e.stopPropagation();

		// Hack for FireFox for force redraw selection
		(() => {
			const n = this.j.createInside.fromHTML(
				'<div style="color:rgba(0,0,0,0.01);width:0;height:0">&nbsp;</div>'
			);

			cell.appendChild(n);

			this.j.async.setTimeout(() => {
				n.parentNode?.removeChild(n);
			}, this.j.defaultTimeout / 5);
		})();
	}

	/**
	 * On click in outside - remove selection
	 */
	@autobind
	private onRemoveSelection(e?: MouseEvent): void {
		if (
			!e?.buffer?.actionTrigger &&
			!this.selectedCell &&
			this.module.getAllSelectedCells().length
		) {
			this.j.unlock();
			this.unselectCells();
			this.j.e.fire('hidePopup', 'cells');
			return;
		}

		this.isSelectionMode = false;
		this.selectedCell = null;
	}

	/**
	 * Stop selection process
	 */
	@autobind
	private onStopSelection(table: HTMLTableElement, e: MouseEvent): void {
		if (!this.selectedCell) {
			return;
		}

		this.isSelectionMode = false;

		this.j.unlock();

		const node = this.j.ed.elementFromPoint(e.clientX, e.clientY);

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

		const bound = Table.getSelectedBound(table, [cell, this.selectedCell]),
			box = Table.formalMatrix(table);

		const max = box[bound[1][0]][bound[1][1]],
			min = box[bound[0][0]][bound[0][1]];

		this.j.e.fire(
			'showPopup',
			table,
			(): IBound => {
				const minOffset: IBound = position(min, this.j),
					maxOffset: IBound = position(max, this.j);

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
	private unselectCells(currentCell?: Nullable<HTMLTableCellElement>) {
		const module = this.module;
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
		if (
			/table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow)/.test(
				command
			)
		) {
			command = command.replace('table', '');

			const cells = this.module.getAllSelectedCells();

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
						Table.splitVertical(table, this.j);
						break;

					case 'splitg':
						Table.splitHorizontal(table, this.j);
						break;

					case 'merge':
						Table.mergeSelected(table, this.j);
						break;

					case 'empty':
						cells.forEach(td => Dom.detach(td));
						break;

					case 'bin':
						Dom.safeRemove(table);
						break;

					case 'binrow':
						new Set(
							cells.map(
								td => td.parentNode as HTMLTableRowElement
							)
						).forEach(row => {
							Table.removeRow(table, row.rowIndex);
						});

						break;

					case 'bincolumn':
						{
							const columnsSet = new Set<number>(),
								columns = cells.reduce((acc, td) => {
									if (!columnsSet.has(td.cellIndex)) {
										acc.push(td);
										columnsSet.add(td.cellIndex);
									}

									return acc;
								}, <HTMLTableCellElement[]>[]);

							columns.forEach(td => {
								Table.removeColumn(table, td.cellIndex);
							});
						}
						break;

					case 'addcolumnafter':
					case 'addcolumnbefore':
						Table.appendColumn(
							table,
							cell.cellIndex,
							command === 'addcolumnafter',
							this.j.createInside
						);
						break;

					case 'addrowafter':
					case 'addrowbefore':
						Table.appendRow(
							table,
							cell.parentNode as HTMLTableRowElement,
							command === 'addrowafter',
							this.j.createInside
						);
						break;
				}
			}

			return false;
		}
	}

	/**
	 * Add some align after native command
	 */
	@autobind
	private onAfterCommand(command: string): void {
		if (/^justify/.test(command)) {
			this.module
				.getAllSelectedCells()
				.forEach(elm => alignElement(command, elm));
		}
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.onRemoveSelection();

		jodit.e.off('.select-cells');
	}
}
