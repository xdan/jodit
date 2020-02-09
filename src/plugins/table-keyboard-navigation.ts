/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../constants';
import { Dom } from '../modules/Dom';
import { Table } from '../modules/Table';
import { IJodit } from '../types';

/**
 * Process navigate keypressing in table cell
 *
 * @param {Jodit} editor
 */
export function tableKeyboardNavigation(editor: IJodit) {
	editor.events
		.off('.tableKeyboardNavigation')
		.on('keydown.tableKeyboardNavigation', (event: KeyboardEvent):
			| false
			| void => {
			let current: Element, block: HTMLElement;

			if (
				event.which === consts.KEY_TAB ||
				event.which === consts.KEY_LEFT ||
				event.which === consts.KEY_RIGHT ||
				event.which === consts.KEY_UP ||
				event.which === consts.KEY_DOWN
			) {
				current = editor.selection.current() as Element;

				block = Dom.up(
					current,
					(elm: Node | null) =>
						elm && elm.nodeName && /^td|th$/i.test(elm.nodeName),
					editor.editor
				) as HTMLTableCellElement;

				if (!block) {
					return;
				}

				const range = editor.selection.range;

				if (event.which !== consts.KEY_TAB && current !== block) {
					if (
						((event.which === consts.KEY_LEFT ||
							event.which === consts.KEY_UP) &&
							(Dom.prev(
								current,
								(elm: Node | null) =>
									event.which === consts.KEY_UP
										? Dom.isTag(elm, 'br')
										: !!elm,
								block
							) ||
								(event.which !== consts.KEY_UP &&
									Dom.isText(current) &&
									range.startOffset !== 0))) ||
						((event.which === consts.KEY_RIGHT ||
							event.which === consts.KEY_DOWN) &&
							(Dom.next(
								current,
								(elm: Node | null) =>
									event.which === consts.KEY_DOWN
										? Dom.isTag(elm, 'br')
										: !!elm,
								block
							) ||
								(event.which !== consts.KEY_DOWN &&
									Dom.isText(current) &&
									current.nodeValue &&
									range.startOffset !==
										current.nodeValue.length)))
					) {
						return;
					}
				}
			} else {
				return;
			}

			const table = Dom.up(
				block,
				(elm: Node | null) => elm && /^table$/i.test(elm.nodeName),
				editor.editor
			) as HTMLTableElement;
			let next: HTMLTableCellElement | null = null;

			switch (event.which) {
				case consts.KEY_TAB:
				// case consts.KEY_RIGHT:
				case consts.KEY_LEFT:
					const sibling: string =
						event.which === consts.KEY_LEFT || event.shiftKey
							? 'prev'
							: 'next';

					next = (Dom as any)[sibling](
						block,
						(elm: Node | null) =>
							elm &&
							/^td|th$/i.test((elm as HTMLElement).tagName),
						table
					) as HTMLTableCellElement;

					if (!next) {
						Table.appendRow(
							table,
							sibling === 'next'
								? false
								: (table.querySelector(
										'tr'
								  ) as HTMLTableRowElement),
							sibling === 'next',
							editor.create.inside
						);
						next = (Dom as any)[sibling](
							block,
							(elm: Node | null) =>
								elm && Dom.isCell(elm, editor.editorWindow),
							table
						) as HTMLTableCellElement;
					}
					break;
				case consts.KEY_UP:
				case consts.KEY_DOWN:
					{
						let i = 0,
							j = 0;

						const matrix = Table.formalMatrix(
							table,
							(elm, _i, _j) => {
								if (elm === block) {
									i = _i;
									j = _j;
								}
							}
						);
						if (event.which === consts.KEY_UP) {
							if (matrix[i - 1] !== undefined) {
								next = matrix[i - 1][j];
							}
						} else {
							if (matrix[i + 1] !== undefined) {
								next = matrix[i + 1][j];
							}
						}
					}
					break;
			}

			if (next) {
				if (!next.firstChild) {
					const first = editor.create.inside.element('br');
					next.appendChild(first);
					editor.selection.setCursorBefore(first);
				} else {
					if (event.which === consts.KEY_TAB) {
						editor.selection.select(next, true);
					} else {
						editor.selection.setCursorIn(
							next,
							event.which === consts.KEY_RIGHT ||
								event.which === consts.KEY_DOWN
						);
					}
				}
				return false;
			}
		});
}
