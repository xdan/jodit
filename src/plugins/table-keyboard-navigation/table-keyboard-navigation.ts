/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/table-keyboard-navigation/README.md]]
 * @packageDocumentation
 * @module plugins/table-keyboard-navigation
 */

import type { IJodit, Nullable } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { call } from 'jodit/core/helpers';
import { Table } from 'jodit/modules/table/table';

const WORK_KEYS = new Set([
	consts.KEY_TAB,
	consts.KEY_LEFT,
	consts.KEY_RIGHT,
	consts.KEY_UP,
	consts.KEY_DOWN
]);

/**
 * Process navigates key pressing in table cell
 */
export function tableKeyboardNavigation(editor: IJodit): void {
	editor.e
		.off('.tableKeyboardNavigation')
		.on(
			'keydown.tableKeyboardNavigation',
			(event: KeyboardEvent): false | void => {
				const { key } = event;

				const cell = findCell(editor, key);

				if (!cell) {
					return;
				}

				const tableModule = editor.getInstance<Table>(Table, editor.o);

				const table = Dom.closest(cell, 'table', editor.editor)!;

				let next: HTMLTableCellElement | null = null;
				const isPrev = key === consts.KEY_LEFT || event.shiftKey;
				const getNextCell = (): Nullable<HTMLTableCellElement> =>
					call(
						isPrev ? Dom.prev : Dom.next,
						cell,
						Dom.isCell,
						table
					) as HTMLTableCellElement;

				switch (key) {
					case consts.KEY_TAB:
					case consts.KEY_LEFT: {
						next = getNextCell();

						if (!next) {
							tableModule.appendRow(
								table,
								!isPrev
									? false
									: (table.querySelector(
											'tr'
										) as HTMLTableRowElement),
								!isPrev
							);
							next = getNextCell();
						}
						break;
					}
					case consts.KEY_UP:
					case consts.KEY_DOWN:
						{
							const matrix = tableModule.formalMatrix(table);
							const [row, column] = tableModule.formalCoordinate(
								table,
								cell
							);

							if (key === consts.KEY_UP) {
								if (matrix[row - 1] !== undefined) {
									next = matrix[row - 1][column];
								}
							} else {
								if (matrix[row + 1] !== undefined) {
									next = matrix[row + 1][column];
								}
							}
						}
						break;
				}

				if (!next) {
					return;
				}

				editor.e.fire('hidePopup hideResizer');

				if (!next.firstChild) {
					const first = editor.createInside.element('br');
					next.appendChild(first);
					editor.s.setCursorBefore(first);
				} else {
					if (key === consts.KEY_TAB) {
						editor.s.select(next, true);
					} else {
						editor.s.setCursorIn(
							next,
							key === consts.KEY_RIGHT || key === consts.KEY_DOWN
						);
					}
				}

				editor.synchronizeValues();
				return false;
			}
		);
}

pluginSystem.add('tableKeyboardNavigation', tableKeyboardNavigation);

function findCell(
	editor: IJodit,
	key: string
): HTMLTableCellElement | undefined {
	if (!WORK_KEYS.has(key)) {
		return;
	}

	const current = editor.s.current();

	if (!current) {
		return;
	}

	const cell = Dom.up<HTMLTableCellElement>(
		current,
		Dom.isCell,
		editor.editor
	);

	if (!cell) {
		return;
	}

	const { range } = editor.s;

	if (key !== consts.KEY_TAB && current !== cell) {
		const isNextDirection =
			key === consts.KEY_RIGHT || key === consts.KEY_DOWN;

		const hasNext = call(
			!isNextDirection ? Dom.prev : Dom.next,
			current,
			elm =>
				key === consts.KEY_UP || key === consts.KEY_DOWN
					? Dom.isTag(elm, 'br')
					: Boolean(elm),
			cell
		);

		if (
			(!isNextDirection &&
				(hasNext ||
					(key !== consts.KEY_UP &&
						Dom.isText(current) &&
						range.startOffset !== 0))) ||
			(isNextDirection &&
				(hasNext ||
					(key !== consts.KEY_DOWN &&
						Dom.isText(current) &&
						current.nodeValue &&
						range.startOffset !== current.nodeValue.length)))
		) {
			return;
		}
	}

	return cell;
}
