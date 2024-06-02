/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/table/README.md]]
 * @packageDocumentation
 * @module modules/table
 */

import type { ICreate, IDictionary, IJodit, Prettify } from 'jodit/types';
import { ViewComponent } from 'jodit/core/component';
import * as consts from 'jodit/core/constants';
import { debounce } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import { getContainer } from 'jodit/core/global';
import {
	$$,
	attr,
	cssPath,
	isNumber,
	toArray,
	trim
} from 'jodit/core/helpers/';

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

	private static __selectedByTable: WeakMap<
		HTMLTableElement,
		Set<HTMLTableCellElement>
	> = new WeakMap();

	@debounce()
	private __recalculateStyles(): void {
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
		this.__recalculateStyles();

		const table = Dom.closest(td, 'table', this.j.editor);

		if (table) {
			const cells = Table.__selectedByTable.get(table) || new Set();
			cells.add(td);
			Table.__selectedByTable.set(table, cells);
		}
	}

	removeSelection(td: HTMLTableCellElement): void {
		this.selected.delete(td);

		this.__recalculateStyles();

		const table = Dom.closest(td, 'table', this.j.editor);

		if (table) {
			const cells = Table.__selectedByTable.get(table);

			if (cells) {
				cells.delete(td);

				if (!cells.size) {
					Table.__selectedByTable.delete(table);
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

	private static __getSelectedCellsByTable(
		table: HTMLTableElement
	): HTMLTableCellElement[] {
		const cells = Table.__selectedByTable.get(table);
		return cells ? toArray(cells) : [];
	}

	/** @override **/
	override destruct(): any {
		this.selected.clear();
		return super.destruct();
	}

	private static __getRowsCount(table: HTMLTableElement): number {
		return table.rows.length;
	}

	/**
	 * Returns rows count in the table
	 */
	getRowsCount(table: HTMLTableElement): number {
		return Table.__getRowsCount(table);
	}

	private static __getColumnsCount(table: HTMLTableElement): number {
		const matrix = Table.__formalMatrix(table);

		return matrix.reduce(
			(max_count, cells) => Math.max(max_count, cells.length),
			0
		);
	}

	/**
	 * Returns columns count in the table
	 */
	getColumnsCount(table: HTMLTableElement): number {
		return Table.__getColumnsCount(table);
	}

	private static __formalMatrix(
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
	 * Generate formal table martix columns*rows
	 * @param table - Working table
	 * @param callback - if return false cycle break
	 */
	formalMatrix(
		table: HTMLTableElement,
		callback?: (
			cell: HTMLTableCellElement,
			row: number,
			col: number,
			colSpan: number,
			rowSpan: number
		) => false | void
	): HTMLTableCellElement[][] {
		return Table.__formalMatrix(table, callback);
	}

	private static __formalCoordinate(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		max = false
	): number[] {
		let i: number = 0,
			j: number = 0,
			width: number = 1,
			height: number = 1;

		Table.__formalMatrix(
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
	 * Get cell coordinate in formal table (without colspan and rowspan)
	 */
	formalCoordinate(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		max = false
	): number[] {
		return Table.__formalCoordinate(table, cell, max);
	}

	private static __appendRow(
		table: HTMLTableElement,
		line: false | HTMLTableRowElement,
		after: boolean,
		create: Prettify<Pick<ICreate, 'element'>>
	): void {
		let row: HTMLTableRowElement;

		if (!line) {
			const columnsCount = Table.__getColumnsCount(table);

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
	 * Inserts a new line after row what contains the selected cell
	 *
	 * @param table - Working table
	 * @param line - Insert a new line after/before this
	 * line contains the selected cell
	 * @param after - Insert a new line after line contains the selected cell
	 */
	appendRow(
		table: HTMLTableElement,
		line: false | HTMLTableRowElement,
		after: boolean
	): void {
		return Table.__appendRow(table, line, after, this.j.createInside);
	}

	private static __removeRow(
		table: HTMLTableElement,
		rowIndex: number
	): void {
		const box = Table.__formalMatrix(table);

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
	 * Remove row
	 */
	removeRow(table: HTMLTableElement, rowIndex: number): void {
		return Table.__removeRow(table, rowIndex);
	}

	/**
	 * Insert column before / after all the columns containing the selected cells
	 */
	appendColumn(
		table: HTMLTableElement,
		selectedCell: HTMLTableCellElement,
		insertAfter: boolean = true
	): void {
		const box = Table.__formalMatrix(table);

		if (!insertAfter && Dom.isCell(selectedCell.previousElementSibling)) {
			return this.appendColumn(
				table,
				selectedCell.previousElementSibling as HTMLTableCellElement,
				true
			);
		}

		const columnIndex = insertAfter
			? selectedCell.cellIndex + ((selectedCell.colSpan || 1) - 1)
			: selectedCell.cellIndex;

		const newColumnIndex = insertAfter ? columnIndex + 1 : columnIndex;

		for (let i = 0; i < box.length; ) {
			const cells = box[i];

			if (
				cells[columnIndex] !== cells[newColumnIndex] ||
				columnIndex === newColumnIndex
			) {
				const cell = this.j.createInside.element('td');
				if (insertAfter) {
					Dom.after(cells[columnIndex], cell);
				} else {
					Dom.before(cells[columnIndex], cell);
				}

				if (cells[columnIndex].rowSpan > 1) {
					cell.rowSpan = cells[columnIndex].rowSpan;
				}
			} else {
				cells[columnIndex].colSpan += 1;
			}

			i += cells[columnIndex].rowSpan || 1;
		}
	}

	private static __removeColumn(table: HTMLTableElement, j: number): void {
		const box = Table.__formalMatrix(table);

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
	 * Remove column by index
	 */
	removeColumn(table: HTMLTableElement, j: number): void {
		return Table.__removeColumn(table, j);
	}

	private static __getSelectedBound(
		table: HTMLTableElement,
		selectedCells: HTMLTableCellElement[]
	): number[][] {
		const bound = [
			[Infinity, Infinity],
			[0, 0]
		];

		const box = Table.__formalMatrix(table);
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
	 * Define bound for selected cells
	 */
	getSelectedBound(
		table: HTMLTableElement,
		selectedCells: HTMLTableCellElement[]
	): number[][] {
		return Table.__getSelectedBound(table, selectedCells);
	}

	private static __normalizeTable(table: HTMLTableElement): void {
		const __marked: HTMLTableCellElement[] = [],
			box = Table.__formalMatrix(table);

		Table.__removeExtraColspans(box, __marked);
		Table.__removeExtraRowspans(box, __marked);

		// remove rowspans and colspans equal 1 and empty class
		for (let i = 0; i < box.length; i += 1) {
			for (let j = 0; j < box[i].length; j += 1) {
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

		Table.__unmark(__marked);
	}

	private static __removeExtraColspans(
		box: HTMLTableCellElement[][],
		__marked: HTMLTableCellElement[]
	): void {
		for (let j = 0; j < box[0].length; j += 1) {
			let min = 1000000;
			let not = false;

			for (let i = 0; i < box.length; i += 1) {
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
				for (let i = 0; i < box.length; i += 1) {
					if (box[i][j] === undefined) {
						continue; // broken table
					}

					Table.__mark(
						box[i][j],
						'colspan',
						box[i][j].colSpan - min + 1,
						__marked
					);
				}
			}
		}
	}

	private static __removeExtraRowspans(
		box: HTMLTableCellElement[][],
		marked: HTMLTableCellElement[]
	): void {
		let i: number = 0;
		let j: number = 0;

		for (i = 0; i < box.length; i += 1) {
			let min = 1000000;
			let not = false;

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

					Table.__mark(
						box[i][j],
						'rowspan',
						box[i][j].rowSpan - min + 1,
						marked
					);
				}
			}
		}
	}

	/**
	 * Try recalculate all coluns and rows after change
	 */
	normalizeTable(table: HTMLTableElement): void {
		return Table.__normalizeTable(table);
	}

	private static __mergeSelected(
		table: HTMLTableElement,
		jodit: IJodit
	): void {
		const html: string[] = [],
			bound = Table.__getSelectedBound(
				table,
				Table.__getSelectedCellsByTable(table)
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
			Table.__formalMatrix(
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
								Table.__mark(td, 'remove', 1, __marked);

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
					Table.__mark(first, 'colspan', cols, __marked);
				}
				if (rows > 1) {
					Table.__mark(first, 'rowspan', rows, __marked);
				}

				if (w) {
					Table.__mark(
						first,
						'width',
						((w / table.offsetWidth) * 100).toFixed(
							consts.ACCURACY
						) + '%',
						__marked
					);

					if (first_j) {
						Table.__setColumnWidthByDelta(
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

				Table.__unmark(__marked);

				Table.__normalizeTable(table);

				toArray(table.rows).forEach(tr => {
					if (!tr.cells.length) {
						Dom.safeRemove(tr);
					}
				});
			}
		}
	}

	/**
	 * It combines all the selected cells into one. The contents of the cells will also be combined
	 */
	mergeSelected(table: HTMLTableElement): void {
		return Table.__mergeSelected(table, this.j);
	}

	private static __splitHorizontal(
		table: HTMLTableElement,
		jodit: IJodit
	): void {
		let coord: number[],
			td: HTMLTableCellElement,
			tr: HTMLTableRowElement,
			parent: HTMLTableRowElement,
			after: HTMLTableCellElement;

		const __marked: HTMLTableCellElement[] = [];

		Table.__getSelectedCellsByTable(table).forEach(
			(cell: HTMLTableCellElement) => {
				td = jodit.createInside.element('td');
				td.appendChild(jodit.createInside.element('br'));
				tr = jodit.createInside.element('tr');

				coord = Table.__formalCoordinate(table, cell);

				if (cell.rowSpan < 2) {
					Table.__formalMatrix(table, (tdElm, i, j) => {
						if (
							coord[0] === i &&
							coord[1] !== j &&
							tdElm !== cell
						) {
							Table.__mark(
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
					Table.__mark(cell, 'rowspan', cell.rowSpan - 1, __marked);

					Table.__formalMatrix(
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
					Table.__mark(td, 'colspan', cell.colSpan, __marked);
				}

				Table.__unmark(__marked);
				instance(jodit).removeSelection(cell);
			}
		);

		this.__normalizeTable(table);
	}

	/**
	 * Divides all selected by `jodit_focused_cell` class table cell in 2 parts vertical. Those division into 2 columns
	 */
	splitHorizontal(table: HTMLTableElement): void {
		return Table.__splitHorizontal(table, this.j);
	}

	private static __splitVertical(
		table: HTMLTableElement,
		jodit: IJodit
	): void {
		let coord: number[], td: HTMLTableCellElement, percentage: number;

		const __marked: HTMLTableCellElement[] = [];

		Table.__getSelectedCellsByTable(table).forEach(cell => {
			coord = Table.__formalCoordinate(table, cell);

			if (cell.colSpan < 2) {
				Table.__formalMatrix(table, (tdElm, i, j) => {
					if (coord[1] === j && coord[0] !== i && tdElm !== cell) {
						Table.__mark(
							tdElm,
							'colspan',
							tdElm.colSpan + 1,
							__marked
						);
					}
				});
			} else {
				Table.__mark(cell, 'colspan', cell.colSpan - 1, __marked);
			}

			td = jodit.createInside.element('td');
			td.appendChild(jodit.createInside.element('br'));

			if (cell.rowSpan > 1) {
				Table.__mark(td, 'rowspan', cell.rowSpan, __marked);
			}

			const oldWidth = cell.offsetWidth; // get old width

			Dom.after(cell, td);

			percentage = oldWidth / table.offsetWidth / 2;

			Table.__mark(
				cell,
				'width',
				(percentage * 100).toFixed(consts.ACCURACY) + '%',
				__marked
			);

			Table.__mark(
				td,
				'width',
				(percentage * 100).toFixed(consts.ACCURACY) + '%',
				__marked
			);

			Table.__unmark(__marked);

			instance(jodit).removeSelection(cell);
		});

		Table.__normalizeTable(table);
	}

	/**
	 * It splits all the selected cells into 2 parts horizontally. Those. are added new row
	 */
	splitVertical(table: HTMLTableElement): void {
		return Table.__splitVertical(table, this.j);
	}

	private static __setColumnWidthByDelta(
		table: HTMLTableElement,
		column: number,
		delta: number,
		noUnmark: boolean,
		marked: HTMLTableCellElement[]
	): void {
		const box = Table.__formalMatrix(table);

		let clearWidthIndex = 0;
		for (let i = 0; i < box.length; i += 1) {
			const cell = box[i][column];

			if (cell.colSpan > 1 && box.length > 1) {
				continue;
			}

			const w = cell.offsetWidth;
			const percent = ((w + delta) / table.offsetWidth) * 100;

			Table.__mark(
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

			Table.__mark(cell, 'width', null, marked);
		}

		if (!noUnmark) {
			Table.__unmark(marked);
		}
	}

	/**
	 * Set column width used delta value
	 */
	setColumnWidthByDelta(
		table: HTMLTableElement,
		column: number,
		delta: number,
		noUnmark: boolean,
		marked: HTMLTableCellElement[]
	): void {
		return Table.__setColumnWidthByDelta(
			table,
			column,
			delta,
			noUnmark,
			marked
		);
	}

	private static __mark(
		cell: HTMLTableCellElement,
		key: string,
		value: string | number | null,
		marked: HTMLTableCellElement[]
	): void {
		marked.push(cell);

		const dict = markedValue.get(cell) ?? {};
		dict[key] = value === undefined ? 1 : value;
		markedValue.set(cell, dict);
	}

	private static __unmark(marked: HTMLTableCellElement[]): void {
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
