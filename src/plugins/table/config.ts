/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/table
 */

import type { IControlType, IDictionary, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { attr } from 'jodit/core/helpers/utils';
import { $$, css, scrollIntoViewIfNeeded } from 'jodit/core/helpers';
import { Icon } from 'jodit/core/ui/icon';

declare module 'jodit/config' {
	interface Config {
		table: {
			selectionCellStyle: string;
			useExtraClassesOptions: boolean;
		};
	}
}

Config.prototype.table = {
	selectionCellStyle: 'border: 1px double #1e88e5 !important;',
	useExtraClassesOptions: false
};

Icon.set('table', require('./table.svg'));

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
		const default_rows_count =
				control.data && control.data.rows ? control.data.rows : 10,
			default_cols_count =
				control.data && control.data.cols ? control.data.cols : 10;

		const generateExtraClasses = (): string => {
			if (!editor.o.table.useExtraClassesOptions) {
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
					'<div class="jodit-form__table-creator-box">' +
					'<div class="jodit-form__container"></div>' +
					'<div class="jodit-form__options">' +
					generateExtraClasses() +
					'</div>' +
					'</div>' +
					'<label class="jodit-form__center">' +
					'<span>1</span> &times; <span>1</span>' +
					'</label>' +
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

			const k =
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

				const k = parseInt(attr(dv, '-index') || '0', 10);

				const rows_count = Math.ceil((k + 1) / default_cols_count),
					cols_count = (k % default_cols_count) + 1;

				const crt = editor.createInside,
					tbody = crt.element('tbody'),
					table = crt.element('table');

				table.appendChild(tbody);

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

						css(td, 'width', (100 / cols_count).toFixed(4) + '%');

						td.appendChild(crt.element('br'));
						tr.appendChild(crt.text('\n'));
						tr.appendChild(crt.text('\t'));
						tr.appendChild(td);
					}

					tbody.appendChild(crt.text('\n'));
					tbody.appendChild(tr);
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

				if (editor.editor.firstChild) {
					editor.s.insertNode(crt.text('\n'), false, false);
				}

				editor.s.insertNode(table, false);

				if (first_td) {
					editor.s.setCursorIn(first_td);
					scrollIntoViewIfNeeded(first_td, editor.editor, editor.ed);
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
