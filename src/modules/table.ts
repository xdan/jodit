/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Module for working with tables . Delete, insert , merger, division of cells , rows and columns.
 * When creating elements such as <table> for each of them
 * creates a new instance Jodit.modules.TableProcessor and it can be accessed via $('table').data('table-processor')
 *
 * @module Table
 * @param {Object} parent Jodit main object
 * @param {HTMLTableElement} table Table for which to create a module
 */

import type { ICreate, IJodit } from '../types';
import * as consts from '../core/constants';
import { Dom } from '../core/dom';
import { $$, attr, cssPath, each, toArray, trim } from '../core/helpers/';
import { ViewComponent } from '../core/component';
import { getContainer } from '../core/global';
import { debounce } from '../core/decorators';

declare module '../config' {
	interface Config {
		table: {
			allowCellSelection: boolean;
			selectionCellStyle: string;

			allowCellResize: boolean;
			useExtraClassesOptions: boolean;
		};
	}
}

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
	destruct(): any {
		this.selected.clear();
		return super.destruct();
	}

	/**
	 * Returns rows count in the table
	 * @param table
	 */
	static getRowsCount(table: HTMLTableElement): number {
		return table.rows.length;
	}

	/**
	 * Returns columns count in the table
	 * @param table
	 */
	static getColumnsCount(table: HTMLTableElement): number {
		const matrix = Table.formalMatrix(table);
		return matrix.reduce((max_count, cells) => {
			return Math.max(max_count, cells.length);
		}, 0);
	}

	/**
	 * Generate formal table martix columns*rows
	 *
	 * @param {HTMLTableElement} table
	 * @param {function(HTMLTableCellElement, int, int, int, int):boolean} [callback] if return false cycle break
	 * @return {Array}
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
	 *
	 * @param table
	 * @param cell
	 * @param max
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
	 * @param {HTMLTableElement} table
	 * @param {Boolean|HTMLTableRowElement} [line=false] Insert a new line after/before this
	 * line contains the selected cell
	 * @param {Boolean} [after=true] Insert a new line after line contains the selected cell
	 */
	static appendRow(
		table: HTMLTableElement,
		line: false | HTMLTableRowElement,
		after: boolean,
		create: ICreate
	): void {
		let row: HTMLTableRowElement;

		if (!line) {
			const columnsCount: number = Table.getColumnsCount(table);

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
			($$(':scope>tbody', table)[0] || table).appendChild(row);
		}
	}

	/**
	 * Remove row
	 *
	 * @param {HTMLTableElement} table
	 * @param {int} rowIndex
	 */
	static removeRow(table: HTMLTableElement, rowIndex: number): void {
		const box = Table.formalMatrix(table);
		let dec: boolean;
		const row = table.rows[rowIndex];

		each<HTMLTableCellElement>(
			box[rowIndex],
			(j: number, cell: HTMLTableCellElement) => {
				dec = false;
				if (rowIndex - 1 >= 0 && box[rowIndex - 1][j] === cell) {
					dec = true;
				} else if (box[rowIndex + 1] && box[rowIndex + 1][j] === cell) {
					if (
						cell.parentNode === row &&
						cell.parentNode.nextSibling
					) {
						dec = true;
						let nextCell = j + 1;
						while (box[rowIndex + 1][nextCell] === cell) {
							nextCell += 1;
						}

						const nextRow: HTMLTableRowElement = Dom.next(
							cell.parentNode,
							(elm: Node | null) => Dom.isTag(elm, 'tr'),
							table
						) as HTMLTableRowElement;

						if (box[rowIndex + 1][nextCell]) {
							nextRow.insertBefore(
								cell,
								box[rowIndex + 1][nextCell]
							);
						} else {
							nextRow.appendChild(cell);
						}
					}
				} else {
					Dom.safeRemove(cell);
				}
				if (
					dec &&
					(cell.parentNode === row || cell !== box[rowIndex][j - 1])
				) {
					const rowSpan: number = cell.rowSpan;

					attr(
						cell,
						'rowspan',
						rowSpan - 1 > 1 ? (rowSpan - 1).toString() : null
					);
				}
			}
		);

		Dom.safeRemove(row);
	}

	/**
	 * Insert column before / after all the columns containing the selected cells
	 *
	 * @param table
	 * @param j
	 * @param after
	 * @param create
	 */
	static appendColumn(
		table: HTMLTableElement,
		j: number,
		after: boolean,
		create: ICreate
	): void {
		const box: HTMLTableCellElement[][] = Table.formalMatrix(table);
		let i: number;

		if (j === undefined || j < 0) {
			j = Table.getColumnsCount(table) - 1;
		}

		for (i = 0; i < box.length; i += 1) {
			const cell = create.element('td');
			const td: HTMLTableCellElement = box[i][j];
			let added: boolean = false;
			if (after) {
				if (
					(box[i] && td && j + 1 >= box[i].length) ||
					td !== box[i][j + 1]
				) {
					if (td.nextSibling) {
						td.parentNode &&
							td.parentNode.insertBefore(cell, td.nextSibling);
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
					td.parentNode &&
						td.parentNode.insertBefore(cell, box[i][j]);
					added = true;
				}
			}
			if (!added) {
				box[i][j].setAttribute(
					'colspan',
					(
						parseInt(attr(box[i][j], 'colspan') || '1', 10) + 1
					).toString()
				);
			}
		}
	}

	/**
	 * Remove column by index
	 *
	 * @param {HTMLTableElement} table
	 * @param {int} [j]
	 */
	static removeColumn(table: HTMLTableElement, j: number): void {
		const box: HTMLTableCellElement[][] = Table.formalMatrix(table);

		let dec: boolean;
		each(box, (i: number, cells: HTMLTableCellElement[]) => {
			const td: HTMLTableCellElement = cells[j];
			dec = false;
			if (j - 1 >= 0 && box[i][j - 1] === td) {
				dec = true;
			} else if (j + 1 < cells.length && box[i][j + 1] === td) {
				dec = true;
			} else {
				Dom.safeRemove(td);
			}
			if (dec && (i - 1 < 0 || td !== box[i - 1][j])) {
				const colSpan: number = td.colSpan;

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
	 *
	 * @param {HTMLTableElement} table
	 * @param {Array.<HTMLTableCellElement>} selectedCells
	 * @return {number[][]}
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
	 * @param {HTMLTableElement} table
	 */
	static normalizeTable(table: HTMLTableElement): void {
		let i: number, j: number, min: number, not: boolean;

		const __marked: HTMLTableCellElement[] = [],
			box: HTMLTableCellElement[][] = Table.formalMatrix(table);

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
					Table.__mark(
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

					Table.__mark(
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
					box[i][j].removeAttribute('rowspan');
				}

				if (
					box[i][j].hasAttribute('colspan') &&
					box[i][j].colSpan === 1
				) {
					box[i][j].removeAttribute('colspan');
				}

				if (
					box[i][j].hasAttribute('class') &&
					!attr(box[i][j], 'class')
				) {
					box[i][j].removeAttribute('class');
				}
			}
		}

		Table.__unmark(__marked);
	}

	/**
	 * It combines all of the selected cells into one. The contents of the cells will also be combined
	 * @param table
	 */
	static mergeSelected(table: HTMLTableElement, jodit: IJodit): void {
		const html: string[] = [],
			bound: number[][] = Table.getSelectedBound(
				table,
				Table.getSelectedCellsByTable(table)
			);

		let w: number = 0,
			first: HTMLTableCellElement | null = null,
			first_j: number = 0,
			td: HTMLTableCellElement,
			cols: number = 0,
			rows: number = 0;

		const __marked: HTMLTableCellElement[] = [];

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

							if ((td as any).__i_am_already_was) {
								return;
							}

							(td as any).__i_am_already_was = true;

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

				delete (first as any).__i_am_already_was;

				Table.__unmark(__marked);

				Table.normalizeTable(table);

				each(toArray(table.rows), (index, tr) => {
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
					Table.__mark(td, 'colspan', cell.colSpan, __marked);
				}

				Table.__unmark(__marked);
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

		Table.getSelectedCellsByTable(table).forEach(
			(cell: HTMLTableCellElement) => {
				coord = Table.formalCoordinate(table, cell);
				if (cell.colSpan < 2) {
					Table.formalMatrix(table, (tdElm, i, j) => {
						if (
							coord[1] === j &&
							coord[0] !== i &&
							tdElm !== cell
						) {
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
			}
		);

		Table.normalizeTable(table);
	}

	/**
	 * Set column width used delta value
	 *
	 * @param {HTMLTableElement} table
	 * @param {int} j column
	 * @param {int} delta
	 * @param {boolean} noUnmark
	 * @param {HTMLTableCellElement[]} marked
	 */
	static setColumnWidthByDelta(
		table: HTMLTableElement,
		j: number,
		delta: number,
		noUnmark: boolean,
		marked: HTMLTableCellElement[]
	): void {
		const box = Table.formalMatrix(table);
		let i: number, w: number, percent: number;

		for (i = 0; i < box.length; i += 1) {
			w = box[i][j].offsetWidth;
			percent = ((w + delta) / table.offsetWidth) * 100;
			Table.__mark(
				box[i][j],
				'width',
				percent.toFixed(consts.ACCURACY) + '%',
				marked
			);
		}

		if (!noUnmark) {
			Table.__unmark(marked);
		}
	}

	/**
	 *
	 * @param {HTMLTableCellElement} cell
	 * @param {string} key
	 * @param {string} value
	 * @param {HTMLTableCellElement[]} marked
	 * @private
	 */
	private static __mark(
		cell: HTMLTableCellElement,
		key: string,
		value: string | number,
		marked: HTMLTableCellElement[]
	) {
		marked.push(cell);
		if (!(cell as any).__marked_value) {
			(cell as any).__marked_value = {};
		}
		(cell as any).__marked_value[key] = value === undefined ? 1 : value;
	}

	private static __unmark(marked: HTMLTableCellElement[]) {
		marked.forEach(cell => {
			if ((cell as any).__marked_value) {
				each(
					(cell as any).__marked_value,
					(key: string, value: number) => {
						switch (key) {
							case 'remove':
								Dom.safeRemove(cell);
								break;
							case 'rowspan':
								if (value > 1) {
									cell.setAttribute(
										'rowspan',
										value.toString()
									);
								} else {
									cell.removeAttribute('rowspan');
								}
								break;
							case 'colspan':
								if (value > 1) {
									cell.setAttribute(
										'colspan',
										value.toString()
									);
								} else {
									cell.removeAttribute('colspan');
								}
								break;
							case 'width':
								cell.style.width = value.toString();
								break;
						}
						delete (cell as any).__marked_value[key];
					}
				);
				delete (cell as any).__marked_value;
			}
		});
	}
}

const instance = (j: IJodit): Table => j.getInstance<Table>('Table', j.o);
