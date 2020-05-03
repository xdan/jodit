import { Plugin } from '../../core/plugin';
import { IBound, IJodit } from '../../types';
import { Dom, Table } from '../../modules';
import { $$, position } from '../../core/helpers';
import { alignElement } from '../justify';
import * as consts from '../../core/constants';

export class SelectCells extends Plugin {
	protected afterInit(jodit: IJodit): void {
		jodit.e
			.on(
				this.j.ow,
				'mousedown.table touchend.table',
				(event: MouseEvent) => {
					// need use event['originalEvent'] because of IE can not set target from
					// another window to current window
					const current_cell: HTMLTableCellElement = Dom.closest(
						(event as any).originalEvent.target as HTMLElement,
						'TD|TH',
						this.j.editor
					) as HTMLTableCellElement;

					let table: HTMLTableElement | null = null;

					if (Dom.isCell(current_cell, this.j.editorWindow)) {
						table = Dom.closest(
							current_cell,
							'table',
							this.j.editor
						) as HTMLTableElement;
					}

					if (table) {
						this.deSelectAll(
							table,
							current_cell instanceof
								(this.j.editorWindow as any)
									.HTMLTableCellElement
								? current_cell
								: false
						);
					} else {
						this.deSelectAll();
					}
				}
			)
			.on('keydown.table', (event: KeyboardEvent) => {
				if (event.key === consts.KEY_TAB) {
					($$('table', jodit.editor) as HTMLTableElement[]).forEach(
						(table: HTMLTableElement) => {
							this.deSelectAll(table);
						}
					);
				}
			})
			.on('beforeCommand.table', this.onExecCommand.bind(this))
			.on('afterCommand.table', this.onAfterCommand.bind(this))
			.on('afterGetValueFromEditor.table', (data: { value: string }) => {
				const rxp = new RegExp(
					`([\s]*)${consts.JODIT_SELECTED_CELL_MARKER}="1"`,
					'g'
				);

				if (rxp.test(data.value)) {
					data.value = data.value.replace(rxp, '');
				}
			})
			.on('change.table afterCommand.table afterSetMode.table', () => {
				($$('table', jodit.editor) as HTMLTableElement[]).forEach(
					(table: HTMLTableElement) => {
						if (!(table as any)[this.key]) {
							this.observe(table);
						}
					}
				);
			});
	}

	private selectMode: boolean = false;

	private key: string = 'table_processor_observer';

	private observe(table: HTMLTableElement) {
		(table as any)[this.key] = true;

		let start: HTMLTableCellElement;

		this.j.e
			.on(
				table,
				'mousedown.table touchstart.table',
				(event: MouseEvent) => {
					if (this.j.o.readonly) {
						return;
					}

					const cell = Dom.up(
						event.target as HTMLElement,
						elm => Dom.isCell(elm, this.j.editorWindow),
						table
					) as HTMLTableCellElement;

					if (cell) {
						if (!cell.firstChild) {
							cell.appendChild(this.j.createInside.element('br'));
						}

						start = cell;
						Table.addSelected(cell);

						this.j.e.fire(
							'showPopup',
							table,
							(): IBound => position(cell, this.j),
							'table-cells'
						);

						this.selectMode = true;
					}
				}
			)
			.on(
				table,
				'mousemove.table touchmove.table',
				(event: MouseEvent) => {
					if (this.j.o.readonly) {
						return;
					}

					if (this.j.isLockedNotBy(this.key)) {
						return;
					}

					const cell = Dom.up(
						event.target as HTMLElement,
						elm => Dom.isCell(elm, this.j.editorWindow),
						table
					) as HTMLTableCellElement;

					if (!cell) {
						return;
					}

					if (this.selectMode) {
						if (cell !== start) {
							this.j.lock(this.key);

							const sel = this.j.selection.sel;
							sel && sel.removeAllRanges();

							if (event.preventDefault) {
								event.preventDefault();
							}
						}

						this.deSelectAll(table);

						const bound = Table.getSelectedBound(table, [
								cell,
								start
							]),
							box = Table.formalMatrix(table);

						for (let i = bound[0][0]; i <= bound[1][0]; i += 1) {
							for (
								let j = bound[0][1];
								j <= bound[1][1];
								j += 1
							) {
								Table.addSelected(box[i][j]);
							}
						}

						const max = box[bound[1][0]][bound[1][1]],
							min = box[bound[0][0]][bound[0][1]];

						this.j.e.fire(
							'showPopup',
							table,
							(): IBound => {
								const minOffset: IBound = position(min, this.j);

								const maxOffset: IBound = position(max, this.j);

								return {
									left: minOffset.left,
									top: minOffset.top,

									width:
										maxOffset.left -
										minOffset.left +
										maxOffset.width,

									height:
										maxOffset.top -
										minOffset.top +
										maxOffset.height
								};
							},
							'table-cells'
						);

						event.stopPropagation();
					}
				}
			);
	}

	/**
	 *
	 * @param {HTMLTableElement} [table]
	 * @param {HTMLTableCellElement} [currentCell]
	 * @private
	 */
	private deSelectAll(
		table?: HTMLTableElement,
		currentCell?: HTMLTableCellElement | false
	) {
		const cells: HTMLTableCellElement[] = table
			? Table.getAllSelectedCells(table)
			: Table.getAllSelectedCells(this.j.editor);

		if (cells.length) {
			cells.forEach((cell: HTMLTableCellElement) => {
				if (!currentCell || currentCell !== cell) {
					Table.restoreSelection(cell);
				}
			});
		}
	}

	/**
	 *
	 * @param {string} command
	 */
	private onExecCommand = (command: string): false | void => {
		if (
			/table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow)/.test(
				command
			)
		) {
			command = command.replace('table', '');
			const cells = Table.getAllSelectedCells(this.j.editor);
			if (cells.length) {
				const cell: HTMLTableCellElement | undefined = cells.shift();

				if (!cell) {
					return;
				}

				const table = Dom.closest(
					cell,
					'table',
					this.j.editor
				) as HTMLTableElement;

				switch (command) {
					case 'splitv':
						Table.splitVertical(table, this.j.createInside);
						break;
					case 'splitg':
						Table.splitHorizontal(table, this.j.createInside);
						break;
					case 'merge':
						Table.mergeSelected(table);
						break;
					case 'empty':
						Table.getAllSelectedCells(this.j.editor).forEach(
							td => (td.innerHTML = '')
						);
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
	};

	private onAfterCommand(command: string) {
		if (/^justify/.test(command)) {
			$$('[data-jodit-selected-cell]', this.j.editor).forEach(elm =>
				alignElement(command, elm, this.j)
			);
		}
	}

	protected beforeDestruct(jodit: IJodit): void {}
}
