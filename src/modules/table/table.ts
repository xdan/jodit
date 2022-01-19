/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/table/README.md]]
 * @packageDocumentation
 * @module modules/table
 */

import type { ICreate, IDictionary, IJodit } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import {
	$$,
	attr,
	cssPath,
	isNumber,
	toArray,
	trim
} from 'jodit/core/helpers/';
import { ViewComponent } from 'jodit/core/component';
import { getContainer } from 'jodit/core/global';
import { debounce } from 'jodit/core/decorators';

declare module 'jodit/config' {
	interface Config {
		table: {
			allowCellSelection: boolean;
			selectionCellStyle: string;

			allowCellResize: boolean;
			useExtraClassesOptions: boolean;
		};
	}
}

const markedValue = new WeakMap<
	HTMLElement,
	IDictionary<string | number | null>
>();

export class Table extends ViewComponent<IJodit> {
	/** @override */
	className(): string {
		return 'Table';
	}

	private selected: Set<HTMLTableCellElement> = new Set();

	private static selectedByTable: WeakMap<
		HTMLTableElement,
		Set<HTMLTableCellElement>
	> = new WeakMap();

	@debounce()
	private recalculateStyles(): void {
		const style = getContainer(this.j, Table, 'style', true);

		const selectors: string[] = [];

		this.selected.forEach(td => {
			const selector = cssPath(td);
			selector && selectors.push(selector);
		});

		// eslint-disable-next-line no-prototype-builtins
		style.innerHTML = selectors.length
			? selectors.join(',') +
			  `{${(this.jodit.options as any).table.selectionCellStyle}}`
			: '';
	}

	addSelection(td: HTMLTableCellElement): void {
		this.selected.add(td);
		this.recalculateStyles();

		const table = Dom.closest(td, 'table', this.j.editor);

		if (table) {
			const cells = Table.selectedByTable.get(table) || new Set();
			cells.add(td);
			Table.selectedByTable.set(table, cells);
		}
	}

	removeSelection(td: HTMLTableCellElement): void {
		this.selected.delete(td);

		this.recalculateStyles();

		const table = Dom.closest(td, 'table', this.j.editor);

		if (table) {
			const cells = Table.selectedByTable.get(table);

			if (cells) {
				cells.delete(td);

				if (!cells.size) {
					Table.selectedByTable.delete(table);
				}
			}
		}
	}

	/**
	 * Returns array of selected cells
	 */
	getAllSelectedCells(): HTMLTableCellElement[] {
		return toArray(this.selected);
	}

	static getSelectedCellsByTable(
		table: HTMLTableElement
	): HTMLTableCellElement[] {
		const cells = Table.selectedByTable.get(table);
		return cells ? toArray(cells) : [];
	}

	/** @override **/
	override destruct(): any {
		this.selected.clear();
		return super.destruct();
	}

	/**
	 * Returns rows count in the table
	 */
	static getRowsCount(table: HTMLTableElement): number {
		return table.rows.length;
	}

	/**
	 * Returns columns count in the table
	 */
	static getColumnsCount(table: HTMLTableElement): number {
		const matrix = Table.formalMatrix(table);

		return matrix.reduce(
			(max_count, cells) => Math.max(max_count, cells.length),
			0
		);
	}

	/**
	 * Generate formal table martix columns*rows
	 * @param callback - if return false cycle break
	 */
	static formalMatrix(
		table: HTMLTableElement,
		callback?: (
			cell: HTMLTableCellElement,
			row: number,
			col: number,
			colSpan: number,
			rowSpan: number
		) => false | void
	): HTMLTableCellElement[][] {
		const matrix: HTMLTableCellElement[][] = [[]];
		const rows = toArray(table.rows);

		const setCell = (
			cell: HTMLTableCellElement,
			i: number
		): false | HTMLTableCellElement[][] | void => {
			if (matrix[i] === undefined) {
				matrix[i] = [];
			}

			const colSpan: number = cell.colSpan,
				rowSpan = cell.rowSpan;
			let column: number,
				row: number,
				currentColumn: number = 0;

			while (matrix[i][currentColumn]) {
				currentColumn += 1;
			}

			for (row = 0; row < rowSpan; row += 1) {
				for (column = 0; column < colSpan; column += 1) {
					if (matrix[i + row] === undefined) {
						matrix[i + row] = [];
					}
					if (
						callback &&
						callback(
							cell,
							i + row,
							currentColumn + column,
							colSpan,
							rowSpan
						) === false
					) {
						return false;
					}

					matrix[i + row][currentColumn + column] = cell;
				}
			}
		};

		for (let i = 0; i < rows.length; i += 1) {
			const cells = toArray(rows[i].cells);

			for (let j = 0; j < cells.length; j += 1) {
				if (setCell(cells[j], i) === false) {
					return matrix;
				}
			}
		}

		return matrix;
	}

	/**
	 * Get cell coordinate in formal table (without colspan and rowspan)
	 */
	static formalCoordinate(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		max = false
	): number[] {
		let i: number = 0,
			j: number = 0,
			width: number = 1,
			height: number = 1;

		Table.formalMatrix(
			table,
			(
				td: HTMLTableCellElement,
				ii: number,
				jj: number,
				colSpan: number | void,
				rowSpan: number | void
			): false | void => {
				if (cell === td) {
					i = ii;
					j = jj;
					width = colSpan || 1;
					height = rowSpan || 1;

					if (max) {
						j += (colSpan || 1) - 1;
						i += (rowSpan || 1) - 1;
					}

					return false;
				}
			}
		);

		return [i, j, width, height];
	}

	/**
	 * Inserts a new line after row what contains the selected cell
	 *
	 * @param line - Insert a new line after/before this
	 * line contains the selected cell
	 * @param after - Insert a new line after line contains the selected cell
	 */
	static appendRow(
		table: HTMLTableElement,
		line: false | HTMLTableRowElement,
		after: boolean,
		create: ICreate
	): void {
		let row: HTMLTableRowElement;

		if (!line) {
			const columnsCount = Table.getColumnsCount(table);

			row = create.element('tr');

			for (let j: number = 0; j < columnsCount; j += 1) {
				row.appendChild(create.element('td'));
			}
		} else {
			row = line.cloneNode(true) as HTMLTableRowElement;

			$$('td,th', line).forEach(cell => {
				const rowspan = attr(cell, 'rowspan');

				if (rowspan && parseInt(rowspan, 10) > 1) {
					const newRowSpan = parseInt(rowspan, 10) - 1;
					attr(cell, 'rowspan', newRowSpan > 1 ? newRowSpan : null);
				}
			});

			$$('td,th', row).forEach(cell => {
				cell.innerHTML = '';
			});
		}

		if (after && line && line.nextSibling) {
			line.parentNode &&
				line.parentNode.insertBefore(row, line.nextSibling);
		} else if (!after && line) {
			line.parentNode && line.parentNode.insertBefore(row, line);
		} else {
			(table.getElementsByTagName('tbody')?.[0] || table).appendChild(
				row
			);
		}
	}

	/**
	 * Remove row
	 */
	static removeRow(table: HTMLTableElement, rowIndex: number): void {
		const box = Table.formalMatrix(table);

		let dec: boolean;
		const row = table.rows[rowIndex];

		box[rowIndex].forEach((cell: HTMLTableCellElement, j: number) => {
			dec = false;

			if (rowIndex - 1 >= 0 && box[rowIndex - 1][j] === cell) {
				dec = true;
			} else if (box[rowIndex + 1] && box[rowIndex + 1][j] === cell) {
				if (cell.parentNode === row && cell.parentNode.nextSibling) {
					dec = true;
					let nextCell = j + 1;

					while (box[rowIndex + 1][nextCell] === cell) {
						nextCell += 1;
					}

					const nextRow = Dom.next<HTMLTableRowElement>(
						cell.parentNode,
						elm => Dom.isTag(elm, 'tr'),
						table
					);

					if (nextRow) {
						if (box[rowIndex + 1][nextCell]) {
							nextRow.insertBefore(
								cell,
								box[rowIndex + 1][nextCell]
							);
						} else {
							nextRow.appendChild(cell);
						}
					}
				}
			} else {
				Dom.safeRemove(cell);
			}
			if (
				dec &&
				(cell.parentNode === row || cell !== box[rowIndex][j - 1])
			) {
				const rowSpan = cell.rowSpan;

				attr(cell, 'rowspan', rowSpan - 1 > 1 ? rowSpan - 1 : null);
			}
		});

		Dom.safeRemove(row);
	}

	/**
	 * Insert column before / after all the columns containing the selected cells
	 */
	static appendColumn(
		table: HTMLTableElement,
		j: number,
		after: boolean,
		create: ICreate
	): void {
		const box = Table.formalMatrix(table);

		let i: number;

		if (j === undefined || j < 0) {
			j = Table.getColumnsCount(table) - 1;
		}

		for (i = 0; i < box.length; i += 1) {
			const cell = create.element('td');
			const td = box[i][j];

			let added: boolean = false;

			if (after) {
				if (
					(box[i] && td && j + 1 >= box[i].length) ||
					td !== box[i][j + 1]
				) {
					if (td.nextSibling) {
						Dom.before(td.nextSibling, cell);
					} else {
						td.parentNode && td.parentNode.appendChild(cell);
					}
					added = true;
				}
			} else {
				if (
					j - 1 < 0 ||
					(box[i][j] !== box[i][j - 1] && box[i][j].parentNode)
				) {
					Dom.before(box[i][j], cell);
					added = true;
				}
			}

			if (!added) {
				attr(
					box[i][j],
					'colspan',
					parseInt(attr(box[i][j], 'colspan') || '1', 10) + 1
				);
			}
		}
	}

	/**
	 * Remove column by index
	 */
	static removeColumn(table: HTMLTableElement, j: number): void {
		const box = Table.formalMatrix(table);

		let dec: boolean;
		box.forEach((cells: HTMLTableCellElement[], i: number) => {
			const td = cells[j];

			dec = false;

			if (j - 1 >= 0 && box[i][j - 1] === td) {
				dec = true;
			} else if (j + 1 < cells.length && box[i][j + 1] === td) {
				dec = true;
			} else {
				Dom.safeRemove(td);
			}

			if (dec && (i - 1 < 0 || td !== box[i - 1][j])) {
				const colSpan = td.colSpan;

				attr(
					td,
					'colspan',
					colSpan - 1 > 1 ? (colSpan - 1).toString() : null
				);
			}
		});
	}

	/**
	 * Define bound for selected cells
	 */
	static getSelectedBound(
		table: HTMLTableElement,
		selectedCells: HTMLTableCellElement[]
	): number[][] {
		const bound = [
			[Infinity, Infinity],
			[0, 0]
		];

		const box = Table.formalMatrix(table);
		let i: number, j: number, k: number;

		for (i = 0; i < box.length; i += 1) {
			for (j = 0; box[i] && j < box[i].length; j += 1) {
				if (selectedCells.includes(box[i][j])) {
					bound[0][0] = Math.min(i, bound[0][0]);
					bound[0][1] = Math.min(j, bound[0][1]);
					bound[1][0] = Math.max(i, bound[1][0]);
					bound[1][1] = Math.max(j, bound[1][1]);
				}
			}
		}

		for (i = bound[0][0]; i <= bound[1][0]; i += 1) {
			for (k = 1, j = bound[0][1]; j <= bound[1][1]; j += 1) {
				while (box[i] && box[i][j - k] && box[i][j] === box[i][j - k]) {
					bound[0][1] = Math.min(j - k, bound[0][1]);
					bound[1][1] = Math.max(j - k, bound[1][1]);
					k += 1;
				}

				k = 1;
				while (box[i] && box[i][j + k] && box[i][j] === box[i][j + k]) {
					bound[0][1] = Math.min(j + k, bound[0][1]);
					bound[1][1] = Math.max(j + k, bound[1][1]);
					k += 1;
				}

				k = 1;
				while (box[i - k] && box[i][j] === box[i - k][j]) {
					bound[0][0] = Math.min(i - k, bound[0][0]);
					bound[1][0] = Math.max(i - k, bound[1][0]);
					k += 1;
				}

				k = 1;
				while (box[i + k] && box[i][j] === box[i + k][j]) {
					bound[0][0] = Math.min(i + k, bound[0][0]);
					bound[1][0] = Math.max(i + k, bound[1][0]);
					k += 1;
				}
			}
		}

		return bound;
	}

	/**
	 * Try recalculate all coluns and rows after change
	 */
	static normalizeTable(table: HTMLTableElement): void {
		let i: number, j: number, min: number, not: boolean;

		const __marked: HTMLTableCellElement[] = [],
			box = Table.formalMatrix(table);

		// remove extra colspans
		for (j = 0; j < box[0].length; j += 1) {
			min = 1000000;
			not = false;

			for (i = 0; i < box.length; i += 1) {
				if (box[i][j] === undefined) {
					continue; // broken table
				}

				if (box[i][j].colSpan < 2) {
					not = true;
					break;
				}

				min = Math.min(min, box[i][j].colSpan);
			}
			if (!not) {
				for (i = 0; i < box.length; i += 1) {
					if (box[i][j] === undefined) {
						continue; // broken table
					}

					Table.mark(
						box[i][j],
						'colspan',
						box[i][j].colSpan - min + 1,
						__marked
					);
				}
			}
		}

		// remove extra rowspans
		for (i = 0; i < box.length; i += 1) {
			min = 1000000;
			not = false;

			for (j = 0; j < box[i].length; j += 1) {
				if (box[i][j] === undefined) {
					continue; // broken table
				}
				if (box[i][j].rowSpan < 2) {
					not = true;
					break;
				}
				min = Math.min(min, box[i][j].rowSpan);
			}

			if (!not) {
				for (j = 0; j < box[i].length; j += 1) {
					if (box[i][j] === undefined) {
						continue; // broken table
					}

					Table.mark(
						box[i][j],
						'rowspan',
						box[i][j].rowSpan - min + 1,
						__marked
					);
				}
			}
		}

		// remove rowspans and colspans equal 1 and empty class
		for (i = 0; i < box.length; i += 1) {
			for (j = 0; j < box[i].length; j += 1) {
				if (box[i][j] === undefined) {
					continue; // broken table
				}

				if (
					box[i][j].hasAttribute('rowspan') &&
					box[i][j].rowSpan === 1
				) {
					attr(box[i][j], 'rowspan', null);
				}

				if (
					box[i][j].hasAttribute('colspan') &&
					box[i][j].colSpan === 1
				) {
					attr(box[i][j], 'colspan', null);
				}

				if (
					box[i][j].hasAttribute('class') &&
					!attr(box[i][j], 'class')
				) {
					attr(box[i][j], 'class', null);
				}
			}
		}

		Table.unmark(__marked);
	}

	/**
	 * It combines all of the selected cells into one. The contents of the cells will also be combined
	 */
	static mergeSelected(table: HTMLTableElement, jodit: IJodit): void {
		const html: string[] = [],
			bound = Table.getSelectedBound(
				table,
				Table.getSelectedCellsByTable(table)
			);

		let w: number = 0,
			first: HTMLTableCellElement | null = null,
			first_j: number = 0,
			td: HTMLTableCellElement,
			cols: number = 0,
			rows: number = 0;

		const alreadyMerged = new Set<HTMLTableCellElement>(),
			__marked: HTMLTableCellElement[] = [];

		if (bound && (bound[0][0] - bound[1][0] || bound[0][1] - bound[1][1])) {
			Table.formalMatrix(
				table,
				(
					cell: HTMLTableCellElement,
					i: number,
					j: number,
					cs: number,
					rs: number
				) => {
					if (i >= bound[0][0] && i <= bound[1][0]) {
						if (j >= bound[0][1] && j <= bound[1][1]) {
							td = cell;

							if (alreadyMerged.has(td)) {
								return;
							}

							alreadyMerged.add(td);

							if (i === bound[0][0] && td.style.width) {
								w += td.offsetWidth;
							}

							if (
								trim(
									cell.innerHTML.replace(/<br(\/)?>/g, '')
								) !== ''
							) {
								html.push(cell.innerHTML);
							}

							if (cs > 1) {
								cols += cs - 1;
							}
							if (rs > 1) {
								rows += rs - 1;
							}

							if (!first) {
								first = cell;
								first_j = j;
							} else {
								Table.mark(td, 'remove', 1, __marked);

								instance(jodit).removeSelection(td);
							}
						}
					}
				}
			);

			cols = bound[1][1] - bound[0][1] + 1;
			rows = bound[1][0] - bound[0][0] + 1;

			if (first) {
				if (cols > 1) {
					Table.mark(first, 'colspan', cols, __marked);
				}
				if (rows > 1) {
					Table.mark(first, 'rowspan', rows, __marked);
				}

				if (w) {
					Table.mark(
						first,
						'width',
						((w / table.offsetWidth) * 100).toFixed(
							consts.ACCURACY
						) + '%',
						__marked
					);

					if (first_j) {
						Table.setColumnWidthByDelta(
							table,
							first_j,
							0,
							true,
							__marked
						);
					}
				}

				(first as HTMLTableCellElement).innerHTML = html.join('<br/>');
				instance(jodit).addSelection(first);

				alreadyMerged.delete(first);

				Table.unmark(__marked);

				Table.normalizeTable(table);

				toArray(table.rows).forEach((tr, index) => {
					if (!tr.cells.length) {
						Dom.safeRemove(tr);
					}
				});
			}
		}
	}

	/**
	 * Divides all selected by `jodit_focused_cell` class table cell in 2 parts vertical. Those division into 2 columns
	 */
	static splitHorizontal(table: HTMLTableElement, jodit: IJodit): void {
		let coord: number[],
			td: HTMLTableCellElement,
			tr: HTMLTableRowElement,
			parent: HTMLTableRowElement,
			after: HTMLTableCellElement;

		const __marked: HTMLTableCellElement[] = [];

		Table.getSelectedCellsByTable(table).forEach(
			(cell: HTMLTableCellElement) => {
				td = jodit.createInside.element('td');
				td.appendChild(jodit.createInside.element('br'));
				tr = jodit.createInside.element('tr');

				coord = Table.formalCoordinate(table, cell);

				if (cell.rowSpan < 2) {
					Table.formalMatrix(table, (tdElm, i, j) => {
						if (
							coord[0] === i &&
							coord[1] !== j &&
							tdElm !== cell
						) {
							Table.mark(
								tdElm,
								'rowspan',
								tdElm.rowSpan + 1,
								__marked
							);
						}
					});

					Dom.after(
						Dom.closest(cell, 'tr', table) as HTMLTableRowElement,
						tr
					);

					tr.appendChild(td);
				} else {
					Table.mark(cell, 'rowspan', cell.rowSpan - 1, __marked);

					Table.formalMatrix(
						table,
						(tdElm: HTMLTableCellElement, i: number, j: number) => {
							if (
								i > coord[0] &&
								i < coord[0] + cell.rowSpan &&
								coord[1] > j &&
								(tdElm.parentNode as HTMLTableRowElement)
									.rowIndex === i
							) {
								after = tdElm;
							}
							if (coord[0] < i && tdElm === cell) {
								parent = table.rows[i];
							}
						}
					);

					if (after) {
						Dom.after(after, td);
					} else {
						parent.insertBefore(td, parent.firstChild);
					}
				}

				if (cell.colSpan > 1) {
					Table.mark(td, 'colspan', cell.colSpan, __marked);
				}

				Table.unmark(__marked);
				instance(jodit).removeSelection(cell);
			}
		);

		this.normalizeTable(table);
	}

	/**
	 * It splits all the selected cells into 2 parts horizontally. Those. are added new row
	 */
	static splitVertical(table: HTMLTableElement, jodit: IJodit): void {
		let coord: number[], td: HTMLTableCellElement, percentage: number;

		const __marked: HTMLTableCellElement[] = [];

		Table.getSelectedCellsByTable(table).forEach(cell => {
			coord = Table.formalCoordinate(table, cell);

			if (cell.colSpan < 2) {
				Table.formalMatrix(table, (tdElm, i, j) => {
					if (coord[1] === j && coord[0] !== i && tdElm !== cell) {
						Table.mark(
							tdElm,
							'colspan',
							tdElm.colSpan + 1,
							__marked
						);
					}
				});
			} else {
				Table.mark(cell, 'colspan', cell.colSpan - 1, __marked);
			}

			td = jodit.createInside.element('td');
			td.appendChild(jodit.createInside.element('br'));

			if (cell.rowSpan > 1) {
				Table.mark(td, 'rowspan', cell.rowSpan, __marked);
			}

			const oldWidth = cell.offsetWidth; // get old width

			Dom.after(cell, td);

			percentage = oldWidth / table.offsetWidth / 2;

			Table.mark(
				cell,
				'width',
				(percentage * 100).toFixed(consts.ACCURACY) + '%',
				__marked
			);

			Table.mark(
				td,
				'width',
				(percentage * 100).toFixed(consts.ACCURACY) + '%',
				__marked
			);

			Table.unmark(__marked);

			instance(jodit).removeSelection(cell);
		});

		Table.normalizeTable(table);
	}

	/**
	 * Set column width used delta value
	 */
	static setColumnWidthByDelta(
		table: HTMLTableElement,
		column: number,
		delta: number,
		noUnmark: boolean,
		marked: HTMLTableCellElement[]
	): void {
		const box = Table.formalMatrix(table);

		let clearWidthIndex = 0;
		for (let i = 0; i < box.length; i += 1) {
			const cell = box[i][column];

			if (cell.colSpan > 1 && box.length > 1) {
				continue;
			}

			const w = cell.offsetWidth;
			const percent = ((w + delta) / table.offsetWidth) * 100;

			Table.mark(
				cell,
				'width',
				percent.toFixed(consts.ACCURACY) + '%',
				marked
			);

			clearWidthIndex = i;
			break;
		}

		for (let i = clearWidthIndex + 1; i < box.length; i += 1) {
			const cell = box[i][column];

			Table.mark(cell, 'width', null, marked);
		}

		if (!noUnmark) {
			Table.unmark(marked);
		}
	}

	private static mark(
		cell: HTMLTableCellElement,
		key: string,
		value: string | number | null,
		marked: HTMLTableCellElement[]
	) {
		marked.push(cell);

		const dict = markedValue.get(cell) ?? {};
		dict[key] = value === undefined ? 1 : value;
		markedValue.set(cell, dict);
	}

	private static unmark(marked: HTMLTableCellElement[]) {
		marked.forEach(cell => {
			const dict = markedValue.get(cell);

			if (dict) {
				Object.keys(dict).forEach((key: string) => {
					const value = dict[key];

					switch (key) {
						case 'remove':
							Dom.safeRemove(cell);
							break;

						case 'rowspan':
							attr(
								cell,
								'rowspan',
								isNumber(value) && value > 1 ? value : null
							);
							break;

						case 'colspan':
							attr(
								cell,
								'colspan',
								isNumber(value) && value > 1 ? value : null
							);
							break;

						case 'width':
							if (value == null) {
								cell.style.removeProperty('width');
								if (!attr(cell, 'style')) {
									attr(cell, 'style', null);
								}
							} else {
								cell.style.width = value.toString();
							}

							break;
					}

					delete dict[key];
				});

				markedValue.delete(cell);
			}
		});
	}
}

const instance = (j: IJodit): Table => j.getInstance<Table>('Table', j.o);
