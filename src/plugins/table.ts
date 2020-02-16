/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';
import { Table } from '../modules/Table';
import {
	$$,
	call,
	getContentWidth,
	offset,
	scrollIntoView
} from '../modules/helpers/';
import { IControlType } from '../types/toolbar';
import { IBound, IDictionary } from '../types/types';
import { IJodit } from '../types';
import { alignElement } from './justify';

declare module '../Config' {
	interface Config {
		/**
		 * Use module {@link TableProcessor|TableProcessor}
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
			if (!editor.options.useExtraClassesOptions) {
				return '';
			}

			const out: string[] = [];

			if (control.data) {
				const classList: IDictionary<string> = control.data.classList;

				Object.keys(classList).forEach((classes: string) => {
					out.push(
						`<label class="jodit_vertical_middle"><input class="jodit_checkbox" value="${classes}" type="checkbox"/>${classList[classes]}</label>`
					);
				});
			}
			return out.join('');
		};

		const form: HTMLFormElement = editor.create.fromHTML(
				'<form class="jodit_form jodit_form_inserter">' +
					'<label class="jodit_form_center">' +
					'<span>1</span> &times; <span>1</span>' +
					'</label>' +
					'<div class="jodit_form-table-creator-box">' +
					'<div class="jodit_form-container"></div>' +
					'<div class="jodit_form-options">' +
					generateExtraClasses() +
					'</div>' +
					'</div>' +
					'</form>'
			) as HTMLFormElement,
			rows: HTMLSpanElement = form.querySelectorAll('span')[0],
			cols: HTMLSpanElement = form.querySelectorAll('span')[1],
			blocksContainer: HTMLDivElement = form.querySelector(
				'.jodit_form-container'
			) as HTMLDivElement,
			mainBox: HTMLDivElement = form.querySelector(
				'.jodit_form-table-creator-box'
			) as HTMLDivElement,
			options: HTMLDivElement = form.querySelector(
				'.jodit_form-options'
			) as HTMLDivElement,
			cells: HTMLDivElement[] = [];

		const generateRows = (need_rows: number) => {
			const cnt: number = need_rows * default_cols_count;

			if (cells.length > cnt) {
				for (let i = cnt; i < cells.length; i += 1) {
					Dom.safeRemove(cells[i]);
					delete cells[i];
				}
				cells.length = cnt;
			}

			for (let i = 0; i < cnt; i += 1) {
				if (!cells[i]) {
					const div = editor.create.div();

					div.setAttribute('data-index', i.toString());
					cells.push(div);
				}
			}

			cells.forEach((cell: HTMLDivElement) => {
				blocksContainer.appendChild(cell);
			});

			const width = (cells[0].offsetWidth || 18) * default_cols_count;

			blocksContainer.style.width = width + 'px';
			mainBox.style.width = width + options.offsetWidth + 1 + 'px';
		};

		const mouseenter = (e: MouseEvent, index?: number): void => {
			const dv = e.target;

			if (!Dom.isTag(dv, 'div')) {
				return;
			}

			let k =
				index === undefined || isNaN(index)
					? parseInt(dv.getAttribute('data-index') || '0', 10)
					: index || 0;

			const rows_count = Math.ceil((k + 1) / default_cols_count),
				cols_count = (k % default_cols_count) + 1;

			for (let i = 0; i < cells.length; i += 1) {
				if (
					cols_count >= (i % default_cols_count) + 1 &&
					rows_count >= Math.ceil((i + 1) / default_cols_count)
				) {
					cells[i].className = 'hovered';
				} else {
					cells[i].className = '';
				}
			}

			cols.textContent = cols_count.toString();
			rows.textContent = rows_count.toString();
		};

		blocksContainer.addEventListener('mousemove', mouseenter);

		editor.events.on(
			blocksContainer,
			'touchstart mousedown',
			(e: MouseEvent) => {
				const dv = e.target;

				e.preventDefault();
				e.stopImmediatePropagation();

				if (!Dom.isTag(dv, 'div')) {
					return;
				}

				let k = parseInt(dv.getAttribute('data-index') || '0', 10);

				const rows_count = Math.ceil((k + 1) / default_cols_count),
					cols_count = (k % default_cols_count) + 1;

				const crt = editor.create.inside,
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
			}
		);

		if (button && button.parentToolbar) {
			editor.events
				.off(
					button.parentToolbar.container as object,
					'afterOpenPopup.tableGenerator'
				)
				.on(
					button.parentToolbar.container as object,
					'afterOpenPopup.tableGenerator',
					() => {
						generateRows(default_rows_count);
						if (cells[0]) {
							cells[0].className = 'hovered';
						}
					},
					'',
					true
				);
		}

		return form;
	},
	tooltip: 'Insert table'
} as IControlType;

/**
 * Process tables in editor
 */
export class TableProcessor extends Plugin {
	private isCell = (tag: Node | null): tag is HTMLTableCellElement => {
		return (
			(Dom.isHTMLElement(tag, this.jodit.editorWindow) &&
				Dom.isTag(tag, 'td')) ||
			Dom.isTag(tag, 'th')
		);
	};

	/**
	 * Now editor has rtl direction
	 */
	private get isRTL(): boolean {
		return this.jodit.options.direction === 'rtl';
	}

	private key: string = 'table_processor_observer';

	private selectMode: boolean = false;

	private resizeDelta: number = 0;
	private resizeHandler!: HTMLElement;

	private showResizeHandle() {
		this.jodit.async.clearTimeout(this.hideTimeout);
		this.jodit.workplace.appendChild(this.resizeHandler);
	}

	private hideResizeHandle() {
		this.hideTimeout = this.jodit.async.setTimeout(
			() => {
				Dom.safeRemove(this.resizeHandler);
			},
			{
				timeout: this.jodit.defaultTimeout,
				label: 'hideResizer'
			}
		);
	}

	private createResizeHandle = () => {
		if (!this.resizeHandler) {
			this.resizeHandler = this.jodit.create.div('jodit_table_resizer');

			this.jodit.events
				.on(
					this.resizeHandler,
					'mousedown.table touchstart.table',
					this.onHandleMouseDown.bind(this)
				)
				.on(this.resizeHandler, 'mouseenter.table', () => {
					this.jodit.async.clearTimeout(this.hideTimeout);
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

		this.jodit.events.on(
			this.jodit.editorWindow,
			'mousemove.table touchmove.table',
			this.onMouseMove
		);

		this.startX = event.clientX;

		this.jodit.lock(this.key);
		this.resizeHandler.classList.add('jodit_table_resizer-moved');

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

	private onMouseMove = (event: MouseEvent) => {
		if (!this.drag) {
			return;
		}

		let x = event.clientX;

		const workplacePosition: IBound = offset(
			(this.resizeHandler.parentNode ||
				this.jodit.ownerDocument.documentElement) as HTMLElement,
			this.jodit,
			this.jodit.ownerDocument,
			true
		);

		if (x < this.minX) {
			x = this.minX;
		}

		if (x > this.maxX) {
			x = this.maxX;
		}

		this.resizeDelta =
			x -
			this.startX +
			(!this.jodit.options.iframe ? 0 : workplacePosition.left);

		this.resizeHandler.style.left =
			x - (this.jodit.options.iframe ? 0 : workplacePosition.left) + 'px';

		const sel = this.jodit.selection.sel;

		sel && sel.removeAllRanges();

		if (event.preventDefault) {
			event.preventDefault();
		}
	};

	private onMouseUp = () => {
		if (this.selectMode || this.drag) {
			this.selectMode = false;
			this.jodit.unlock();
		}

		if (!this.resizeHandler || !this.drag) {
			return;
		}

		this.drag = false;

		this.jodit.events.off(
			this.jodit.editorWindow,
			'mousemove.table touchmove.table',
			this.onMouseMove
		);

		this.resizeHandler.classList.remove('jodit_table_resizer-moved');

		// resize column
		if (this.wholeTable === null) {
			this.resizeColumns();
		} else {
			this.resizeTable();
		}

		this.jodit.setEditorValue();
		this.jodit.selection.focus();
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
			this.isCell,
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
				this.jodit.editorWindow
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
				this.jodit.editorWindow.getComputedStyle(this.workTable)[
					side
					] || '0',
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
			: Table.getAllSelectedCells(this.jodit.editor);

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
			this.jodit.editor
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
		const box = offset(cell, this.jodit, this.jodit.editorDocument);

		if (offsetX > consts.NEARBY && offsetX < box.width - consts.NEARBY) {
			this.hideResizeHandle();
			return;
		}

		const workplacePosition: IBound = offset(
				this.jodit.workplace,
				this.jodit,
				this.jodit.ownerDocument,
				true
			),
			parentBox: IBound = offset(
				table,
				this.jodit,
				this.jodit.editorDocument
			);

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
				this.isCell,
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
				this.isCell,
				cell.parentNode as HTMLElement
			);

			this.setWorkCell(cell, !nextTD ? false : null);
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
			const cells = Table.getAllSelectedCells(this.jodit.editor);
			if (cells.length) {
				const cell: HTMLTableCellElement | undefined = cells.shift();

				if (!cell) {
					return;
				}

				const table = Dom.closest(
					cell,
					'table',
					this.jodit.editor
				) as HTMLTableElement;

				switch (command) {
					case 'splitv':
						Table.splitVertical(table, this.jodit.create.inside);
						break;
					case 'splitg':
						Table.splitHorizontal(table, this.jodit.create.inside);
						break;
					case 'merge':
						Table.mergeSelected(table);
						break;
					case 'empty':
						Table.getAllSelectedCells(this.jodit.editor).forEach(
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
							this.jodit.create.inside
						);
						break;
					case 'addrowafter':
					case 'addrowbefore':
						Table.appendRow(
							table,
							cell.parentNode as HTMLTableRowElement,
							command === 'addrowafter',
							this.jodit.create.inside
						);
						break;
				}
			}
			return false;
		}
	};

	/**
	 *
	 * @param {Jodit} editor
	 */
	afterInit(editor: IJodit): void {
		if (!editor.options.useTableProcessor) {
			return;
		}

		editor.events
			.off(this.jodit.ownerWindow, '.table')
			.off('.table')
			.on(
				this.jodit.ownerWindow,
				'mouseup.table touchend.table',
				this.onMouseUp
			)
			.on(this.jodit.ownerWindow, 'scroll.table', () => {
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
			.on(
				this.jodit.ownerWindow,
				'mousedown.table touchend.table',
				(event: MouseEvent) => {
					// need use event['originalEvent'] because of IE can not set target from
					// another window to current window
					const current_cell: HTMLTableCellElement = Dom.closest(
						(event as any).originalEvent.target as HTMLElement,
						'TD|TH',
						this.jodit.editor
					) as HTMLTableCellElement;

					let table: HTMLTableElement | null = null;

					if (this.isCell(current_cell)) {
						table = Dom.closest(
							current_cell,
							'table',
							this.jodit.editor
						) as HTMLTableElement;
					}

					if (table) {
						this.deSelectAll(
							table,
							current_cell instanceof
								(this.jodit.editorWindow as any)
									.HTMLTableCellElement
								? current_cell
								: false
						);
					} else {
						this.deSelectAll();
					}
				}
			)
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
				($$('table', editor.editor) as HTMLTableElement[]).forEach(
					(table: HTMLTableElement) => {
						if (!(table as any)[this.key]) {
							this.observe(table);
						}
					}
				);
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
			})
			.on('keydown.table', (event: KeyboardEvent) => {
				if (event.which === consts.KEY_TAB) {
					($$('table', editor.editor) as HTMLTableElement[]).forEach(
						(table: HTMLTableElement) => {
							this.deSelectAll(table);
						}
					);
				}
			})
			.on('beforeCommand.table', this.onExecCommand.bind(this))
			.on('afterCommand.table', this.onAfterCommand.bind(this));
	}

	private observe(table: HTMLTableElement) {
		(table as any)[this.key] = true;

		let start: HTMLTableCellElement;

		this.jodit.events
			.on(
				table,
				'mousedown.table touchstart.table',
				(event: MouseEvent) => {
					if (this.jodit.options.readonly) {
						return;
					}

					const cell = Dom.up(
						event.target as HTMLElement,
						this.isCell,
						table
					) as HTMLTableCellElement;

					if (cell) {
						if (!cell.firstChild) {
							cell.appendChild(
								this.jodit.create.inside.element('br')
							);
						}

						start = cell;
						Table.addSelected(cell);
						this.selectMode = true;
					}
				}
			)
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
					if (this.jodit.options.readonly) {
						return;
					}

					if (this.drag || this.jodit.isLockedNotBy(this.key)) {
						return;
					}

					const cell = Dom.up(
						event.target as HTMLElement,
						this.isCell,
						table
					) as HTMLTableCellElement;

					if (!cell) {
						return;
					}

					if (this.selectMode) {
						if (cell !== start) {
							this.jodit.lock(this.key);

							const sel = this.jodit.selection.sel;
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

						this.jodit.events.fire(
							'showPopup',
							table,
							(): IBound => {
								const minOffset: IBound = offset(
									min,
									this.jodit,
									this.jodit.editorDocument
								);
								const maxOffset: IBound = offset(
									max,
									this.jodit,
									this.jodit.editorDocument
								);

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
							}
						);

						event.stopPropagation();
					} else {
						this.calcHandlePosition(table, cell, event.offsetX);
					}
				}
			);

		this.createResizeHandle();
	}

	private onAfterCommand(command: string) {
		if (/^justify/.test(command)) {
			$$('[data-jodit-selected-cell]', this.jodit.editor).forEach(elm =>
				alignElement(command, elm, this.jodit)
			);
		}
	}

	beforeDestruct(jodit: IJodit): void {
		if (jodit.events) {
			jodit.events.off(this.jodit.ownerWindow, '.table');
			jodit.events.off('.table');
		}
	}
}
