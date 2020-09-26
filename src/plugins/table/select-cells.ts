/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import autobind from 'autobind-decorator';

import { Plugin } from '../../core/plugin';
import { IBound, IJodit, Nullable } from '../../types';
import { Dom, Table } from '../../modules';
import { $$, dataBind, position } from '../../core/helpers';
import { alignElement } from '../justify';
import { KEY_TAB } from '../../core/constants';

const key = 'table_processor_observer';

export class selectCells extends Plugin {
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
			.on(this.j.ow, 'click.select-cells', this.onRemoveSelection)
			.on('keydown.select-cells', (event: KeyboardEvent) => {
				if (event.key === KEY_TAB) {
					this.unselectCells();
				}
			})

			.on('beforeCommand.select-cells', this.onExecCommand)
			.on('afterCommand.select-cells', this.onAfterCommand)

			.on(
				'change afterCommand afterSetMode click afterInit'
					.split(' ')
					.map(e => e + '.select-cells')
					.join(' '),
				() => {
					$$('table', jodit.editor).forEach(this.observe);
				}
			);
	}

	/**
	 * First selected cell
	 */
	private selectedCell: Nullable<HTMLTableCellElement> = null;

	/***
	 * Add listeners for table
	 * @param table
	 */
	@autobind
	private observe(table: HTMLTableElement): void {
		if (dataBind(table, key)) {
			return;
		}

		this.onRemoveSelection();

		dataBind(table, key, true);

		this.j.e.on(
			table,
			'mousedown.select-cells touchstart.select-cells',
			this.onStartSelection.bind(this, table)
		);
	}

	/**
	 * Mouse click inside the table
	 *
	 * @param table
	 * @param e
	 */
	private onStartSelection(table: HTMLTableElement, e: MouseEvent): void {
		if (this.j.o.readonly) {
			return;
		}

		this.unselectCells();

		const cell = Dom.closest(e.target as HTMLElement, ['td', 'th'], table);

		if (!cell) {
			return;
		}

		if (!cell.firstChild) {
			cell.appendChild(this.j.createInside.element('br'));
		}

		this.selectedCell = cell;

		this.module.addSelection(cell);

		this.j.e
			.on(
				table,
				'mousemove.select-cells touchmove.select-cells',
				this.onMove.bind(this, table)
			)
			.on(
				table,
				'mouseup.select-cells touchend.select-cells',
				this.onStopSelection.bind(this, table)
			);

		this.j.e.fire(
			'showPopup',
			table,
			(): IBound => position(cell, this.j),
			'cells'
		);
	}

	/**
	 * Mouse move inside the table
	 *
	 * @param table
	 * @param e
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

		this.unselectCells(table);

		const bound = Table.getSelectedBound(table, [cell, this.selectedCell]),
			box = Table.formalMatrix(table);

		for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
			for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
				this.module.addSelection(box[i][j]);
			}
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
	}

	/**
	 * Remove selection for all cells
	 *
	 * @param [table]
	 * @param [currentCell]
	 */
	private unselectCells(
		table?: HTMLTableElement,
		currentCell?: Nullable<HTMLTableCellElement>
	) {
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
	 * @param {string} command
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
				const cell = cells.shift();

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
						cells.forEach(td => (td.innerHTML = ''));
						break;

					case 'bin':
						Dom.safeRemove(table);
						break;

					case 'binrow':
						Table.removeRow(
							table,
							(cell.parentNode as HTMLTableRowElement).rowIndex
						);
						break;

					case 'bincolumn':
						Table.removeColumn(table, cell.cellIndex);
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
	 * @param command
	 */
	@autobind
	private onAfterCommand(command: string): void {
		if (/^justify/.test(command)) {
			this.module
				.getAllSelectedCells()
				.forEach(elm => alignElement(command, elm, this.j));
		}
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.onRemoveSelection();

		jodit.e.off('.select-cells');
	}
}
