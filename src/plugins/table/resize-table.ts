/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './table.less';

import autobind from 'autobind-decorator';

import { Config } from '../../config';
import * as consts from '../../core/constants';
import { Plugin, Dom, Table } from '../../modules';
import {
	$$,
	attr,
	call,
	getContentWidth,
	offset,
	scrollIntoView
} from '../../core/helpers';
import { IBound, IDictionary, IControlType, IJodit } from '../../types';

declare module '../../config' {
	interface Config {
		/**
		 * Use module {@link ResizeTable|ResizeTable}
		 */
		useTableProcessor: boolean;
		useExtraClassesOptions: boolean;
	}
}

Config.prototype.useTableProcessor = true;
Config.prototype.useExtraClassesOptions = true;

Config.prototype.controls.table = {
	data: {
		cols: 10,
		rows: 10,
		classList: {
			'table table-bordered': 'Bootstrap Bordered',
			'table table-striped': 'Bootstrap Striped',
			'table table-dark': 'Bootstrap Dark'
		}
	},
	popup: (editor: IJodit, current, control, close, button) => {
		const default_rows_count: number =
				control.data && control.data.rows ? control.data.rows : 10,
			default_cols_count: number =
				control.data && control.data.cols ? control.data.cols : 10;

		const generateExtraClasses = (): string => {
			if (!editor.o.useExtraClassesOptions) {
				return '';
			}

			const out: string[] = [];

			if (control.data) {
				const classList: IDictionary<string> = control.data.classList;

				Object.keys(classList).forEach((classes: string) => {
					out.push(
						`<label class="jodit_vertical_middle"><input class="jodit-checkbox" value="${classes}" type="checkbox"/>${classList[classes]}</label>`
					);
				});
			}
			return out.join('');
		};

		const form: HTMLFormElement = editor.c.fromHTML(
				'<form class="jodit-form jodit-form__inserter">' +
					'<label class="jodit-form__center">' +
					'<span>1</span> &times; <span>1</span>' +
					'</label>' +
					'<div class="jodit-form__table-creator-box">' +
					'<div class="jodit-form__container"></div>' +
					'<div class="jodit-form__options">' +
					generateExtraClasses() +
					'</div>' +
					'</div>' +
					'</form>'
			) as HTMLFormElement,
			rows: HTMLSpanElement = form.querySelectorAll('span')[0],
			cols: HTMLSpanElement = form.querySelectorAll('span')[1],
			blocksContainer = form.querySelector(
				'.jodit-form__container'
			) as HTMLDivElement,
			options = form.querySelector(
				'.jodit-form__options'
			) as HTMLDivElement,
			cells: HTMLElement[] = [];

		const cnt = default_rows_count * default_cols_count;

		for (let i = 0; i < cnt; i += 1) {
			if (!cells[i]) {
				cells.push(
					editor.c.element('span', {
						dataIndex: i
					})
				);
			}
		}

		const mouseenter = (e: MouseEvent, index?: number): void => {
			const dv = e.target;

			if (!Dom.isTag(dv, 'span')) {
				return;
			}

			let k =
				index === undefined || isNaN(index)
					? parseInt(attr(dv, '-index') || '0', 10)
					: index || 0;

			const rows_count = Math.ceil((k + 1) / default_cols_count),
				cols_count = (k % default_cols_count) + 1;

			for (let i = 0; i < cells.length; i += 1) {
				if (
					cols_count >= (i % default_cols_count) + 1 &&
					rows_count >= Math.ceil((i + 1) / default_cols_count)
				) {
					cells[i].className = 'jodit_hovered';
				} else {
					cells[i].className = '';
				}
			}

			cols.textContent = cols_count.toString();
			rows.textContent = rows_count.toString();
		};

		editor.e
			.on(blocksContainer, 'mousemove', mouseenter)
			.on(blocksContainer, 'touchstart mousedown', (e: MouseEvent) => {
				const dv = e.target;

				e.preventDefault();
				e.stopImmediatePropagation();

				if (!Dom.isTag(dv, 'span')) {
					return;
				}

				let k = parseInt(attr(dv, '-index') || '0', 10);

				const rows_count = Math.ceil((k + 1) / default_cols_count),
					cols_count = (k % default_cols_count) + 1;

				const crt = editor.createInside,
					tbody = crt.element('tbody'),
					table = crt.element('table');

				table.appendChild(tbody);

				table.style.width = '100%';

				let first_td: HTMLTableCellElement | null = null,
					tr: HTMLTableRowElement,
					td: HTMLTableCellElement;

				for (let i = 1; i <= rows_count; i += 1) {
					tr = crt.element('tr');

					for (let j = 1; j <= cols_count; j += 1) {
						td = crt.element('td');

						if (!first_td) {
							first_td = td;
						}

						td.appendChild(crt.element('br'));
						tr.appendChild(crt.text('\n'));
						tr.appendChild(crt.text('\t'));
						tr.appendChild(td);
					}

					tbody.appendChild(crt.text('\n'));
					tbody.appendChild(tr);
				}

				const crnt = editor.selection.current();

				if (crnt && editor.selection.isCollapsed()) {
					const block: HTMLElement | false = Dom.closest(
						crnt,
						node => Dom.isBlock(node, editor.editorWindow),
						editor.editor
					) as HTMLElement | false;

					if (
						block &&
						block !== editor.editor &&
						!block.nodeName.match(
							/^TD|TH|TBODY|TABLE|THEADER|TFOOTER$/
						)
					) {
						editor.selection.setCursorAfter(block);
					}
				}

				$$('input[type=checkbox]:checked', options).forEach(
					(input: HTMLElement) => {
						(input as HTMLInputElement).value
							.split(/[\s]+/)
							.forEach((className: string) => {
								table.classList.add(className);
							});
					}
				);

				editor.selection.insertNode(crt.text('\n'));
				editor.selection.insertNode(table, false);

				if (first_td) {
					editor.selection.setCursorIn(first_td);
					scrollIntoView(
						first_td,
						editor.editor,
						editor.editorDocument
					);
				}

				close();
			});

		if (button && button.parentElement) {
			for (let i = 0; i < default_rows_count; i += 1) {
				const row = editor.c.div();

				for (let j = 0; j < default_cols_count; j += 1) {
					row.appendChild(cells[i * default_cols_count + j]);
				}

				blocksContainer.appendChild(row);
			}

			if (cells[0]) {
				cells[0].className = 'hovered';
			}
		}

		return form;
	},
	tooltip: 'Insert table'
} as IControlType;

/**
 * Process tables in editor
 */
export class ResizeTable extends Plugin {
	/**
	 * Now editor has rtl direction
	 */
	private get isRTL(): boolean {
		return this.j.o.direction === 'rtl';
	}

	private selectMode: boolean = false;

	private resizeDelta: number = 0;
	private resizeHandler!: HTMLElement;

	private showResizeHandle() {
		this.j.async.clearTimeout(this.hideTimeout);
		this.j.workplace.appendChild(this.resizeHandler);
	}

	private hideResizeHandle() {
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

	private createResizeHandle = () => {
		if (!this.resizeHandler) {
			this.resizeHandler = this.j.c.div('jodit-table-resizer');

			this.j.e
				.on(
					this.resizeHandler,
					'mousedown.table touchstart.table',
					this.onHandleMouseDown.bind(this)
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

	private onHandleMouseDown(event: MouseEvent) {
		this.drag = true;

		this.j.e.on(
			this.j.editorWindow,
			'mousemove.table touchmove.table',
			this.onMouseMove
		);

		this.startX = event.clientX;

		this.j.lock(this.key);
		this.resizeHandler.classList.add('jodit-table-resizer-moved');

		let box: ClientRect,
			tableBox = this.workTable.getBoundingClientRect();

		this.minX = 0;
		this.maxX = 1000000;

		if (this.wholeTable !== null) {
			tableBox = (this.workTable
				.parentNode as HTMLElement).getBoundingClientRect();

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

	@autobind
	private onMouseMove(event: MouseEvent) {
		if (!this.drag) {
			return;
		}

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

		const sel = this.j.selection.sel;

		sel && sel.removeAllRanges();

		if (event.preventDefault) {
			event.preventDefault();
		}
	}

	private onMouseUp = () => {
		if (this.selectMode || this.drag) {
			this.selectMode = false;
			this.j.unlock();
		}

		if (!this.resizeHandler || !this.drag) {
			return;
		}

		this.drag = false;

		this.j.e.off(
			this.j.editorWindow,
			'mousemove.table touchmove.table',
			this.onMouseMove
		);

		this.resizeHandler.classList.remove('jodit-table-resizer-moved');

		// resize column
		if (this.wholeTable === null) {
			this.resizeColumns();
		} else {
			this.resizeTable();
		}

		this.j.setEditorValue();
		this.j.selection.focus();
	};

	private resizeColumns() {
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
			elm => Dom.isCell(elm, this.j.editorWindow),
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

	private resizeTable() {
		const delta = this.resizeDelta * (this.isRTL ? -1 : 1);

		const width = this.workTable.offsetWidth,
			parentWidth = getContentWidth(
				this.workTable.parentNode as HTMLElement,
				this.j.editorWindow
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
				this.j.editorWindow.getComputedStyle(this.workTable)[side] ||
					'0',
				10
			);

			this.workTable.style.width =
				((width - delta) / parentWidth) * 100 + '%';

			this.workTable.style[side] =
				((margin + delta) / parentWidth) * 100 + '%';
		}
	}

	/**
	 *
	 * @param {HTMLTableCellElement} cell
	 * @param {boolean|null} [wholeTable=null] true - resize whole table by left side,
	 * false - resize whole table by right side, null - resize column
	 * @private
	 */
	private setWorkCell(
		cell: HTMLTableCellElement,
		wholeTable: boolean | null = null
	) {
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
	 *
	 * @param {HTMLTableElement} table
	 * @param {HTMLTableCellElement} cell
	 * @param {int} [offsetX=0]
	 * @param {int} [delta=0]
	 *
	 * @private
	 */
	private calcHandlePosition(
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		offsetX: number = 0,
		delta: number = 0
	) {
		const box = offset(cell, this.j, this.j.editorDocument);

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
			parentBox: IBound = offset(table, this.j, this.j.editorDocument);

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
				elm => Dom.isCell(elm, this.j.editorWindow),
				cell.parentNode as HTMLElement
			) as HTMLTableCellElement;

			if (prevTD) {
				this.setWorkCell(prevTD);
			} else {
				this.setWorkCell(cell, true);
			}
		} else {
			const nextTD = call(
				!this.isRTL ? Dom.next : Dom.prev,
				cell,
				elm => Dom.isCell(elm, this.j.editorWindow),
				cell.parentNode as HTMLElement
			);

			this.setWorkCell(cell, !nextTD ? false : null);
		}
	}

	private key: string = 'table_processor_observer';

	/**
	 *
	 * @param {Jodit} editor
	 */
	afterInit(editor: IJodit): void {
		if (!editor.o.useTableProcessor) {
			return;
		}

		editor.e
			.off(this.j.ow, '.table')
			.off('.table')
			.on('change.table afterCommand.table afterSetMode.table', () => {
				($$('table', editor.editor) as HTMLTableElement[]).forEach(
					(table: HTMLTableElement) => {
						if (!(table as any)[this.key]) {
							this.observe(table);
						}
					}
				);
			})
			.on(this.j.ow, 'mouseup.table touchend.table', this.onMouseUp)
			.on(this.j.ow, 'scroll.table', () => {
				if (this.drag) {
					const parent = Dom.up(
						this.workCell,
						(elm: Node | null) => Dom.isTag(elm, 'table'),
						editor.editor
					) as HTMLElement;

					if (parent) {
						const parentBox = parent.getBoundingClientRect();
						this.resizeHandler.style.top = parentBox.top + 'px';
					}
				}
			})
			.on('beforeSetMode.table', () => {
				Table.getAllSelectedCells(editor.editor).forEach(td => {
					Table.restoreSelection(td);
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

	private observe(table: HTMLTableElement) {
		(table as any)[this.key] = true;

		this.j.e
			.on(table, 'mouseleave.table', (e: MouseEvent) => {
				if (
					this.resizeHandler &&
					this.resizeHandler !== e.relatedTarget
				) {
					this.hideResizeHandle();
				}
			})
			.on(
				table,
				'mousemove.table touchmove.table',
				(event: MouseEvent) => {
					const cell = Dom.up(
						event.target as HTMLElement,
						elm => Dom.isCell(elm, this.j.editorWindow),
						table
					) as HTMLTableCellElement;

					if (!cell) {
						return;
					}

					this.calcHandlePosition(table, cell, event.offsetX);
				}
			);

		this.createResizeHandle();
	}

	beforeDestruct(jodit: IJodit): void {
		if (jodit.events) {
			jodit.e.off(this.j.ow, '.table');
			jodit.e.off('.table');
		}
	}
}
