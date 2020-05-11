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
		jodit.e
			.on(
				[this.j.ow, this.j.editorWindow],
				'mouseup.table touchend.table',
				this.onStopSelection
			)
			.on(
				[this.j.ow, this.j.editorWindow],
				'mousedown.table touchstart.table',
				this.onMouseClickEverywhere
			)
			.on('keydown.table', (event: KeyboardEvent) => {
				if (event.key === KEY_TAB) {
					this.unselectCells();
				}
			})

			.on('beforeCommand.table', this.onExecCommand)
			.on('afterCommand.table', this.onAfterCommand)

			.on('change.table afterCommand.table afterSetMode.table', () => {
				$$('table', jodit.editor).forEach(table => {
					if (!dataBind(table, key)) {
						this.observe(table);
					}
				});
			});
	}

	/**
	 * Start selection or remove all selection from cells
	 */
	@autobind
	private onMouseClickEverywhere(event: MouseEvent): void {
		// need use event['originalEvent'] because of IE can not set target from
		// another window to current window
		const cell = Dom.closest(
			(event as any).originalEvent.target as HTMLElement,
			['td', 'th'],
			this.j.editor
		);

		if (!cell) {
			return this.unselectCells();
		}

		const table = Dom.closest(cell, 'table', this.j.editor);

		if (table) {
			this.unselectCells(table, cell);
		} else {
			this.unselectCells();
		}
	}

	/**
	 * First selected cell
	 */
	private selectedCell: Nullable<HTMLTableCellElement> = null;

	/***
	 * Add listeners for table
	 * @param table
	 */
	private observe(table: HTMLTableElement) {
		dataBind(table, key, true);

		this.j.e.on(
			table,
			'mousedown.table touchstart.table',
			this.onStartSelection.bind(this, table)
		);
	}

	/**
	 * Mouse click inside the table
	 *
	 * @param table
	 * @param event
	 */
	private onStartSelection(table: HTMLTableElement, event: MouseEvent): void {
		if (this.j.o.readonly) {
			return;
		}

		const cell = Dom.closest(
			event.target as HTMLElement,
			['td', 'th'],
			table
		);

		if (!cell) {
			return;
		}

		if (!cell.firstChild) {
			cell.appendChild(this.j.createInside.element('br'));
		}

		this.selectedCell = cell;

		this.module.addSelection(cell);

		this.j.e.on(
			table,
			'mousemove.table touchmove.table',
			this.onMove.bind(this, table)
		);

		event.buffer = {
			isOpenEvent: true
		}

		this.j.e.fire(
			'showPopup',
			table,
			(): IBound => position(cell, this.j),
			'table-cells'
		);
	}

	/**
	 * Mouse move inside the table
	 *
	 * @param table
	 * @param event
	 */
	private onMove(table: HTMLTableElement, event: MouseEvent): void {
		if (this.j.o.readonly) {
			return;
		}

		if (this.j.isLockedNotBy(key)) {
			return;
		}

		const cell = Dom.closest(
			event.target as HTMLElement,
			['td', 'th'],
			table
		);

		if (!cell || !this.selectedCell) {
			return;
		}

		if (cell !== this.selectedCell) {
			this.j.lock(key);

			this.j.selection.clear();

			if (event.preventDefault) {
				event.preventDefault();
			}
		}

		this.unselectCells(table);

		const bound = Table.getSelectedBound(table, [cell, this.selectedCell]),
			box = Table.formalMatrix(table);

		for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
			for (let j = bound[0][1]; j <= bound[1][1]; j += 1) {
				this.j
					.getInstance<Table>('Table', this.j.o)
					.addSelection(box[i][j]);
			}
		}

		const max = box[bound[1][0]][bound[1][1]],
			min = box[bound[0][0]][bound[0][1]];

		this.j.e.fire('hidePopup');
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
			'table-cells'
		);

		event.stopPropagation();
	}

	/**
	 * Stop selection process
	 */
	@autobind
	private onStopSelection(): void {
		this.j.unlock();

		if (!this.selectedCell) {
			return;
		}

		this.selectedCell = null;

		$$('table', this.j.editor).forEach(table => {
			this.j.e.off(table, 'mousemove.table touchmove.table');
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
		currentCell: Nullable<HTMLTableCellElement> = this.selectedCell
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
						Table.mergeSelected(table);
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
		this.onStopSelection();

		jodit.e
			.off(
				[jodit.ow, jodit.editorWindow],
				'mouseup.table touchend.table',
				this.onStopSelection
			)
			.off(
				[jodit.ow, jodit.editorWindow],
				'mousedown.table touchstart.table',
				this.onMouseClickEverywhere
			)
			.off('keydown.table')
			.off('beforeCommand.table', this.onExecCommand)
			.off('afterCommand.table', this.onAfterCommand)
			.off('afterGetValueFromEditor.table')
			.off('change.table afterCommand.table afterSetMode.table')
			.off('.table');
	}
}
